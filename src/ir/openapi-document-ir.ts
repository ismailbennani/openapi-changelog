import { OpenAPIV3 } from "openapi-types";
import { extractOperations, OperationIntermediateRepresentation } from "./operations-ir";
import { extractParameters, ParameterIntermediateRepresentation } from "./parameters-ir";
import { extractSchemas, SchemaIntermediateRepresentation } from "./schemas-ir";
import { Logger } from "../core/logging";

export interface OpenapiDocumentIntermediateRepresentation {
  title: string;
  version: string;
  operations: OperationIntermediateRepresentation[];
  parameters: ParameterIntermediateRepresentation[];
  schemas: SchemaIntermediateRepresentation[];
}

export function extractIntermediateRepresentation(document: OpenAPIV3.Document): OpenapiDocumentIntermediateRepresentation {
  const startOperations = performance.now();
  const operations = extractOperations(document);
  const startParameters = performance.now();
  const parameters = extractParameters(document);
  const startSchemas = performance.now();
  const schemas = extractSchemas(document);
  const end = performance.now();

  Logger.debug(
    `IR extraction performed in ${(end - startOperations).toString()}ms (` +
      `operations:${(startParameters - startOperations).toString()}ms, ` +
      `parameters:${(startSchemas - startParameters).toString()}ms, ` +
      `schemas:${(end - startSchemas).toString()}ms` +
      ")",
  );

  return {
    title: document.info.title,
    version: document.info.version,
    operations,
    parameters,
    schemas,
  };
}
