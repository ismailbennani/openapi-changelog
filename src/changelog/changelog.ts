import { DiffResponse } from "../diff/types";
import path from "node:path";
import fs from "node:fs/promises";
import Handlebars from "handlebars";

export async function changelog(diff: DiffResponse): Promise<string> {
  const templatePath = path.join(import.meta.dirname, "templates", "simple.hbs");
  const templateContent = await fs.readFile(templatePath, "utf8");

  Handlebars.registerHelper("upper", function (str: string) {
    return str.toUpperCase();
  });

  const template = Handlebars.compile(templateContent, { noEscape: true });
  return template(diff);
}
