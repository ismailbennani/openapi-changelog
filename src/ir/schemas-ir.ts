import { OpenAPIV3 } from "openapi-types";
import { evaluateSchemaOrRef, isReferenceObject } from "./utils";
import { HttpMethod, isHttpMethod } from "../core/http-methods";
import { extractParameterReferenceName, extractRequestBodyReferenceName, extractResponseReferenceName, extractSchemaReferenceName } from "../core/openapi-documents-utils";
import { escapeMarkdown } from "../core/string-utils";
import { Logger } from "../core/logging";

export interface SchemaIntermediateRepresentation {
  name: string;
  description: string | undefined;
  examples: string | undefined;
  computeOccurrences: () => Occurrence[];
}

interface Occurrence {
  path: string;
  method: HttpMethod;
}

export function extractSchemas(document: OpenAPIV3.Document): SchemaIntermediateRepresentation[] {
  if (!document.components?.schemas) {
    return [];
  }

  const startGraphTime = performance.now();
  const graph = buildReferencesGraph(document);
  const endGraphTime = performance.now();

  Logger.debug(`References graph construction performed in ${(endGraphTime - startGraphTime).toString()}ms (${Object.keys(graph).length.toString()} nodes)`);

  const result: SchemaIntermediateRepresentation[] = [];

  for (const [name, schema] of Object.entries(document.components.schemas)) {
    const evaluatedSchema = evaluateSchemaOrRef(document, schema);
    if (!evaluatedSchema) {
      continue;
    }

    result.push({
      name,
      description: evaluatedSchema.description === undefined ? undefined : escapeMarkdown(evaluatedSchema.description),
      examples: extractSchemaExamples(schema),
      computeOccurrences: () => {
        const occurrences = findOccurrences(document, name, graph);
        return Object.entries(occurrences).flatMap(([path, methods]) => [...methods].map((method) => ({ path, method })));
      },
    });
  }

  return result;
}

export function extractSchemaExamples(schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject): string | undefined {
  if (isReferenceObject(schema)) {
    return undefined;
  }

  if (schema.example !== undefined) {
    return `Example: ${schema.example as string}`;
  }

  return undefined;
}

function buildReferencesGraph(document: OpenAPIV3.Document): ReferencesGraph {
  const schemas: [ReferenceGraphId, ReferencesGraphNode][] =
    document.components?.schemas === undefined
      ? []
      : Object.keys(document.components.schemas).map((name) => [
          `schema/${name}`,
          { id: `schema/${name}`, references: new Set<ReferenceGraphId>(), referencedBy: new Set<ReferenceGraphId>() },
        ]);
  const parameters: [ReferenceGraphId, ReferencesGraphNode][] =
    document.components?.parameters === undefined
      ? []
      : Object.keys(document.components.parameters).map((name) => [
          `parameter/${name}`,
          {
            id: `parameter/${name}`,
            references: new Set<ReferenceGraphId>(),
            referencedBy: new Set<ReferenceGraphId>(),
          },
        ]);
  const requestBodies: [ReferenceGraphId, ReferencesGraphNode][] =
    document.components?.requestBodies === undefined
      ? []
      : Object.keys(document.components.requestBodies).map((name) => [
          `request-body/${name}`,
          { id: `request-body/${name}`, references: new Set<ReferenceGraphId>(), referencedBy: new Set<ReferenceGraphId>() },
        ]);
  const responses: [ReferenceGraphId, ReferencesGraphNode][] =
    document.components?.responses === undefined
      ? []
      : Object.keys(document.components.responses).map((name) => [
          `response/${name}`,
          {
            id: `response/${name}`,
            references: new Set<ReferenceGraphId>(),
            referencedBy: new Set<ReferenceGraphId>(),
          },
        ]);

  const graph: ReferencesGraph = Object.fromEntries([...schemas, ...parameters, ...requestBodies, ...responses]);
  const state: ReferencesGraphConstructionState = {};

  if (document.components?.schemas !== undefined) {
    for (const [name, schema] of Object.entries(document.components.schemas)) {
      state[`schema/${name}`] = "open";
      walkSchema(document, `schema/${name}`, schema, graph, state);
      state[`schema/${name}`] = "closed";
    }
  }

  if (document.components?.parameters !== undefined) {
    for (const [name, parameter] of Object.entries(document.components.parameters)) {
      state[`parameter/${name}`] = "open";
      walkParameter(document, `parameter/${name}`, parameter, graph, state);
      state[`parameter/${name}`] = "closed";
    }
  }

  if (document.components?.requestBodies !== undefined) {
    for (const [name, requestBody] of Object.entries(document.components.requestBodies)) {
      state[`request-body/${name}`] = "open";
      walkRequestBody(document, `request-body/${name}`, requestBody, graph, state);
      state[`request-body/${name}`] = "closed";
    }
  }

  if (document.components?.responses !== undefined) {
    for (const [name, response] of Object.entries(document.components.responses)) {
      state[`response/${name}`] = "open";
      walkResponse(document, `response/${name}`, response, graph, state);
      state[`response/${name}`] = "closed";
    }
  }

  return graph;
}

