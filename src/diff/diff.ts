import { OpenAPIV3 } from "openapi-types";
import * as util from "util";
import winston from "winston";
import semver from "semver";
import { HttpMethod, OpenapiChangelogDiff, OperationBreakingChange, OperationBreakingDiff, OperationChanged, OperationNonBreakingDiff } from "./types";
import { extractVersionDiff } from "./version-diff";
import { extractOperationsDiff, OperationDiff } from "./operations-diff";
import {
  extractOperationParametersDiff,
  ParameterAddition,
  ParameterDeprecation,
  ParameterDiff,
  ParameterRemoval,
  UnclassifiedParameterBreakingChange,
} from "./operation-parameters-diff";
import { extractOperationResponsesDiff, ResponseDiff } from "./operation-responses-diff";
import { extractIntermediateRepresentation } from "../ir/openapi-document-ir";

export interface OpenapiDiffOptions {
  limit?: number;
}

export function diff(specs: OpenAPIV3.Document[], options?: OpenapiDiffOptions): readonly { old: OpenAPIV3.Document; new: OpenAPIV3.Document; diff: OpenapiChangelogDiff }[] {
  if (specs.length < 2) {
    throw new Error("Expected at least two specifications");
  }

  specs.sort((a, b) => -semver.compareBuild(a.info.version, b.info.version, { loose: true }));

  if (options?.limit !== undefined && specs.length > options.limit) {
    winston.info(`Changelog limit set to ${options.limit}, dropping last ${specs.length - options.limit} versions.`);
    specs = specs.slice(0, options.limit);
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

    const versionDiffs = extractVersionDiff(oldSpecIR, newSpecIR);
    const operationDiffs = extractOperationsDiff({ spec: oldSpec, ir: oldSpecIR }, { spec: newSpec, ir: newSpecIR });
    const parameterDiffs = extractOperationParametersDiff({ spec: oldSpec, ir: oldSpecIR }, { spec: newSpec, ir: newSpecIR });
    const responseDiffs = extractOperationResponsesDiff({ spec: oldSpec, ir: oldSpecIR }, { spec: newSpec, ir: newSpecIR });

    const transformed = transformDiffs(operationDiffs, parameterDiffs, responseDiffs);

    result.push({
      old: oldSpec,
      new: newSpec,
      diff: {
        version: versionDiffs,
        breaking: transformed.breaking,
        nonBreaking: transformed.nonBreaking,
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
    if (!(parameterDiff as ParameterAddition).addition) {
      const diff = getOrCreateOperationChange(diffs, parameterDiff.path, parameterDiff.method, parameterDiff.oldOperation, parameterDiff.newOperation);
      diff.parameters.push({
        name: parameterDiff.name,
        breaking: false,
        added: true,
        new: undefined!,
      });
    }

    if ((parameterDiff as UnclassifiedParameterBreakingChange).breakingChange) {
      const diff = getOrCreateBreakingOperationChange(diffs, parameterDiff.path, parameterDiff.method, parameterDiff.oldOperation, parameterDiff.newOperation);
      diff.parameters.push({
        name: parameterDiff.name,
        breaking: true,
        changed: true,
        old: undefined!,
        new: undefined!,
      });
    }

    if ((parameterDiff as ParameterDeprecation).deprecated) {
      const diff = getOrCreateOperationChange(diffs, parameterDiff.path, parameterDiff.method, parameterDiff.oldOperation, parameterDiff.newOperation);
      diff.parameters.push({
        name: parameterDiff.name,
        breaking: false,
        changed: true,
        deprecated: true,
        old: undefined!,
        new: undefined!,
      });
    }

    if ((parameterDiff as ParameterRemoval).removed) {
      const diff = getOrCreateBreakingOperationChange(diffs, parameterDiff.path, parameterDiff.method, parameterDiff.oldOperation, parameterDiff.newOperation);
      diff.parameters.push({
        name: parameterDiff.name,
        breaking: true,
        removed: true,
        old: undefined!,
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
