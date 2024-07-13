import { IntermediateRepresentation } from "./intermediate-representation";
import { isDeepStrictEqual } from "util";
import { OpenAPIV3 } from "openapi-types";
import { HttpMethod } from "./types";

interface Input {
  spec: OpenAPIV3.Document;
  ir: IntermediateRepresentation;
}

export function extractResponsesDiff(oldSpec: Input, newSpec: Input): ResponseDiff[] {
  const result: ResponseDiff[] = [];

  for (const response of oldSpec.ir.operationResponses) {
    const operationInOldSpec = newSpec.spec.paths[response.path]?.[response.method]!;
    const operationInNewSpec = newSpec.spec.paths[response.path]?.[response.method];
    if (!operationInNewSpec) {
      continue;
    }

    const responseInOldSpec = operationInOldSpec.responses[response.code];
    const responseInNewSpec = operationInNewSpec.responses[response.code];

    if (!responseInNewSpec) {
      result.push({
        path: response.path,
        method: response.method,
        code: response.code,
        oldOperation: operationInOldSpec,
        newOperation: operationInNewSpec,
        old: responseInOldSpec,
        added: false,
        changed: false,
        removed: true,
      });
    }

    if (responseInNewSpec && !isDeepStrictEqual(response, responseInNewSpec)) {
      result.push({
        path: response.path,
        method: response.method,
        code: response.code,
        oldOperation: operationInOldSpec,
        newOperation: operationInNewSpec,
        old: responseInOldSpec,
        new: responseInNewSpec,
        added: false,
        changed: true,
        removed: false,
      });
    }
  }

  for (const response of newSpec.ir.operationResponses) {
    const operationInOldSpec = newSpec.spec.paths[response.path]?.[response.method];
    const operationInNewSpec = newSpec.spec.paths[response.path]?.[response.method]!;
    if (!operationInOldSpec) {
      continue;
    }

    const responseInOldSpec = operationInOldSpec.responses[response.code];
    const responseInNewSpec = operationInNewSpec.responses[response.code];
    if (!responseInOldSpec) {
      result.push({
        path: response.path,
        method: response.method,
        code: response.code,
        oldOperation: operationInOldSpec,
        newOperation: operationInNewSpec,
        new: responseInNewSpec,
        added: true,
        changed: false,
        removed: false,
      });
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
  new: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject;
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
  old: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject;
  new: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject;
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
  old: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject;
}
