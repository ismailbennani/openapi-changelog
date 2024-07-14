import { OpenAPIV3 } from "openapi-types";
import { HttpMethod } from "../diff/types";

export interface OperationResponseIntermediateRepresentation {
  key: string;
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
