import { defineConfig } from "vite";
import { lezer } from "@lezer/generator/rollup";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
  plugins: [lezer(), commonjs()],
  build: {
    outDir: "build",
  },
});
