import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";
import { OpenapiChangelogOptions } from "./changelog";
import { OperationParameterBreakingChange, OperationParameterNonBreakingChange } from "../diff/operation-parameters-change";
import { block, diffStrings } from "./string-utils";
import { OperationParameterIntermediateRepresentation } from "../ir/operation-parameters-ir";

export function operationParameterBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: OperationParameterBreakingChange,
  options: OpenapiChangelogOptions,
): string[] {
  const operationInOldDocument = oldDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  const operationInNewDocument = newDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  if (operationInOldDocument === undefined || operationInNewDocument === undefined) {
    return [];
  }

  const parameterInOldDocument = operationInOldDocument.parameters.find((p) => p.name === change.name);
  const parameterInNewDocument = operationInNewDocument.parameters.find((p) => p.name === change.name);

  switch (change.type) {
    case "operation-parameter-removal":
      return [`- Removed parameter ${change.name}`];
    case "operation-parameter-type-change": {
      const result = [`- Changed type of parameter ${change.name}`];

      if (options.detailed === true && parameterInOldDocument !== undefined && parameterInNewDocument !== undefined) {
        result.push(...parameterTypeChangeDetails(parameterInOldDocument, parameterInNewDocument));
      }

      return result;
    }
    case "operation-parameter-unclassified":
      return [`- Changed parameter ${change.name}`];
  }
}

export function operationParameterNonBreakingChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
  change: OperationParameterNonBreakingChange,
  options: OpenapiChangelogOptions,
): string[] {
  const blockOptions = {
    maxLineLength: options.printWidth,
    padding: 2,
    dontPadFirstLine: true,
  };

  const operationInOldDocument = oldDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  const operationInNewDocument = newDocument.operations.find((p) => p.path === change.path && p.method === change.method);
  if (operationInOldDocument === undefined || operationInNewDocument === undefined) {
    return [];
  }

  const parameterInOldDocument = operationInOldDocument.parameters.find((p) => p.name === change.name);
  const parameterInNewDocument = operationInNewDocument.parameters.find((p) => p.name === change.name);

  switch (change.type) {
    case "operation-parameter-addition": {
      let header = `- Added parameter ${change.name}`;
      if (parameterInNewDocument !== undefined) {
        header += ` of type ${parameterInNewDocument.type}`;
      }

      const result = [header];

      if (options.detailed === true && parameterInNewDocument !== undefined) {
        result.push("", ...parameterAdditionDetails(parameterInNewDocument));
      }

      return block(result, blockOptions);
    }
    case "operation-parameter-deprecation":
      return [`- Deprecated parameter ${change.name}`];
    case "operation-parameter-documentation-change": {
      const result = [`- Changed documentation of parameter ${change.name}`];

      if (options.detailed === true && parameterInOldDocument !== undefined && parameterInNewDocument !== undefined) {
        const details = parameterDocumentationDetails(parameterInOldDocument, parameterInNewDocument);
        if (details !== undefined) {
          result.push("", details);
        }
      }

      return block(result, blockOptions);
    }
  }
}

function parameterTypeChangeDetails(oldParameter: OperationParameterIntermediateRepresentation, newParameter: OperationParameterIntermediateRepresentation): string[] {
  return [`Old type: ${oldParameter.type}`, `New type: ${newParameter.type}`];
}

function parameterAdditionDetails(newParameter: OperationParameterIntermediateRepresentation): string[] {
  const result: string[] = [];

  if (newParameter.description !== undefined) {
    result.push(newParameter.description);
  }

  return result;
}

function parameterDocumentationDetails(oldParameter: OperationParameterIntermediateRepresentation, newParameter: OperationParameterIntermediateRepresentation): string | undefined {
  if (oldParameter.description !== undefined && newParameter.description !== undefined) {
    return diffStrings(oldParameter.description, newParameter.description);
  }

  if (newParameter.description !== undefined) {
    return newParameter.description;
  }

  return undefined;
}
