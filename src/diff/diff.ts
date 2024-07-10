import { readFile } from "node:fs/promises";
import { DiffResponse } from "./types.js";
import { extractVersionDiff } from "./version-diff.js";
import { extractRemovedOperations } from "./removed-operations-diff.js";
import { OpenAPIV3 } from "openapi-types";
import { extractRemovedParameters } from "./removed-parameters-diff.js";
import { extractRemovedResponses } from "./removed-responses-diff.js";

export async function diff(oldOpenApiSpec: string, newOpenApiSpec: string): Promise<Readonly<DiffResponse>> {
  const oldSpec = await readOpenApiSpecification(oldOpenApiSpec);
  const newSpec = await readOpenApiSpecification(newOpenApiSpec);

  return {
    version: extractVersionDiff(oldSpec, newSpec),
    breaking: {
      removed: {
        operations: extractRemovedOperations(oldSpec, newSpec),
        parameters: extractRemovedParameters(oldSpec, newSpec),
        responses: extractRemovedResponses(oldSpec, newSpec),
      },
      changed: {
        parameters: [],
        responses: [],
      },
    },
    nonBreaking: {
      added: {
        operations: [],
        parameters: [],
        responses: [],
      },
      deprecated: {
        operations: [],
        parameters: [],
        responses: [],
      },
    },
  };
}

async function readOpenApiSpecification(path: string): Promise<OpenAPIV3.Document> {
  const stringContent = await readFile(path, "utf8");
  return JSON.parse(stringContent) as OpenAPIV3.Document;
}
