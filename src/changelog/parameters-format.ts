import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { ParameterBreakingChange, ParameterNonBreakingChange } from "../diff/parameters-change";
import { OpenapiChangelogOptions } from "./changelog";

export function parameterBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: ParameterBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  const parameterInOldDocument = oldDocument.parameters.find((p) => p.name === change.name);
  const parameterInNewDocument = newDocument.parameters.find((p) => p.name === change.name);
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

export function parameterNonBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: ParameterNonBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  const parameterInOldDocument = oldDocument.parameters.find((p) => p.name === change.name);
  const parameterInNewDocument = newDocument.parameters.find((p) => p.name === change.name);
  if (parameterInOldDocument === undefined || parameterInNewDocument === undefined) {
    return [];
  }

  switch (change.type) {
    case "parameter-documentation-change":
      return [`- Changed documentation of parameter ${change.name} referenced by ${parameterInNewDocument.nOccurrences.toString()} objects`];
  }
}
