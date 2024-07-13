import { OpenAPIV3 } from "openapi-types";
import { HttpMethod, isHttpMethod } from "./types.js";
import winston from "winston";

export function extractIntermediateRepresentation(spec: OpenAPIV3.Document): IntermediateRepresentation {
  return {
    title: spec.info.title,
    version: spec.info.version,
    operations: extractOperations(spec),
  };
}

function extractOperations(spec: OpenAPIV3.Document): Operation[] {
  const result: Operation[] = [];

  for (let [path, methods] of Object.entries(spec.paths)) {
    if (!methods || isReferenceObject(methods)) {
      continue;
    }

    methods = methods as { [method in OpenAPIV3.HttpMethods]?: OpenAPIV3.OperationObject };
    for (let [method, operation] of Object.entries(methods)) {
      if (!isHttpMethod(method)) {
        continue;
      }

      operation = operation as OpenAPIV3.OperationObject;
      result.push({ path, method, parameters: extractParameters(spec, path, method, operation), responses: extractResponses(spec, path, method, operation), value: operation });
    }
  }

  return result;
}

function extractParameters(spec: OpenAPIV3.Document, path: string, method: string, operation: OpenAPIV3.OperationObject): Parameter[] {
  if (!operation.parameters) {
    return [];
  }

  const result: Parameter[] = [];

  for (const parameter of operation.parameters) {
    const evaluatedParameter = evaluateParameter(spec, parameter);
    if (!evaluatedParameter) {
      winston.warn(`At operation ${method} ${path}: could not evaluate parameter ${JSON.stringify(parameter)}`);
      continue;
    }

    result.push({ name: evaluatedParameter.name, value: parameter, actualValue: evaluatedParameter });
  }

  return result;
}

function extractResponses(spec: OpenAPIV3.Document, path: string, method: string, operation: OpenAPIV3.OperationObject): Response[] {
  if (!operation.responses) {
    return [];
  }

  const result: Response[] = [];

  for (const [code, response] of Object.entries(operation.responses)) {
    const evaluatedResponse = evaluateResponse(spec, response);
    if (!evaluatedResponse) {
      winston.warn(`At operation ${method} ${path}: could not evaluate response ${JSON.stringify(response)}`);
      continue;
    }

    result.push({ code, value: response, actualValue: evaluatedResponse });
  }

  return result;
}

export interface IntermediateRepresentation {
  title: string;
  version: string;
  operations: Operation[];
}

export interface Operation {
  path: string;
  method: HttpMethod;
  parameters: Parameter[];
  responses: Response[];
  value: OpenAPIV3.OperationObject;
}

export interface Parameter {
  name: string;
  value: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject;
  actualValue: OpenAPIV3.ParameterObject;
}

export interface Response {
  code: string;
  value: OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject;
  actualValue: OpenAPIV3.ResponseObject;
}

function evaluateParameter(spec: OpenAPIV3.Document, parameter: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject): OpenAPIV3.ParameterObject | undefined {
  if (isReferenceObject(parameter)) {
    const name = parameter.$ref;
    const refOrParam = spec.components?.parameters?.[name];
    if (!refOrParam) {
      return undefined;
    }

    return evaluateParameter(spec, refOrParam);
  }

  return parameter;
}

function evaluateResponse(spec: OpenAPIV3.Document, response: OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject): OpenAPIV3.ResponseObject | undefined {
  if (isReferenceObject(response)) {
    const name = response.$ref;
    const refOrResponse = spec.components?.responses?.[name];
    if (!refOrResponse) {
      return undefined;
    }

    return evaluateResponse(spec, refOrResponse);
  }

  return response;
}

function isReferenceObject(obj: object): obj is { $ref: string } {
  return Object.keys(obj).includes("$ref");
}
