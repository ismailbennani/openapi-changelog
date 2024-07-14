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
  breaking: OpenapiDocumentBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  switch (breaking.type) {
    case "operation-removal":
      return [`- Removed operation ${breaking.method.toUpperCase()} ${breaking.path}`];
    case "operation-parameter-removal":
      return [`- Removed parameter ${breaking.name} of operation ${breaking.method.toUpperCase()} ${breaking.path}`];
    case "operation-parameter-type-change":
      return [`- Changed type of parameter ${breaking.name} of operation ${breaking.method.toUpperCase()} ${breaking.path}`];
    case "operation-parameter-unclassified":
      return [`- Changed parameter ${breaking.name} of operation ${breaking.method.toUpperCase()} ${breaking.path}`];
    case "operation-response-removal":
      return [`- Removed response ${breaking.code} of operation ${breaking.method.toUpperCase()} ${breaking.path}`];
    case "operation-response-type-change":
      return [`- Changed type of response ${breaking.code} of operation ${breaking.method.toUpperCase()} ${breaking.path}`];
    case "operation-response-unclassified":
      return [`- Changed response ${breaking.code} of operation ${breaking.method.toUpperCase()} ${breaking.path}`];
  }
}

function nonBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  breaking: OpenapiDocumentNonBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  switch (breaking.type) {
    case "operation-addition":
      return [`- Added operation ${breaking.method.toUpperCase()} ${breaking.path}`];
    case "operation-deprecation":
      return [`- Deprecated operation ${breaking.method.toUpperCase()} ${breaking.path}`];
    case "operation-parameter-addition":
      return [`- Added parameter ${breaking.name} to operation ${breaking.method.toUpperCase()} ${breaking.path}`];
    case "operation-parameter-deprecation":
      return [`- Deprecated parameter ${breaking.name} of operation ${breaking.method.toUpperCase()} ${breaking.path}`];
    case "operation-parameter-documentation-change":
      return [`- Changed documentation of parameter ${breaking.name} of operation ${breaking.method.toUpperCase()} ${breaking.path}`];
    case "operation-response-addition":
      return [`- Added response ${breaking.code} to ${breaking.method.toUpperCase()} ${breaking.path}`];
    case "operation-response-documentation-change":
      return [`- Changed documentation of response ${breaking.code} of operation ${breaking.method.toUpperCase()} ${breaking.path}`];
  }
}
