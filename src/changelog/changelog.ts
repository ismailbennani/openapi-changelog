import { OpenapiChangelogDiff } from "../diff/types";
import Handlebars from "handlebars";
import { diff } from "../diff/diff.js";
import { OpenAPIV3 } from "openapi-types";
import * as fs from "fs";

export function changelog(oldSpec: OpenAPIV3.Document, newSpec: OpenAPIV3.Document): string {
  const diffResult = diff(oldSpec, newSpec);
  return changelogInternal(diffResult);
}

function changelogInternal(diff: OpenapiChangelogDiff): string {
  Handlebars.registerHelper("upper", function (str: string) {
    return str.toUpperCase();
  });

  Handlebars.registerHelper("pad", function (str: string, amount: number) {
    return str.length >= amount ? str : " ".repeat(amount - str.length) + str;
  });

  const simpleTemplate = fs.readFileSync(`${__dirname}/templates/simple.hbs`, "utf8");
  const template = Handlebars.compile(simpleTemplate, { noEscape: true });
  return template(diff);
}
