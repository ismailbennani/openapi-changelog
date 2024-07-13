import { IntermediateRepresentation } from "./intermediate-representation";
import { isDeepStrictEqual } from "util";
import { OpenAPIV3 } from "openapi-types";
import { HttpMethod } from "./types";

export function extractResponsesDiff(oldSpec: IntermediateRepresentation, newSpec: IntermediateRepresentation): ResponseDiff[] {
  const result: ResponseDiff[] = [];

  for (const operation of oldSpec.operations) {
    const operationInNewSpec = newSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);
    if (!operationInNewSpec) {
      continue;
    }

    for (const response of operation.responses) {
      const responseInNewSpec = operationInNewSpec.responses.find((p) => p.code === response.code);
      if (!responseInNewSpec) {
        result.push({
          path: operation.path,
          method: operation.method,
          code: response.code,
          oldOperation: operation.value,
          newOperation: operationInNewSpec.value,
          old: response.actualValue,
          added: false,
          changed: false,
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

    for (const response of operation.responses) {
      const responseInNewSpec = operationInNewSpec.responses.find((p) => p.code === response.code);

      if (responseInNewSpec && !isDeepStrictEqual(response, responseInNewSpec)) {
        result.push({
          path: operation.path,
          method: operation.method,
          code: response.code,
          oldOperation: operation.value,
          newOperation: operationInNewSpec.value,
          old: response.actualValue,
          new: responseInNewSpec.actualValue,
          added: false,
          changed: true,
          removed: false,
        });
      }
    }
  }

  for (const operation of newSpec.operations) {
    const operationInOldSpec = oldSpec.operations.find((op) => op.path === operation.path && op.method === operation.method);
    if (!operationInOldSpec) {
      continue;
    }

    for (const response of operation.responses) {
      const responseInOldSpec = operationInOldSpec.responses.find((p) => p.code === response.code);
      if (!responseInOldSpec) {
        result.push({
          path: operation.path,
          method: operation.method,
          code: response.code,
          oldOperation: operationInOldSpec.value,
          newOperation: operation.value,
          new: response.actualValue,
          added: true,
          changed: false,
          removed: false,
        });
      }
    }
  }

  return result;
}

export type ResponseDiff = ResponseAdded | ResponseChanged | ResponseRemoved;

export interface ResponseAdded {
  path: string;
  method: HttpMethod;
  code: string;
  oldOperation: OpenAPIV3.OperationObject;
  newOperation: OpenAPIV3.OperationObject;

  added: true;
  changed: false;
  removed: false;
  new: OpenAPIV3.ResponseObject;
}

export interface ResponseChanged {
  path: string;
  method: HttpMethod;
  code: string;
  oldOperation: OpenAPIV3.OperationObject;
  newOperation: OpenAPIV3.OperationObject;

  added: false;
  changed: true;
  removed: false;
  old: OpenAPIV3.ResponseObject;
  new: OpenAPIV3.ResponseObject;
}

export interface ResponseRemoved {
  path: string;
  method: HttpMethod;
  code: string;
  oldOperation: OpenAPIV3.OperationObject;
  newOperation: OpenAPIV3.OperationObject;

  added: false;
  changed: false;
  removed: true;
  old: OpenAPIV3.ResponseObject;
}
