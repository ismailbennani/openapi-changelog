import { OpenAPIV3 } from "openapi-types";
import { evaluateParameterOrRef, isReferenceObject, join } from "./utils";
import winston from "winston";
import { extractTypeFromSchema } from "./schemas-ir";
import { HttpMethod, isHttpMethod } from "../core/http-methods";

export interface ParameterIntermediateRepresentation {
  name: string;
  type: string;
  occurrences: Occurrence[];
  description: string | undefined;
  examples: string | undefined;
}

interface Occurrence {
  path: string;
  method: HttpMethod;
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

    const occurrences = findOccurrences(document, name);

    result.push({
      name: name,
      type: extractParameterType(parameter),
      occurrences: Object.entries(occurrences).flatMap(([path, methods]) => [...methods].map((method) => ({ path, method }))),
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

function findOccurrences(document: OpenAPIV3.Document, name: string): Record<string, Set<HttpMethod>> {
  const result: Record<string, Set<HttpMethod>> = {};

  for (const [path, methods] of Object.entries(document.paths)) {
    if (methods === undefined) {
      continue;
    }

    const methodsOfPathContainingReference: Set<HttpMethod> = new Set<HttpMethod>();

    if (methods.parameters !== undefined) {
      for (const parameter of methods.parameters) {
        if (isReferenceOfParameter(parameter, name)) {
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
      if (parameters === undefined) {
        continue;
      }

      for (const parameter of parameters) {
        if (isReferenceOfParameter(parameter, name)) {
          methodsOfPathContainingReference.add(method);
        }
      }
    }

    if (methodsOfPathContainingReference.size > 0) {
      result[path] = methodsOfPathContainingReference;
    }
  }

  return result;
}

function isReferenceOfParameter(parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject, name: string): boolean {
  if (isReferenceObject(parameter)) {
    return parameter.$ref === `#/components/parameters/${name}`;
  }

  return false;
}

function extractTypeFromContent(content: OpenAPIV3.MediaTypeObject): string {
  return extractTypeFromSchema(content);
}
