import { defineConfig } from "tsup";
import tsupConfig from "./tsup.config";

export default defineConfig((options) => ({
  ...tsupConfig,
  dts: true
}));