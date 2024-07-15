import { OpenAPIV3 } from "openapi-types";
import { formatDocumentChanges } from "./openapi-document-format";
import { detailedDiff, OpenapiDiffOptions } from "../diff/diff";
import { OpenapiDocumentChange } from "../diff/openapi-document-changes";

export type OpenapiChangelogOptions = OpenapiDiffOptions & {
  printWidth?: number;
  exclude?: OpenapiDocumentChange["type"][];
};

export function changelog(documents: OpenAPIV3.Document[], options?: OpenapiChangelogOptions): string {
  const diff = detailedDiff(documents, options);
  return [
    ...diff.flatMap((d) => [...formatDocumentChanges(d.oldDocument, d.newDocument, d.changes, options), ""]),
    `Version ${diff[diff.length - 1].changes.version.old}`,
    `  Start of changelog`,
  ].join("\n");
}
