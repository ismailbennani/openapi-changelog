import { VersionDiff } from "./types.js";
import { major, minor, patch, valid } from "semver";
import { IntermediateRepresentation } from "./intermediate-representation";

export function extractVersionDiff(oldSpec: IntermediateRepresentation, newSpec: IntermediateRepresentation): VersionDiff {
  const from = valid(oldSpec.version);
  const to = valid(newSpec.version);

  if (from === null || to === null) {
    return { from: oldSpec.version, to: newSpec.version, changed: { major: false, minor: false, patch: false } };
  }

  return { from, to, changed: { major: major(from) !== major(to), minor: minor(from) !== minor(to), patch: patch(from) !== patch(to) } };
}
