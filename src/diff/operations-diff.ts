import { IntermediateRepresentation } from "../ir/types";
import { OpenAPIV3 } from "openapi-types";
import { HttpMethod } from "./types";

interface Input {
  spec: OpenAPIV3.Document;
  ir: IntermediateRepresentation;
}

export function extractOperationsDiff(oldSpec: Input, newSpec: Input): OperationDiff[] {
  const result: OperationDiff[] = [];

  for (const operation of oldSpec.ir.operations) {
    const operationInOldSpec = oldSpec.spec.paths[operation.path]?.[operation.method];
    const operationInNewSpec = newSpec.spec.paths[operation.path]?.[operation.method];

    if (operationInOldSpec && !operationInNewSpec) {
      result.push({
        path: operation.path,
        method: operation.method,
        old: operationInOldSpec,
        added: false,
        changed: false,
        deprecated: false,
        removed: true,
      });
    }
  }

  for (const operation of oldSpec.ir.operations) {
    const operationInOldSpec = oldSpec.spec.paths[operation.path]?.[operation.method];
    const operationInNewSpec = newSpec.spec.paths[operation.path]?.[operation.method];

    if (operationInOldSpec === undefined || operationInNewSpec === undefined) {
      continue;
    }

    if (operationInNewSpec.deprecated === true && operationInOldSpec.deprecated !== true) {
      result.push({
        path: operation.path,
        method: operation.method,
        old: operationInOldSpec,
        new: operationInNewSpec,
        added: false,
        deprecated: true,
        removed: false,
      });
    }
  }

  for (const operation of newSpec.ir.operations) {
    const operationInOldSpec = oldSpec.spec.paths[operation.path]?.[operation.method];
    const operationInNewSpec = newSpec.spec.paths[operation.path]?.[operation.method];

    if (!operationInOldSpec && operationInNewSpec) {
      result.push({
        path: operation.path,
        method: operation.method,
        new: operationInNewSpec,
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
