import { OpenAPIV3 } from "openapi-types";
import { evaluateSchemaOrRef, isArrayObject, isReferenceObject } from "./utils";
import winston from "winston";

export interface SchemaIntermediateRepresentation {
  name: string;
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
