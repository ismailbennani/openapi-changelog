import { OpenAPIV3 } from "openapi-types";
import semver from "semver";
import { isReferenceObject } from "../ir/utils";

export function sortDocumentsByVersionDescInPlace(documents: OpenAPIV3.Document[]): OpenAPIV3.Document[] {
  const semverOptions = { loose: true };

  if (documents.some((d) => semver.valid(d.info.version, semverOptions) === null)) {
    return documents.sort((a, b) => -a.info.version.localeCompare(b.info.version));
  }

  return documents.sort((a, b) => -semver.compareBuild(a.info.version, b.info.version, semverOptions));
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
