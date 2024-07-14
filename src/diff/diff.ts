import { OpenAPIV3 } from "openapi-types";
import winston from "winston";
import fs from "node:fs";
import { sortDocumentsByVersionDescInPlace } from "../core/openapi-documents-utils";
import { extractIntermediateRepresentation, OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { compareIntermediateRepresentations, OpenapiDocumentChanges } from "./openapi-document-changes";
import { DEBUG_FOLDER_NAME } from "../core/constants";
import { ensureDir } from "../core/fs-utils";

export interface OpenapiDiffOptions {
  limit?: number;
  dumpIntermediateRepresentations?: boolean;
  dumpChanges?: boolean;
}

export function diff(documents: OpenAPIV3.Document[], options?: OpenapiDiffOptions): OpenapiDocumentChanges[] {
  return detailedDiff(documents, options).map((d) => d.changes);
}

export function detailedDiff(
  documents: OpenAPIV3.Document[],
  options?: OpenapiDiffOptions,
): { oldDocument: OpenapiDocumentIntermediateRepresentation; newDocument: OpenapiDocumentIntermediateRepresentation; changes: OpenapiDocumentChanges }[] {
  if (documents.length < 2) {
    throw new Error("Expected at least two documents");
  }

  sortDocumentsByVersionDescInPlace(documents);

  if (options?.limit !== undefined && documents.length > options.limit) {
    winston.info(`Changelog limit set to ${options.limit.toString()}, dropping last ${(documents.length - options.limit).toString()} versions.`);
    documents = documents.slice(0, options.limit);
  }

  winston.info("Computing differences between documents:");
  for (const document of documents) {
    winston.info(`\t ${document.info.title} v${document.info.version}`);
  }

  winston.info("Extracting data from documents...");
  const documentIrs = documents.map((d) => ir(d, options));

  const result: { oldDocument: OpenapiDocumentIntermediateRepresentation; newDocument: OpenapiDocumentIntermediateRepresentation; changes: OpenapiDocumentChanges }[] = [];

  for (let i = 0; i < documentIrs.length - 1; i++) {
    const oldDocumentIr = documentIrs[i + 1];
    const newDocumentIr = documentIrs[i];

    const changes = compareIntermediateRepresentations(oldDocumentIr, newDocumentIr);
    result.push({ oldDocument: oldDocumentIr, newDocument: newDocumentIr, changes: changes });

    if (options?.dumpChanges === true) {
      const toDump = JSON.stringify(changes, null, 2);
      const path = `${DEBUG_FOLDER_NAME}/${oldDocumentIr.title} v${oldDocumentIr.version} to v${newDocumentIr.version}.changes`;

      ensureDir(DEBUG_FOLDER_NAME);
      fs.writeFileSync(path, toDump);
    }
  }

  return result;
}

function ir(document: OpenAPIV3.Document, options?: OpenapiDiffOptions): OpenapiDocumentIntermediateRepresentation {
  const result = extractIntermediateRepresentation(document);

  if (options?.dumpIntermediateRepresentations === true) {
    const toDump = JSON.stringify(result, null, 2);
    const path = `${DEBUG_FOLDER_NAME}/${result.title} v${result.version}.ir`;

    ensureDir(DEBUG_FOLDER_NAME);
    fs.writeFileSync(path, toDump);
  }

  return result;
}
