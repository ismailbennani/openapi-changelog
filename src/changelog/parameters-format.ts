import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { ParameterBreakingChange, ParameterNonBreakingChange } from "../diff/parameters-change";
import { OpenapiChangelogOptions } from "./changelog";
import { block, diffStrings } from "./string-utils";
import { ParameterIntermediateRepresentation } from "../ir/parameters-ir";

export function parameterBreakingChanges(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  changes: ParameterBreakingChange[],
  options: OpenapiChangelogOptions,
): string[] {
  const result: string[] = [];

  for (const change of changes) {
    const parameterInOldDocument = oldDocument.parameters.find((p) => p.name === change.name);
    const parameterInNewDocument = newDocument.parameters.find((p) => p.name === change.name);
    if (parameterInOldDocument === undefined || parameterInNewDocument === undefined) {
      return [];
    }

    switch (change.type) {
      case "parameter-type-change": {
        const result = [`- Changed type of parameter ${change.name} referenced by ${parameterInNewDocument.nOccurrences.toString()} objects`];

        if (options.detailed === true) {
          result.push(...parameterTypeChangeDetails(parameterInOldDocument, parameterInNewDocument));
        }

        return result;
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
  const blockOptions = {
    maxLineLength: options.printWidth,
    padding: 2,
    dontPadFirstLine: true,
  };

  const result: string[] = [];

  for (const change of changes) {
    const parameterInOldDocument = oldDocument.parameters.find((p) => p.name === change.name);
    const parameterInNewDocument = newDocument.parameters.find((p) => p.name === change.name);
    if (parameterInOldDocument === undefined || parameterInNewDocument === undefined) {
      return [];
    }

    switch (change.type) {
      case "parameter-documentation-change": {
        const content = [`- Changed documentation of parameter ${change.name} referenced by ${parameterInNewDocument.nOccurrences.toString()} objects`];

        if (options.detailed === true) {
          const details = parameterDocumentationDetails(parameterInOldDocument, parameterInNewDocument);
          if (details !== undefined) {
            content.push("", details);
          }
        }

        return block(content, blockOptions);
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
