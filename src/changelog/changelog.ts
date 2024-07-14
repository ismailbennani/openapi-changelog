import { OpenAPIV3 } from "openapi-types";
import {
  isAddition,
  isChange,
  isDeprecation,
  isRemoved,
  OpenapiChangelogDiff,
  OperationBreakingDiff,
  OperationNonBreakingDiff,
  ParameterBreakingChange,
  ParameterChange,
  ResponseBreakingChange,
  ResponseChange,
} from "../diff/types.js";
import { diff, OpenapiDiffOptions } from "../diff/diff.js";

export type OpenapiChangelogOptions = OpenapiDiffOptions & {
  template?: string;
  printWidth?: number;
};

export function changelog(specs: OpenAPIV3.Document[], options?: OpenapiChangelogOptions): string {
  const diffResult = diff(specs, options);
  return dumpDiffs(
    diffResult.map((d) => d.diff),
    options,
  );
}

function dumpDiffs(diffs: OpenapiChangelogDiff[], options?: OpenapiChangelogOptions): string {
  const result: string[] = [];

  for (const diff of diffs) {
    result.push(...dumpDiff(diff, options));
    result.push("");
    result.push("");
  }

  return result.join("\n");
}

function dumpDiff(diff: OpenapiChangelogDiff, options?: OpenapiChangelogOptions): string[] {
  const result = header(diff);

  if (diff.breaking) {
    result.push("");
    result.push("> BREAKING CHANGES");
    for (const breaking of diff.breaking) {
      result.push(...breakingChange(breaking, options).map((l) => `  ${l}`));
    }
  }

  if (diff.nonBreaking) {
    result.push("");
    result.push("> Changes");
    for (const nonBreaking of diff.nonBreaking) {
      result.push(...nonBreakingChange(nonBreaking, options).map((l) => `  ${l}`));
    }
  }

  return result;
}

function header(diff: OpenapiChangelogDiff, options?: OpenapiChangelogOptions): string[] {
  return [diff.version.new, "", ""];
}

function breakingChange(breaking: OperationBreakingDiff, options?: OpenapiChangelogOptions): string[] {
  if (isRemoved(breaking)) {
    return [`- Removed operation ${breaking.method.toUpperCase()} ${breaking.path}`];
  } else {
    const result = [`- In operation ${breaking.method.toUpperCase()} ${breaking.path}:`];

    for (const parameter of breaking.parameters) {
      result.push(...parameterBreakingChange(parameter, options).map((l) => `  ${l}`));
    }

    for (const response of breaking.responses) {
      result.push(...responseBreakingChange(response, options).map((l) => `  ${l}`));
    }

    return result;
  }
}

function parameterBreakingChange(parameter: ParameterBreakingChange, options?: OpenapiChangelogOptions): string[] {
  if (isRemoved(parameter)) {
    return [`- Removed parameter ${parameter.name}`];
  } else if (isChange(parameter)) {
    return [`- Changed parameter ${parameter.name}`];
  } else {
    return [];
  }
}

function responseBreakingChange(response: ResponseBreakingChange, options?: OpenapiChangelogOptions): string[] {
  if (isRemoved(response)) {
    return [`- Removed response ${response.code}`];
  } else if (isChange(response)) {
    return [`- Changed response ${response.code}`];
  } else {
    return [];
  }
}

