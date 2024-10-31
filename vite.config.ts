import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import externalize from "vite-plugin-externalize-dependencies";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  base:'./',
  build: {
    minify: true,
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      makeAbsoluteExternalsRelative: true,
      external: [
        /.node$/,
        "fs",
        "path",
        "events"
      ]
    },
    lib: {
      entry: [
        "src/main.ts",
        "src/example/demo.tsx"
      ],
      formats: ["cjs"]
    }
  },
  plugins: [
    externalize({
      externals: [
        /.node$/,
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
