import { OpenAPIV3 } from "openapi-types";
import { evaluateParameterOrRef, isReferenceObject, join } from "./core";
import winston from "winston";
import { extractTypeFromSchema } from "./schemas-ir";

export interface ParameterIntermediateRepresentation {
  key: string;
  name: string;
  type: string;
  description: string | undefined;
  examples: string | undefined;
}

export function extractParameters(document: OpenAPIV3.Document): ParameterIntermediateRepresentation[] {
  if (!document.components?.parameters) {
    return [];
  }

  const result: ParameterIntermediateRepresentation[] = [];

  for (const [name, parameter] of Object.entries(document.components.parameters)) {
    const evaluatedParameter = evaluateParameterOrRef(document, parameter);
    if (!evaluatedParameter) {
      winston.warn(`At parameter ${name}: could not evaluate parameter ${JSON.stringify(parameter)}`);
      continue;
    }

    result.push({
      key: `$PARAMETER_${evaluatedParameter.name}`,
      name: name,
      type: extractParameterType(parameter),
      description: isReferenceObject(parameter) ? undefined : parameter.description,
      examples: isReferenceObject(parameter) ? undefined : extractParameterExamples(parameter),
    });
  }

  return result;
}

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

    return join(result, "\n");
  }

  return "???";
}

export function extractParameterExamples(parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject): string | undefined {
  if (isReferenceObject(parameter)) {
    return undefined;
  }

  const result: string[] = [];

  if (parameter.example !== undefined) {
    result.push(`Example: ${parameter.example as string}`);
  }

  if (parameter.examples !== undefined) {
    result.push("Example:");

    for (const [name, example] of Object.entries(parameter.examples)) {
      const exampleStr: string = isReferenceObject(example) ? example.$ref : (example.value as string);
      result.push(`  - ${name}: ${exampleStr}`);
    }
  }

  return join(result, "\n");
}

function extractTypeFromContent(content: OpenAPIV3.MediaTypeObject): string {
  return extractTypeFromSchema(content);
}
