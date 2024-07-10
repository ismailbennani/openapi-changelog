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
  from: string;
  /**
   * The new version
   */
  to: string;
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

export interface BreakingDiffs {
  /**
   * The objects that are present in the old specification but not in the new specification
   */
  removed: {
    /**
     * The operations that are present in the old specification but not in the new specification
     */
    operations: RemovedOperation[];
    /**
     * The parameters that are present in the old specification but not in the new specification
     */
    parameters: RemovedParameters[];
    /**
     * The responses that are present in the old specification but not in the new specification
     */
    responses: RemovedResponses[];
  };
  /**
   * The objects that are present in both the old specification and the new specification but with different values
   */
  changed: {
    /**
     * The parameters that are present in both the old specification and the new specification but with different values
     */
    parameters: ChangedParameters[];
    /**
     * The responses that are present in both the old specification and the new specification but with different values
     */
    responses: ChangedResponses[];
  };
}

export type RemovedOperation = {
  /**
   * The path of the operation that is removed
   */
  path: string;

  /**
   * The method of the operation that is removed
   */
  method: HttpMethod;
} & OpenAPIV3.OperationObject;

export interface RemovedParameters {
  /**
   * The path of the operation where the parameters that are removed
   */
  path: string;

  /**
   * The method of the operation where the parameters that are removed
   */
  method: HttpMethod;

  /**
   * The parameters that are removed
   */
  parameters: OpenAPIV3.ParameterObject[];
}

export interface RemovedResponses {
  /**
   * The path of the operation where the responses that are removed
   */
  path: string;

  /**
   * The method of the operation where the responses that are removed
   */
  method: HttpMethod;

  /**
   * The responses that are removed
   */
  responses: OpenAPIV3.ResponseObject[];
}

export interface ChangedParameters {
  /**
   * The path of the operation where the parameters that are changed
   */
  path: string;

  /**
   * The method of the operation where the parameters that are changed
   */
  method: HttpMethod;

  /**
   * The parameters that are changed between the old specification and the new specification
   */
  changes: {
    /**
     * The parameter in the old specification
     */
    from: OpenAPIV3.ParameterObject;
    /**
     * The parameter in the new specification
     */
    to: OpenAPIV3.ParameterObject;
  }[];
}

export interface ChangedResponses {
  /**
   * The path of the operation where the response that has changed
   */
  path: string;

  /**
   * The method of the operation where the response that has changed
   */
  method: HttpMethod;

  /**
   * The responses that are changed between the old specification and the new specification
   */
  changes: {
    /**
     * The response in the old specification
     */
    from: OpenAPIV3.ResponseObject;

    /**
     * The response in the new specification
     */
    to: OpenAPIV3.ResponseObject;
  }[];
}

export interface NonBreakingDiffs {
  /**
   * The objects that are present in the new specification but not in the old specification
   */
  added: {
    /**
     * The operations that are present in the new specification but not in the old specification
     */
    operations: AddedOperation[];
    /**
     * The parameters that are present in the new specification but not in the old specification
     */
    parameters: AddedParameters[];
    /**
     * The responses that are present in the new specification but not in the old specification
     */
    responses: AddedResponses[];
  };
  /**
   * The objects that are deprecated in the new specification but not in the old specification
   */
  deprecated: {
    /**
     * The operations that are deprecated in the new specification but not in the old specification
     */
    operations: DeprecatedOperation[];
    /**
     * The parameters that are deprecated in the new specification but not in the old specification
     */
    parameters: DeprecatedParameter[];
    /**
     * The responses that are deprecated in the new specification but not in the old specification
     */
    responses: DeprecatedResponse[];
  };
}

export type AddedOperation = {
  /**
   * The path of the operation that is added
   */
  path: string;

  /**
   * The method of the operation that is added
   */
  method: HttpMethod;
} & OpenAPIV3.OperationObject;

export interface AddedParameters {
  /**
   * The path of the operation where the parameters that are added
   */
  path: string;

  /**
   * The method of the operation where the parameters that are added
   */
  method: HttpMethod;

  /**
   * The parameters that are added
   */
  parameters: OpenAPIV3.ParameterObject[];
}

export interface AddedResponses {
  /**
   * The path of the operation where the responses that are added
   */
  path: string;

  /**
   * The method of the operation where the responses that are added
   */
  method: HttpMethod;

  /**
   * The responses that are added
   */
  responses: OpenAPIV3.ResponseObject[];
}

export type DeprecatedOperation = {
  /**
   * The path of the operation that is deprecated
   */
  path: string;

  /**
   * The method of the operation that is deprecated
   */
  method: HttpMethod;
} & OpenAPIV3.OperationObject;

export interface DeprecatedParameter {
  /**
   * The path of the operation where the parameters that are deprecated
   */
  path: string;

  /**
   * The method of the operation where the parameters that are deprecated
   */
  method: HttpMethod;

  /**
   * The parameters that are deprecated
   */
  parameters: OpenAPIV3.ParameterObject[];
}

export interface DeprecatedResponse {
  /**
   * The path of the operation where the responses that are deprecated
   */
  path: string;

  /**
   * The method of the operation where the responses that are deprecated
   */
  method: HttpMethod;

  /**
   * The responses that are deprecated
   */
  responses: OpenAPIV3.ResponseObject[];
}

export const HttpMethods = ["get", "put", "post", "delete", "options", "head", "patch", "trace"] as const;
export type HttpMethod = (typeof HttpMethods)[number];

export function isHttpMethod(value: string): value is HttpMethod {
  const methods: readonly string[] = HttpMethods;
  return methods.includes(value);
}