function walkSchema(
  document: OpenAPIV3.Document,
  id: ReferenceGraphId,
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
  graph: ReferencesGraph,
  state: ReferencesGraphConstructionState,
): void {
  if (state[id] === "closed") {
    return;
  }

  if (isReferenceObject(schema)) {
    const referencedSchemaId: ReferenceGraphId = `schema/${extractSchemaReferenceName(schema)}`;
    graph[id].references.add(referencedSchemaId);
  } else {
    if (schema.not !== undefined) {
      walkSchema(document, id, schema.not, graph, state);
    }

    if (schema.oneOf !== undefined) {
      for (const oneOf of schema.oneOf) {
        walkSchema(document, id, oneOf, graph, state);
      }
    }

    if (schema.anyOf !== undefined) {
      for (const anyOf of schema.anyOf) {
        walkSchema(document, id, anyOf, graph, state);
      }
    }

    if (schema.allOf !== undefined) {
      for (const allOf of schema.allOf) {
        walkSchema(document, id, allOf, graph, state);
      }
    }

    if (schema.additionalProperties !== undefined && schema.additionalProperties !== true && schema.additionalProperties !== false) {
      walkSchema(document, id, schema.additionalProperties, graph, state);
    }

    if (schema.properties !== undefined) {
      for (const property of Object.values(schema.properties)) {
        walkSchema(document, id, property, graph, state);
      }
    }

    if (schema.type === "array") {
      walkSchema(document, id, schema.items, graph, state);
    }
  }
}

function walkParameter(
  document: OpenAPIV3.Document,
  id: ReferenceGraphId,
  parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject,
  graph: ReferencesGraph,
  state: ReferencesGraphConstructionState,
): void {
  if (state[id] === "closed") {
    return;
  }

  if (isReferenceObject(parameter)) {
    const referencedParameterId: ReferenceGraphId = `parameter/${extractParameterReferenceName(parameter)}`;
    graph[id].references.add(referencedParameterId);
  } else {
    if (parameter.schema !== undefined) {
      walkSchema(document, id, parameter.schema, graph, state);
    }

    if (parameter.content !== undefined) {
      walkContent(document, id, parameter.content, graph, state);
    }
  }
}

function walkContent(
  document: OpenAPIV3.Document,
  id: ReferenceGraphId,
  content: OpenAPIV3.MediaTypeObject,
  graph: ReferencesGraph,
  state: ReferencesGraphConstructionState,
): void {
  if (content.schema !== undefined) {
    walkSchema(document, id, content.schema, graph, state);
  }
}

