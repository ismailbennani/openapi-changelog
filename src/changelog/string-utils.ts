export function block(str: string[], options: BlockOptions): string[] {
  const padding = options.padding !== undefined && options.padding > 0 ? " ".repeat(options.padding) : "";
  const lineLength = options.maxLineLength ?? 9999;

  const lines = str.flatMap((s) => s.split("\n"));
  if (lines.length === 1) {
    return options.dontPadFirstLine !== undefined ? lines : [padding + lines[0]];
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

    function split(i: number): void {
      const substr = line.substring(lastSplit, i);

      if (options.dontPadFirstLine === false || result.length > 0) {
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
