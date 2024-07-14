import { major, minor, patch, valid } from "semver";
import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";

export interface VersionChange {
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

export function extractVersionChange(oldSpec: OpenapiDocumentIntermediateRepresentation, newSpec: OpenapiDocumentIntermediateRepresentation): VersionChange {
  const oldVersion = valid(oldSpec.version);
  const newVersion = valid(newSpec.version);

  if (oldVersion === null || newVersion === null) {
    return { old: oldSpec.version, new: newSpec.version, changed: { major: false, minor: false, patch: false } };
  }

  return {
    old: oldVersion,
    new: newVersion,
    changed: { major: major(oldVersion) !== major(newVersion), minor: minor(oldVersion) !== minor(newVersion), patch: patch(oldVersion) !== patch(newVersion) },
  };
}
