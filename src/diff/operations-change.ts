import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { BreakingChange, NonBreakingChange } from "./types";
import { isDeepStrictEqual } from "util";
import { extractOperationParametersChange, OperationParameterBreakingChange, OperationParameterNonBreakingChange } from "./operation-parameters-change";
import { extractOperationResponsesChange, OperationResponseBreakingChange, OperationResponseNonBreakingChange } from "./operation-responses-change";

export function extractOperationsChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
): (OperationBreakingChange | OperationNonBreakingChange)[] {
  const result: (OperationBreakingChange | OperationNonBreakingChange)[] = [];

  for (const operationInOldDocument of oldDocument.operations) {
    const operationInNewDocument = newDocument.operations.find((op) => op.path === operationInOldDocument.path && op.method === operationInOldDocument.method);

    if (operationInNewDocument === undefined) {
      result.push({
        path: operationInOldDocument.path,
        method: operationInOldDocument.method,
        type: "operation-removal",
        breaking: true,
      });
    } else if (!isDeepStrictEqual(operationInOldDocument, operationInNewDocument)) {
      if (operationInNewDocument.deprecated && !operationInOldDocument.deprecated) {
        result.push({
          path: operationInOldDocument.path,
          method: operationInOldDocument.method,
          type: "operation-deprecation",
          breaking: false,
        });
      }

      if (operationInNewDocument.description !== operationInOldDocument.description) {
        result.push({
          path: operationInOldDocument.path,
          method: operationInOldDocument.method,
          type: "operation-documentation-change",
          breaking: false,
        });
      }

      result.push(...extractOperationParametersChange(operationInOldDocument, operationInNewDocument).map((c) => c));
      result.push(...extractOperationResponsesChange(operationInOldDocument, operationInNewDocument).map((c) => c));
    }
  }

  for (const operationInNewDocument of newDocument.operations) {
    const operationInOldDocument = newDocument.operations.find((op) => op.path === operationInNewDocument.path && op.method === operationInNewDocument.method);

    if (operationInOldDocument === undefined) {
      result.push({
        path: operationInNewDocument.path,
        method: operationInNewDocument.method,
        type: "operation-addition",
        breaking: false,
      });
    }
  }

  return result;
}

interface OperationChange {
  path: string;
  method: string;
}

export type OperationBreakingChange = (BreakingChange<"operation-removal"> | OperationParameterBreakingChange | OperationResponseBreakingChange) & OperationChange;
export type OperationNonBreakingChange = (
  | NonBreakingChange<"operation-addition" | "operation-documentation-change" | "operation-deprecation">
  | OperationParameterNonBreakingChange
  | OperationResponseNonBreakingChange
) &
  OperationChange;
