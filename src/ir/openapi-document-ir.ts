import { OpenAPIV3 } from "openapi-types";
import { extractOperations, OperationIntermediateRepresentation } from "./operations-ir";
import { extractParameters, ParameterIntermediateRepresentation } from "./parameters-ir";
import { extractSchemas, SchemaIntermediateRepresentation } from "./schemas-ir";

export interface OpenapiDocumentIntermediateRepresentation {
  title: string;
  version: string;
  operations: OperationIntermediateRepresentation[];
  parameters: ParameterIntermediateRepresentation[];
  schemas: SchemaIntermediateRepresentation[];
}

export function extractIntermediateRepresentation(document: OpenAPIV3.Document): OpenapiDocumentIntermediateRepresentation {
  return {
    title: document.info.title,
    version: document.info.version,
    operations: extractOperations(document),
    parameters: extractParameters(document),
    schemas: extractSchemas(document),
  };
}
