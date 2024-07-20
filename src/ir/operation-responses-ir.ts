import { OpenAPIV3 } from "openapi-types";
import { HttpMethod } from "../core/http-methods";
import { evaluateResponseOrRef, isReferenceObject } from "./utils";
import { escapeMarkdown } from "../core/string-utils";
import { extractResponseType } from "./openapi-types-utils";

export interface OperationResponseIntermediateRepresentation {
  path: string;
  method: HttpMethod;
  code: string;
  type: string;
  description: string | undefined;
}

export function extractOperationResponses(document: OpenAPIV3.Document, path: string, method: HttpMethod): OperationResponseIntermediateRepresentation[] {
  const result: OperationResponseIntermediateRepresentation[] = [];

  const pathObj = document.paths[path];
  if (pathObj !== undefined) {
    const operation = pathObj[method];
    if (operation?.responses !== undefined) {
      for (const [code, response] of Object.entries(operation.responses)) {
        const evaluatedResponse = evaluateResponseOrRef(document, response);
        if (!evaluatedResponse) {
          continue;
        }

        result.push({
          path,
          method,
          code,
          type: extractResponseType(response),
          description: isReferenceObject(response) ? undefined : escapeMarkdown(response.description),
        });
      }
    }
  }

  return result;
}
