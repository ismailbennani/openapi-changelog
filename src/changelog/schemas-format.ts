import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { SchemaBreakingChange, SchemaNonBreakingChange } from "../diff/schemas-change";
import { OpenapiChangelogOptions } from "./changelog";
import { block, diffStrings } from "./string-utils";
import { SchemaIntermediateRepresentation } from "../ir/schemas-ir";

export function schemaBreakingChanges(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  changes: SchemaBreakingChange[],
  options: OpenapiChangelogOptions,
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
  options: OpenapiChangelogOptions,
): string[] {
  const blockOptions = {
    maxLineLength: options.printWidth,
    padding: 2,
    dontPadFirstLine: true,
  };

  const result: string[] = [];

  for (const change of changes) {
    const schemaInOldDocument = oldDocument.schemas.find((p) => p.name === change.name);
    const schemaInNewDocument = newDocument.schemas.find((p) => p.name === change.name);
    if (schemaInOldDocument === undefined || schemaInNewDocument === undefined) {
      return [];
    }

    switch (change.type) {
      case "schema-documentation-change": {
        const content = [`- Changed documentation of schema ${change.name} referenced by ${schemaInNewDocument.nOccurrences.toString()} objects`];

        if (options.detailed === true) {
          const details = schemaDocumentationDetails(schemaInOldDocument, schemaInNewDocument);
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

function schemaDocumentationDetails(oldSchema: SchemaIntermediateRepresentation, newSchema: SchemaIntermediateRepresentation): string | undefined {
  if (oldSchema.description !== undefined && newSchema.description !== undefined) {
    return diffStrings(oldSchema.description, newSchema.description);
  }

  if (newSchema.description !== undefined) {
    return newSchema.description;
  }

  return undefined;
}
