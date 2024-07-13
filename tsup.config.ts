import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts", "src/cli.ts"],
  publicDir: "src/public",
  format: "esm",
  shims: true,
  dts: true,
  minify: "terser",
  treeshake: true, 
}));