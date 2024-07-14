import { OperationIntermediateRepresentation } from "../ir/operations-ir";
import { BreakingChange, NonBreakingChange } from "./types";
import { HttpMethod } from "../core/http-methods";

export function extractOperationParametersChange(
  oldOperation: OperationIntermediateRepresentation,
  newOperation: OperationIntermediateRepresentation,
): (OperationParameterBreakingChange | OperationParameterNonBreakingChange)[] {
  const result: (OperationParameterBreakingChange | OperationParameterNonBreakingChange)[] = [];

  for (const parameterInOldOperation of oldOperation.parameters) {
    const parameterInNewOperation = newOperation.parameters.find((p) => p.name === parameterInOldOperation.name);

    if (parameterInNewOperation === undefined) {
      result.push({
        path: parameterInOldOperation.path,
        method: parameterInOldOperation.method,
        name: parameterInOldOperation.name,
        type: "operation-parameter-removal",
        breaking: true,
      });
    } else {
      if (parameterInNewOperation.type !== parameterInOldOperation.type) {
        result.push({
          path: parameterInOldOperation.path,
          method: parameterInOldOperation.method,
          name: parameterInOldOperation.name,
          type: "operation-parameter-type-change",
          breaking: true,
        });
      }

      if (parameterInNewOperation.deprecated === true && parameterInOldOperation.deprecated !== true) {
        result.push({
          path: parameterInOldOperation.path,
          method: parameterInOldOperation.method,
          name: parameterInOldOperation.name,
          type: "operation-parameter-deprecation",
          breaking: false,
        });
      }

      if (parameterInNewOperation.description !== parameterInOldOperation.description) {
        result.push({
          path: parameterInOldOperation.path,
          method: parameterInOldOperation.method,
          name: parameterInOldOperation.name,
          type: "operation-parameter-documentation-change",
          breaking: false,
        });
      }
    }
  }

  for (const parameterInNewOperation of newOperation.parameters) {
    const parameterInOldOperation = newOperation.parameters.find((p) => p.name === parameterInNewOperation.name);

    if (parameterInOldOperation === undefined) {
      result.push({
        path: parameterInNewOperation.path,
        method: parameterInNewOperation.method,
        name: parameterInNewOperation.name,
        type: "operation-parameter-addition",
        breaking: false,
      });
    }
  }

  return result;
}

interface OperationParameterChange {
  path: string;
  method: HttpMethod;
  name: string;
}

export type OperationParameterBreakingChange = BreakingChange<"operation-parameter-removal" | "operation-parameter-type-change" | "operation-parameter-unclassified"> &
  OperationParameterChange;
export type OperationParameterNonBreakingChange = NonBreakingChange<
  "operation-parameter-addition" | "operation-parameter-deprecation" | "operation-parameter-documentation-change"
> &
  OperationParameterChange;
