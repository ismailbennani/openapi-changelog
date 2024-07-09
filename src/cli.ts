#!/usr/bin/env node
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { diff, DiffArgs } from "./diff/diff.js";

await yargs(hideBin(process.argv))
  .scriptName("openapi-changelog")
  .usage("Usage: $0 <diff|changelog> [options]")
  .command<DiffArgs>(
    "diff <old_openapi_spec> <new_openapi_spec>",
    "get the differences between two open api specifications",
    (yargs) => {
      yargs
        .positional("old_openapi_spec", {
          describe: "path or url to the old openapi specification",
          type: "string",
        })
        .positional("new_openapi_spec", { describe: "path or url to the new openapi specification", type: "string" });
    },
    (args) => {
      diff(args);
    },
  )
  .help("h")
  .alias("h", "help")
  .parse();
