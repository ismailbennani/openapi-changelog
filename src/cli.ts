#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { ArgumentsCamelCase } from "yargs";
import winston, { format } from "winston";
import fs, { readFile } from "node:fs/promises";
import { diff as diff } from "./diff/diff.js";
import { changelog as changelog } from "./changelog/changelog.js";
import { OpenAPIV3 } from "openapi-types";
import { load } from "js-yaml";
import { inspect } from "util";
import { glob } from "glob";

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
        .option("debug", {
          alias: "D",
          type: "string",
          describe: "Log additional debug information to log file",
          global: true,
        })
        .help()
        .middleware([verboseMiddleware]),
    async (args) => {
      const files = (await Promise.all(args.specifications.map(async (s) => await expandGlobPattern(s)))).flatMap((d) => d);

      winston.info(`Parsing ${files.length} files...`);
      const specs = [];
      for (const file of files) {
        const spec = await parseFiles(file);

        if (spec.result) {
          specs.push(spec.result);
          winston.info(`OK ${file}`);
        } else {
          winston.warn(`KO ${file}: ${spec.errorMessage}`);
        }
      }

      let result: string;
      if (args.diff === true) {
        const differences = diff(...specs);
        result = JSON.stringify(differences, null, 2);
      } else {
        result = changelog(...specs);
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

async function expandGlobPattern(globPath: string): Promise<string[]> {
  return glob(globPath.replaceAll("\\", "/"), { posix: true, nodir: true });
}

async function parseFiles(path: string): Promise<{ result?: OpenAPIV3.Document; errorMessage?: string }> {
  if (path.endsWith(".yml") || path.endsWith(".yaml")) {
    try {
      return { result: await parseYaml(path) };
    } catch (e) {
      return { errorMessage: JSON.stringify(e) };
    }
  }

  if (path.endsWith(".json")) {
    try {
      return { result: await parseJson(path) };
    } catch (e) {
      return { errorMessage: JSON.stringify(e) };
    }
  }

  return { errorMessage: "Invalid format" };
}

async function parseYaml(path: string): Promise<OpenAPIV3.Document> {
  const specContent = await readFile(path, "utf8");
  return load(specContent) as OpenAPIV3.Document;
}

async function parseJson(path: string): Promise<OpenAPIV3.Document> {
  const specContent = await readFile(path, "utf8");
  return JSON.parse(specContent) as OpenAPIV3.Document;
}
