import { IntermediateRepresentation, Operation } from "./intermediate-representation.js";
import { AddedOperation, DeprecatedOperation, RemovedOperation } from "./types";
import { isDeepStrictEqual } from "node:util";

export function extractOperationsDiff(
  oldSpec: IntermediateRepresentation,
  newSpec: IntermediateRepresentation,
): { added: AddedOperation[]; deprecated: DeprecatedOperation[]; removed: RemovedOperation[] } {
  const removed: RemovedOperation[] = [];
  for (const operation of oldSpec.operations) {
    const operationInNewSpec = newSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);
    if (!operationInNewSpec) {
      removed.push({ path: operation.path, method: operation.method, ...operation.value });
    }
  }

  const deprecated: DeprecatedOperation[] = [];
  for (const operation of oldSpec.operations) {
    const operationInNewSpec = newSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);
    if (operationInNewSpec && operationInNewSpec.value.deprecated && !operation.value.deprecated) {
      deprecated.push({ path: operation.path, method: operation.method, ...operation.value });
    }
  }

  const added: AddedOperation[] = [];
  for (const operation of newSpec.operations) {
    const operationInOldSpec = oldSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);

    if (!operationInOldSpec) {
      added.push({ path: operation.path, method: operation.method, ...operation.value });
    }
  }

  return { added, deprecated, removed };
}
