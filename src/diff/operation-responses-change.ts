import { OperationIntermediateRepresentation } from "../ir/operations-ir";
import { BreakingChange, NonBreakingChange } from "./types";
import { HttpMethod } from "../core/http-methods";

export function extractOperationResponsesChange(
  oldOperation: OperationIntermediateRepresentation,
  newOperation: OperationIntermediateRepresentation,
): (OperationResponseBreakingChange | OperationResponseNonBreakingChange)[] {
  const result: (OperationResponseBreakingChange | OperationResponseNonBreakingChange)[] = [];

  for (const responseInOldOperation of oldOperation.responses) {
    const responseInNewOperation = newOperation.responses.find((p) => p.code === responseInOldOperation.code);

    if (responseInNewOperation === undefined) {
      result.push({
        path: responseInOldOperation.path,
        method: responseInOldOperation.method,
        code: responseInOldOperation.code,
        type: "operation-response-removal",
        breaking: true,
      });
    } else {
      if (responseInNewOperation.type !== responseInOldOperation.type) {
        result.push({
          path: responseInOldOperation.path,
          method: responseInOldOperation.method,
          code: responseInOldOperation.code,
          type: "operation-response-type-change",
          breaking: true,
        });
      }

      if (responseInNewOperation.description !== responseInOldOperation.description) {
        result.push({
          path: responseInOldOperation.path,
          method: responseInOldOperation.method,
          code: responseInOldOperation.code,
          type: "operation-response-documentation-change",
          breaking: false,
        });
      }
    }
  }

  for (const responseInNewOperation of newOperation.responses) {
    const responseInOldOperation = newOperation.responses.find((p) => p.code === responseInNewOperation.code);

    if (responseInOldOperation === undefined) {
      result.push({
        path: responseInNewOperation.path,
        method: responseInNewOperation.method,
        code: responseInNewOperation.code,
        type: "operation-response-addition",
        breaking: false,
      });
    }
  }

  return result;
}

interface OperationResponseChange {
  path: string;
  method: HttpMethod;
  code: string;
}
export type OperationResponseBreakingChange = BreakingChange<"operation-response-removal" | "operation-response-type-change" | "operation-response-unclassified"> &
  OperationResponseChange;
export type OperationResponseNonBreakingChange = NonBreakingChange<"operation-response-addition" | "operation-response-documentation-change"> & OperationResponseChange;
