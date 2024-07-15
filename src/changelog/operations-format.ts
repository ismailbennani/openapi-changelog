import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { OperationBreakingChange, OperationNonBreakingChange } from "../diff/operations-change";
import { OpenapiChangelogOptions } from "./changelog";
import { operationParameterBreakingChange, operationParameterNonBreakingChange } from "./operation-parameters-format";
import { operationResponseBreakingChange, operationResponseNonBreakingChange } from "./operation-responses-format";
import { block, pad } from "./string-utils";
import { OperationIntermediateRepresentation } from "../ir/operations-ir";

export function operationBreakingChanges(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  changes: OperationBreakingChange[],
  options: OpenapiChangelogOptions,
): string[] {
  const groupedByOperation = Object.values(Object.groupBy(changes, (op) => `${op.method}_${op.path}}`));

  const blockOptions = {
    maxLineLength: options.printWidth,
    padding: 2,
    dontPadFirstLine: true,
  };

  const result: string[] = [];

  for (const group of groupedByOperation) {
    if (group === undefined) {
      continue;
    }

    group.sort((a, b) => a.type.localeCompare(b.type));
    let headerPrintedAlready = false;
    for (const change of group) {
      const operationInOldDocument = oldDocument.operations.find((p) => p.path === change.path && p.method === change.method);
      const operationInNewDocument = newDocument.operations.find((p) => p.path === change.path && p.method === change.method);

      switch (change.type) {
        case "operation-removal":
          result.push(...block(`- Removed operation ${change.method.toUpperCase()} ${change.path}`, blockOptions));
          break;
        case "operation-parameter-removal":
        case "operation-parameter-type-change":
        case "operation-parameter-unclassified":
          if (!headerPrintedAlready) {
            result.push(...block(`- In operation ${change.method.toUpperCase()} ${change.path}`, blockOptions));
            headerPrintedAlready = true;
          }

          result.push(...pad(operationParameterBreakingChange(oldDocument, newDocument, change, options), 2));
          break;
        case "operation-response-removal":
        case "operation-response-type-change":
        case "operation-response-unclassified":
          if (!headerPrintedAlready) {
            result.push(...block(`- In operation ${change.method.toUpperCase()} ${change.path}`, blockOptions));
            headerPrintedAlready = true;
          }

          result.push(...pad(operationResponseBreakingChange(oldDocument, newDocument, change, options), 2));
          break;
      }
    }
  }

  return result;
}

export function operationNonBreakingChanges(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  changes: OperationNonBreakingChange[],
  options: OpenapiChangelogOptions,
): string[] {
  const groupedByOperation = Object.values(Object.groupBy(changes, (op) => `${op.method}_${op.path}}`));

  const blockOptions = {
    maxLineLength: options.printWidth,
    padding: 2,
    dontPadFirstLine: true,
  };

  const result: string[] = [];

  for (const group of groupedByOperation) {
    if (group === undefined) {
      continue;
    }

    group.sort((a, b) => a.type.localeCompare(b.type));
    for (const change of group) {
      const operationInOldDocument = oldDocument.operations.find((p) => p.path === change.path && p.method === change.method);
      const operationInNewDocument = newDocument.operations.find((p) => p.path === change.path && p.method === change.method);

      switch (change.type) {
        case "operation-addition": {
          const content = [`- Added operation ${change.method.toUpperCase()} ${change.path}`];

          if (options.detailed === true && operationInNewDocument !== undefined) {
            content.push("", ...operationAdditionDetails(operationInNewDocument));
          }

          result.push(...block(content, blockOptions));
          break;
        }
        case "operation-documentation-change": {
          const content = [`- Changed documentation of operation ${change.method.toUpperCase()} ${change.path}`];

          if (options.detailed === true && operationInOldDocument !== undefined && operationInNewDocument !== undefined) {
            content.push("", ...operationDocumentationDetails(operationInOldDocument, operationInNewDocument));
          }

          result.push(...block(content, blockOptions));
          break;
        }
        case "operation-deprecation": {
          result.push(...block(`- Deprecated operation ${change.method.toUpperCase()} ${change.path}`, blockOptions));
          break;
        }
        case "operation-parameter-addition":
        case "operation-parameter-deprecation":
        case "operation-parameter-documentation-change": {
          result.push(...pad(operationParameterNonBreakingChange(oldDocument, newDocument, change, options), 2));
          break;
        }
        case "operation-response-addition":
        case "operation-response-documentation-change": {
          result.push(...pad(operationResponseNonBreakingChange(oldDocument, newDocument, change, options), 2));
          break;
        }
      }
    }
  }

  return result;
}

function operationAdditionDetails(newOperation: OperationIntermediateRepresentation): string[] {
  const result: string[] = [];

  if (newOperation.description !== undefined) {
    result.push(newOperation.description);
  }

  return result;
}

function operationDocumentationDetails(oldOperation: OperationIntermediateRepresentation, newOperation: OperationIntermediateRepresentation): string[] {
  const result: string[] = [];

  if (newOperation.description !== undefined) {
    result.push(newOperation.description);
  }

  return result;
}
