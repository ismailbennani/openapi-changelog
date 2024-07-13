import { DiffResponse } from "./diff/types.js";
import { diff } from "./diff/diff.js";
import { changelog } from "./changelog/changelog";

export type OpenapiChangelogDiff = DiffResponse;

export const OpenapiChangelog = {
  diff: (oldSpec: string, newSpec: string): OpenapiChangelogDiff => {
    return diff(oldSpec, newSpec);
  },

  changelog: (oldSpec: string, newSpec: string): Promise<string> => {
    const diffResult = diff(oldSpec, newSpec);
    return changelog(diffResult);
  },
};
