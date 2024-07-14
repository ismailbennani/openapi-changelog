import { OpenAPIV3 } from "openapi-types";
import semver from "semver";

export function sortDocumentsByVersionDescInPlace(documents: OpenAPIV3.Document[]): OpenAPIV3.Document[] {
  return documents.sort((a, b) => -semver.compareBuild(a.info.version, b.info.version, { loose: true }));
}
