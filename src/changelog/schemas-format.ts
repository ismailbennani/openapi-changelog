import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { SchemaBreakingChange, SchemaNonBreakingChange } from "../diff/schemas-change";
import { OpenapiChangelogOptions } from "./changelog";

export function schemaBreakingChanges(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  changes: SchemaBreakingChange[],
  options?: OpenapiChangelogOptions,
): string[] {
  const result: string[] = [];

  for (const change of changes) {
    const schemaInOldDocument = oldDocument.schemas.find((p) => p.name === change.name);
    const schemaInNewDocument = newDocument.schemas.find((p) => p.name === change.name);
    if (schemaInOldDocument === undefined || schemaInNewDocument === undefined) {
      return [];
    }

    switch (change.type) {
      case "schema-unclassified":
        result.push(`- Changed schema ${change.name} referenced by ${schemaInNewDocument.nOccurrences.toString()} objects`);
        break;
    }
  }

  return result;
}

export function schemaNonBreakingChanges(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  changes: SchemaNonBreakingChange[],
  options?: OpenapiChangelogOptions,
): string[] {
  const result: string[] = [];

  for (const change of changes) {
    const schemaInOldDocument = oldDocument.schemas.find((p) => p.name === change.name);
    const schemaInNewDocument = newDocument.schemas.find((p) => p.name === change.name);
    if (schemaInOldDocument === undefined || schemaInNewDocument === undefined) {
      return [];
    }

    switch (change.type) {
      case "schema-documentation-change":
        result.push(`- Changed documentation of schema ${change.name} referenced by ${schemaInNewDocument.nOccurrences.toString()} objects`);
        break;
    }
  }

  return result;
}
