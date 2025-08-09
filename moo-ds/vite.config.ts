import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr";
import { resolve } from "path";
import { fileURLToPath } from "url";
import dts from "vite-plugin-dts";

import typescript from "@rollup/plugin-typescript"
import external from "rollup-plugin-peer-deps-external"
import postcss from "rollup-plugin-postcss"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"), //fileURLToPath(new URL("./src/index.ts")),
      name: "moo-ds",
      fileName: (format) => `moo-ds.${format}.js`,
    },
    rollupOptions: {
      plugins: [
        external(),
        postcss({
          modules: false,
          extensions: [".scss"],
          sourceMap: true
        }),
        svgr(),
        typescript(),
      ],
    },
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("../node_modules/", import.meta.url)),
    }
  }
})
