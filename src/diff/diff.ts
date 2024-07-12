import { readFile } from "node:fs/promises";
import { DiffResponse, HttpMethod, OperationBreakingChange, OperationBreakingDiff, OperationChanged, OperationNonBreakingDiff } from "./types.js";
import { OpenAPIV3 } from "openapi-types";
import * as util from "node:util";
import winston from "winston";
import { extractIntermediateRepresentation } from "./intermediate-representation.js";
import { extractVersionDiff } from "./version-diff.js";
import { extractOperationsDiff, OperationDiff } from "./operations-diff.js";
import { extractParametersDiff, ParameterDiff } from "./parameters-diff.js";
import { extractResponsesDiff, ResponseDiff } from "./responses-diff.js";

export async function diff(oldOpenApiSpec: string, newOpenApiSpec: string): Promise<Readonly<DiffResponse>> {
  const oldSpec = await readOpenApiSpecification(oldOpenApiSpec);
  const newSpec = await readOpenApiSpecification(newOpenApiSpec);

  const oldSpecIR = extractIntermediateRepresentation(oldSpec);
  const newSpecIR = extractIntermediateRepresentation(newSpec);

  winston.debug("==== OLD SPEC");
  winston.debug(util.inspect(oldSpecIR, false, null, true));
  winston.debug("");

  winston.debug("==== NEW SPEC");
  winston.debug(util.inspect(newSpecIR, false, null, true));
  winston.debug("");

  const operationDiffs = extractOperationsDiff(oldSpecIR, newSpecIR);
  const parameterDiffs = extractParametersDiff(oldSpecIR, newSpecIR);
  const responseDiffs = extractResponsesDiff(oldSpecIR, newSpecIR);

  winston.debug("==== OPERATION DIFFS");
  winston.debug(util.inspect(operationDiffs, false, null, true));
  winston.debug("");

  winston.debug("==== PARAMETER DIFFS");
  winston.debug(util.inspect(parameterDiffs, false, null, true));
  winston.debug("");

  winston.debug("==== RESPONSE DIFFS");
  winston.debug(util.inspect(responseDiffs, false, null, true));
  winston.debug("");

  const diffs = transformDiffs(operationDiffs, parameterDiffs, responseDiffs);

  return {
    version: extractVersionDiff(oldSpecIR, newSpecIR),
    breaking: diffs.breaking,
    nonBreaking: diffs.nonBreaking,
  };
}

async function readOpenApiSpecification(path: string): Promise<OpenAPIV3.Document> {
  const stringContent = await readFile(path, "utf8");
  return JSON.parse(stringContent) as OpenAPIV3.Document;
}

