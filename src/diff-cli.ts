import winston from "winston";
import fs from "node:fs/promises";
import { diff } from "./diff/diff.js";

export const diffCliHandler = async (args: DiffArgs): Promise<void> => {
  winston.info(`Computing diff\n\tfrom:\t ${args.old_openapi_spec}\n\tto:\t ${args.new_openapi_spec}`);
  const result = await diff(args.old_openapi_spec, args.new_openapi_spec);
  await fs.writeFile(args.output, JSON.stringify(result, null, 2), { encoding: "utf8", flag: "w" });
  winston.info(`Done, output written at ${args.output}`);
};

export interface DiffArgs {
  old_openapi_spec: string;
  new_openapi_spec: string;
  output: string;
}
