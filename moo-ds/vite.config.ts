import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import external from "rollup-plugin-peer-deps-external"
import { fileURLToPath } from "url"

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL("src/index.ts", import.meta.url)),
      formats: ["es"],
      fileName: () => "index.es.js",
    },
    sourcemap: true,
    minify: false,
    rollupOptions: {
      plugins: [external()],
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
      output: {
        assetFileNames: "index[extname]",
      },
    },
  },
  plugins: [
    dts({ exclude: ["src/**/*.test.*", "src/**/__tests__/**", "src/test-utils/**", "src/setupTests.*"] }),
  ],
})
