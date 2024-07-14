import { VersionDiff } from "./types";
import { major, minor, patch, valid } from "semver";
import { IntermediateRepresentation } from "../ir/intermediate-representation";

export function extractVersionDiff(oldSpec: IntermediateRepresentation, newSpec: IntermediateRepresentation): VersionDiff {
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
