import { OpenAPIV3 } from "openapi-types";
import { isHttpMethod, RemovedResponses } from "./types.js";

export function extractRemovedResponses(oldSpec: OpenAPIV3.Document, newSpec: OpenAPIV3.Document): RemovedResponses[] {
  const result: RemovedResponses[] = [];

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

      const removed: OpenAPIV3.ResponseObject[] = [];

      operation = operation as OpenAPIV3.OperationObject;
      for (const [code, response] of Object.entries(operation.responses)) {
        const evaluatedResponse = evaluateResponse(oldSpec, response);
        if (!evaluatedResponse) {
          console.warn(`Could not evaluate response ${JSON.stringify(response)}`);
          continue;
        }

        const responseInNewSpec = newSpec.paths[key][method].responses[code];
        if (responseInNewSpec === undefined) {
          removed.push(evaluatedResponse);
        }
      }

      if (removed.length > 0) {
        result.push({ path: key, method, responses: removed });
      }
    }
  }

  return result;
}

function evaluateResponse(spec: OpenAPIV3.Document, response: OpenAPIV3.ReferenceObject | OpenAPIV3.ResponseObject): OpenAPIV3.ResponseObject | undefined {
  if (isReferenceObject(response)) {
    const name = response.$ref;
    const refOrParam = spec.components?.responses?.[name];
    if (!refOrParam) {
      return undefined;
    }

    return evaluateResponse(spec, refOrParam);
  }

  return response;
}

function isReferenceObject(obj: object): obj is OpenAPIV3.ReferenceObject {
  return Object.keys(obj).includes("$ref");
}
