#!/usr/bin/env node
const fs = require("fs/promises");
const { execSync } = require("child_process");

const main = async () => {
  const includeCmd = "include";
  const shellCmd = "shell";
  const includeRegex = new RegExp("\{\{\s*(" + includeCmd + "|" + shellCmd + ")\s*(.*)\s*}}");

  let result = await fs.readFile("./README.md.tpl", "utf8");
  let fuel = 10000;
  while (fuel > 0) {
    const match = result.match(includeRegex);
    if (!match) {
      break;
    }

    const command = match[1];

    let replacementStr;
    switch (command) {
      case "include":
        const fileToInclude = match[2].trim();
        replacementStr = await fs.readFile(fileToInclude, "utf8");
        break;
      case "shell":
        const cmd = match[2].trim();
        replacementStr = execSync(cmd);
        break;
      default:
        continue;
    }

    const removeFrom = match.index;
    const removeTo = match.index + match[0].length;

    result = result.substring(0, removeFrom) + replacementStr + result.substring(removeTo);

    fuel--;
  }

  await fs.writeFile("./README.md", result, "utf8");
};

main().then(() => console.log("Done.")).catch(console.error);