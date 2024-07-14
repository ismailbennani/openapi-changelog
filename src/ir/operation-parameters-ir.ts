import { OpenAPIV3 } from "openapi-types";
import { HttpMethod } from "../diff/types";
import { evaluateParameterOrRef, isReferenceObject } from "./core";
import winston from "winston";
import { extractParameterExamples, extractParameterType } from "./parameters-ir";

export interface OperationParameterIntermediateRepresentation {
  key: string;
  path: string;
  method: HttpMethod;
  name: string;
  type: string;
  location: ParameterLocation | undefined;
  description: string | undefined;
  deprecated: boolean | undefined;
  required: boolean | undefined;
  examples: string | undefined;
}

const parameterLocations = ["path", "query", "header", "body", "formData", "cookie"] as const;
export type ParameterLocation = (typeof parameterLocations)[number];

export function extractOperationParameters(document: OpenAPIV3.Document, path: string, method: HttpMethod): OperationParameterIntermediateRepresentation[] {
  const parameters: (OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject)[] = Object.values(document.components?.parameters ?? {});

  const pathObj = document.paths[path];
  if (pathObj !== undefined) {
    if (pathObj.parameters !== undefined) {
      parameters.push(...pathObj.parameters);
    }

    const operation = pathObj[method];
    if (operation?.parameters !== undefined) {
      parameters.push(...operation.parameters);
    }
  }

  if (parameters.length === 0) {
    return [];
  }

  const result: OperationParameterIntermediateRepresentation[] = [];

  for (const parameter of parameters) {
    const evaluatedParameter = evaluateParameterOrRef(document, parameter);
    if (!evaluatedParameter) {
      winston.warn(`At operation ${method} ${path}: could not evaluate parameter ${JSON.stringify(parameter)}`);
      continue;
    }

    result.push({
      key: `OPERATION_${method}_${path}_${evaluatedParameter.name}`,
      path,
      method,
      name: evaluatedParameter.name,
      type: extractParameterType(parameter),
      location: isParameterLocation(evaluatedParameter.in) ? evaluatedParameter.in : undefined,
      deprecated: isReferenceObject(parameter) ? undefined : parameter.deprecated ?? false,
      required: isReferenceObject(parameter) ? undefined : parameter.required ?? false,
      description: isReferenceObject(parameter) ? undefined : parameter.description,
      examples: isReferenceObject(parameter) ? undefined : extractParameterExamples(parameter),
    });
  }

  return result;
}

export function isParameterLocation(str: string): str is ParameterLocation {
  return parameterLocations.some((location) => location === str);
}
