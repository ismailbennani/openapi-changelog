import fs from "fs";

export function ensureDir(path: string): void {
  try {
    fs.mkdirSync(path);
  } catch (e) {
    if (e === undefined || (e as { code: string }).code !== "EEXIST") {
      throw e;
    }
  }
}
