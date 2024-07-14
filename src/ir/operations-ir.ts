import { OpenAPIV3 } from "openapi-types";
import { HttpMethod, isHttpMethod } from "../diff/types";
import { isReferenceObject, join } from "./core";
import { extractOperationParameters, OperationParameterIntermediateRepresentation } from "./operation-parameters-ir";
import { extractOperationResponses, OperationResponseIntermediateRepresentation } from "./operation-responses-ir";

export interface OperationIntermediateRepresentation {
  key: string;
  path: string;
  method: HttpMethod;
  description: string | undefined;
  deprecated: boolean;
  parameters: OperationParameterIntermediateRepresentation[];
  responses: OperationResponseIntermediateRepresentation[];
}

export function extractOperations(document: OpenAPIV3.Document): OperationIntermediateRepresentation[] {
  const operations: OperationIntermediateRepresentation[] = [];

  for (const [path, methods] of Object.entries(document.paths)) {
    if (!methods || isReferenceObject(methods)) {
      continue;
    }

    for (const [method, operation] of Object.entries(methods)) {
      if (!isHttpMethod(method)) {
        continue;
      }

      const operationObj = operation as OpenAPIV3.OperationObject;
      operations.push({
        key: `OPERATION_${method}_${path}`,
        path,
        method,
        description: extractOperationDescription(operationObj),
        deprecated: operationObj.deprecated ?? false,
        parameters: extractOperationParameters(document, path, method),
        responses: extractOperationResponses(document, path, method),
      });
    }
  }

  return operations;
}

function extractOperationDescription(operation: OpenAPIV3.OperationObject): string | undefined {
  const result = [];

  if (operation.summary !== undefined) {
    result.push(`${operation.summary}\n`);
  }

  if (operation.description !== undefined) {
    result.push(`${operation.description}\n`);
  }

  if (operation.externalDocs !== undefined) {
    let line = "See also: ";

    if (operation.externalDocs.description !== undefined) {
      line += `${operation.externalDocs.description} (${operation.externalDocs.url})`;
    } else {
      line += operation.externalDocs.url;
    }

    result.push(line);
  }

  if (result.length === 0) {
    return undefined;
  }

  return join(result, "\n\n");
}