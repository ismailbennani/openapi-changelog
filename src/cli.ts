#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { ArgumentsCamelCase, Argv } from "yargs";
import winston, { format } from "winston";
import * as util from "node:util";
import { DiffArgs, diffCliHandler } from "./diff-cli.js";

winston.add(new winston.transports.Console({ format: format.combine(format.colorize(), format.simple()) }));

const yargsInstance = yargs(hideBin(process.argv));
const terminalWidth = yargsInstance.terminalWidth();
const maxWidth = 120;

await yargsInstance
  .scriptName("openapi-changelog")
  .usage("Usage: $0 <diff|changelog> [options]")
  .command<DiffArgs>(
    "diff <old_openapi_spec> <new_openapi_spec>",
    "Get the differences between two open api specifications",
    (yargs: Argv) => {
      yargs
        .positional("old_openapi_spec", {
          describe: "Path or url to the old openapi specification",
          type: "string",
        })
        .positional("new_openapi_spec", { describe: "Path or url to the new openapi specification", type: "string" })
        .string("output")
        .alias("o", "output")
        .describe("output", "Output file name")
        .default("output", "diff.json")
        .group("output", "Diff options")
        .usage("Usage: $0 diff <old_openapi_spec> <new_openapi_spec> --output diff.json [options]");
    },
    diffCliHandler,
  )
  .boolean("verbose")
  .describe("verbose", "Print more stuff")
  .group("verbose", "Common options")
  .help("h")
  .alias("h", "help")
  .group("help", "Common options")
  .group("version", "Common options")
  .wrap(terminalWidth > maxWidth ? maxWidth : terminalWidth)
  .middleware([verboseMiddleware])
  .parse();

function verboseMiddleware(args: ArgumentsCamelCase<{ verbose: boolean | undefined }>): void {
  if (args.verbose === true) {
    winston.level = "debug";
    winston.debug(`ARGS: ${util.inspect(args, false, null, true)}`);
  }

  winston.level = "info";
}
