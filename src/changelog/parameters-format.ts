import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { ParameterBreakingChange, ParameterNonBreakingChange } from "../diff/parameters-change";
import { OpenapiChangelogOptions } from "./changelog";

export function parameterBreakingChanges(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  changes: ParameterBreakingChange[],
  options?: OpenapiChangelogOptions,
): string[] {
  const result: string[] = [];

  for (const change of changes) {
    const parameterInOldDocument = oldDocument.parameters.find((p) => p.name === change.name);
    const parameterInNewDocument = newDocument.parameters.find((p) => p.name === change.name);
    if (parameterInOldDocument === undefined || parameterInNewDocument === undefined) {
      return [];
    }

    switch (change.type) {
      case "parameter-type-change":
        result.push(`- Changed type of parameter ${change.name} referenced by ${parameterInNewDocument.nOccurrences.toString()} objects`);
        break;
      case "parameter-unclassified":
        result.push(`- Changed parameter ${change.name} referenced by ${parameterInNewDocument.nOccurrences.toString()} objects`);
        break;
    }
  }

  return result;
}

export function parameterNonBreakingChanges(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  changes: ParameterNonBreakingChange[],
  options?: OpenapiChangelogOptions,
): string[] {
  const result: string[] = [];

  for (const change of changes) {
    const parameterInOldDocument = oldDocument.parameters.find((p) => p.name === change.name);
    const parameterInNewDocument = newDocument.parameters.find((p) => p.name === change.name);
    if (parameterInOldDocument === undefined || parameterInNewDocument === undefined) {
      return [];
    }

    switch (change.type) {
      case "parameter-documentation-change":
        result.push(`- Changed documentation of parameter ${change.name} referenced by ${parameterInNewDocument.nOccurrences.toString()} objects`);
        break;
    }
  }

  return result;
}
