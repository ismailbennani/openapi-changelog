import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { OperationBreakingChange, OperationNonBreakingChange } from "../diff/operations-change";
import { OpenapiChangelogOptions } from "./changelog";
import { operationParameterBreakingChange, operationParameterNonBreakingChange } from "./operation-parameters-format";
import { operationResponseBreakingChange, operationResponseNonBreakingChange } from "./operation-responses-format";

export function operationBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: OperationBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  const operationInOldDocument = oldDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  const operationInNewDocument = newDocument.operations.find((p) => p.path === change.path && p.method === change.method);

  switch (change.type) {
    case "operation-removal":
      return [`- Removed operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-parameter-removal":
    case "operation-parameter-type-change":
    case "operation-parameter-unclassified":
      return operationParameterBreakingChange(oldDocument, newDocument, change, options);
    case "operation-response-removal":
    case "operation-response-type-change":
    case "operation-response-unclassified":
      return operationResponseBreakingChange(oldDocument, newDocument, change, options);
  }
}

export function operationNonBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: OperationNonBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  const operationInOldDocument = oldDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  const operationInNewDocument = newDocument.operations.find((p) => p.path === change.path && p.method === change.method);

  switch (change.type) {
    case "operation-addition":
      return [`- Added operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-documentation-change":
      return [`- Changed documentation of operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-deprecation":
      return [`- Deprecated operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-parameter-addition":
    case "operation-parameter-deprecation":
    case "operation-parameter-documentation-change":
      return operationParameterNonBreakingChange(oldDocument, newDocument, change, options);
    case "operation-response-addition":
    case "operation-response-documentation-change":
      return operationResponseNonBreakingChange(oldDocument, newDocument, change, options);
  }
}
