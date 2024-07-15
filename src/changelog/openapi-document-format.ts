import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { OpenapiDocumentBreakingChange, OpenapiDocumentChanges, OpenapiDocumentNonBreakingChange } from "../diff/openapi-document-changes";
import { OpenapiChangelogOptions } from "./changelog";
import { parameterBreakingChanges, parameterNonBreakingChanges } from "./parameters-format";
import { schemaBreakingChanges, schemaNonBreakingChanges } from "./schemas-format";
import { operationBreakingChanges, operationNonBreakingChanges } from "./operations-format";
import { OperationBreakingChange, OperationNonBreakingChange } from "../diff/operations-change";
import { ParameterBreakingChange, ParameterNonBreakingChange } from "../diff/parameters-change";
import { SchemaBreakingChange, SchemaNonBreakingChange } from "../diff/schemas-change";
import { pad } from "./string-utils";

export function formatDocumentChanges(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  changes: OpenapiDocumentChanges,
  options: OpenapiChangelogOptions,
): string[] {
  const result: string[] = [...header(changes)];

  const breaking: OpenapiDocumentBreakingChange[] = changes.changes.filter((c) => c.breaking).filter((c) => options.exclude?.includes(c.type) === false);
  if (breaking.length > 0) {
    result.push(...pad(["- BREAKING CHANGES"], 2));

    result.push(
      ...pad(
        operationBreakingChanges(
          oldDocument,
          newDocument,
          breaking.filter((c) => c.type.startsWith("operation")).map((c) => c as OperationBreakingChange),
          { ...options, printWidth: options.printWidth !== undefined ? options.printWidth - 4 : undefined },
        ),
        4,
      ),
    );

    result.push(
      ...pad(
        parameterBreakingChanges(
          oldDocument,
          newDocument,
          breaking.filter((c) => c.type.startsWith("parameters")).map((c) => c as ParameterBreakingChange),
          { ...options, printWidth: options.printWidth !== undefined ? options.printWidth - 4 : undefined },
        ),
        4,
      ),
    );

    result.push(
      ...pad(
        schemaBreakingChanges(
          oldDocument,
          newDocument,
          breaking.filter((c) => c.type.startsWith("schemas")).map((c) => c as SchemaBreakingChange),
          { ...options, printWidth: options.printWidth !== undefined ? options.printWidth - 4 : undefined },
        ),
        4,
      ),
    );
  }

  const nonBreaking: OpenapiDocumentNonBreakingChange[] = changes.changes.filter((c) => !c.breaking).filter((c) => options.exclude?.includes(c.type) === false);

  if (breaking.length > 0 && nonBreaking.length > 0) {
    result.push("");
  }

  if (nonBreaking.length > 0) {
    result.push(...pad(["- Changes"], 2));

    result.push(
      ...pad(
        operationNonBreakingChanges(
          oldDocument,
          newDocument,
          nonBreaking.filter((c) => c.type.startsWith("operation")).map((c) => c as OperationNonBreakingChange),
          { ...options, printWidth: options.printWidth !== undefined ? options.printWidth - 4 : undefined },
        ),
        4,
      ),
    );

    result.push(
      ...pad(
        parameterNonBreakingChanges(
          oldDocument,
          newDocument,
          nonBreaking.filter((c) => c.type.startsWith("parameters")).map((c) => c as ParameterNonBreakingChange),
          { ...options, printWidth: options.printWidth !== undefined ? options.printWidth - 4 : undefined },
        ),
        4,
      ),
    );

    result.push(
      ...pad(
        schemaNonBreakingChanges(
          oldDocument,
          newDocument,
          nonBreaking.filter((c) => c.type.startsWith("schemas")).map((c) => c as SchemaNonBreakingChange),
          { ...options, printWidth: options.printWidth !== undefined ? options.printWidth - 4 : undefined },
        ),
        4,
      ),
    );
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
