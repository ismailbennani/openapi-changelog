import { OpenAPIV3 } from "openapi-types";

export interface DiffResponse {
  /**
   * The change in versions between the old and the new specifications
   */
  version: VersionDiff;
  /**
   * The breaking changes between the old and the new specifications
   */
  breaking: BreakingDiffs;
  /**
   * The non-breaking changes between the old and the new specifications
   */
  nonBreaking: NonBreakingDiffs;
}

export interface VersionDiff {
  /**
   * The old version
   */
  old: string;
  /**
   * The new version
   */
  new: string;
  /**
   * The changes in versions
   */
  changed: {
    /**
     * True iff the major version has changed
     */
    major: boolean;
    /**
     * True iff the minor version has changed
     */
    minor: boolean;
    /**
     * True iff the patch version has changed
     */
    patch: boolean;
  };
}

export type BreakingDiffs = OperationBreakingDiff[];

export type OperationBreakingDiff = OperationRemoved | OperationBreakingChange;

export type OperationRemoved = OperationChangeBase & {
  /**
   * The operation has been removed
   */
  removed: true;

  /**
   * The operation in the old specification
   */
  old: OpenAPIV3.OperationObject;
};

export type OperationBreakingChange = OperationChangeBase & {
  /**
   * The parameter has changed
   */
  changed: true;

  /**
   * The parameters that have changed
   */
  parameters: ParameterBreakingChange[];

  /**
   * The responses that have changed
   */
  responses: ResponseBreakingChange[];

  /**
   * The operation in the old specification
   */
  old: OpenAPIV3.OperationObject;

  /**
   * The operation in the new specification
   */
  new: OpenAPIV3.OperationObject;
};

export type ParameterBreakingChange = ParameterRemoved | ParameterChanged;

export type ParameterRemoved = ParameterChangeBase & {
  /**
   * The parameter has been removed
   */
  removed: true;

  /**
   * The parameter in the old specification
   */
  old: OpenAPIV3.ParameterObject;
};

export type ParameterChanged = ParameterChangeBase & {
  /**
   * The parameter has changed
   */
  changed: true;

  /**
   * The parameter in the old specification
   */
  old: OpenAPIV3.ParameterObject;

  /**
   * The parameter in the new specification
   */
  new: OpenAPIV3.ParameterObject;
};

export type ResponseBreakingChange = ResponseRemoved | ResponseChanged;

export type ResponseRemoved = ResponseChangeBase & {
  /**
   * The response has been removed
   */
  removed: true;

  /**
   * The response in the old specification
   */
  old: OpenAPIV3.ResponseObject;
};

export type ResponseChanged = ResponseChangeBase & {
  /**
   * The response has not been removed
   */
  changed: true;

  /**
   * The response in the old specification
   */
  old: OpenAPIV3.ResponseObject;

  /**
   * The response in the new specification
   */
  new: OpenAPIV3.ResponseObject;
};

export type NonBreakingDiffs = OperationNonBreakingDiff[];

export type OperationNonBreakingDiff = OperationAdded | OperationChanged;

export type OperationAdded = OperationChangeBase & {
  /**
   * The operation has been added
   */
  added: true;

  /**
   * The operation in the new specification
   */
  new: OpenAPIV3.OperationObject;
};

export type OperationChanged = OperationChangeBase & {
  /**
   * Has the operation been deprecated
   */
  changed: true;

  /**
   * Has the operation been deprecated
   */
  deprecated: boolean;

  /**
   * The parameters that have changed
   */
  parameters: ParameterChange[];

  /**
   * The responses that have changed
   */
  responses: ResponseChange[];

  /**
   * The operation in the old specification
   */
  old: OpenAPIV3.OperationObject;

  /**
   * The operation in the new specification
   */
  new: OpenAPIV3.OperationObject;
};

export type ParameterChange = ParameterAdded | ParameterDeprecated;

export type ParameterAdded = ParameterChangeBase & {
  /**
   * The parameter has been added
   */
  added: true;

  /**
   * The parameter in the new specification
   */
  new: OpenAPIV3.ParameterObject;
};

export type ParameterDeprecated = ParameterChangeBase & {
  /**
   * The parameter has been deprecated
   */
  deprecated: true;

  /**
   * The parameter in the old specification
   */
  old: OpenAPIV3.ParameterObject;

  /**
   * The parameter in the new specification
   */
  new: OpenAPIV3.ParameterObject;
};

export type ResponseChange = ResponseAdded;

export type ResponseAdded = ResponseChangeBase & {
  /**
   * The parameter has been added
   */
  added: true;

  /**
   * The parameter in the new specification
   */
  new: OpenAPIV3.ResponseObject;
};

export interface OperationChangeBase {
  /**
   * The path of the operation that has changed
   */
  path: string;

  /**
   * The method of the operation that has changed
   */
  method: HttpMethod;
}

export interface ParameterChangeBase {
  /**
   * The name of the parameter
   */
  name: string;
}

export interface ResponseChangeBase {
  /**
   * The http status code of the response
   */
  code: string;
}

export const HttpMethods = ["get", "put", "post", "delete", "options", "head", "patch", "trace"] as const;
export type HttpMethod = (typeof HttpMethods)[number];

export function isHttpMethod(value: string): value is HttpMethod {
  const methods: readonly string[] = HttpMethods;
  return methods.includes(value);
}
