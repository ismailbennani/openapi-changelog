#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { diff } from "./diff/diff.js";
import { Argv } from "yargs";

await yargs(hideBin(process.argv))
  .scriptName("openapi-changelog")
  .usage("Usage: $0 <diff|changelog> [options]")
  .command<DiffArgs>(
    "diff <old_openapi_spec> <new_openapi_spec>",
    "get the differences between two open api specifications",
    (yargs: Argv) => {
      yargs
        .positional("old_openapi_spec", {
          describe: "path or url to the old openapi specification",
          type: "string",
        })
        .positional("new_openapi_spec", { describe: "path or url to the new openapi specification", type: "string" });
    },
    async (args: DiffArgs) => {
      const result = await diff(args.old_openapi_spec, args.new_openapi_spec);
      console.log(JSON.stringify(result, null, 2));
    },
  )
  .help("h")
  .alias("h", "help")
  .parse();

interface DiffArgs {
  old_openapi_spec: string;
  new_openapi_spec: string;
}
