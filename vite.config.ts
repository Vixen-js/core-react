import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import externalize from "vite-plugin-externalize-dependencies";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
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
    react()
  ]
});
