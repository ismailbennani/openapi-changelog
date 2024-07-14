import { OpenAPIV3 } from "openapi-types";
import { evaluateSchemaOrRef, isArrayObject, isReferenceObject } from "./utils";
import winston from "winston";

export interface SchemaIntermediateRepresentation {
  name: string;
  nOccurrences: number;
  description: string | undefined;
  examples: string | undefined;
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

    result.push({
      name,
      nOccurrences: countOccurrences(document, name),
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

function countOccurrences(document: OpenAPIV3.Document, name: string): number {
  let result = 0;

  for (const methods of Object.values(document.paths)) {
    if (methods === undefined) {
      continue;
    }

    if (methods.parameters !== undefined) {
      for (const parameter of methods.parameters) {
        result += countOccurrencesInParameter(parameter, name);
      }
    }

    for (const operation of Object.values(methods)) {
      const parameters = (operation as OpenAPIV3.OperationObject).parameters;
      if (parameters !== undefined) {
        for (const parameter of parameters) {
          result += countOccurrencesInParameter(parameter, name);
        }
      }

      const requestBody = (operation as OpenAPIV3.OperationObject).requestBody;
      if (requestBody !== undefined) {
        result += countOccurrencesInRequestBody(requestBody, name);
      }

      const responses = (operation as OpenAPIV3.OperationObject).responses;
      if (responses !== undefined) {
        for (const response of Object.values(responses)) {
          result += countOccurrencesInResponse(response, name);
        }
      }
    }
  }

  if (document.components?.schemas !== undefined) {
    for (const [otherSchemaName, schema] of Object.entries(document.components.schemas)) {
      if (countOccurrencesInSchema(schema, name) > 0) {
        result += countOccurrences(document, otherSchemaName);
      }
    }
  }

  return result;
}

function countOccurrencesInParameter(parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject, name: string): number {
  if (isReferenceObject(parameter)) {
    return 0;
  }

  if (parameter.schema !== undefined) {
    return countOccurrencesInSchema(parameter.schema, name);
  }

  if (parameter.content !== undefined) {
    let result = 0;

    for (const content of Object.values(parameter.content)) {
      result += countOccurrencesInContent(content, name);
    }

    return result;
  }

  return 0;
}

function countOccurrencesInSchema(schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject, name: string): number {
  if (isReferenceObject(schema)) {
    if (isReferenceToSchema(schema, name)) {
      return 1;
    }

    return 0;
  }

  switch (schema.type) {
    case "array":
      return countOccurrencesInSchema(schema.items, name);
    case "object":
      if (schema.oneOf?.some((s) => countOccurrencesInSchema(s, name) > 0) === true) {
        return 1;
      }

      if (schema.allOf?.some((s) => countOccurrencesInSchema(s, name) > 0) === true) {
        return 1;
      }

      if (schema.anyOf?.some((s) => countOccurrencesInSchema(s, name) > 0) === true) {
        return 1;
      }

      if (schema.not !== undefined && countOccurrencesInSchema(schema.not, name) > 0) {
        return 1;
      }

      if (
        schema.additionalProperties !== undefined &&
        schema.additionalProperties !== true &&
        schema.additionalProperties !== false &&
        countOccurrencesInSchema(schema.additionalProperties, name) > 0
      ) {
        return 1;
      }

      return 0;
    default:
      return 0;
  }
}

function countOccurrencesInRequestBody(requestBody: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject, name: string): number {
  if (isReferenceObject(requestBody)) {
    return 0;
  }

  let result = 0;

  for (const content of Object.values(requestBody.content)) {
    result += countOccurrencesInContent(content, name);
  }

  return result;
}

function countOccurrencesInResponse(response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject, name: string): number {
  if (isReferenceObject(response)) {
    return 0;
  }

  let result = 0;

  if (response.content !== undefined) {
    for (const content of Object.values(response.content)) {
      result += countOccurrencesInContent(content, name);
    }
  }

  return result;
}

function countOccurrencesInContent(content: OpenAPIV3.MediaTypeObject, name: string): number {
  if (content.schema === undefined) {
    return 0;
  }

  return countOccurrencesInSchema(content.schema, name);
}

function isReferenceToSchema(parameter: OpenAPIV3.ReferenceObject, name: string): boolean {
  return parameter.$ref === `#/components/schemas/${name}`;
}
