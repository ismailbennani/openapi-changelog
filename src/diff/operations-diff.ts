import { IntermediateRepresentation } from "./intermediate-representation.js";
import { OpenAPIV3 } from "openapi-types";
import { HttpMethod } from "./types";
import { isDeepStrictEqual } from "util";

export function extractOperationsDiff(oldSpec: IntermediateRepresentation, newSpec: IntermediateRepresentation): OperationDiff[] {
  const result: OperationDiff[] = [];

  for (const operation of oldSpec.operations) {
    const operationInNewSpec = newSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);
    if (!operationInNewSpec) {
      result.push({
        path: operation.path,
        method: operation.method,
        old: operation.value,
        added: false,
        changed: false,
        deprecated: false,
        removed: true,
      });
    }
  }

  for (const operation of oldSpec.operations) {
    const operationInNewSpec = newSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);
    if (!operationInNewSpec) {
      continue;
    }

    if (operationInNewSpec.value.deprecated === true && operation.value.deprecated !== true) {
      result.push({
        path: operation.path,
        method: operation.method,
        old: operation.value,
        new: operationInNewSpec.value,
        added: false,
        deprecated: true,
        removed: false,
      });
    }
  }

  for (const operation of newSpec.operations) {
    const operationInOldSpec = oldSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);

    if (!operationInOldSpec) {
      result.push({
        path: operation.path,
        method: operation.method,
        new: operation.value,
        added: true,
        changed: false,
        deprecated: false,
        removed: false,
      });
    }
  }

  return result;
}

export type OperationDiff = OperationAdded | OperationDeprecated | OperationRemoved;

export interface OperationAdded {
  path: string;
  method: HttpMethod;

  added: true;
  changed: false;
  deprecated: false;
  removed: false;
  new: OpenAPIV3.OperationObject;
}

export interface OperationDeprecated {
  path: string;
  method: HttpMethod;

  added: false;
  deprecated: boolean;
  removed: false;
  old: OpenAPIV3.OperationObject;
  new: OpenAPIV3.OperationObject;
}

export interface OperationRemoved {
  path: string;
  method: HttpMethod;

  added: false;
  changed: false;
  deprecated: false;
  removed: true;
  old: OpenAPIV3.OperationObject;
}
