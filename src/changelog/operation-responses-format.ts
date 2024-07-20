import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { OpenapiChangelogOptions } from "./changelog";
import { OperationResponseBreakingChange, OperationResponseNonBreakingChange } from "../diff/operation-responses-change";
import { OperationResponseIntermediateRepresentation } from "../ir/operation-responses-ir";
import { block, diffStrings, pad } from "../core/string-utils";

export function operationResponseBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: OperationResponseBreakingChange,
  options: OpenapiChangelogOptions,
): string[] {
  const innerBlockPadding = 2;
  const blockWidth = options.printWidth ?? 9999;
  const innerBlockWidth = blockWidth - innerBlockPadding;

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
        result.push("", ...pad(responseTypeChangeDetails(responseInOldDocument, responseInNewDocument), innerBlockPadding));
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
  const innerBlockPadding = 2;
  const blockWidth = options.printWidth ?? 9999;
  const innerBlockWidth = blockWidth - innerBlockPadding;

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

      const result = [header];

      if (options.detailed === true && responseInNewDocument !== undefined) {
        result.push("", ...pad(responseAdditionDetails(responseInNewDocument), innerBlockPadding));
      }

      return result;
    }
    case "operation-response-documentation-change": {
      const result = block(`- Changed documentation of response ${change.code}`, blockWidth);

      if (options.detailed === true && responseInOldDocument !== undefined && responseInNewDocument !== undefined) {
        const details = responseDocumentationDetails(responseInOldDocument, responseInNewDocument);
        if (details !== undefined) {
          result.push("  - Changes", ...block(details, innerBlockWidth, innerBlockPadding));
        }
      }

      return result;
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

function responseDocumentationDetails(oldResponse: OperationResponseIntermediateRepresentation, newResponse: OperationResponseIntermediateRepresentation): string | undefined {
  if (oldResponse.description !== undefined && newResponse.description !== undefined) {
    return diffStrings(oldResponse.description, newResponse.description);
  }

  if (newResponse.description !== undefined) {
    return newResponse.description;
  }

  return undefined;
}
