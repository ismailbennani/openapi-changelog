import fastDiff from "fast-diff";

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

export interface BlockOptions {
  maxLineLength?: number | undefined;
  padding?: number | undefined;
  dontPadFirstLine?: boolean | undefined;
}

export function block(str: string[] | string, options: BlockOptions): string[] {
  const linesArray = Array.isArray(str) ? str : [str];
  const lines: string[] = linesArray.flatMap((s) => s.split("\n"));

  const result: string[] = [];

  const maxLineLength = options.maxLineLength ?? 9999;
  let nextLineLength = options.padding === undefined ? maxLineLength : options.dontPadFirstLine === true ? maxLineLength : maxLineLength - options.padding;

  for (const line of lines) {
    if (line === "") {
      result.push("");
      continue;
    }

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

      if (i - lastSplit > nextLineLength) {
        split(lastSpace);
      }
    }

    if (lastSplit < line.length) {
      split(line.length);
    }

    function split(i: number): void {
      const substr = line.substring(lastSplit, i);
      result.push(substr);
      lastSplit = i + 1;

      nextLineLength = options.padding === undefined ? maxLineLength : maxLineLength - options.padding;
    }
  }

  if (options.padding !== undefined) {
    return pad(result, { padding: options.padding, dontPadFirstLine: options.dontPadFirstLine });
  }

  return result;
}

export function diffStrings(str1: string, str2: string): string {
  const str1Lines = str1.split("\n");
  const str2Lines = str2.split("\n");

  let result = "";

  const n = str1Lines.length < str2Lines.length ? str1Lines.length : str2Lines.length;
  for (let i = 0; i < n; i++) {
    const diff = fastDiff(str1Lines[i], str2Lines[i]);

    if (diff.length >= 10) {
      result += `~~${str1Lines[i]}~~\n**${str2Lines[i]}**\n`;
    } else {
      result += `${diff
        .map(([op, str]) => {
          switch (op) {
            case fastDiff.EQUAL:
              return str;
            case fastDiff.INSERT:
              return `**${str}**`;
            case fastDiff.DELETE:
              return `~~${str}~~`;
          }
        })
        .join("")}\n`;
    }
  }

  for (let i = n; i < str1Lines.length; i++) {
    result += `~~${str1Lines[i]}~~\n`;
  }

  for (let i = n; i < str2Lines.length; i++) {
    result += `**${str2Lines[i]}**\n`;
  }

  return result;
}
