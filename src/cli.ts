#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { diff } from "./diff/diff.js";
import { Argv } from "yargs";
import winston, { format } from "winston";
import * as util from "node:util";
import * as fs from "node:fs/promises";

winston.add(new winston.transports.Console({ format: format.combine(format.colorize(), format.simple()) }));

const yargsInstance = yargs(hideBin(process.argv));
await yargsInstance
  .scriptName("openapi-changelog")
  .usage("Usage: $0 <diff|changelog> [options]")
  .command<DiffArgs>(
    "diff <old_openapi_spec> <new_openapi_spec>",
    "get the differences between two open api specifications",
    (yargs: Argv) => {
      yargs
        .positional("old_openapi_spec", {
          describe: "Path or url to the old openapi specification",
          type: "string",
        })
        .positional("new_openapi_spec", { describe: "Path or url to the new openapi specification", type: "string" })
        .string("output")
        .demandOption("output")
        .alias("o", "output")
        .describe("output", "Output file name")
        .usage("Usage: $0 diff <old_openapi_spec> <new_openapi_spec> --output diff.json [options]");
    },
    async (args: DiffArgs) => {
      winston.info(`Computing diff\n\tfrom:\t ${args.old_openapi_spec}\n\tto:\t ${args.new_openapi_spec}`);
      const result = await diff(args.old_openapi_spec, args.new_openapi_spec);
      await fs.writeFile(args.output, JSON.stringify(result, null, 2), { encoding: "utf8", flag: "w" });
      winston.info(`Done, output written at ${args.output}`);
    },
  )
  .boolean("verbose")
  .describe("verbose", "Print more stuff")
  .help("h")
  .alias("h", "help")
  .wrap(yargsInstance.terminalWidth())
  .middleware([
    (args) => {
      if (args.verbose) {
        winston.level = "debug";
        winston.debug(`ARGS: ${util.inspect(args, false, null, true)}`);
      }

      winston.level = "info";
    },
  ])
  .parse();

interface DiffArgs {
  old_openapi_spec: string;
  new_openapi_spec: string;
  output: string;
}
