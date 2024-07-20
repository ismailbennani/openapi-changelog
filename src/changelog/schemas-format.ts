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
  const innerBlockPadding = 2;
  const blockWidth = options.printWidth ?? 9999;
  const innerBlockWidth = blockWidth - innerBlockPadding;

  const result: string[] = [];

  for (const change of changes) {
    const schemaInOldDocument = oldDocument.schemas.find((p) => p.name === change.name);
    const schemaInNewDocument = newDocument.schemas.find((p) => p.name === change.name);
    if (schemaInOldDocument === undefined || schemaInNewDocument === undefined) {
      return [];
    }

    switch (change.type) {
      case "schema-unclassified":
        result.push(`- Changed schema ${change.name} used in ${schemaInNewDocument.occurrences.length.toString()} endpoints`);

        if (options.detailed === true) {
          if (schemaInNewDocument.occurrences.length > 0) {
            result.push("", ...block(schemaEndpointsDetails(schemaInNewDocument), innerBlockWidth, innerBlockPadding));
          }
        }
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
  const innerBlockPadding = 2;
  const blockWidth = options.printWidth ?? 9999;
  const innerBlockWidth = blockWidth - innerBlockPadding;

  const result: string[] = [];

  for (const change of changes) {
    const schemaInOldDocument = oldDocument.schemas.find((p) => p.name === change.name);
    const schemaInNewDocument = newDocument.schemas.find((p) => p.name === change.name);
    if (schemaInOldDocument === undefined || schemaInNewDocument === undefined) {
      return [];
    }

    switch (change.type) {
      case "schema-documentation-change": {
        result.push(`- Changed documentation of schema ${change.name} used in ${schemaInNewDocument.occurrences.length.toString()} endpoints`);

        if (options.detailed === true) {
          if (schemaInNewDocument.occurrences.length > 0) {
            result.push("", ...block(schemaEndpointsDetails(schemaInNewDocument), innerBlockWidth, innerBlockPadding));
          }

          const details = schemaDocumentationDetails(schemaInOldDocument, schemaInNewDocument);
          if (details !== undefined) {
            result.push("  - Changes:", ...block(details, innerBlockWidth - 2, innerBlockPadding + 2));
          }
        }
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

function schemaEndpointsDetails(schema: SchemaIntermediateRepresentation): string[] {
  const result: string[] = [];

  for (const occurrence of schema.occurrences) {
    result.push(`- Used in ${occurrence.method.toUpperCase()} ${occurrence.path}`);
  }

  return result;
}
