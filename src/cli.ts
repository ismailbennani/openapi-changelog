#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { ArgumentsCamelCase } from "yargs";
import winston, { format } from "winston";
import fs, { readFile } from "node:fs/promises";
import { diff as diffFn } from "./diff/diff.js";
import { changelog as changelogFn } from "./changelog/changelog.js";
import { OpenAPIV3 } from "openapi-types";
import { load } from "js-yaml";
import { inspect } from "util";

const yargsInstance = yargs(hideBin(process.argv));
const terminalWidth = yargsInstance.terminalWidth();
const maxWidth = 140;

void yargsInstance
  .wrap(terminalWidth > maxWidth ? maxWidth : terminalWidth)
  .scriptName("openapi-changelog")
  .usage(
    "$0 <old_openapi_spec> <new_openapi_spec> [options]",
    "Compute the changelog between the old and the new openapi specifications",
    (yargs) =>
      yargs
        .positional("old_openapi_spec", {
          describe: "Path or url to the old openapi specification",
          type: "string",
          demandOption: true,
          normalize: true,
        })
        .positional("new_openapi_spec", {
          describe: "Path or url to the new openapi specification",
          type: "string",
          demandOption: true,
          normalize: true,
        })
        .boolean("diff")
        .describe("diff", "Output a JSON containing the differences between the two specifications instead of a nicely formatted changelog")
        .group("diff", "Diff options")
        .string("output")
        .alias("o", "output")
        .describe("output", "Write the result to the corresponding file instead of stdout")
        .group("output", "Changelog options")
        .boolean("verbose")
        .describe("verbose", "Log stuff")
        .group("verbose", "Common options")
        .string("debug")
        .describe("debug", "Log debug information to log file")
        .group("debug", "Common options")
        .help("h")
        .alias("h", "help")
        .group("help", "Common options")
        .group("version", "Common options")
        .middleware([verboseMiddleware]),
    async (args) => {
      winston.info(`Computing diff\n\tfrom:\t ${args.old_openapi_spec}\n\tto:\t ${args.new_openapi_spec}`);

      const oldSpec = await parseOpenapiSpecFile(args.old_openapi_spec);
      const newSpec = await parseOpenapiSpecFile(args.new_openapi_spec);

      let result: string;
      if (args.diff === true) {
        const differences = diffFn(oldSpec, newSpec);
        result = JSON.stringify(differences, null, 2);
      } else {
        result = changelogFn(oldSpec, newSpec);
      }

      if (args.output !== undefined) {
        winston.info(`Writing result to ${args.output}`);
        await fs.writeFile(args.output, result, { encoding: "utf8", flag: "w" });
        winston.info(`Done.`);
      } else {
        winston.info(`Writing output below\n`);
        process.stdout.write(result);
      }
    },
  )
  .parse();

function verboseMiddleware(args: ArgumentsCamelCase<{ output: string | undefined; verbose: boolean | undefined; debug: string | undefined }>): void {
  const consoleTransport = new winston.transports.Console({
    format: format.combine(format.colorize(), format.simple()),
    // If output is not set, the output is stdout so we need to log everything to stderr instead of stdout
    stderrLevels: args.output === undefined ? ["error", "warn", "info"] : ["error", "warn"],
    level: "info",
  });
  winston.add(consoleTransport);

  if (args.verbose !== true) {
    consoleTransport.silent = true;
  }

  if (args.debug !== undefined) {
    const fileName = args.debug === "" ? "debug.log" : args.debug;
    winston.info(`Verbose: writing debug logs to ${fileName}`);
    winston.add(new winston.transports.File({ filename: fileName, format: format.combine(format.uncolorize(), format.simple()), level: "debug", options: { flags: "w" } }));
    winston.debug(`ARGS: ${inspect(args, false, null, true)}`);
  }
}

async function parseOpenapiSpecFile(path: string): Promise<OpenAPIV3.Document> {
  if (path.endsWith(".yml") || path.endsWith(".yaml")) {
    const specContent = await readFile(path, "utf8");
    return load(specContent) as OpenAPIV3.Document;
  }

  if (path.endsWith(".json")) {
    const specContent = await readFile(path, "utf8");
    return JSON.parse(specContent) as OpenAPIV3.Document;
  }

  throw new Error("Invalid file format, expected JSON or YAML");
}
