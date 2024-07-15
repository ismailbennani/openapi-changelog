import * as Diff from "diff";
import wrap from "word-wrap";

export interface PadOptions {
  padding: number;
  dontPadFirstLine?: boolean | undefined;
}

export function pad(str: string[] | string, padding: number): string[];
export function pad(str: string[] | string, options: PadOptions): string[];
export function pad(str: string[] | string, options: PadOptions | number): string[] {
  const padding = typeof options === "number" ? options : options.padding;
  const dontPadFirstLine = typeof options === "number" ? false : options.dontPadFirstLine;

  const prefix = padding > 0 ? " ".repeat(padding) : "";

  const linesArray = Array.isArray(str) ? str.flatMap((s) => s.split("\n")) : str.split("\n");
  return linesArray.map((s, i) => (dontPadFirstLine === false || i > 0 ? prefix + s : s));
}

export function block(str: string[] | string, width: number, padding?: number | undefined): string[] {
  const lines = (Array.isArray(str) ? str : [str]).flatMap((s) => s.split("\n"));
  const wrappedLines = lines.map((l) => wrap(l, { width, trim: true, indent: padding === undefined ? undefined : " ".repeat(padding) }));
  return wrappedLines.flatMap((s) => s.split("\n"));
}

export function diffStrings(str1: string, str2: string): string {
  const differences = Diff.diffLines(str1, str2, { newlineIsToken: true });

  const result: string[] = [];

  for (const diff of differences) {
    const line = diff.value === "" ? "_(newline)_" : diff.value.endsWith("\n") ? diff.value.substring(0, diff.value.length - 1) : diff.value;

    if (diff.added === true) {
      result.push(`**${line}**`);
    } else if (diff.removed === true) {
      result.push(`~~${line}~~`);
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}
