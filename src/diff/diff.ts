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

  const anyRemoval = removedOperations.length > 0 || removedParameters.length > 0 || removedResponses.length > 0;
  const anyChange = changedParameters.length > 0 || changedResponses.length > 0;
  const anyBreaking = anyRemoval || anyChange;
  const anyAddition = addedOperations.length > 0 || addedParameters.length > 0 || addedResponses.length > 0;
  const anyDeprecation = deprecatedOperations.length > 0 || deprecatedParameters.length > 0;
  const anyNonBreaking = anyAddition || anyDeprecation;

  return {
    version: extractVersionDiff(oldSpecIR, newSpecIR),
    breaking: {
      any: anyBreaking,
      removed: {
        any: anyRemoval,
        operations: removedOperations,
        parameters: removedParameters,
        responses: removedResponses,
      },
      changed: {
        any: anyChange,
        parameters: changedParameters,
        responses: changedResponses,
      },
    },
    nonBreaking: {
      any: anyNonBreaking,
      added: {
        any: anyAddition,
        operations: addedOperations,
        parameters: addedParameters,
        responses: addedResponses,
      },
      deprecated: {
        any: anyDeprecation,
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
