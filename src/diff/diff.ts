import { OpenAPIV3 } from "openapi-types";
import fs from "fs";
import { parseOpenapiFile, sortDocumentsByVersionDescInPlace } from "../core/openapi-documents-utils";
import { extractIntermediateRepresentation, OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { compareIntermediateRepresentations, OpenapiDocumentChanges } from "./openapi-document-changes";
import { DEBUG_FOLDER_NAME } from "../core/constants";
import { ensureDir } from "../core/fs-utils";
import { Logger } from "../core/logging";

export interface OpenapiDiffOptions {
  limit?: number;
  dumpIntermediateRepresentations?: boolean;
  dumpChanges?: boolean;
}

export function diff(documents: OpenAPIV3.Document[], options?: OpenapiDiffOptions): OpenapiDocumentChanges[] {
  return detailedDiff(documents, options).map((d) => d.changes);
}

export function diffFromFiles(documentPaths: string[], options?: OpenapiDiffOptions): OpenapiDocumentChanges[] {
  return detailedDiffFromFiles(documentPaths, options).map((d) => d.changes);
}

export function detailedDiff(
  documents: OpenAPIV3.Document[],
  options?: OpenapiDiffOptions,
): { oldDocument: OpenapiDocumentIntermediateRepresentation; newDocument: OpenapiDocumentIntermediateRepresentation; changes: OpenapiDocumentChanges }[] {
  if (documents.length < 2) {
    throw new Error("Expected at least two documents");
  }

  const documentIrs = documents.map((d) => ir(d, options));
  sortDocumentsByVersionDescInPlace(documentIrs);

  return computeChanges(documentIrs, options);
}

export function detailedDiffFromFiles(
  documentPaths: string[],
  options?: OpenapiDiffOptions,
): { oldDocument: OpenapiDocumentIntermediateRepresentation; newDocument: OpenapiDocumentIntermediateRepresentation; changes: OpenapiDocumentChanges }[] {
  if (documentPaths.length < 2) {
    throw new Error("Expected at least two documents");
  }

  const documentIrs: OpenapiDocumentIntermediateRepresentation[] = [];
  for (const path of documentPaths) {
    const ir = irFromFile(path, options);
    if (ir === undefined) {
      continue;
    }

    documentIrs.push(ir);
  }

  sortDocumentsByVersionDescInPlace(documentIrs);

  return computeChanges(documentIrs, options);
}

function ir(document: OpenAPIV3.Document, options: OpenapiDiffOptions | undefined): OpenapiDocumentIntermediateRepresentation {
  Logger.info(`Building intermediate representation of ${document.info.title} v${document.info.version}...`);

  const result = extractIntermediateRepresentation(document);

  if (options?.dumpIntermediateRepresentations === true) {
    const toDump = JSON.stringify(result, null, 2);
    const path = `${DEBUG_FOLDER_NAME}/${result.title} v${result.version}.ir`;

    ensureDir(DEBUG_FOLDER_NAME);
    fs.writeFileSync(path, toDump);
  }

  return result;
}

function irFromFile(path: string, options: OpenapiDiffOptions | undefined): OpenapiDocumentIntermediateRepresentation | undefined {
  Logger.info(`Reading document at ${path}...`);

  const content = parseOpenapiFile(path);
  if (content.result === undefined) {
    Logger.error(`Could not parse document at ${path}: ${content.errorMessage ?? ""}`);
    return undefined;
  }

  return ir(content.result, options);
}

function computeChanges(
  documentIrs: OpenapiDocumentIntermediateRepresentation[],
  options: OpenapiDiffOptions | undefined,
): {
  oldDocument: OpenapiDocumentIntermediateRepresentation;
  newDocument: OpenapiDocumentIntermediateRepresentation;
  changes: OpenapiDocumentChanges;
}[] {
  if (options?.limit !== undefined && documentIrs.length > options.limit) {
    Logger.info(`Limit set to ${options.limit.toString()}, dropping last ${(documentIrs.length - options.limit).toString()} documents.`);
    documentIrs = documentIrs.slice(0, options.limit);
  }

  Logger.info("Computing differences between documents:");
  for (const documentIr of documentIrs) {
    Logger.info(`\t ${documentIr.title} v${documentIr.version}`);
  }

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