function nonBreakingChange(breaking: OperationNonBreakingDiff, options?: OpenapiChangelogOptions): string[] {
  if (isAddition(breaking)) {
    const result: string[] = [`- Added operation ${breaking.method.toUpperCase()} ${breaking.path}`];

    if (breaking.new.summary || breaking.new.description || breaking.new.externalDocs) {
      result[0] += ":";

      if (breaking.new.summary) {
        result.push(
          "",
          ...block(breaking.new.summary, {
            maxLineLength: options?.printWidth ? options.printWidth - 2 : undefined,
            padding: 2,
          }),
        );
      }

      if (breaking.new.description) {
        result.push(
          "",
          ...block(breaking.new.description, {
            maxLineLength: options?.printWidth ? options.printWidth - 2 : undefined,
            padding: 2,
          }),
        );
      }

      if (breaking.new.externalDocs) {
        result.push(
          "",
          ...block(`Link: ${breaking.new.externalDocs}`, {
            maxLineLength: options?.printWidth ? options.printWidth - 2 : undefined,
            padding: 2,
          }),
        );
      }

      result.push("");
    }

    return result;
  } else {
    const result = [`- In operation ${breaking.method.toUpperCase()} ${breaking.path}:`];

    for (const parameter of breaking.parameters) {
      result.push(...parameterNonBreakingChange(parameter).map((l) => `  ${l}`));
    }

    for (const response of breaking.responses) {
      result.push(...responseNonBreakingChange(response).map((l) => `  ${l}`));
    }

    return result;
  }
}

function parameterNonBreakingChange(parameter: ParameterChange, options?: OpenapiChangelogOptions): string[] {
  if (isAddition(parameter)) {
    const result: string[] = [`- Added parameter ${parameter.name}`];

    if ((parameter.new as OpenAPIV3.ParameterObject).description || (parameter.new as OpenAPIV3.ParameterObject).example || (parameter.new as OpenAPIV3.ParameterObject).examples) {
      result[0] += ":";

      if ((parameter.new as OpenAPIV3.ParameterObject).description) {
        result.push(
          "",
          ...block((parameter.new as OpenAPIV3.ParameterObject).description!, {
            maxLineLength: options?.printWidth ? options.printWidth - 2 : undefined,
            padding: 2,
          }),
        );
      }

      if ((parameter.new as OpenAPIV3.ParameterObject).example) {
        result.push(
          "",
          ...block(`Example: ${(parameter.new as OpenAPIV3.ParameterObject).example}`, {
            maxLineLength: options?.printWidth ? options.printWidth - 2 : undefined,
            padding: 2,
          }),
        );
      }

      if ((parameter.new as OpenAPIV3.ParameterObject).examples) {
        result.push(
          "",
          "Examples:",
          ...block(
            (parameter.new as OpenAPIV3.ParameterObject).example.map((e: string) => `- ${e}`),
            {
              maxLineLength: options?.printWidth ? options.printWidth - 4 : undefined,
              padding: 4,
            },
          ),
        );
      }

      result.push("");
    }

    return result;
  } else if (isDeprecation(parameter)) {
    return [`- Deprecated parameter ${parameter.name}`];
  } else {
    return [];
  }
}

function responseNonBreakingChange(response: ResponseChange, options?: OpenapiChangelogOptions): string[] {
  if (isAddition(response)) {
    return [`- Added response ${response.code}`];
  } else {
    return [];
  }
}

function block(str: string, options: BlockOptions): string[] {
  const padding = options.padding && options.padding > 0 ? " ".repeat(options.padding) : "";
  const lineLength = options.maxLineLength ?? 9999;

  const lines = str.split("\n");
  if (lines.length == 1) {
    return options.dontPadFirstLine ? [str] : [padding + str];
  }

  const result: string[] = [];

  for (const line of lines) {
    let lastSplit = 0;
    let lastSpace = 0;

    for (let i = 0; i < line.length; i++) {
      switch (line[i]) {
        case "\n":
          split(i);
          break;
        case " ":
        case "\t":
          lastSpace = i;
          break;
      }

      if (i - lastSplit > lineLength) {
        split(lastSpace);
      }
    }

    if (lastSplit < line.length) {
      split(line.length);
    }

    function split(i: number) {
      const substr = line.substring(lastSplit, i);

      if (!options.dontPadFirstLine || result.length > 0) {
        result.push(padding + substr);
      } else {
        result.push(substr);
      }

      lastSplit = i + 1;
    }
  }

  return result;
}

interface BlockOptions {
  maxLineLength?: number | undefined;
  padding?: number | undefined;
  dontPadFirstLine?: boolean | undefined;
}
