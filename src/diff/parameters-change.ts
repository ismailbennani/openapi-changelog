import { BreakingChange, NonBreakingChange } from "./types";
import { OpenapiDocumentIntermediateRepresentation } from "../ir/openapi-document-ir";

export function extractParametersChange(
  oldDocument: OpenapiDocumentIntermediateRepresentation,
  newDocument: OpenapiDocumentIntermediateRepresentation,
): (ParameterBreakingChange | ParameterNonBreakingChange)[] {
  const result: (ParameterBreakingChange | ParameterNonBreakingChange)[] = [];

  for (const parameterInOldOperation of oldDocument.parameters) {
    const parameterInNewOperation = newDocument.parameters.find((p) => p.name === parameterInOldOperation.name);

    if (parameterInNewOperation === undefined) {
      continue;
    }

    if (parameterInNewOperation.type !== parameterInOldOperation.type) {
      result.push({
        name: parameterInOldOperation.name,
        type: "parameter-type-change",
        breaking: true,
      });
    }

    if (parameterInNewOperation.description !== parameterInOldOperation.description || parameterInNewOperation.examples !== parameterInOldOperation.examples) {
      result.push({
        name: parameterInOldOperation.name,
        type: "parameter-documentation-change",
        breaking: false,
      });
    }
  }

  return result;
}

interface ParameterChange {
  name: string;
}

export type ParameterBreakingChange = BreakingChange<"parameter-type-change" | "parameter-unclassified"> & ParameterChange;
export type ParameterNonBreakingChange = NonBreakingChange<"parameter-documentation-change"> & ParameterChange;
