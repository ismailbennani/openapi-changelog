import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { OpenapiDocumentBreakingChange, OpenapiDocumentChanges, OpenapiDocumentNonBreakingChange } from "../diff/openapi-document-changes";
import { OpenapiChangelogOptions } from "./changelog";
import { ParameterBreakingChange, ParameterNonBreakingChange } from "../diff/parameters-change";
import { SchemaBreakingChange, SchemaNonBreakingChange } from "../diff/schemas-change";
import { parameterBreakingChange, parameterNonBreakingChange } from "./parameters-format";
import { schemaBreakingChange, schemaNonBreakingChange } from "./schemas-format";
import { operationBreakingChange, operationNonBreakingChange } from "./operations-format";

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
    case "operation-parameter-removal":
    case "operation-parameter-type-change":
    case "operation-parameter-unclassified":
    case "operation-response-removal":
    case "operation-response-type-change":
    case "operation-response-unclassified":
      return operationBreakingChange(oldDocument, newDocument, change, options);
    case "parameter-type-change":
    case "parameter-unclassified":
      return parameterBreakingChange(oldDocument, newDocument, change, options);
    case "schema-unclassified":
      return schemaBreakingChange(oldDocument, newDocument, change, options);
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
    case "operation-documentation-change":
    case "operation-deprecation":
    case "operation-parameter-addition":
    case "operation-parameter-deprecation":
    case "operation-parameter-documentation-change":
    case "operation-response-addition":
    case "operation-response-documentation-change":
      return operationNonBreakingChange(oldDocument, newDocument, change, options);
    case "parameter-documentation-change":
      return parameterNonBreakingChange(oldDocument, newDocument, change, options);
    case "schema-documentation-change":
      return schemaNonBreakingChange(oldDocument, newDocument, change, options);
  }
}
