import { OpenAPIV3 } from "openapi-types";
import { formatDocumentChanges } from "./openapi-document-format";
import { detailedDiff, OpenapiDiffOptions } from "../diff/diff";
import { OpenapiDocumentChange } from "../diff/openapi-document-changes";
import { setupConsoleLoggingIfNecessary } from "../core/logging-utils";

export type OpenapiChangelogOptions = OpenapiDiffOptions & {
  printWidth?: number;
  exclude?: OpenapiDocumentChange["type"][];
  detailed?: boolean;
};

export function changelog(documents: OpenAPIV3.Document[], options?: OpenapiChangelogOptions): string {
  setupConsoleLoggingIfNecessary();

  const actualOptions: OpenapiChangelogOptions = {
    dumpIntermediateRepresentations: undefined,
    limit: undefined,
    printWidth: undefined,
    detailed: undefined,
    dumpChanges: undefined,
    exclude: [],
    ...options,
  };

  const diff = detailedDiff(documents, actualOptions);
  return [...diff.flatMap((d) => [...formatDocumentChanges(d.oldDocument, d.newDocument, d.changes, actualOptions), ""])].join("\n");
}
