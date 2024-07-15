import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { OpenapiChangelogOptions } from "./changelog";
import { OperationResponseBreakingChange, OperationResponseNonBreakingChange } from "../diff/operation-responses-change";
import { OperationResponseIntermediateRepresentation } from "../ir/operation-responses-ir";
import { block } from "./string-utils";

export function operationResponseBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: OperationResponseBreakingChange,
  options: OpenapiChangelogOptions,
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
    case "operation-response-type-change": {
      const result = [`- Changed type of response ${change.code}`];

      if (options.detailed === true && responseInOldDocument !== undefined && responseInNewDocument !== undefined) {
        result.push(...responseTypeChangeDetails(responseInOldDocument, responseInNewDocument));
      }

      return result;
    }
    case "operation-response-unclassified":
      return [`- Changed response ${change.code}`];
  }
}

export function operationResponseNonBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: OperationResponseNonBreakingChange,
  options: OpenapiChangelogOptions,
): string[] {
  const blockOptions = {
    maxLineLength: options.printWidth,
    padding: 2,
    dontPadFirstLine: true,
  };

  const operationInOldDocument = oldDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  const operationInNewDocument = newDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  if (operationInOldDocument === undefined || operationInNewDocument === undefined) {
    return [];
  }

  const responseInOldDocument = operationInOldDocument.responses.find((p) => p.code === change.code);
  const responseInNewDocument = operationInNewDocument.responses.find((p) => p.code === change.code);

  switch (change.type) {
    case "operation-response-addition": {
      let header = `- Added response ${change.code}`;
      if (responseInNewDocument !== undefined) {
        header += ` of type ${responseInNewDocument.type}`;
      }

      const content = [header];

      if (options.detailed === true && responseInNewDocument !== undefined) {
        content.push("", ...responseAdditionDetails(responseInNewDocument));
      }

      return block(content, blockOptions);
    }
    case "operation-response-documentation-change": {
      const content = [`- Changed documentation of response ${change.code}`];

      if (options.detailed === true && responseInOldDocument !== undefined && responseInNewDocument !== undefined) {
        content.push("", ...responseDocumentationDetails(responseInOldDocument, responseInNewDocument));
      }

      return block(content, blockOptions);
    }
  }
}

function responseTypeChangeDetails(oldResponse: OperationResponseIntermediateRepresentation, newResponse: OperationResponseIntermediateRepresentation): string[] {
  return [`Old type: ${oldResponse.type}`, `New type: ${newResponse.type}`];
}

function responseAdditionDetails(newResponse: OperationResponseIntermediateRepresentation): string[] {
  const result: string[] = [];

  if (newResponse.description !== undefined) {
    result.push(newResponse.description);
  }

  return result;
}

function responseDocumentationDetails(oldResponse: OperationResponseIntermediateRepresentation, newResponse: OperationResponseIntermediateRepresentation): string[] {
  const result: string[] = [];

  if (newResponse.description !== undefined) {
    result.push(newResponse.description);
  }

  return result;
}
