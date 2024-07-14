import { OperationIntermediateRepresentation } from "../ir/operations-ir";
import { BreakingChange, NonBreakingChange } from "./types";
import { HttpMethod } from "../core/http-methods";
import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";

export function extractSchemasChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
): (SchemaBreakingChange | SchemaNonBreakingChange)[] {
  const result: (SchemaBreakingChange | SchemaNonBreakingChange)[] = [];

  for (const schemaInOldOperation of oldDocument.schemas) {
    const schemaInNewOperation = newDocument.schemas.find((p) => p.name === schemaInOldOperation.name);

    if (schemaInNewOperation === undefined) {
      continue;
    }

    if (schemaInNewOperation.description !== schemaInOldOperation.description || schemaInNewOperation.examples !== schemaInOldOperation.examples) {
      result.push({
        name: schemaInOldOperation.name,
        type: "schema-documentation-change",
        breaking: false,
      });
    }
  }

  return result;
}

interface SchemaChange {
  name: string;
}

export type SchemaBreakingChange = BreakingChange<"schema-unclassified"> & SchemaChange;
export type SchemaNonBreakingChange = NonBreakingChange<"schema-documentation-change"> & SchemaChange;
