import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { OpenapiDocumentBreakingChange, OpenapiDocumentChanges, OpenapiDocumentNonBreakingChange } from "../diff/openapi-document-changes";
import { OpenapiChangelogOptions } from "./changelog";
import { ParameterBreakingChange, ParameterNonBreakingChange } from "../diff/parameters-change";
import { SchemaBreakingChange, SchemaNonBreakingChange } from "../diff/schemas-change";

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
    case "parameter-unclassified":
      return parameterBreakingChange(oldDocument, newDocument, change, options);
    case "schema-unclassified":
      return schemaBreakingChange(oldDocument, newDocument, change, options);
  }
}

function parameterBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: ParameterBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  const parameterInOldDocument = oldDocument.parameters.find((p) => p.name === change.name);
  const parameterInNewDocument = oldDocument.parameters.find((p) => p.name === change.name);
  if (parameterInOldDocument === undefined || parameterInNewDocument === undefined) {
    return [];
  }

  switch (change.type) {
    case "parameter-type-change":
      return [`- Changed type of parameter ${change.name} referenced by ${parameterInNewDocument.nOccurrences.toString()} objects`];
    case "parameter-unclassified":
      return [`- Changed parameter ${change.name} referenced by ${parameterInNewDocument.nOccurrences.toString()} objects`];
  }
}

function schemaBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: SchemaBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  const schemaInOldDocument = oldDocument.schemas.find((p) => p.name === change.name);
  const schemaInNewDocument = oldDocument.schemas.find((p) => p.name === change.name);
  if (schemaInOldDocument === undefined || schemaInNewDocument === undefined) {
    return [];
  }

  switch (change.type) {
    case "schema-unclassified":
      return [`- Changed schema ${change.name} referenced by ${schemaInNewDocument.nOccurrences.toString()} objects`];
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
      return parameterNonBreakingChange(oldDocument, newDocument, change, options);
    case "schema-documentation-change":
      return schemaNonBreakingChange(oldDocument, newDocument, change, options);
  }
}

function parameterNonBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: ParameterNonBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  const parameterInOldDocument = oldDocument.parameters.find((p) => p.name === change.name);
  const parameterInNewDocument = oldDocument.parameters.find((p) => p.name === change.name);
  if (parameterInOldDocument === undefined || parameterInNewDocument === undefined) {
    return [];
  }

  switch (change.type) {
    case "parameter-documentation-change":
      return [`- Changed documentation of parameter ${change.name} referenced by ${parameterInNewDocument.nOccurrences.toString()} objects`];
  }
}

function schemaNonBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: SchemaNonBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  const schemaInOldDocument = oldDocument.schemas.find((p) => p.name === change.name);
  const schemaInNewDocument = oldDocument.schemas.find((p) => p.name === change.name);
  if (schemaInOldDocument === undefined || schemaInNewDocument === undefined) {
    return [];
  }

  switch (change.type) {
    case "schema-documentation-change":
      return [`- Changed documentation of schema ${change.name} referenced by ${schemaInNewDocument.nOccurrences.toString()} objects`];
  }
}
