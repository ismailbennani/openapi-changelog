import { DiffResponse } from "../diff/types";
import path from "node:path";
import fs from "node:fs/promises";
import Handlebars from "handlebars";
import { diff } from "../diff/diff.js";
import { OpenAPIV3 } from "openapi-types";

export function changelog(oldSpec: OpenAPIV3.Document, newSpec: OpenAPIV3.Document): Promise<string> {
  const diffResult = diff(oldSpec, newSpec);
  return changelogInternal(diffResult);
}

async function changelogInternal(diff: DiffResponse): Promise<string> {
  const templatePath = path.join(import.meta.dirname, "templates", "simple.hbs");
  const templateContent = await fs.readFile(templatePath, "utf8");

  Handlebars.registerHelper("upper", function (str: string) {
    return str.toUpperCase();
  });

  Handlebars.registerHelper("pad", function (str: string, amount: number) {
    return str.length >= amount ? str : " ".repeat(amount - str.length) + str;
  });

  const template = Handlebars.compile(templateContent, { noEscape: true });
  return template(diff);
}
