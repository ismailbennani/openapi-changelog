#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { ArgumentsCamelCase } from "yargs";
import winston, { format } from "winston";
import fs from "fs/promises";
import { changelogFromFiles } from "./changelog/changelog";
import { inspect } from "util";
import { glob } from "glob";
import { diffFromFiles } from "./diff/diff";
import { OpenapiDocumentChange } from "./diff/openapi-document-changes";
import { DEBUG_FOLDER_NAME } from "./core/constants";
import { ensureDir } from "./core/fs-utils";
import { Logger } from "./core/logging";

const yargsInstance = yargs(hideBin(process.argv));
const terminalWidth = yargsInstance.terminalWidth();
const maxWidth = 140;

void yargsInstance
  .wrap(terminalWidth > maxWidth ? maxWidth : terminalWidth)
  .scriptName("openapi-changelog")
  .usage(
    "$0 <specifications...>",
    "Compute the changelog between the old and the new openapi specifications",
    (yargs) =>
      yargs
        .positional("specifications", {
          describe: "Path or url to the openapi specifications",
          type: "string",
          demandOption: true,
          normalize: true,
          array: true,
        })
        .option("diff", {
          type: "boolean",
          describe: "Output a JSON containing the differences between the two specifications instead of a nicely formatted changelog",
        })
        .option("template", {
          type: "string",
          describe: "Handlebars template to use to generate the changelog",
        })
        .option("limit", {
          alias: "n",
          type: "number",
          describe:
            "Max number of versions to consider when computing changelog. " +
            "The limit will be applied AFTER sorting the versions, the changelog will contain the N most recent versions.",
        })
        .option("detailed", {
          alias: "D",
          type: "boolean",
          describe: "Output a detailed description of the changes",
        })
        .option("exclude", {
          alias: "x",
          type: "string",
          array: true,
          describe: "Type of changes that should be excluded from the output",
        })
        .option("include-minor", {
          type: "boolean",
          describe: "Include minor changes such as documentation changes in the output",
        })
        .option("output", {
          alias: "o",
          type: "string",
          default: undefined,
          describe: "Write the result to the corresponding file instead of stdout",
          global: true,
        })
        .option("verbose", {
          alias: "v",
          type: "boolean",
          default: false,
          describe: "Log stuff",
          global: true,
        })
        .option("vverbose", {
          type: "boolean",
          describe: "[DEBUG] Very verbose, log debug information to a debug.log file",
          global: true,
        })
        .option("dump-ir", {
          type: "boolean",
          describe: "[DEBUG] Dump the intermediate representation generated for each openapi document in .ir files",
          global: true,
        })
        .option("dump-changes", {
          type: "boolean",
          describe: "[DEBUG] Dump the changes computed between each openapi document couple in .changes files",
          global: true,
        })
        .help()
        .middleware([verboseMiddleware]),
    async (args) => {
      const files = (await Promise.all(args.specifications.map(async (s) => await expandGlobPattern(s)))).flatMap((d) => d);

      const diffOptions = { limit: args.limit, dumpIntermediateRepresentations: args.dumpIr, dumpChanges: args.dumpChanges };

      let result: string;
      if (args.diff === true) {
        const differences = await diffFromFiles(files, diffOptions);
        result = JSON.stringify(differences, null, 2);
      } else {
        const exclude: OpenapiDocumentChange["type"][] = args.exclude?.map((e) => e as OpenapiDocumentChange["type"]) ?? [];
        if (args.includeMinor !== true) {
          exclude.push(
            "operation-documentation-change",
            "operation-parameter-documentation-change",
            "operation-response-documentation-change",
            "parameter-documentation-change",
            "schema-documentation-change",
          );
        }

        result = await changelogFromFiles(files, { ...diffOptions, printWidth: 120, exclude, detailed: args.detailed });
      }

      if (args.output !== undefined) {
        Logger.info(`Writing result to ${args.output}`);
        await fs.writeFile(args.output, result, { encoding: "utf8", flag: "w" });
        Logger.info(`Done.`);
      } else {
        Logger.info(`Writing output below\n`);
        Logger.debug(result);

        process.stdout.write(result);
      }
    },
  )
  .parse();

function verboseMiddleware(args: ArgumentsCamelCase<{ output: string | undefined; verbose: boolean | undefined; vverbose: boolean | undefined }>): void {
  Logger.useWinston();

  const options: winston.transports.ConsoleTransportOptions = {
    format: format.combine(format.colorize(), format.simple()),
    level: "info",
  };

  if (args.output !== undefined) {
    options.stderrLevels = ["error", "warn", "info"];
  }

  const consoleTransport = new winston.transports.Console(options);
  winston.add(consoleTransport);

  if (args.verbose !== true) {
    consoleTransport.silent = true;
  }

  if (args.vverbose !== undefined) {
    ensureDir(DEBUG_FOLDER_NAME);
    const fileName = `${DEBUG_FOLDER_NAME}/debug.log`;
    winston.add(new winston.transports.File({ filename: fileName, format: format.combine(format.uncolorize(), format.simple()), level: "debug", options: { flags: "w" } }));
    Logger.info(`Verbose: writing debug logs to ${fileName}`);
    Logger.debug(`ARGS: ${inspect(args, false, null, true)}`);
  }
}

async function expandGlobPattern(globPath: string): Promise<string[]> {
  return glob(globPath.replaceAll("\\", "/"), { posix: true, nodir: true });
}
