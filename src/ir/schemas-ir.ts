import { OpenAPIV3 } from "openapi-types";
import { evaluateSchemaOrRef, isArrayObject, isReferenceObject } from "./utils";
import winston from "winston";
import { HttpMethod, isHttpMethod } from "../core/http-methods";
import { getReferencedObject, isReferenceToSchema } from "../core/openapi-documents-utils";

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

  for (const [name, schema] of Object.entries(document.components.schemas)) {
    const evaluatedSchema = evaluateSchemaOrRef(document, schema);
    if (!evaluatedSchema) {
      winston.warn(`At parameter ${name}: could not evaluate parameter ${JSON.stringify(schema)}`);
      continue;
    }

    const occurrences = findOccurrences(document, name);

    result.push({
      name,
      occurrences: Object.entries(occurrences).flatMap(([path, methods]) => [...methods].map((method) => ({ path, method }))),
      description: evaluatedSchema.description,
      examples: extractSchemaExamples(schema),
    });
  }

  return result;
}

export function extractTypeFromSchema(schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject): string {
  if (isReferenceObject(schema)) {
    return schema.$ref;
  }

  if (isArrayObject(schema)) {
    const arrayType = schema.items;
    const itemType = extractTypeFromSchema(arrayType);

    return `${itemType}[]`;
  }

  const nonArrayType = schema.type;
  return nonArrayType ?? "???";
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

function findOccurrences(document: OpenAPIV3.Document, name: string): Record<string, Set<HttpMethod>> {
  const result: Record<string, Set<HttpMethod>> = {};

  for (const [path, methods] of Object.entries(document.paths)) {
    if (methods === undefined) {
      continue;
    }

    const methodsOfPathContainingReference: Set<HttpMethod> = new Set<HttpMethod>();

    if (methods.parameters !== undefined) {
      for (const parameter of methods.parameters) {
        if (hasOccurrencesInParameter(document, parameter, name)) {
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
          if (hasOccurrencesInParameter(document, parameter, name)) {
            methodsOfPathContainingReference.add(method);
          }
        }
      }

      const requestBody = (operation as OpenAPIV3.OperationObject).requestBody;
      if (requestBody !== undefined) {
        if (hasOccurrencesInRequestBody(document, requestBody, name)) {
          methodsOfPathContainingReference.add(method);
        }
      }

      const responses = (operation as OpenAPIV3.OperationObject | undefined)?.responses;
      if (responses !== undefined) {
        for (const response of Object.values(responses)) {
          if (hasOccurrencesInResponse(document, response, name)) {
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

function hasOccurrencesInParameter(document: OpenAPIV3.Document, parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject, name: string): boolean {
  if (isReferenceObject(parameter)) {
    const otherParameter = document.components?.parameters?.[parameter.$ref];
    if (otherParameter === undefined) {
      return false;
    }

    return hasOccurrencesInParameter(document, otherParameter, name);
  }

  if (parameter.schema !== undefined) {
    return hasOccurrencesInSchema(document, parameter.schema, name);
  }

  if (parameter.content !== undefined) {
    return Object.values(parameter.content).some((c) => hasOccurrencesInContent(document, c, name));
  }

  return false;
}

function hasOccurrencesInSchema(document: OpenAPIV3.Document, schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject, name: string, fuel = 10): boolean {
  if (fuel <= 0) {
    return false;
  }

  if (isReferenceObject(schema)) {
    if (isReferenceToSchema(schema, name)) {
      return true;
    }

    const otherSchema = getReferencedObject(document, schema.$ref) as OpenAPIV3.SchemaObject | undefined;
    if (otherSchema === undefined) {
      return false;
    }

    return hasOccurrencesInSchema(document, otherSchema, name, fuel - 1);
  }

  switch (schema.type) {
    case "array":
      return hasOccurrencesInSchema(document, schema.items, name);
    case "object":
      if (schema.oneOf?.some((s) => hasOccurrencesInSchema(document, s, name, fuel - 1)) === true) {
        return true;
      }

      if (schema.allOf?.some((s) => hasOccurrencesInSchema(document, s, name, fuel - 1)) === true) {
        return true;
      }

      if (schema.anyOf?.some((s) => hasOccurrencesInSchema(document, s, name, fuel - 1)) === true) {
        return true;
      }

      if (schema.not !== undefined && hasOccurrencesInSchema(document, schema.not, name, fuel - 1)) {
        return true;
      }

      if (
        schema.additionalProperties !== undefined &&
        schema.additionalProperties !== true &&
        schema.additionalProperties !== false &&
        hasOccurrencesInSchema(document, schema.additionalProperties, name, fuel - 1)
      ) {
        return true;
      }

      if (schema.properties !== undefined && Object.values(schema.properties).some((v) => hasOccurrencesInSchema(document, v, name, fuel - 1))) {
        return true;
      }

      return false;
    default:
      return false;
  }
}

function hasOccurrencesInRequestBody(document: OpenAPIV3.Document, requestBody: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject, name: string): boolean {
  if (isReferenceObject(requestBody)) {
    const otherRequestBody = getReferencedObject(document, requestBody.$ref) as OpenAPIV3.RequestBodyObject | undefined;
    if (otherRequestBody === undefined) {
      return false;
    }

    return hasOccurrencesInRequestBody(document, otherRequestBody, name);
  }

  if (requestBody.content !== undefined) {
    return Object.values(requestBody.content).some((c) => hasOccurrencesInContent(document, c, name));
  }

  return false;
}

function hasOccurrencesInResponse(document: OpenAPIV3.Document, response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject, name: string): boolean {
  if (isReferenceObject(response)) {
    const otherResponse = getReferencedObject(document, response.$ref) as OpenAPIV3.ResponseObject | undefined;
    if (otherResponse === undefined) {
      return false;
    }

    return hasOccurrencesInResponse(document, otherResponse, name);
  }

  if (response.content !== undefined) {
    return Object.values(response.content).some((c) => hasOccurrencesInContent(document, c, name));
  }

  return false;
}

function hasOccurrencesInContent(document: OpenAPIV3.Document, content: OpenAPIV3.MediaTypeObject, name: string): boolean {
  if (content.schema === undefined) {
    return false;
  }

  return hasOccurrencesInSchema(document, content.schema, name);
}
