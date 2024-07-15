import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { OpenapiChangelogOptions } from "./changelog";
import { OperationResponseBreakingChange, OperationResponseNonBreakingChange } from "../diff/operation-responses-change";

export function operationResponseBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: OperationResponseBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  const operationInOldDocument = oldDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  const operationInNewDocument = newDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  if (operationInOldDocument === undefined || operationInNewDocument === undefined) {
    return [];
  }

  const responseInOldDocument = operationInOldDocument.responses.find((p) => p.code === change.code);
  const responseInNewDocument = operationInNewDocument.responses.find((p) => p.code === change.code);

  switch (change.type) {
    case "operation-response-removal":
      return [`- Removed response ${change.code}`];
    case "operation-response-type-change":
      return [`- Changed type of response ${change.code}`];
    case "operation-response-unclassified":
      return [`- Changed response ${change.code}`];
  }
}

export function operationResponseNonBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: OperationResponseNonBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  const operationInOldDocument = oldDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  const operationInNewDocument = newDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  if (operationInOldDocument === undefined || operationInNewDocument === undefined) {
    return [];
  }

  const responseInOldDocument = operationInOldDocument.responses.find((p) => p.code === change.code);
  const responseInNewDocument = operationInNewDocument.responses.find((p) => p.code === change.code);

  switch (change.type) {
    case "operation-response-addition":
      return [`- Added response ${change.code}`];
    case "operation-response-documentation-change":
      return [`- Changed documentation of response ${change.code}`];
  }
}
