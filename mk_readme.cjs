#!/usr/bin/env node
const fs = require("fs/promises");
const { execSync } = require("child_process");

const main = async () => {
  const includeCmd = "include";
  const shellCmd = "shell";
  const includeRegex = new RegExp("\{\{\s*(" + includeCmd + "|" + shellCmd + ")\s*(.*)\s*}}", "gm");

  const template = await fs.readFile("./README_template.md", "utf8");
  const matches = template.matchAll(includeRegex);
  
  let result = template;
  let offset = 0;
  
  for (const match of matches) {
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

    const removeFrom = match.index + offset;
    const removeTo = match.index + match[0].length + offset;
    offset = offset - match[0].length + replacementStr.length;

    result = result.substring(0, removeFrom) + replacementStr + result.substring(removeTo);
  }

  await fs.writeFile("./README.md", result, "utf8");
};

main().then(() => console.log("Done.")).catch(console.error);