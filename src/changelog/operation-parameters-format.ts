import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { OpenapiChangelogOptions } from "./changelog";
import { OperationParameterBreakingChange, OperationParameterNonBreakingChange } from "../diff/operation-parameters-change";

export function operationParameterBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: OperationParameterBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  const operationInOldDocument = oldDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  const operationInNewDocument = newDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  if (operationInOldDocument === undefined || operationInNewDocument === undefined) {
    return [];
  }

  const parameterInOldDocument = operationInOldDocument.parameters.find((p) => p.name === change.name);
  const parameterInNewDocument = operationInNewDocument.parameters.find((p) => p.name === change.name);

  switch (change.type) {
    case "operation-parameter-removal":
      return [`- Removed parameter ${change.name}`];
    case "operation-parameter-type-change":
      return [`- Changed type of parameter ${change.name}`];
    case "operation-parameter-unclassified":
      return [`- Changed parameter ${change.name}`];
  }
}

export function operationParameterNonBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: OperationParameterNonBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  const operationInOldDocument = oldDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  const operationInNewDocument = newDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  if (operationInOldDocument === undefined || operationInNewDocument === undefined) {
    return [];
  }

  const parameterInOldDocument = operationInOldDocument.parameters.find((p) => p.name === change.name);
  const parameterInNewDocument = operationInNewDocument.parameters.find((p) => p.name === change.name);

  switch (change.type) {
    case "operation-parameter-addition":
      return [`- Added parameter ${change.name}`];
    case "operation-parameter-deprecation":
      return [`- Deprecated parameter ${change.name}`];
    case "operation-parameter-documentation-change":
      return [`- Changed documentation of parameter ${change.name}`];
  }
}
