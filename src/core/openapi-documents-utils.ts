import { OpenAPIV3 } from "openapi-types";
import semver from "semver";
import { isReferenceObject } from "../ir/utils";
import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { readFile } from "fs/promises";
import { load } from "js-yaml";
import { Logger } from "./logging";

export function sortDocumentsByVersionDescInPlace(documents: OpenapiDocumentIntermediateRepresentation[]): OpenapiDocumentIntermediateRepresentation[] {
  const semverOptions = { loose: true };

  if (documents.some((d) => semver.valid(d.version, semverOptions) === null)) {
    return documents.sort((a, b) => -a.version.localeCompare(b.version));
  }

  return documents.sort((a, b) => -semver.compareBuild(a.version, b.version, semverOptions));
}

export async function parseOpenapiFile(path: string): Promise<{ result?: OpenAPIV3.Document; errorMessage?: string }> {
  try {
    Logger.debug(`Start reading file at ${path}`);
    const specContent = await readFile(path, "utf8");
    Logger.debug(`Done reading file at ${path}`);

    if (path.endsWith(".yml") || path.endsWith(".yaml")) {
      return { result: load(specContent) as OpenAPIV3.Document };
    }

    if (path.endsWith(".json")) {
      return { result: JSON.parse(specContent) as OpenAPIV3.Document };
    }

    return { errorMessage: "Invalid format" };
  } catch (e) {
    return { errorMessage: JSON.stringify(e) };
  }
}

export function extractParameterReferenceName(parameter: OpenAPIV3.ReferenceObject): string {
  return parameter.$ref.substring(24);
}

export function isReferenceOfParameter(parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject, name: string): boolean {
  if (isReferenceObject(parameter)) {
    return parameter.$ref === `#/components/parameters/${name}`;
  }

  return false;
}

export function extractSchemaReferenceName(schema: OpenAPIV3.ReferenceObject): string {
  return schema.$ref.substring(21);
}

export function isReferenceOfSchema(schema: OpenAPIV3.ReferenceObject, name: string): boolean {
  return schema.$ref === `#/components/schemas/${name}`;
}

export function extractRequestBodyReferenceName(requestBody: OpenAPIV3.ReferenceObject): string {
  return requestBody.$ref.substring(27);
}

export function isReferenceOfRequestBody(requestBody: OpenAPIV3.ReferenceObject, name: string): boolean {
  return requestBody.$ref === `#/components/requestBodies/${name}`;
}

export function extractResponseReferenceName(response: OpenAPIV3.ReferenceObject): string {
  return response.$ref.substring(23);
}

export function isReferenceOfResponse(response: OpenAPIV3.ReferenceObject, name: string): boolean {
  return response.$ref === `#/components/responses/${name}`;
}

export function getReferencedObject(document: OpenAPIV3.Document, ref: string): undefined | object {
  const split = ref.split("/");
  if (split[0] !== "#") {
    return undefined;
  }

  let current: object | undefined = document;

  for (let i = 1; i < split.length; i++) {
    if (current === undefined) {
      break;
    }

    const key = split[i];
    current = key in current ? (current as Record<string, object>)[key] : undefined;
  }

  return current;
}
