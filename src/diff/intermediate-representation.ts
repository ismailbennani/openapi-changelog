import { OpenAPIV3 } from "openapi-types";
import { HttpMethod, isHttpMethod } from "./types.js";
import winston from "winston";

export function extractIntermediateRepresentation(spec: OpenAPIV3.Document): IntermediateRepresentation {
  const { operations, operationParameters, operationResponses } = extractOperations(spec);

  return {
    title: spec.info.title,
    version: spec.info.version,
    operations,
    operationParameters,
    operationResponses,
    parameters: extractParameters(spec),
    schemas: extractSchemas(spec),
  };
}

function extractOperations(spec: OpenAPIV3.Document): { operations: Operation[]; operationParameters: OperationParameter[]; operationResponses: OperationResponse[] } {
  const operations: Operation[] = [];
  const operationParameters: OperationParameter[] = [];
  const operationResponses: OperationResponse[] = [];

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
      operations.push({
        path,
        method,
        value: operation,
      });

      operationParameters.push(...extractOperationParameters(spec, path, method, operation));
      operationResponses.push(...extractOperationResponses(spec, path, method, operation));
    }
  }

  return { operations, operationParameters, operationResponses };
}

function extractOperationParameters(spec: OpenAPIV3.Document, path: string, method: string, operation: OpenAPIV3.OperationObject): OperationParameter[] {
  if (!operation.parameters) {
    return [];
  }

  const result: OperationParameter[] = [];

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

function extractOperationResponses(spec: OpenAPIV3.Document, path: string, method: string, operation: OpenAPIV3.OperationObject): OperationResponse[] {
  if (!operation.responses) {
    return [];
  }

  const result: OperationResponse[] = [];

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

function extractParameters(spec: OpenAPIV3.Document) {
  if (!spec.components?.parameters) {
    return [];
  }

  const result: NamedParameter[] = [];

  for (const [name, parameter] of Object.entries(spec.components.parameters)) {
    const evaluatedParameter = evaluateParameter(spec, parameter);
    if (!evaluatedParameter) {
      winston.warn(`At parameter ${name}: could not evaluate parameter ${JSON.stringify(parameter)}`);
      continue;
    }

    result.push({ name, value: parameter, actualValue: evaluatedParameter });
  }

  return result;
}

function extractSchemas(spec: OpenAPIV3.Document) {
  if (!spec.components?.schemas) {
    return [];
  }

  const result: Schema[] = [];

  for (const [name, schema] of Object.entries(spec.components.schemas)) {
    const evaluatedSchema = evaluateSchema(spec, schema);
    if (!evaluatedSchema) {
      winston.warn(`At parameter ${name}: could not evaluate parameter ${JSON.stringify(schema)}`);
      continue;
    }

    result.push({ name, value: schema, actualValue: evaluatedSchema });
  }

  return result;
}

export interface IntermediateRepresentation {
  title: string;
  version: string;
  operations: Operation[];
  operationParameters: OperationParameter[];
  operationResponses: OperationResponse[];
  parameters: NamedParameter[];
  schemas: Schema[];
}

export interface Operation {
  path: string;
  method: HttpMethod;
  value: OpenAPIV3.OperationObject;
}

export interface OperationParameter {
  name: string;
  value: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject;
  actualValue: OpenAPIV3.ParameterObject;
}

export interface OperationResponse {
  code: string;
  value: OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject;
  actualValue: OpenAPIV3.ResponseObject;
}

export interface NamedParameter {
  name: string;
  value: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;
  actualValue: OpenAPIV3.ParameterObject;
}

export interface Schema {
  name: string;
  value: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
  actualValue: OpenAPIV3.SchemaObject;
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

function evaluateSchema(spec: OpenAPIV3.Document, schema: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject): OpenAPIV3.SchemaObject | undefined {
  if (isReferenceObject(schema)) {
    const name = schema.$ref;
    const refOrSchema = spec.components?.schemas?.[name];
    if (!refOrSchema) {
      return undefined;
    }

    return evaluateSchema(spec, refOrSchema);
  }

  return schema;
}

function isReferenceObject(obj: object): obj is { $ref: string } {
  return Object.keys(obj).includes("$ref");
}
