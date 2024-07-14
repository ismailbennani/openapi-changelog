import { IntermediateRepresentation } from "../ir/types";
import { OpenAPIV3 } from "openapi-types";
import { isDeepStrictEqual } from "util";
import { HttpMethod } from "./types";

interface Input {
  spec: OpenAPIV3.Document;
  ir: IntermediateRepresentation;
}

export function extractOperationParametersDiff(oldSpec: Input, newSpec: Input): ParameterDiff[] {
  const result: ParameterDiff[] = [];

  for (const operation of oldSpec.ir.operations) {
    const operationInOldSpec = oldSpec.spec.paths[operation.path]?.[operation.method];
    const operationInNewSpec = newSpec.spec.paths[operation.path]?.[operation.method];
    if (!operationInOldSpec || !operationInNewSpec) {
      continue;
    }

    for (const parameter of operation.parameters) {
      const parameterInOldSpec = operationInOldSpec.parameters?.find((p) => (p as OpenAPIV3.ParameterObject).name === parameter.name);
      if (!parameterInOldSpec) {
        continue;
      }

      const parameterInNewSpec = operationInNewSpec.parameters?.find((p) => (p as OpenAPIV3.ParameterObject).name === parameter.name);

      if (!parameterInNewSpec) {
        result.push({
          path: parameter.path,
          method: parameter.method,
          name: parameter.name,
          oldOperation: operationInOldSpec,
          newOperation: operationInNewSpec,
          old: parameterInOldSpec,
          removed: true,
        });
      }

      if (parameterInNewSpec && !isDeepStrictEqual(parameterInOldSpec, parameterInNewSpec)) {
        const parameterObjectInOldSpec = parameterInOldSpec as OpenAPIV3.ParameterObject;
        const parameterObjectInNewSpec = parameterInNewSpec as OpenAPIV3.ParameterObject;

        if (parameterObjectInNewSpec.deprecated === true && parameterObjectInOldSpec.deprecated !== true) {
          result.push({
            path: parameter.path,
            method: parameter.method,
            name: parameter.name,
            oldOperation: operationInOldSpec,
            newOperation: operationInNewSpec,
            old: parameterInOldSpec,
            new: parameterInNewSpec,
            deprecated: true,
          });
        }

        if (
          parameterObjectInNewSpec.description !== parameterObjectInOldSpec.description ||
          parameterObjectInNewSpec.example !== parameterObjectInOldSpec.example ||
          parameterObjectInNewSpec.examples !== parameterObjectInOldSpec.examples
        ) {
          result.push({
            path: parameter.path,
            method: parameter.method,
            name: parameter.name,
            oldOperation: operationInOldSpec,
            newOperation: operationInNewSpec,
            old: parameterInOldSpec,
            new: parameterInNewSpec,
            documentation: true,
          });
        }

        if (
          !isDeepStrictEqual(
            { ...parameterInOldSpec, deprecated: false, description: "", example: "", examples: [] },
            { ...parameterInNewSpec, deprecated: false, description: "", example: "", examples: [] },
          )
        ) {
          result.push({
            path: parameter.path,
            method: parameter.method,
            name: parameter.name,
            oldOperation: operationInOldSpec,
            newOperation: operationInNewSpec,
            old: parameterInOldSpec,
            new: parameterInNewSpec,
            breakingChange: true,
          });
        }
      }
    }
  }

  for (const operation of newSpec.ir.operations) {
    const operationInOldSpec = oldSpec.spec.paths[operation.path]?.[operation.method];
    const operationInNewSpec = newSpec.spec.paths[operation.path]?.[operation.method];
    if (!operationInOldSpec || !operationInNewSpec) {
      continue;
    }

    for (const parameter of operation.parameters) {
      const parameterInOldSpec = operationInOldSpec.parameters?.find((p) => (p as OpenAPIV3.ParameterObject).name === parameter.name);
      const parameterInNewSpec = operationInNewSpec.parameters?.find((p) => (p as OpenAPIV3.ParameterObject).name === parameter.name);

      if (parameterInNewSpec && !parameterInOldSpec) {
        result.push({
          path: parameter.path,
          method: parameter.method,
          name: parameter.name,
          oldOperation: operationInOldSpec,
          newOperation: operationInNewSpec,
          new: parameterInNewSpec,
          addition: true,
        });
      }
    }
  }

  return result;
}

export type ParameterDiff = ParameterAddition | ParameterDocumentationChange | ParameterDeprecation | ParameterRemoval | UnclassifiedParameterBreakingChange;

export interface ParameterAddition {
  path: string;
  method: HttpMethod;
  name: string;
  oldOperation: OpenAPIV3.OperationObject;
  newOperation: OpenAPIV3.OperationObject;

  addition: true;
  new: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;
}

export interface ParameterDocumentationChange {
  path: string;
  method: HttpMethod;
  name: string;
  oldOperation: OpenAPIV3.OperationObject;
  newOperation: OpenAPIV3.OperationObject;

  documentation: true;
  old: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;
  new: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;
}

export interface ParameterDeprecation {
  path: string;
  method: HttpMethod;
  name: string;
  oldOperation: OpenAPIV3.OperationObject;
  newOperation: OpenAPIV3.OperationObject;

  deprecated: true;
  old: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;
  new: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;
}

export interface ParameterRemoval {
  path: string;
  method: HttpMethod;
  name: string;
  oldOperation: OpenAPIV3.OperationObject;
  newOperation: OpenAPIV3.OperationObject;

  removed: true;
  old: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;
}

export interface UnclassifiedParameterBreakingChange {
  path: string;
  method: HttpMethod;
  name: string;
  oldOperation: OpenAPIV3.OperationObject;
  newOperation: OpenAPIV3.OperationObject;

  breakingChange: true;
  old: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;
  new: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;
}
