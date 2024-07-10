import { readFile } from "node:fs/promises";
import { DiffResponse } from "./types.js";
import { OpenAPIV3 } from "openapi-types";
import * as util from "node:util";
import winston from "winston";
import { extractIntermediateRepresentation } from "./intermediate-representation.js";
import { extractVersionDiff } from "./version-diff.js";
import { extractOperationsDiff } from "./operations-diff.js";
import { extractParametersDiff } from "./parameters-diff.js";
import { extractResponsesDiff } from "./responses-diff.js";

export async function diff(oldOpenApiSpec: string, newOpenApiSpec: string): Promise<Readonly<DiffResponse>> {
  const oldSpec = await readOpenApiSpecification(oldOpenApiSpec);
  const newSpec = await readOpenApiSpecification(newOpenApiSpec);

  const oldSpecIR = extractIntermediateRepresentation(oldSpec);
  const newSpecIR = extractIntermediateRepresentation(newSpec);

  const { added: addedOperations, deprecated: deprecatedOperations, removed: removedOperations } = extractOperationsDiff(oldSpecIR, newSpecIR);
  const { added: addedParameters, changed: changedParameters, deprecated: deprecatedParameters, removed: removedParameters } = extractParametersDiff(oldSpecIR, newSpecIR);
  const { added: addedResponses, changed: changedResponses, removed: removedResponses } = extractResponsesDiff(oldSpecIR, newSpecIR);

  winston.debug("==== OLD SPEC");
  winston.debug(util.inspect(oldSpecIR, false, null, true));
  winston.debug("");

  winston.debug("==== NEW SPEC");
  winston.debug(util.inspect(newSpecIR, false, null, true));
  winston.debug("");

  return {
    version: extractVersionDiff(oldSpecIR, newSpecIR),
    breaking: {
      removed: {
        operations: removedOperations,
        parameters: removedParameters,
        responses: removedResponses,
      },
      changed: {
        parameters: changedParameters,
        responses: changedResponses,
      },
    },
    nonBreaking: {
      added: {
        operations: addedOperations,
        parameters: addedParameters,
        responses: addedResponses,
      },
      deprecated: {
        operations: deprecatedOperations,
        parameters: deprecatedParameters,
      },
    },
  };
}

async function readOpenApiSpecification(path: string): Promise<OpenAPIV3.Document> {
  const stringContent = await readFile(path, "utf8");
  return JSON.parse(stringContent) as OpenAPIV3.Document;
}
