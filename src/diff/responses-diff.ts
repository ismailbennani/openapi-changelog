import { IntermediateRepresentation } from "./intermediate-representation";
import { AddedResponse, AddedResponses, ChangedResponse, ChangedResponses, RemovedResponse, RemovedResponses } from "./types";
import { isDeepStrictEqual } from "node:util";

export function extractResponsesDiff(
  oldSpec: IntermediateRepresentation,
  newSpec: IntermediateRepresentation,
): { added: AddedResponses[]; changed: ChangedResponses[]; removed: RemovedResponses[] } {
  const removed: RemovedResponses[] = [];
  for (const operation of oldSpec.operations) {
    const operationInNewSpec = newSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);
    if (!operationInNewSpec) {
      continue;
    }

    const responses: AddedResponse[] = [];
    for (const response of operation.responses) {
      const responseInNewSpec = operationInNewSpec.responses.find((p) => p.code === response.code);
      if (!responseInNewSpec) {
        responses.push({ code: response.code, ...response.value });
      }
    }

    if (responses.length > 0) {
      removed.push({ path: operation.path, method: operation.method, responses });
    }
  }

  const changed: ChangedResponses[] = [];
  for (const operation of oldSpec.operations) {
    const operationInNewSpec = newSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);
    if (!operationInNewSpec) {
      continue;
    }

    const changes: ChangedResponse[] = [];
    for (const response of operation.responses) {
      const responseInNewSpec = operationInNewSpec.responses.find((p) => p.code === response.code);

      if (responseInNewSpec && !isDeepStrictEqual(response, responseInNewSpec)) {
        changes.push({ from: response.value, to: responseInNewSpec.value });
      }
    }

    if (changes.length > 0) {
      changed.push({ path: operation.path, method: operation.method, changes });
    }
  }

  const added: RemovedResponses[] = [];
  for (const operation of newSpec.operations) {
    const operationInOldSpec = oldSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);
    if (!operationInOldSpec) {
      continue;
    }

    const responses: RemovedResponse[] = [];
    for (const response of operation.responses) {
      const responseInOldSpec = operationInOldSpec.responses.find((p) => p.code === response.code);
      if (!responseInOldSpec) {
        responses.push({ code: response.code, ...response.value });
      }
    }

    if (responses.length > 0) {
      added.push({ path: operation.path, method: operation.method, responses });
    }
  }

  return { added, changed, removed };
}
