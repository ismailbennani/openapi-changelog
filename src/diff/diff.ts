import { HttpMethod, OpenapiChangelogDiff, OperationBreakingChange, OperationBreakingDiff, OperationChanged, OperationNonBreakingDiff } from "./types.js";
import { OpenAPIV3 } from "openapi-types";
import * as util from "util";
import winston from "winston";
import { extractIntermediateRepresentation } from "./intermediate-representation.js";
import { extractVersionDiff } from "./version-diff.js";
import { extractOperationsDiff, OperationDiff } from "./operations-diff.js";
import { extractParametersDiff, ParameterDiff } from "./parameters-diff.js";
import { extractResponsesDiff, ResponseDiff } from "./responses-diff.js";
import semver from "semver";

export function diff(...specs: OpenAPIV3.Document[]): readonly { old: OpenAPIV3.Document; new: OpenAPIV3.Document; diff: OpenapiChangelogDiff }[] {
  if (specs.length < 2) {
    throw new Error("Expected at least two specifications");
  }

  winston.info("Computing differences...");

  const specIRs = [];
  for (const spec of specs) {
    winston.info(`Extracting information from ${spec.info.title} v${spec.info.version}...`);
    const specIR = extractIntermediateRepresentation(spec);
    specIRs.push(specIR);

    winston.debug(`== SPEC INTERMEDIATE REPRESENTATION: ${spec.info.title} v${spec.info.version}`);
    winston.debug(util.inspect(specIR, false, null, true));
    winston.debug("");
  }

  specIRs.sort((a, b) => -semver.compareBuild(a.version, b.version, { loose: true }));

  winston.info("Found specifications:");
  for (const spec of specIRs) {
    winston.info(`\t ${spec.title} v${spec.version}`);
  }

  const result: { old: OpenAPIV3.Document; new: OpenAPIV3.Document; diff: OpenapiChangelogDiff }[] = [];
  for (let i = 0; i < specIRs.length - 1; i++) {
    const oldSpec = specs[i];
    const newSpec = specs[i + 1];
    const oldSpecIR = specIRs[i];
    const newSpecIR = specIRs[i + 1];

    winston.debug(`== DIFFS ${oldSpec.info.title} v${oldSpec.info.version} -> ${newSpec.info.title} v${newSpec.info.version}`);

    const versionDiffs = extractVersionDiff(oldSpecIR, newSpecIR);

    winston.debug("==== VERSION DIFFS");
    winston.debug(util.inspect(versionDiffs, false, null, true));
    winston.debug("");

    const operationDiffs = extractOperationsDiff(oldSpecIR, newSpecIR);

    winston.debug("==== OPERATION DIFFS");
    winston.debug(util.inspect(operationDiffs, false, null, true));
    winston.debug("");

    const parameterDiffs = extractParametersDiff(oldSpecIR, newSpecIR);

    winston.debug("==== PARAMETER DIFFS");
    winston.debug(util.inspect(parameterDiffs, false, null, true));
    winston.debug("");

    const responseDiffs = extractResponsesDiff(oldSpecIR, newSpecIR);

    winston.debug("==== RESPONSE DIFFS");
    winston.debug(util.inspect(responseDiffs, false, null, true));
    winston.debug("");

    const diffs = transformDiffs(operationDiffs, parameterDiffs, responseDiffs);

    result.push({
      old: oldSpec,
      new: newSpec,
      diff: {
        version: versionDiffs,
        breaking: diffs.breaking,
        nonBreaking: diffs.nonBreaking,
      },
    });
  }

  return result;
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
        breaking: false,
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
        breaking: false,
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
        breaking: true,
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
        breaking: false,
        added: true,
        new: parameterDiff.new,
      });
    }

    if (parameterDiff.changed) {
      const diff = getOrCreateBreakingOperationChange(diffs, parameterDiff.path, parameterDiff.method, parameterDiff.oldOperation, parameterDiff.newOperation);
      diff.parameters.push({
        name: parameterDiff.name,
        breaking: true,
        changed: true,
        old: parameterDiff.old,
        new: parameterDiff.new,
      });
    }

    if (parameterDiff.deprecated) {
      const diff = getOrCreateOperationChange(diffs, parameterDiff.path, parameterDiff.method, parameterDiff.oldOperation, parameterDiff.newOperation);
      diff.parameters.push({
        name: parameterDiff.name,
        breaking: false,
        changed: true,
        deprecated: true,
        old: parameterDiff.old,
        new: parameterDiff.new,
      });
    }

    if (parameterDiff.removed) {
      const diff = getOrCreateBreakingOperationChange(diffs, parameterDiff.path, parameterDiff.method, parameterDiff.oldOperation, parameterDiff.newOperation);
      diff.parameters.push({
        name: parameterDiff.name,
        breaking: true,
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
        breaking: false,
        added: true,
        new: responseDiff.new,
      });
    }

    if (responseDiff.changed) {
      const diff = getOrCreateBreakingOperationChange(diffs, responseDiff.path, responseDiff.method, responseDiff.oldOperation, responseDiff.newOperation);
      diff.responses.push({
        code: responseDiff.code,
        breaking: true,
        changed: true,
        old: responseDiff.old,
        new: responseDiff.new,
      });
    }

    if (responseDiff.removed) {
      const diff = getOrCreateBreakingOperationChange(diffs, responseDiff.path, responseDiff.method, responseDiff.oldOperation, responseDiff.newOperation);
      diff.responses.push({
        code: responseDiff.code,
        breaking: true,
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
    diffs[path][method].nonBreaking = {
      path,
      method,
      breaking: false,
      changed: true,
      parameters: [],
      responses: [],
      old: oldOperation,
      new: newOperation,
    };
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
    diffs[path][method].breaking = {
      path,
      method,
      breaking: true,
      changed: true,
      parameters: [],
      responses: [],
      old: oldOperation,
      new: newOperation,
    };
  }

  return diffs[path][method].breaking as OperationBreakingChange;
}
