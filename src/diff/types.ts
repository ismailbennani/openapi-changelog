import { OpenAPIV3 } from "openapi-types";

export interface OpenapiChangelogDiff {
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
export type OperationRemoved = Operation & Removal<OpenAPIV3.OperationObject>;
export type OperationBreakingChange = Operation &
  BreakingChange<OpenAPIV3.OperationObject> & {
    /**
     * The parameters that have changed
     */
    parameters: ParameterBreakingChange[];

    /**
     * The responses that have changed
     */
    responses: ResponseBreakingChange[];
  };

export type ParameterBreakingChange = ParameterRemoved | ParameterChanged;
export type ParameterRemoved = Parameter & Removal<OpenAPIV3.ParameterObject>;
export type ParameterChanged = Parameter & BreakingChange<OpenAPIV3.ParameterObject>;

export type ResponseBreakingChange = ResponseRemoved | ResponseChanged;
export type ResponseRemoved = Response & Removal<OpenAPIV3.ResponseObject>;
export type ResponseChanged = Response & BreakingChange<OpenAPIV3.ResponseObject>;

export type NonBreakingDiffs = OperationNonBreakingDiff[];

export type OperationNonBreakingDiff = OperationAdded | OperationChanged;
export type OperationAdded = Operation & Addition<OpenAPIV3.OperationObject>;
export type OperationChanged = Operation &
  (NonBreakingChange<OpenAPIV3.OperationObject> | Deprecation<OpenAPIV3.OperationObject>) & {
    /**
     * The parameters that have changed
     */
    parameters: ParameterChange[];

    /**
     * The responses that have changed
     */
    responses: ResponseChange[];
  };

export type ParameterChange = ParameterAdded | ParameterDeprecated;
export type ParameterAdded = Parameter & Addition<OpenAPIV3.ParameterObject>;
export type ParameterDeprecated = Parameter & Deprecation<OpenAPIV3.ParameterObject>;

export type ResponseChange = ResponseAdded;
export type ResponseAdded = Response & Addition<OpenAPIV3.ResponseObject>;

export const HttpMethods = ["get", "put", "post", "delete", "options", "head", "patch", "trace"] as const;
export type HttpMethod = (typeof HttpMethods)[number];

export function isHttpMethod(value: string): value is HttpMethod {
  const methods: readonly string[] = HttpMethods;
  return methods.includes(value);
}

interface Operation {
  /**
   * The path of the operation that has changed
   */
  path: string;

  /**
   * The method of the operation that has changed
   */
  method: HttpMethod;
}

interface Parameter {
  /**
   * The name of the parameter
   */
  name: string;
}

interface Response {
  /**
   * The http status code of the response
   */
  code: string;
}

interface Addition<T> {
  breaking: false;
  added: true;
  /**
   * The value in the new specification
   */
  readonly new: T;
}

interface Removal<T> {
  breaking: true;
  removed: true;
  /**
   * The value in the old specification
   */
  readonly old: T;
}

interface BreakingChange<T> {
  breaking: true;
  changed: true;
  /**
   * The value in the old specification
   */
  readonly old: T;
  /**
   * The value in the new specification
   */
  readonly new: T;
}

interface NonBreakingChange<T> {
  breaking: false;
  changed: true;
  /**
   * The value in the old specification
   */
  readonly old: T;
  /**
   * The value in the new specification
   */
  readonly new: T;
}

type Deprecation<T> = NonBreakingChange<T> & {
  deprecated: true;
};
