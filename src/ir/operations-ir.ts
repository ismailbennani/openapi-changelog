import { OpenAPIV3 } from "openapi-types";
import { HttpMethod, isHttpMethod } from "../core/http-methods";
import { trimJoin } from "./utils";
import { extractOperationParameters, OperationParameterIntermediateRepresentation } from "./operation-parameters-ir";
import { extractOperationResponses, OperationResponseIntermediateRepresentation } from "./operation-responses-ir";
import { escapeMarkdown } from "../core/string-utils";

export interface OperationIntermediateRepresentation {
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
    if (!methods) {
      continue;
    }

    for (const [method, operation] of Object.entries(methods)) {
      if (!isHttpMethod(method)) {
        continue;
      }

      const operationObj = operation as OpenAPIV3.OperationObject;
      const description = extractOperationDescription(operationObj);
      operations.push({
        path,
        method,
        description: description === undefined ? undefined : escapeMarkdown(description),
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

  return trimJoin(result, "\n\n");
}
