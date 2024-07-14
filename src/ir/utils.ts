import { OpenAPIV3 } from "openapi-types";

export function isArrayObject(obj: object): obj is { type: "array" } {
  return (obj as { type: string }).type === "array";
}

//#region Strings

export function join(lines: string[], sep?: string): string {
  return lines.map((s) => s.trim()).join(sep ?? "\n");
}

// #endregion

//#region References

export function isReferenceObject(obj: unknown): obj is { $ref: string } {
  return obj === undefined || obj === null ? false : Object.keys(obj).includes("$ref");
}

export function evaluateParameterOrRef(spec: OpenAPIV3.Document, parameter: { $ref: string } | OpenAPIV3.ParameterObject): OpenAPIV3.ParameterObject | undefined {
  return evaluateReference(parameter, spec.components?.parameters ?? {});
}

export function evaluateResponseOrRef(spec: OpenAPIV3.Document, response: { $ref: string } | OpenAPIV3.ResponseObject): OpenAPIV3.ResponseObject | undefined {
  return evaluateReference(response, spec.components?.responses ?? {});
}

export function evaluateSchemaOrRef(spec: OpenAPIV3.Document, schema: { $ref: string } | OpenAPIV3.SchemaObject): OpenAPIV3.SchemaObject | undefined {
  return evaluateReference(schema, spec.components?.schemas ?? {});
}

function evaluateReference<T extends object>(objOrRef: T | { $ref: string }, refs: Record<string, T | OpenAPIV3.ReferenceObject>): T | undefined {
  if (!isReferenceObject(objOrRef)) {
    return objOrRef;
  }

  const unref = refs[objOrRef.$ref];
  return evaluateReference(unref, refs);
}

//#endregion
