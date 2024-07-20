import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { OpenapiDocumentBreakingChange, OpenapiDocumentChanges, OpenapiDocumentNonBreakingChange } from "../diff/openapi-document-changes";
import { OpenapiChangelogOptions } from "./changelog";
import { parameterBreakingChanges, parameterNonBreakingChanges } from "./parameters-format";
import { schemaBreakingChanges, schemaNonBreakingChanges } from "./schemas-format";
import { operationBreakingChanges, operationNonBreakingChanges } from "./operations-format";
import { OperationBreakingChange, OperationNonBreakingChange } from "../diff/operations-change";
import { ParameterBreakingChange, ParameterNonBreakingChange } from "../diff/parameters-change";
import { SchemaBreakingChange, SchemaNonBreakingChange } from "../diff/schemas-change";
import { block, pad } from "../core/string-utils";

export function formatDocumentChanges(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  changes: OpenapiDocumentChanges,
  options: OpenapiChangelogOptions,
): string[] {
  const innerBlockPadding = 4;
  const blockWidth = options.printWidth ?? 9999;
  const innerBlockWidth = blockWidth - innerBlockPadding;
  const innerBlockOptions = { ...options, printWidth: innerBlockWidth };

  const result: string[] = [...header(changes)];

  const breaking: OpenapiDocumentBreakingChange[] = changes.changes.filter((c) => c.breaking).filter((c) => options.exclude?.includes(c.type) === false);
  if (breaking.length > 0) {
    result.push(...pad(["- BREAKING CHANGES"], 2));

    const operationBreakingChangesResult = operationBreakingChanges(
      oldDocument,
      newDocument,
      breaking.filter((c) => c.type.startsWith("operation")).map((c) => c as OperationBreakingChange),
      innerBlockOptions,
    );
    result.push(...pad(operationBreakingChangesResult, innerBlockPadding));

    const parameterBreakingChangesResult = parameterBreakingChanges(
      oldDocument,
      newDocument,
      breaking.filter((c) => c.type.startsWith("parameters")).map((c) => c as ParameterBreakingChange),
      innerBlockOptions,
    );
    result.push(...pad(parameterBreakingChangesResult, innerBlockPadding));

    const schemaBreakingChangesResult = schemaBreakingChanges(
      oldDocument,
      newDocument,
      breaking.filter((c) => c.type.startsWith("schemas")).map((c) => c as SchemaBreakingChange),
      innerBlockOptions,
    );
    result.push(...pad(schemaBreakingChangesResult, innerBlockPadding));
  }

  const nonBreaking: OpenapiDocumentNonBreakingChange[] = changes.changes.filter((c) => !c.breaking).filter((c) => options.exclude?.includes(c.type) === false);

  if (breaking.length > 0 && nonBreaking.length > 0) {
    result.push("");
  }

  if (nonBreaking.length > 0) {
    result.push(...pad(["- Changes"], 2));

    const operationNonBreakingChangesResult = operationNonBreakingChanges(
      oldDocument,
      newDocument,
      nonBreaking.filter((c) => c.type.startsWith("operation")).map((c) => c as OperationNonBreakingChange),
      innerBlockOptions,
    );
    result.push(...pad(operationNonBreakingChangesResult, innerBlockPadding));

    const parameterNonBreakingChangesResult = parameterNonBreakingChanges(
      oldDocument,
      newDocument,
      nonBreaking.filter((c) => c.type.startsWith("parameter")).map((c) => c as ParameterNonBreakingChange),
      innerBlockOptions,
    );
    result.push(...pad(parameterNonBreakingChangesResult, innerBlockPadding));

    const schemaNonBreakingChangesResult = schemaNonBreakingChanges(
      oldDocument,
      newDocument,
      nonBreaking.filter((c) => c.type.startsWith("schema")).map((c) => c as SchemaNonBreakingChange),
      innerBlockOptions,
    );
    result.push(...pad(schemaNonBreakingChangesResult, innerBlockPadding));
  }

  if (breaking.length === 0 && nonBreaking.length === 0) {
    result.push(...pad(["- No changes"], 2));
  }

  return result;
}

function header(diff: OpenapiDocumentChanges): string[] {
  const updateType = diff.version.changed.major ? " - MAJOR" : diff.version.changed.minor ? " - MINOR" : diff.version.changed.patch ? " - PATCH" : " ";
  return [`Version ${diff.version.new}${updateType}`];
}
