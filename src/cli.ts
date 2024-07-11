#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { ArgumentsCamelCase } from "yargs";
import winston, { format } from "winston";
import * as util from "node:util";
import fs from "node:fs/promises";
import { diff as diffFn } from "./diff/diff.js";
import { changelog as changelogFn } from "./changelog/changelog.js";

winston.add(new winston.transports.Console({ format: format.combine(format.colorize(), format.simple()), stderrLevels: ["error", "warn", "info"], level: "info" }));

const yargsInstance = yargs(hideBin(process.argv));
const terminalWidth = yargsInstance.terminalWidth();
const maxWidth = 140;

await yargsInstance
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
        .string("verbose")
        .describe("verbose", "Print more stuff")
        .group("verbose", "Common options")
        .help("h")
        .alias("h", "help")
        .group("help", "Common options")
        .group("version", "Common options")
        .middleware([verboseMiddleware]),
    async (args) => {
      winston.info(`Computing diff\n\tfrom:\t ${args.old_openapi_spec}\n\tto:\t ${args.new_openapi_spec}`);

      const differences = await diffFn(args.old_openapi_spec, args.new_openapi_spec);
      const changelog = args.diff === true ? JSON.stringify(differences, null, 2) : await changelogFn(differences);

      if (args.output !== undefined) {
        winston.info(`Writing result to ${args.output}`);
        await fs.writeFile(args.output, changelog, { encoding: "utf8", flag: "w" });
        winston.info(`Done.`);
      } else {
        winston.info(`Writing output below\n`);
        process.stdout.write(changelog);
      }
    },
  )
  .parse();

function verboseMiddleware(args: ArgumentsCamelCase<{ verbose: string | undefined }>): void {
  if (args.verbose !== undefined) {
    const fileName = args.verbose === "" ? "debug.log" : args.verbose;
    winston.info(`Verbose: writing debug logs to ${fileName}`);
    winston.add(new winston.transports.File({ filename: fileName, format: format.combine(format.uncolorize(), format.simple()), level: "debug", options: { flags: "w" } }));
    winston.debug(`ARGS: ${util.inspect(args, false, null, true)}`);
  }
}