function walkRequestBody(
  document: OpenAPIV3.Document,
  id: ReferenceGraphId,
  requestBody: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject,
  graph: ReferencesGraph,
  state: ReferencesGraphConstructionState,
): void {
  if (state[id] === "closed") {
    return;
  }

  if (isReferenceObject(requestBody)) {
    const referencedRequestBodyId: ReferenceGraphId = `request-body/${extractRequestBodyReferenceName(requestBody)}`;
    graph[id].references.add(referencedRequestBodyId);
  } else {
    if (requestBody.content !== undefined) {
      walkContent(document, id, requestBody.content, graph, state);
    }
  }
}

function walkResponse(
  document: OpenAPIV3.Document,
  id: ReferenceGraphId,
  response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject,
  graph: ReferencesGraph,
  state: ReferencesGraphConstructionState,
): void {
  if (state[id] === "closed") {
    return;
  }

  if (isReferenceObject(response)) {
    const referencedResponseId: ReferenceGraphId = `response/${extractResponseReferenceName(response)}`;
    graph[id].references.add(referencedResponseId);
  } else {
    if (response.content !== undefined) {
      walkContent(document, id, response.content, graph, state);
    }
  }
}

function findOccurrences(document: OpenAPIV3.Document, name: string, graph: ReferencesGraph): Record<string, Set<HttpMethod>> {
  const result: Record<string, Set<HttpMethod>> = {};

  for (const [path, methods] of Object.entries(document.paths)) {
    if (methods === undefined) {
      continue;
    }

    const methodsOfPathContainingReference: Set<HttpMethod> = new Set<HttpMethod>();

    if (methods.parameters !== undefined) {
      for (const parameter of methods.parameters) {
        if (hasOccurrencesInParameter(parameter, name, graph)) {
          for (const method of Object.keys(methods).filter(isHttpMethod)) {
            methodsOfPathContainingReference.add(method);
          }
          break;
        }
      }
    }

    for (const [method, operation] of Object.entries(methods)) {
      if (!isHttpMethod(method) || methodsOfPathContainingReference.has(method)) {
        continue;
      }

      const parameters = (operation as OpenAPIV3.OperationObject).parameters;
      if (parameters !== undefined) {
        for (const parameter of parameters) {
          if (hasOccurrencesInParameter(parameter, name, graph)) {
            methodsOfPathContainingReference.add(method);
          }
        }
      }

      const requestBody = (operation as OpenAPIV3.OperationObject).requestBody;
      if (requestBody !== undefined) {
        if (hasOccurrencesInRequestBody(requestBody, name, graph)) {
          methodsOfPathContainingReference.add(method);
        }
      }

      const responses = (operation as OpenAPIV3.OperationObject | undefined)?.responses;
      if (responses !== undefined) {
        for (const response of Object.values(responses)) {
          if (hasOccurrencesInResponse(response, name, graph)) {
            methodsOfPathContainingReference.add(method);
          }
        }
      }
    }

    if (methodsOfPathContainingReference.size > 0) {
      result[path] = methodsOfPathContainingReference;
    }
  }

  return result;
}

function pathExists(graph: Partial<ReferencesGraph>, node1: ReferenceGraphId, node2: ReferenceGraphId): boolean {
  const visited: Record<ReferenceGraphId, true | undefined> = {};
  const queue: ReferenceGraphId[] = [];

  visited[node1] = true;
  queue.push(node1);

  while (queue.length > 0) {
    const next = queue.shift();
    if (next === undefined) {
      continue;
    }

    if (next === node2) {
      return true;
    }

    if (graph[next]?.references !== undefined) {
      for (const adjacent of graph[next].references) {
        if (visited[adjacent] === true) {
          continue;
        }

        queue.push(adjacent);
        visited[adjacent] = true;
      }
    }
  }

  return false;
}

