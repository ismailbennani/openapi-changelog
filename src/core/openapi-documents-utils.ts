import { OpenAPIV3 } from "openapi-types";
import semver from "semver";

export function sortDocumentsByVersionDescInPlace(documents: OpenAPIV3.Document[]): OpenAPIV3.Document[] {
  const semverOptions = { loose: true };

  if (documents.some((d) => semver.valid(d.info.version, semverOptions) === null)) {
    return documents.sort((a, b) => -a.info.version.localeCompare(b.info.version));
  }

  return documents.sort((a, b) => -semver.compareBuild(a.info.version, b.info.version, semverOptions));
}
