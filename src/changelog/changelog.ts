import { OpenapiChangelogDiff } from "../diff/types";
import Handlebars from "handlebars";
import { diff } from "../diff/diff.js";
import { OpenAPIV3 } from "openapi-types";
import * as fs from "fs";

export interface OpenapiChangelogOptions {
  template?: string;
}

export function changelog(specs: OpenAPIV3.Document[], options?: OpenapiChangelogOptions): string {
  const diffResult = diff(...specs);
  return changelogInternal(
    diffResult.map((d) => d.diff),
    options,
  );
}

function changelogInternal(diffs: OpenapiChangelogDiff[], options?: OpenapiChangelogOptions): string {
  Handlebars.registerHelper("upper", function (str: string) {
    return str.toUpperCase();
  });

  Handlebars.registerHelper("pad", function (str: string, amount: number) {
    return str.length >= amount ? str : " ".repeat(amount - str.length) + str;
  });

  const templatePath = options?.template ?? `${import.meta.dirname}/templates/simple.hbs`;
  const simpleTemplate = fs.readFileSync(templatePath, "utf8");
  const template = Handlebars.compile(simpleTemplate, { noEscape: true });

  let result = "";
  for (const diff of diffs) {
    result += `${template(diff)}\n\n`;
  }

  return result;
}
