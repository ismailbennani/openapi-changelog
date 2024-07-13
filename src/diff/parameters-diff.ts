import { IntermediateRepresentation } from "./intermediate-representation";
import { OpenAPIV3 } from "openapi-types";
import { isDeepStrictEqual } from "node:util";
import { HttpMethod } from "./types";

export function extractParametersDiff(oldSpec: IntermediateRepresentation, newSpec: IntermediateRepresentation): ParameterDiff[] {
  const result: ParameterDiff[] = [];

  for (const operation of oldSpec.operations) {
    const operationInNewSpec = newSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);
    if (!operationInNewSpec) {
      continue;
    }

    for (const parameter of operation.parameters) {
      const parameterInNewSpec = operationInNewSpec.parameters.find((p) => p.name === parameter.name);

      if (!parameterInNewSpec) {
        result.push({
          path: operation.path,
          method: operation.method,
          name: parameter.name,
          oldOperation: operation.value,
          newOperation: operationInNewSpec.value,
          old: parameter.actualValue,
          added: false,
          changed: false,
          deprecated: false,
          removed: true,
        });
      }
    }
  }

  for (const operation of oldSpec.operations) {
    const operationInNewSpec = newSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);
    if (!operationInNewSpec) {
      continue;
    }

    for (const parameter of operation.parameters) {
      const parameterInNewSpec = operationInNewSpec.parameters.find((p) => p.name === parameter.name);

      if (parameterInNewSpec && !isDeepStrictEqual(parameter, parameterInNewSpec)) {
        if (parameterInNewSpec.actualValue.deprecated === true && parameter.actualValue.deprecated !== true) {
          result.push({
            path: operation.path,
            method: operation.method,
            name: parameter.name,
            oldOperation: operation.value,
            newOperation: operationInNewSpec.value,
            old: parameter.actualValue,
            new: parameterInNewSpec.actualValue,
            added: false,
            changed: false,
            deprecated: true,
            removed: false,
          });
        }

        if (!isDeepStrictEqual({ ...parameter, deprecated: false }, { ...parameterInNewSpec, deprecated: false })) {
          result.push({
            path: operation.path,
            method: operation.method,
            name: parameter.name,
            oldOperation: operation.value,
            newOperation: operationInNewSpec.value,
            old: parameter.actualValue,
            new: parameterInNewSpec.actualValue,
            added: false,
            changed: true,
            deprecated: false,
            removed: false,
          });
        }
      }
    }
  }

  for (const operation of newSpec.operations) {
    const operationInOldSpec = oldSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);
    if (!operationInOldSpec) {
      continue;
    }

    for (const parameter of operation.parameters) {
      const parameterInOldSpec = operationInOldSpec.parameters.find((p) => p.name === parameter.name);
      if (!parameterInOldSpec) {
        result.push({
          path: operation.path,
          method: operation.method,
          name: parameter.name,
          oldOperation: operationInOldSpec.value,
          newOperation: operation.value,
          new: parameter.actualValue,
          added: true,
          changed: false,
          deprecated: false,
          removed: false,
        });
      }
    }
  }

  return result;
}

export type ParameterDiff = ParameterAdded | ParameterChanged | ParameterDeprecated | ParameterRemoved;

export interface ParameterAdded {
  path: string;
  method: HttpMethod;
  name: string;
  oldOperation: OpenAPIV3.OperationObject;
  newOperation: OpenAPIV3.OperationObject;

  added: true;
  changed: false;
  deprecated: false;
  removed: false;
  new: OpenAPIV3.ParameterObject;
}

export interface ParameterChanged {
  path: string;
  method: HttpMethod;
  name: string;
  oldOperation: OpenAPIV3.OperationObject;
  newOperation: OpenAPIV3.OperationObject;

  added: false;
  changed: true;
  deprecated: false;
  removed: false;
  old: OpenAPIV3.ParameterObject;
  new: OpenAPIV3.ParameterObject;
}

export interface ParameterDeprecated {
  path: string;
  method: HttpMethod;
  name: string;
  oldOperation: OpenAPIV3.OperationObject;
  newOperation: OpenAPIV3.OperationObject;

  added: false;
  changed: false;
  deprecated: true;
  removed: false;
  old: OpenAPIV3.ParameterObject;
  new: OpenAPIV3.ParameterObject;
}

export interface ParameterRemoved {
  path: string;
  method: HttpMethod;
  name: string;
  oldOperation: OpenAPIV3.OperationObject;
  newOperation: OpenAPIV3.OperationObject;

  added: false;
  changed: false;
  deprecated: false;
  removed: true;
  old: OpenAPIV3.ParameterObject;
}
