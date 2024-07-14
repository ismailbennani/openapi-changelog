import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { OpenapiDocumentBreakingChange, OpenapiDocumentChanges, OpenapiDocumentNonBreakingChange } from "../diff/openapi-document-changes";
import { OpenapiChangelogOptions } from "./changelog";

export function formatDocumentChanges(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  changes: OpenapiDocumentChanges,
  options?: OpenapiChangelogOptions,
): string[] {
  const result: string[] = [...header(changes)];

  const breaking: OpenapiDocumentBreakingChange[] = changes.changes.filter((c) => c.breaking).filter((c) => options?.exclude?.includes(c.type) !== true);
  if (breaking.length > 0) {
    result.push("", "> BREAKING CHANGES", ...breaking.flatMap((c) => breakingChange(oldDocument, newDocument, c, options)).map((l) => `  ${l}`));
  }

  const nonBreaking: OpenapiDocumentNonBreakingChange[] = changes.changes.filter((c) => !c.breaking).filter((c) => options?.exclude?.includes(c.type) !== true);
  if (nonBreaking.length > 0) {
    result.push("", "> Changes", ...nonBreaking.flatMap((c) => nonBreakingChange(oldDocument, newDocument, c, options)).map((l) => `  ${l}`));
  }

  if (breaking.length === 0 && nonBreaking.length === 0) {
    result.push("", "No changes");
  }

  return result;
}

function header(diff: OpenapiDocumentChanges): string[] {
  const updateType = diff.version.changed.major ? " - MAJOR" : diff.version.changed.minor ? " - MINOR" : diff.version.changed.patch ? " - PATCH" : " ";
  return [`Version ${diff.version.new}${updateType}`];
}

function breakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: OpenapiDocumentBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  switch (change.type) {
    case "operation-removal":
      return [`- Removed operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-parameter-removal":
      return [`- Removed parameter ${change.name} of operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-parameter-type-change":
      return [`- Changed type of parameter ${change.name} of operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-parameter-unclassified":
      return [`- Changed parameter ${change.name} of operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-response-removal":
      return [`- Removed response ${change.code} of operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-response-type-change":
      return [`- Changed type of response ${change.code} of operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-response-unclassified":
      return [`- Changed response ${change.code} of operation ${change.method.toUpperCase()} ${change.path}`];
    case "parameter-type-change":
      return [`- Changed type of parameter ${change.name} referenced by ?? objects`];
    case "parameter-unclassified":
      return [`- Changed parameter ${change.name} referenced by ?? objects`];
    case "schema-unclassified":
      return [`- Changed schema ${change.name}`];
  }
}

function nonBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: OpenapiDocumentNonBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  switch (change.type) {
    case "operation-addition":
      return [`- Added operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-documentation-change":
      return [`- Changed documentation of operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-deprecation":
      return [`- Deprecated operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-parameter-addition":
      return [`- Added parameter ${change.name} to operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-parameter-deprecation":
      return [`- Deprecated parameter ${change.name} of operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-parameter-documentation-change":
      return [`- Changed documentation of parameter ${change.name} of operation ${change.method.toUpperCase()} ${change.path}`];
    case "operation-response-addition":
      return [`- Added response ${change.code} to ${change.method.toUpperCase()} ${change.path}`];
    case "operation-response-documentation-change":
      return [`- Changed documentation of response ${change.code} of operation ${change.method.toUpperCase()} ${change.path}`];
    case "parameter-documentation-change":
      return [`- Changed documentation of parameter ${change.name} referenced by ?? objects`];
    case "schema-documentation-change":
      return [`- Changed documentation of schema ${change.name}`];
  }
}
