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
    },
  },
  plugins: [
    dts({ exclude: ["src/**/*.test.*", "src/**/__tests__/**", "src/test-utils/**", "src/setupTests.*"] }),
  ],
})
