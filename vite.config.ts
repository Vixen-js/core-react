import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import externalize from "vite-plugin-externalize-dependencies";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true,
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      external: [
        "@vixen-js/core",
        /^vixen-js-plugin-*/,
        /.node$/,
        "fs",
        "path",
        "events"
      ]
    },
    lib: {
      entry: [
        resolve(__dirname, "src/main.ts"),
        resolve(__dirname, "src/example/demo.tsx")
      ],
      formats: ["cjs"]
    }
  },
  plugins: [
    externalize({
      externals: [
        "@vixen-js/core",
        /.node$/,
        /^vixen-js-plugin-*/,
        "fs",
        "path",
        "events"
      ]
    }),
    react(),
    dts({
      insertTypesEntry: true
    })
  ]
});
