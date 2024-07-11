import { IntermediateRepresentation } from "./intermediate-representation";
import { AddedParameters, ChangedParameter, ChangedParameters, DeprecatedParameters, RemovedParameters } from "./types";
import { OpenAPIV3 } from "openapi-types";
import { isDeepStrictEqual } from "node:util";

export function extractParametersDiff(
  oldSpec: IntermediateRepresentation,
  newSpec: IntermediateRepresentation,
): { added: AddedParameters[]; changed: ChangedParameters[]; deprecated: DeprecatedParameters[]; removed: RemovedParameters[] } {
  const removed: RemovedParameters[] = [];
  for (const operation of oldSpec.operations) {
    const operationInNewSpec = newSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);
    if (!operationInNewSpec) {
      continue;
    }

    const parameters: OpenAPIV3.ParameterObject[] = [];
    for (const parameter of operation.parameters) {
      const parameterInNewSpec = operationInNewSpec.parameters.find((p) => p.name === parameter.name);

      if (!parameterInNewSpec) {
        parameters.push(parameter.value);
      }
    }

    if (parameters.length > 0) {
      removed.push({ path: operation.path, method: operation.method, parameters });
    }
  }

  const changed: ChangedParameters[] = [];
  const deprecated: DeprecatedParameters[] = [];
  for (const operation of oldSpec.operations) {
    const operationInNewSpec = newSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);
    if (!operationInNewSpec) {
      continue;
    }

    const changes: ChangedParameter[] = [];
    const deprecations: OpenAPIV3.ParameterObject[] = [];
    for (const parameter of operation.parameters) {
      const parameterInNewSpec = operationInNewSpec.parameters.find((p) => p.name === parameter.name);

      if (parameterInNewSpec && !isDeepStrictEqual(parameter, parameterInNewSpec)) {
        if (parameterInNewSpec.value.deprecated && !parameter.value.deprecated) {
          deprecations.push(parameter.value);
        }

        if (!isDeepStrictEqual({ ...parameter, deprecated: false }, { ...parameterInNewSpec, deprecated: false })) {
          changes.push({ from: parameter.value, to: parameterInNewSpec.value });
        }
      }
    }

    if (changes.length > 0) {
      changed.push({ path: operation.path, method: operation.method, changes });
    }

    if (deprecations.length > 0) {
      deprecated.push({ path: operation.path, method: operation.method, parameters: deprecations });
    }
  }

  const added: RemovedParameters[] = [];
  for (const operation of newSpec.operations) {
    const operationInOldSpec = oldSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);
    if (!operationInOldSpec) {
      continue;
    }

    const parameters: OpenAPIV3.ParameterObject[] = [];
    for (const parameter of operation.parameters) {
      const parameterInOldSpec = operationInOldSpec.parameters.find((p) => p.name === parameter.name);
      if (!parameterInOldSpec) {
        parameters.push(parameter.value);
      }
    }

    if (parameters.length > 0) {
      added.push({ path: operation.path, method: operation.method, parameters });
    }
  }

  return { added, changed, deprecated, removed };
}
