import { OpenAPIV3 } from "openapi-types";
import { extractVersionChange, VersionChange } from "./version-change";
import { extractIntermediateRepresentation, OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { extractOperationsChange, OperationBreakingChange, OperationNonBreakingChange } from "./operations-change";
import { extractParametersChange, ParameterBreakingChange, ParameterNonBreakingChange } from "./parameters-change";
import { SchemaBreakingChange, SchemaNonBreakingChange } from "./schemas-change";

export interface OpenapiDocumentChanges {
  /**
   * The change in versions between the old and the new specifications
   */
  version: VersionChange;
  /**
   * The changes between the old and the new specifications
   */
  changes: OpenapiDocumentChange[];
}

export type OpenapiDocumentChange = OpenapiDocumentBreakingChange | OpenapiDocumentNonBreakingChange;
export type OpenapiDocumentBreakingChange = OperationBreakingChange | ParameterBreakingChange | SchemaBreakingChange;
export type OpenapiDocumentNonBreakingChange = OperationNonBreakingChange | ParameterNonBreakingChange | SchemaNonBreakingChange;

export function compare(oldDocument: OpenAPIV3.Document, newDocument: OpenAPIV3.Document): OpenapiDocumentChanges {
  const oldDocumentIr = extractIntermediateRepresentation(oldDocument);
  const newDocumentIr = extractIntermediateRepresentation(newDocument);

  return compareIntermediateRepresentations(oldDocumentIr, newDocumentIr);
}

export function compareIntermediateRepresentations(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
): OpenapiDocumentChanges {
  const versionChanges = extractVersionChange(oldDocument, newDocument);
  const operationChanges = extractOperationsChange(oldDocument, newDocument);
  const parameterChanges = extractParametersChange(oldDocument, newDocument);

  return {
    version: versionChanges,
    changes: [...operationChanges, ...parameterChanges],
  };
}