function hasOccurrencesInParameter(parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject, schemaName: string, graph: ReferencesGraph): boolean {
  if (isReferenceObject(parameter)) {
    const referencedParameterName = extractParameterReferenceName(parameter);
    return pathExists(graph, `parameter/${referencedParameterName}`, `schema/${schemaName}`);
  }

  if (parameter.schema !== undefined) {
    if (hasOccurrencesInSchema(parameter.schema, schemaName, graph)) {
      return true;
    }
  }

  if (parameter.content !== undefined) {
    if (Object.values(parameter.content).some((c) => hasOccurrencesInContent(c, schemaName, graph))) {
      return true;
    }
  }

  return false;
}

function hasOccurrencesInSchema(schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject, schemaName: string, graph: ReferencesGraph): boolean {
  if (isReferenceObject(schema)) {
    const referencedSchemaName = extractSchemaReferenceName(schema);
    return pathExists(graph, `schema/${referencedSchemaName}`, `schema/${schemaName}`);
  }

  if (schema.not !== undefined) {
    if (hasOccurrencesInSchema(schema.not, schemaName, graph)) {
      return true;
    }
  }

  if (schema.oneOf !== undefined) {
    for (const oneOf of schema.oneOf) {
      if (hasOccurrencesInSchema(oneOf, schemaName, graph)) {
        return true;
      }
    }
  }

  if (schema.anyOf !== undefined) {
    for (const anyOf of schema.anyOf) {
      if (hasOccurrencesInSchema(anyOf, schemaName, graph)) {
        return true;
      }
    }
  }

  if (schema.allOf !== undefined) {
    for (const allOf of schema.allOf) {
      if (hasOccurrencesInSchema(allOf, schemaName, graph)) {
        return true;
      }
    }
  }

  if (schema.additionalProperties !== undefined && schema.additionalProperties !== true && schema.additionalProperties !== false) {
    if (hasOccurrencesInSchema(schema.additionalProperties, schemaName, graph)) {
      return true;
    }
  }

  if (schema.properties !== undefined) {
    for (const property of Object.values(schema.properties)) {
      if (hasOccurrencesInSchema(property, schemaName, graph)) {
        return true;
      }
    }
  }

  if (schema.type === "array") {
    if (hasOccurrencesInSchema(schema.items, schemaName, graph)) {
      return true;
    }
  }

  return false;
}

function hasOccurrencesInRequestBody(requestBody: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject, schemaName: string, graph: ReferencesGraph): boolean {
  if (isReferenceObject(requestBody)) {
    const referencedRequestBodyName = extractRequestBodyReferenceName(requestBody);
    return pathExists(graph, `request-body/${referencedRequestBodyName}`, `schema/${schemaName}`);
  }

  if (requestBody.content !== undefined) {
    if (hasOccurrencesInContent(requestBody.content, schemaName, graph)) {
      return true;
    }
  }

  return false;
}

function hasOccurrencesInResponse(response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject, schemaName: string, graph: ReferencesGraph): boolean {
  if (isReferenceObject(response)) {
    const referencedRequestBodyName = extractRequestBodyReferenceName(response);
    return pathExists(graph, `response/${referencedRequestBodyName}`, `schema/${schemaName}`);
  }

  if (response.content !== undefined) {
    for (const contentType of Object.values(response.content)) {
      if (hasOccurrencesInContent(contentType, schemaName, graph)) {
        return true;
      }
    }
  }

  return false;
}

function hasOccurrencesInContent(content: OpenAPIV3.MediaTypeObject, schemaName: string, graph: ReferencesGraph): boolean {
  if (content.schema === undefined) {
    return false;
  }

  return hasOccurrencesInSchema(content.schema, schemaName, graph);
}

type ReferencesGraphNodeKind = "schema" | "parameter" | "request-body" | "response";
type ReferenceGraphId = `${ReferencesGraphNodeKind}/${string}`;

interface ReferencesGraphNode {
  id: ReferenceGraphId;
  references: Set<ReferenceGraphId>;
}

type ReferencesGraph = Record<ReferenceGraphId, ReferencesGraphNode>;

type ReferencesGraphConstructionState = Record<string, "open" | "closed" | undefined>;
