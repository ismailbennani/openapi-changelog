import { OpenAPIV3 } from "openapi-types";
import { isHttpMethod, RemovedParameters } from "./types.js";

export function extractRemovedParameters(oldSpec: OpenAPIV3.Document, newSpec: OpenAPIV3.Document): RemovedParameters[] {
  const result: RemovedParameters[] = [];

  for (let [key, path] of Object.entries(oldSpec.paths)) {
    if (!path || isReferenceObject(path)) {
      continue;
    }

    path = path as { [method in OpenAPIV3.HttpMethods]?: OpenAPIV3.OperationObject };
    for (let [method, operation] of Object.entries(path)) {
      if (!isHttpMethod(method)) {
        continue;
      }

      if (newSpec.paths[key]?.[method] === undefined) {
        continue;
      }

      operation = operation as OpenAPIV3.OperationObject;
      if (operation.parameters === undefined) {
        continue;
      }

      const removed: OpenAPIV3.ParameterObject[] = [];

      for (const parameter of operation.parameters) {
        const evaluatedParameter = evaluateParameter(oldSpec, parameter);
        if (!evaluatedParameter) {
          console.warn(`Could not evaluate parameter ${JSON.stringify(parameter)}`);
          continue;
        }

        const parameterInNewSpec = newSpec.paths[key][method].parameters?.find((p) => evaluateParameter(newSpec, p)?.name === evaluatedParameter.name);
        if (parameterInNewSpec === undefined) {
          removed.push(evaluatedParameter);
        }
      }

      if (removed.length > 0) {
        result.push({ path: key, method, parameters: removed });
      }
    }
  }

  return result;
}

function evaluateParameter(spec: OpenAPIV3.Document, parameter: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject): OpenAPIV3.ParameterObject | undefined {
  if (isReferenceObject(parameter)) {
    const name = parameter.$ref;
    const refOrParam = spec.components?.parameters?.[name];
    if (!refOrParam) {
      return undefined;
    }

    return evaluateParameter(spec, refOrParam);
  }

  return parameter;
}

function isReferenceObject(obj: object): obj is { $ref: string } {
  return Object.keys(obj).includes("$ref");
}
