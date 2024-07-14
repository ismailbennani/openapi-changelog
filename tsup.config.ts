import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/cli.ts"],
  format: "esm",
  shims: true,
  minify: "terser",
  treeshake: true
});