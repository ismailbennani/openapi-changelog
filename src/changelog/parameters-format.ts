import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { ParameterBreakingChange, ParameterNonBreakingChange } from "../diff/parameters-change";
import { OpenapiChangelogOptions } from "./changelog";
import { block, diffStrings, pad } from "./string-utils";
import { ParameterIntermediateRepresentation } from "../ir/parameters-ir";

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
        result.push(`- Changed type of parameter ${change.name} used in ${parameterInNewDocument.occurrences.length.toString()} endpoints`);

        if (options.detailed === true) {
          result.push("", ...pad(parameterTypeChangeDetails(parameterInOldDocument, parameterInNewDocument), innerBlockPadding));

          if (parameterInNewDocument.occurrences.length > 0) {
            result.push(...block(parameterEndpointsDetails(parameterInNewDocument), innerBlockWidth, innerBlockPadding));
          }
        }

        break;
      }
      case "parameter-unclassified":
        result.push(`- Changed parameter ${change.name} used in ${parameterInNewDocument.occurrences.length.toString()} endpoints`);
        if (options.detailed === true) {
          if (parameterInNewDocument.occurrences.length > 0) {
            result.push("", ...block(parameterEndpointsDetails(parameterInNewDocument), innerBlockWidth, innerBlockPadding));
          }
        }
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
        result.push(`- Changed documentation of parameter ${change.name} used in ${parameterInNewDocument.occurrences.length.toString()} endpoints`);

        if (options.detailed === true) {
          if (parameterInNewDocument.occurrences.length > 0) {
            result.push("", ...block(parameterEndpointsDetails(parameterInNewDocument), innerBlockWidth, innerBlockPadding));
          }

          const details = parameterDocumentationDetails(parameterInOldDocument, parameterInNewDocument);
          if (details !== undefined) {
            result.push("  - Changes:", ...block(details, innerBlockWidth - 2, innerBlockPadding + 2));
          }
        }
      }
    }
  }

  return result;
}

function parameterTypeChangeDetails(oldParameter: ParameterIntermediateRepresentation, newParameter: ParameterIntermediateRepresentation): string[] {
  return [`- Old type: ${oldParameter.type}`, `- New type: ${newParameter.type}`];
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

function parameterEndpointsDetails(parameter: ParameterIntermediateRepresentation): string[] {
  const result: string[] = [];

  for (const occurrence of parameter.occurrences) {
    result.push(`- Used in ${occurrence.method.toUpperCase()} ${occurrence.path}`);
  }

  return result;
}
