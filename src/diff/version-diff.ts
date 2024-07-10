import { OpenAPIV3 } from "openapi-types";
import { VersionDiff } from "./types.js";
import { major, minor, patch, valid } from "semver";

export function extractVersionDiff(oldSpec: OpenAPIV3.Document, newSpec: OpenAPIV3.Document): VersionDiff {
  const from = valid(oldSpec.info.version);
  const to = valid(newSpec.info.version);

  if (from === null || to === null) {
    return { from: oldSpec.info.version, to: newSpec.info.version, changed: { major: false, minor: false, patch: false } };
  }

  return { from, to, changed: { major: major(from) !== major(to), minor: minor(from) !== minor(to), patch: patch(from) !== patch(to) } };
}
