import { OpenAPIV3 } from "openapi-types";
import semver from "semver";
import { isReferenceObject } from "../ir/utils";
import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { readFile } from "fs/promises";
import { load } from "js-yaml";

export function sortDocumentsByVersionDescInPlace(documents: OpenapiDocumentIntermediateRepresentation[]): OpenapiDocumentIntermediateRepresentation[] {
  const semverOptions = { loose: true };

  if (documents.some((d) => semver.valid(d.version, semverOptions) === null)) {
    return documents.sort((a, b) => -a.version.localeCompare(b.version));
  }

  return documents.sort((a, b) => -semver.compareBuild(a.version, b.version, semverOptions));
}

export async function parseOpenapiFile(path: string): Promise<{ result?: OpenAPIV3.Document; errorMessage?: string }> {
  if (path.endsWith(".yml") || path.endsWith(".yaml")) {
    try {
      return { result: await parseYaml(path) };
    } catch (e) {
      return { errorMessage: JSON.stringify(e) };
    }
  }

  if (path.endsWith(".json")) {
    try {
      return { result: await parseJson(path) };
    } catch (e) {
      return { errorMessage: JSON.stringify(e) };
    }
  }

  return { errorMessage: "Invalid format" };
}

async function parseYaml(path: string): Promise<OpenAPIV3.Document> {
  const specContent = await readFile(path, "utf8");
  return load(specContent) as OpenAPIV3.Document;
}

async function parseJson(path: string): Promise<OpenAPIV3.Document> {
  const specContent = await readFile(path, "utf8");
  return JSON.parse(specContent) as OpenAPIV3.Document;
}

export function isReferenceOfParameter(parameter: OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject, name: string): boolean {
  if (isReferenceObject(parameter)) {
    return parameter.$ref === `#/components/parameters/${name}`;
  }

  return false;
}

export function isReferenceToSchema(parameter: OpenAPIV3.ReferenceObject, name: string): boolean {
  return parameter.$ref === `#/components/schemas/${name}`;
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
