import * as esbuild from "esbuild";
import importFlat from "@vixen-js/plugin-import-flat";

import dts from "npm-dts";
const { Generator } = dts;

try {
  new Generator({
    entry: "src/main.ts",
    output: "dist/main.d.ts"
  }).generate();

  await esbuild.build({
    entryPoints: ["src/**/*.ts", "src/example/demo.tsx"],
    outdir: "dist",
    outExtension: {
      ".js": ".cjs"
    },
    bundle: true,
    platform: "node",
    target: "node18",
    format: "cjs",
    minify: true,
    sourcemap: true,
    tsconfig: "./tsconfig.json",
    packages: "external",
    plugins: [importFlat()]
  });
} catch (e) {
  console.error(e);
}
