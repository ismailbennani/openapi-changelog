import { OpenAPIV3 } from "openapi-types";
import { isHttpMethod, RemovedOperation } from "./types.js";

export function extractRemovedOperations(oldSpec: OpenAPIV3.Document, newSpec: OpenAPIV3.Document): RemovedOperation[] {
  const result: RemovedOperation[] = [];

  for (const [key, path] of Object.entries(oldSpec.paths)) {
    if (!path) {
      continue;
    }

    for (const [method, operation] of Object.entries(path)) {
      if (!isHttpMethod(method)) {
        continue;
      }

      if (newSpec.paths[key]?.[method] === undefined) {
        result.push({ path: key, method: method, ...(operation as OpenAPIV3.OperationObject) });
      }
    }
  }

  return result;
}
