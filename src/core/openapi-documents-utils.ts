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
