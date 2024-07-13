import { IntermediateRepresentation } from "./intermediate-representation";
import { OpenAPIV3 } from "openapi-types";
import { isDeepStrictEqual } from "util";
import { HttpMethod } from "./types";

interface Input {
  spec: OpenAPIV3.Document;
  ir: IntermediateRepresentation;
}

export function extractParametersDiff(oldSpec: Input, newSpec: Input): ParameterDiff[] {
  const result: ParameterDiff[] = [];

  for (const parameter of oldSpec.ir.operationParameters) {
    const operationInOldSpec = oldSpec.spec.paths[parameter.path]?.[parameter.method]!;
    const operationInNewSpec = newSpec.spec.paths[parameter.path]?.[parameter.method];
    if (!operationInNewSpec) {
      continue;
    }

    const parameterInOldSpec = operationInOldSpec.parameters?.find((p) => (p as OpenAPIV3.ParameterObject).name == parameter.name)!;
    const parameterInNewSpec = operationInNewSpec.parameters?.find((p) => (p as OpenAPIV3.ParameterObject).name == parameter.name);

    if (!parameterInNewSpec) {
      result.push({
        path: parameter.path,
        method: parameter.method,
        name: parameter.name,
        oldOperation: operationInOldSpec,
        newOperation: operationInNewSpec,
        old: parameterInOldSpec,
        added: false,
        changed: false,
        deprecated: false,
        removed: true,
      });
    }

    if (parameterInNewSpec && !isDeepStrictEqual(parameter, parameterInNewSpec)) {
      if ((parameterInNewSpec as OpenAPIV3.ParameterObject).deprecated && !(parameterInOldSpec as OpenAPIV3.ParameterObject).deprecated) {
        result.push({
          path: parameter.path,
          method: parameter.method,
          name: parameter.name,
          oldOperation: operationInOldSpec,
          newOperation: operationInNewSpec,
          old: parameterInOldSpec,
          new: parameterInNewSpec,
          added: false,
          changed: false,
          deprecated: true,
          removed: false,
        });
      }

      if (!isDeepStrictEqual({ ...parameter, deprecated: false }, { ...parameterInNewSpec, deprecated: false })) {
        result.push({
          path: parameter.path,
          method: parameter.method,
          name: parameter.name,
          oldOperation: operationInOldSpec,
          newOperation: operationInNewSpec,
          old: parameterInOldSpec,
          new: parameterInNewSpec,
          added: false,
          changed: true,
          deprecated: false,
          removed: false,
        });
      }
    }
  }

  for (const parameter of newSpec.ir.operationParameters) {
    const operationInOldSpec = oldSpec.spec.paths[parameter.path]?.[parameter.method];
    const operationInNewSpec = newSpec.spec.paths[parameter.path]?.[parameter.method]!;
    if (!operationInOldSpec) {
      continue;
    }

    const parameterInOldSpec = operationInOldSpec.parameters?.find((p) => (p as OpenAPIV3.ParameterObject).name == parameter.name);
    const parameterInNewSpec = operationInNewSpec.parameters?.find((p) => (p as OpenAPIV3.ParameterObject).name == parameter.name)!;

    if (!parameterInOldSpec) {
      result.push({
        path: parameter.path,
        method: parameter.method,
        name: parameter.name,
        oldOperation: operationInOldSpec,
        newOperation: operationInNewSpec,
        new: parameterInNewSpec,
        added: true,
        changed: false,
        deprecated: false,
        removed: false,
      });
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
  new: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;
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
  old: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;
  new: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;
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
  old: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;
  new: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;
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
  old: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject;
}
