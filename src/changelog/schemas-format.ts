import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { SchemaBreakingChange, SchemaNonBreakingChange } from "../diff/schemas-change";
import { OpenapiChangelogOptions } from "./changelog";

export function schemaBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: SchemaBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  const schemaInOldDocument = oldDocument.schemas.find((p) => p.name === change.name);
  const schemaInNewDocument = newDocument.schemas.find((p) => p.name === change.name);
  if (schemaInOldDocument === undefined || schemaInNewDocument === undefined) {
    return [];
  }

  switch (change.type) {
    case "schema-unclassified":
      return [`- Changed schema ${change.name} referenced by ${schemaInNewDocument.nOccurrences.toString()} objects`];
  }
}

export function schemaNonBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: SchemaNonBreakingChange,
  options?: OpenapiChangelogOptions,
): string[] {
  const schemaInOldDocument = oldDocument.schemas.find((p) => p.name === change.name);
  const schemaInNewDocument = newDocument.schemas.find((p) => p.name === change.name);
  if (schemaInOldDocument === undefined || schemaInNewDocument === undefined) {
    return [];
  }

  switch (change.type) {
    case "schema-documentation-change":
      return [`- Changed documentation of schema ${change.name} referenced by ${schemaInNewDocument.nOccurrences.toString()} objects`];
  }
}
