import { OpenAPIV3 } from "openapi-types";
import { isArrayObject, isReferenceObject, trimJoin } from "./utils";

export function extractParameterType(parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject): string {
  if (isReferenceObject(parameter)) {
    return parameter.$ref;
  }

  if (parameter.schema !== undefined) {
    return extractTypeFromSchema(parameter.schema);
  }

  if (parameter.content !== undefined) {
    const result: string[] = [];

    for (const [contentType, content] of Object.entries(parameter.content)) {
      result.push(`- ${contentType}: ${extractTypeFromContent(content)}`);
    }

    return trimJoin(result, "\n");
  }

  return "???";
}

function extractTypeFromContent(content: OpenAPIV3.MediaTypeObject): string {
  return extractTypeFromSchema(content);
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

export function extractResponseType(response: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject): string {
  if (isReferenceObject(response)) {
    return response.$ref;
  }

  if (response.content !== undefined) {
    const result: string[] = [];

    for (const [contentType, content] of Object.entries(response.content)) {
      result.push(`- ${contentType}: ${extractTypeFromContent(content)}`);
    }

    return trimJoin(result, "\n");
  }

  return "???";
}
