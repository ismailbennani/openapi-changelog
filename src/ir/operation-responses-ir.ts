import { OpenAPIV3 } from "openapi-types";
import { HttpMethod } from "../core/http-methods";

export interface OperationResponseIntermediateRepresentation {
  path: string;
  method: HttpMethod;
  code: string;
  type: string;
  description: string | undefined;
  examples: string | undefined;
}

export function extractOperationResponses(document: OpenAPIV3.Document, path: string, method: HttpMethod): OperationResponseIntermediateRepresentation[] {
  return [];
}
