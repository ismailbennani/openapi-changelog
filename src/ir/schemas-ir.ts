import { OpenAPIV3 } from "openapi-types";
import { evaluateSchemaOrRef, isReferenceObject } from "./utils";
import { HttpMethod, isHttpMethod } from "../core/http-methods";
import { getReferencedObject, isReferenceToSchema } from "../core/openapi-documents-utils";
import { escapeMarkdown } from "../core/string-utils";

export interface SchemaIntermediateRepresentation {
  name: string;
  occurrences: Occurrence[];
  description: string | undefined;
  examples: string | undefined;
}

interface Occurrence {
  path: string;
  method: HttpMethod;
}

export function extractSchemas(document: OpenAPIV3.Document): SchemaIntermediateRepresentation[] {
  if (!document.components?.schemas) {
    return [];
  }

  const result: SchemaIntermediateRepresentation[] = [];

  const traversalState = Object.fromEntries(
    Object.keys(document.components.schemas).map((name) => [
      name,
      {
        parameters: {},
        schemas: {},
        requestBodies: {},
        responses: {},
      },
    ]),
  );

  for (const [name, schema] of Object.entries(document.components.schemas)) {
    const evaluatedSchema = evaluateSchemaOrRef(document, schema);
    if (!evaluatedSchema) {
      continue;
    }

    const occurrences = findOccurrences(document, name, traversalState);

    result.push({
      name,
      occurrences: Object.entries(occurrences).flatMap(([path, methods]) => [...methods].map((method) => ({ path, method }))),
      description: evaluatedSchema.description === undefined ? undefined : escapeMarkdown(evaluatedSchema.description),
      examples: extractSchemaExamples(schema),
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

function findOccurrences(document: OpenAPIV3.Document, name: string, traversalState: TraversalState): Record<string, Set<HttpMethod>> {
  const result: Record<string, Set<HttpMethod>> = {};

  for (const [path, methods] of Object.entries(document.paths)) {
    if (methods === undefined) {
      continue;
    }

    const methodsOfPathContainingReference: Set<HttpMethod> = new Set<HttpMethod>();

    if (methods.parameters !== undefined) {
      for (const parameter of methods.parameters) {
        if (hasOccurrencesInParameter(document, parameter, name, traversalState)) {
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
          if (hasOccurrencesInParameter(document, parameter, name, traversalState)) {
            methodsOfPathContainingReference.add(method);
          }
        }
      }

      const requestBody = (operation as OpenAPIV3.OperationObject).requestBody;
      if (requestBody !== undefined) {
        if (hasOccurrencesInRequestBody(document, requestBody, name, traversalState)) {
          methodsOfPathContainingReference.add(method);
        }
      }

      const responses = (operation as OpenAPIV3.OperationObject | undefined)?.responses;
      if (responses !== undefined) {
        for (const response of Object.values(responses)) {
          if (hasOccurrencesInResponse(document, response, name, traversalState)) {
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

function hasOccurrencesInParameter(
  document: OpenAPIV3.Document,
  parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject,
  name: string,
  traversalState: TraversalState,
): boolean {
  if (isReferenceObject(parameter)) {
    const hasOccurrenceOfSchema = traversalState[name].parameters[parameter.$ref];
    if (hasOccurrenceOfSchema !== undefined) {
      if (hasOccurrenceOfSchema === "exploring") {
        // cycle
        traversalState[name].parameters[parameter.$ref] = false;
        return false;
      } else {
        return hasOccurrenceOfSchema;
      }
    }

    traversalState[name].parameters[parameter.$ref] = "exploring";
    const result = hasOccurrencesInParameterImpl(document, parameter, name, traversalState);
    traversalState[name].parameters[parameter.$ref] = result;
    return result;
  }

  return hasOccurrencesInParameterImpl(document, parameter, name, traversalState);
}

function hasOccurrencesInParameterImpl(
  document: OpenAPIV3.Document,
  parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject,
  name: string,
  traversalState: TraversalState,
): boolean {
  if (isReferenceObject(parameter)) {
    const otherParameter = document.components?.parameters?.[parameter.$ref];
    if (otherParameter === undefined) {
      return false;
    }

    return hasOccurrencesInParameter(document, otherParameter, name, traversalState);
  }

  if (parameter.schema !== undefined) {
    return hasOccurrencesInSchema(document, parameter.schema, name, traversalState);
  }

  if (parameter.content !== undefined) {
    return Object.values(parameter.content).some((c) => hasOccurrencesInContent(document, c, name, traversalState));
  }

  return false;
}

function hasOccurrencesInSchema(document: OpenAPIV3.Document, schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject, name: string, traversalState: TraversalState): boolean {
  if (isReferenceObject(schema)) {
    const hasOccurrenceOfSchema = traversalState[name].schemas[schema.$ref];
    if (hasOccurrenceOfSchema !== undefined) {
      if (hasOccurrenceOfSchema === "exploring") {
        // cycle
        traversalState[name].schemas[schema.$ref] = false;
        return false;
      } else {
        return hasOccurrenceOfSchema;
      }
    }

    traversalState[name].schemas[schema.$ref] = "exploring";
    const result = hasOccurrencesInSchemaImpl(document, schema, name, traversalState);
    traversalState[name].schemas[schema.$ref] = result;
    return result;
  }

  return hasOccurrencesInSchemaImpl(document, schema, name, traversalState);
}

function hasOccurrencesInSchemaImpl(
  document: OpenAPIV3.Document,
  schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject,
  name: string,
  traversalState: TraversalState,
): boolean {
  if (isReferenceObject(schema)) {
    if (isReferenceToSchema(schema, name)) {
      return true;
    }

    const otherSchema = getReferencedObject(document, schema.$ref) as OpenAPIV3.SchemaObject | undefined;
    if (otherSchema === undefined) {
      return false;
    }

    return hasOccurrencesInSchema(document, otherSchema, name, traversalState);
  }

  switch (schema.type) {
    case "array":
      return hasOccurrencesInSchema(document, schema.items, name, traversalState);
    case "object":
      if (schema.oneOf?.some((s) => hasOccurrencesInSchema(document, s, name, traversalState)) === true) {
        return true;
      }

      if (schema.allOf?.some((s) => hasOccurrencesInSchema(document, s, name, traversalState)) === true) {
        return true;
      }

      if (schema.anyOf?.some((s) => hasOccurrencesInSchema(document, s, name, traversalState)) === true) {
        return true;
      }

      if (schema.not !== undefined && hasOccurrencesInSchema(document, schema.not, name, traversalState)) {
        return true;
      }

      if (
        schema.additionalProperties !== undefined &&
        schema.additionalProperties !== true &&
        schema.additionalProperties !== false &&
        hasOccurrencesInSchema(document, schema.additionalProperties, name, traversalState)
      ) {
        return true;
      }

      if (schema.properties !== undefined && Object.values(schema.properties).some((v) => hasOccurrencesInSchema(document, v, name, traversalState))) {
        return true;
      }

      return false;
    default:
      return false;
  }
}

function hasOccurrencesInRequestBody(
  document: OpenAPIV3.Document,
  requestBody: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject,
  name: string,
  traversalState: TraversalState,
): boolean {
  if (isReferenceObject(requestBody)) {
    const hasOccurrenceOfSchema = traversalState[name].requestBodies[requestBody.$ref];
    if (hasOccurrenceOfSchema !== undefined) {
      if (hasOccurrenceOfSchema === "exploring") {
        // cycle
        traversalState[name].requestBodies[requestBody.$ref] = false;
        return false;
      } else {
        return hasOccurrenceOfSchema;
      }
    }

    traversalState[name].requestBodies[requestBody.$ref] = "exploring";
    const result = hasOccurrencesInRequestBodyImpl(document, requestBody, name, traversalState);
    traversalState[name].requestBodies[requestBody.$ref] = result;
    return result;
  }

  return hasOccurrencesInRequestBodyImpl(document, requestBody, name, traversalState);
}

function hasOccurrencesInRequestBodyImpl(
  document: OpenAPIV3.Document,
  requestBody: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject,
  name: string,
  traversalState: TraversalState,
): boolean {
  if (isReferenceObject(requestBody)) {
    const otherRequestBody = getReferencedObject(document, requestBody.$ref) as OpenAPIV3.RequestBodyObject | undefined;
    if (otherRequestBody === undefined) {
      return false;
    }

    return hasOccurrencesInRequestBody(document, otherRequestBody, name, traversalState);
  }

  if (requestBody.content !== undefined) {
    return Object.values(requestBody.content).some((c) => hasOccurrencesInContent(document, c, name, traversalState));
  }

  return false;
}

function hasOccurrencesInResponse(
  document: OpenAPIV3.Document,
  response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject,
  name: string,
  traversalState: TraversalState,
): boolean {
  if (isReferenceObject(response)) {
    const hasOccurrenceOfSchema = traversalState[name].responses[response.$ref];
    if (hasOccurrenceOfSchema !== undefined) {
      if (hasOccurrenceOfSchema === "exploring") {
        // cycle
        traversalState[name].responses[response.$ref] = false;
        return false;
      } else {
        return hasOccurrenceOfSchema;
      }
    }

    traversalState[name].responses[response.$ref] = "exploring";
    const result = hasOccurrencesInResponseImpl(document, response, name, traversalState);
    traversalState[name].responses[response.$ref] = result;
    return result;
  }

  return hasOccurrencesInResponseImpl(document, response, name, traversalState);
}

function hasOccurrencesInResponseImpl(
  document: OpenAPIV3.Document,
  response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject,
  name: string,
  traversalState: TraversalState,
): boolean {
  if (isReferenceObject(response)) {
    const otherResponse = getReferencedObject(document, response.$ref) as OpenAPIV3.ResponseObject | undefined;
    if (otherResponse === undefined) {
      return false;
    }

    return hasOccurrencesInResponse(document, otherResponse, name, traversalState);
  }

  if (response.content !== undefined) {
    return Object.values(response.content).some((c) => hasOccurrencesInContent(document, c, name, traversalState));
  }

  return false;
}

function hasOccurrencesInContent(document: OpenAPIV3.Document, content: OpenAPIV3.MediaTypeObject, name: string, traversalState: TraversalState): boolean {
  if (content.schema === undefined) {
    return false;
  }

  return hasOccurrencesInSchema(document, content.schema, name, traversalState);
}

type TraversalState = Record<string, SchemaTraversalState>;

interface SchemaTraversalState {
  parameters: Partial<Record<string, boolean | "exploring">>;
  schemas: Partial<Record<string, boolean | "exploring">>;
  requestBodies: Partial<Record<string, boolean | "exploring">>;
  responses: Partial<Record<string, boolean | "exploring">>;
}
