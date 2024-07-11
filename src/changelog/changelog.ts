import ejs from "ejs";
import { DiffResponse } from "../diff/types";
import fs from "node:fs/promises";
import path from "node:path";

export async function changelog(diff: DiffResponse): Promise<string> {
  const templatePath = path.join(import.meta.dirname, "templates", "template.ejs");
  const templateContent = await fs.readFile(templatePath, { encoding: "utf8" });
  return ejs.render(templateContent, diff);
}
