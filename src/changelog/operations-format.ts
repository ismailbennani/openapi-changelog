import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { OperationBreakingChange, OperationNonBreakingChange } from "../diff/operations-change";
import { OpenapiChangelogOptions } from "./changelog";
import { operationParameterBreakingChange, operationParameterNonBreakingChange } from "./operation-parameters-format";
import { operationResponseBreakingChange, operationResponseNonBreakingChange } from "./operation-responses-format";
import { block, diffStrings, pad } from "../core/string-utils";
import { OperationIntermediateRepresentation } from "../ir/operations-ir";

export function operationBreakingChanges(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  changes: OperationBreakingChange[],
  options: OpenapiChangelogOptions,
): string[] {
  const innerBlockPadding = 2;
  const blockWidth = options.printWidth ?? 9999;
  const innerBlockWidth = blockWidth - innerBlockPadding;
  const innerBlockOptions = { ...options, printWidth: innerBlockWidth };

  const result: string[] = [];

  const removals = changes.filter((c) => c.type === "operation-removal");
  for (const removal of removals) {
    result.push(...block(`- Removed operation ${removal.method.toUpperCase()} ${removal.path}`, blockWidth));
  }

  const others = changes.filter((c) => c.type !== "operation-removal");
  const groupedByOperation = Object.values(Object.groupBy(others, (op) => `${op.method}_${op.path}}`));

  for (const group of groupedByOperation) {
    if (group === undefined) {
      continue;
    }

    group.sort((a, b) => a.type.localeCompare(b.type));
    let headerPrintedAlready = false;
    for (const change of group) {
      switch (change.type) {
        case "operation-parameter-removal":
        case "operation-parameter-type-change":
        case "operation-parameter-unclassified":
          if (!headerPrintedAlready) {
            result.push(`- In operation ${change.method.toUpperCase()} ${change.path}`);
            headerPrintedAlready = true;
          }

          result.push(...pad(operationParameterBreakingChange(oldDocument, newDocument, change, innerBlockOptions), innerBlockPadding));
          break;
        case "operation-response-removal":
        case "operation-response-type-change":
        case "operation-response-unclassified":
          if (!headerPrintedAlready) {
            result.push(`- In operation ${change.method.toUpperCase()} ${change.path}`);
            headerPrintedAlready = true;
          }

          result.push(...pad(operationResponseBreakingChange(oldDocument, newDocument, change, innerBlockOptions), innerBlockPadding));
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
  const innerBlockPadding = 2;
  const blockWidth = options.printWidth ?? 9999;
  const innerBlockWidth = blockWidth - innerBlockPadding;
  const innerBlockOptions = { ...options, printWidth: innerBlockWidth };

  const result: string[] = [];

  const additions = changes.filter((c) => c.type === "operation-addition");
  for (const addition of additions) {
    const operationInNewDocument = newDocument.operations.find((p) => p.path === addition.path && p.method === addition.method);

    result.push(`- Added operation ${addition.method.toUpperCase()} ${addition.path}`);

    if (options.detailed === true && operationInNewDocument !== undefined) {
      result.push("", ...pad(operationAdditionDetails(operationInNewDocument), innerBlockPadding));
    }
  }

  const others = changes.filter((c) => c.type !== "operation-addition");
  const groupedByOperation = Object.values(Object.groupBy(others, (op) => `${op.method}_${op.path}}`));

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
        case "operation-documentation-change": {
          result.push(`- Changed documentation of operation ${change.method.toUpperCase()} ${change.path}`);

          if (options.detailed === true && operationInOldDocument !== undefined && operationInNewDocument !== undefined) {
            const details = operationDocumentationDetails(operationInOldDocument, operationInNewDocument);
            if (details !== undefined) {
              result.push("", ...block(details, innerBlockWidth, innerBlockPadding));
            }
          }
          break;
        }
        case "operation-deprecation": {
          result.push(`- Deprecated operation ${change.method.toUpperCase()} ${change.path}`);
          break;
        }
        case "operation-parameter-addition":
        case "operation-parameter-deprecation":
        case "operation-parameter-documentation-change": {
          if (!headerPrintedAlready) {
            result.push(`- In operation ${change.method.toUpperCase()} ${change.path}`);
            headerPrintedAlready = true;
          }

          result.push(...pad(operationParameterNonBreakingChange(oldDocument, newDocument, change, innerBlockOptions), innerBlockPadding));
          break;
        }
        case "operation-response-addition":
        case "operation-response-documentation-change": {
          if (!headerPrintedAlready) {
            result.push(`- In operation ${change.method.toUpperCase()} ${change.path}`);
            headerPrintedAlready = true;
          }

          result.push(...pad(operationResponseNonBreakingChange(oldDocument, newDocument, change, innerBlockOptions), innerBlockPadding));
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

function operationDocumentationDetails(oldOperation: OperationIntermediateRepresentation, newOperation: OperationIntermediateRepresentation): string | undefined {
  if (oldOperation.description !== undefined && newOperation.description !== undefined) {
    return diffStrings(oldOperation.description, newOperation.description);
  }

  if (newOperation.description !== undefined) {
    return newOperation.description;
  }

  return undefined;
}
