import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { ParameterBreakingChange, ParameterNonBreakingChange } from "../diff/parameters-change";
import { OpenapiChangelogOptions } from "./changelog";
import { block, diffStrings, pad } from "./string-utils";
import { ParameterIntermediateRepresentation } from "../ir/parameters-ir";
import { operationResponseBreakingChange } from "./operation-responses-format";

export function parameterBreakingChanges(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  changes: ParameterBreakingChange[],
  options: OpenapiChangelogOptions,
): string[] {
  const innerBlockPadding = 2;
  const blockWidth = options.printWidth ?? 9999;
  const innerBlockWidth = blockWidth - innerBlockPadding;

  const result: string[] = [];

  for (const change of changes) {
    const parameterInOldDocument = oldDocument.parameters.find((p) => p.name === change.name);
    const parameterInNewDocument = newDocument.parameters.find((p) => p.name === change.name);
    if (parameterInOldDocument === undefined || parameterInNewDocument === undefined) {
      return [];
    }

    switch (change.type) {
      case "parameter-type-change": {
        result.push(`- Changed type of parameter ${change.name} referenced by ${parameterInNewDocument.nOccurrences.toString()} objects`);

        if (options.detailed === true) {
          result.push(...pad(parameterTypeChangeDetails(parameterInOldDocument, parameterInNewDocument), innerBlockPadding));
        }

        break;
      }
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
  options: OpenapiChangelogOptions,
): string[] {
  const innerBlockPadding = 2;
  const blockWidth = options.printWidth ?? 9999;
  const innerBlockWidth = blockWidth - innerBlockPadding;

  const result: string[] = [];

  for (const change of changes) {
    const parameterInOldDocument = oldDocument.parameters.find((p) => p.name === change.name);
    const parameterInNewDocument = newDocument.parameters.find((p) => p.name === change.name);
    if (parameterInOldDocument === undefined || parameterInNewDocument === undefined) {
      return [];
    }

    switch (change.type) {
      case "parameter-documentation-change": {
        result.push(`- Changed documentation of parameter ${change.name} referenced by ${parameterInNewDocument.nOccurrences.toString()} objects`);

        if (options.detailed === true) {
          const details = parameterDocumentationDetails(parameterInOldDocument, parameterInNewDocument);
          if (details !== undefined) {
            result.push(...block(details, innerBlockWidth, innerBlockPadding));
          }
        }
      }
    }
  }

  return result;
}

function parameterTypeChangeDetails(oldParameter: ParameterIntermediateRepresentation, newParameter: ParameterIntermediateRepresentation): string[] {
  return [`Old type: ${oldParameter.type}`, `New type: ${newParameter.type}`];
}

function parameterDocumentationDetails(oldParameter: ParameterIntermediateRepresentation, newParameter: ParameterIntermediateRepresentation): string | undefined {
  if (oldParameter.description !== undefined && newParameter.description !== undefined) {
    return diffStrings(oldParameter.description, newParameter.description);
  }

  if (newParameter.description !== undefined) {
    return newParameter.description;
  }

  return undefined;
}