function transformDiffs(
  operationDiffs: OperationDiff[],
  parameterDiffs: ParameterDiff[],
  responseDiffs: ResponseDiff[],
): {
  breaking: OperationBreakingDiff[];
  nonBreaking: OperationNonBreakingDiff[];
} {
  const diffs: Record<
    string,
    Record<
      string,
      {
        breaking?: OperationBreakingDiff;
        nonBreaking?: OperationNonBreakingDiff;
      }
    >
  > = {};

  for (const operationDiff of operationDiffs) {
    if (!operationDiff.added && !operationDiff.deprecated && !operationDiff.removed) {
      continue;
    }

    diffs[operationDiff.path] = {};
    diffs[operationDiff.path][operationDiff.method] = {};

    if (operationDiff.added) {
      diffs[operationDiff.path][operationDiff.method].nonBreaking = {
        path: operationDiff.path,
        method: operationDiff.method,
        added: true,
        new: operationDiff.new,
      };
    }

    if (operationDiff.deprecated) {
      diffs[operationDiff.path][operationDiff.method].nonBreaking = {
        path: operationDiff.path,
        method: operationDiff.method,
        changed: true,
        deprecated: true,
        parameters: [],
        responses: [],
        old: operationDiff.old,
        new: operationDiff.new,
      };
    }

    if (operationDiff.removed) {
      diffs[operationDiff.path][operationDiff.method].breaking = {
        path: operationDiff.path,
        method: operationDiff.method,
        removed: true,
        old: operationDiff.old,
      };
    }
  }

  for (const parameterDiff of parameterDiffs) {
    if (parameterDiff.added) {
      const diff = getOrCreateOperationChange(diffs, parameterDiff.path, parameterDiff.method, parameterDiff.oldOperation, parameterDiff.newOperation);
      diff.parameters.push({
        name: parameterDiff.name,
        added: true,
        new: parameterDiff.new,
      });
    }

    if (parameterDiff.changed) {
      const diff = getOrCreateBreakingOperationChange(diffs, parameterDiff.path, parameterDiff.method, parameterDiff.oldOperation, parameterDiff.newOperation);
      diff.parameters.push({
        name: parameterDiff.name,
        changed: true,
        old: parameterDiff.old,
        new: parameterDiff.new,
      });
    }

    if (parameterDiff.deprecated) {
      const diff = getOrCreateOperationChange(diffs, parameterDiff.path, parameterDiff.method, parameterDiff.oldOperation, parameterDiff.newOperation);
      diff.parameters.push({
        name: parameterDiff.name,
        deprecated: true,
        old: parameterDiff.old,
        new: parameterDiff.new,
      });
    }

    if (parameterDiff.removed) {
      const diff = getOrCreateBreakingOperationChange(diffs, parameterDiff.path, parameterDiff.method, parameterDiff.oldOperation, parameterDiff.newOperation);
      diff.parameters.push({
        name: parameterDiff.name,
        removed: true,
        old: parameterDiff.old,
      });
    }
  }

  for (const responseDiff of responseDiffs) {
    if (responseDiff.added) {
      const diff = getOrCreateOperationChange(diffs, responseDiff.path, responseDiff.method, responseDiff.oldOperation, responseDiff.newOperation);
      diff.responses.push({
        code: responseDiff.code,
        added: true,
        new: responseDiff.new,
      });
    }

    if (responseDiff.changed) {
      const diff = getOrCreateBreakingOperationChange(diffs, responseDiff.path, responseDiff.method, responseDiff.oldOperation, responseDiff.newOperation);
      diff.responses.push({
        code: responseDiff.code,
        changed: true,
        old: responseDiff.old,
        new: responseDiff.new,
      });
    }

    if (responseDiff.removed) {
      const diff = getOrCreateBreakingOperationChange(diffs, responseDiff.path, responseDiff.method, responseDiff.oldOperation, responseDiff.newOperation);
      diff.responses.push({
        code: responseDiff.code,
        removed: true,
        old: responseDiff.old,
      });
    }
  }

  const result: { breaking: OperationBreakingDiff[]; nonBreaking: OperationNonBreakingDiff[] } = {
    breaking: [],
    nonBreaking: [],
  };

  for (const diffEntry of Object.values(diffs).flatMap(
    (
      d: Record<
        string,
        {
          breaking?: OperationBreakingDiff;
          nonBreaking?: OperationNonBreakingDiff;
        }
      >,
    ) => Object.values(d),
  )) {
    if (diffEntry.breaking) {
      result.breaking.push(diffEntry.breaking);
    }

    if (diffEntry.nonBreaking) {
      result.nonBreaking.push(diffEntry.nonBreaking);
    }
  }

  return result;
}

function getOrCreateOperationChange(
  diffs: Record<
    string,
    Record<
      string,
      {
        breaking?: OperationBreakingDiff;
        nonBreaking?: OperationNonBreakingDiff;
      }
    >
  >,
  path: string,
  method: HttpMethod,
  oldOperation: OpenAPIV3.OperationObject,
  newOperation: OpenAPIV3.OperationObject,
): OperationChanged {
  if (!(path in diffs)) {
    diffs[path] = {};
  }

  if (!(method in diffs[path])) {
    diffs[path][method] = {};
  }

  if (!diffs[path][method].nonBreaking) {
    diffs[path][method].nonBreaking = { path, method, changed: true, deprecated: false, parameters: [], responses: [], old: oldOperation, new: newOperation };
  }

  return diffs[path][method].nonBreaking as OperationChanged;
}

function getOrCreateBreakingOperationChange(
  diffs: Record<
    string,
    Record<
      string,
      {
        breaking?: OperationBreakingDiff;
        nonBreaking?: OperationNonBreakingDiff;
      }
    >
  >,
  path: string,
  method: HttpMethod,
  oldOperation: OpenAPIV3.OperationObject,
  newOperation: OpenAPIV3.OperationObject,
): OperationBreakingChange {
  if (!(path in diffs)) {
    diffs[path] = {};
  }

  if (!(method in diffs[path])) {
    diffs[path][method] = {};
  }

  if (!diffs[path][method].breaking) {
    diffs[path][method].breaking = { path, method, changed: true, parameters: [], responses: [], old: oldOperation, new: newOperation };
  }

  return diffs[path][method].breaking as OperationBreakingChange;
}
