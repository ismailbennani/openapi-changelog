import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/cli.ts"],
  publicDir: "src/public",
  format: "esm",
  shims: true,
  minify: "terser",
  treeshake: true
});