import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import dts from "vite-plugin-dts"
import external from "rollup-plugin-peer-deps-external"
import { fileURLToPath } from "url"

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        svgoConfig: {
          plugins: [{
            name: "preset-default",
            params: { overrides: { removeViewBox: false, cleanupIds: false } },
          }],
        },
      },
      include: "**/*.svg",
    }),
    dts({ exclude: ["src/**/*.test.*", "src/**/__tests__/**", "src/setupTests.*"] }),
  ],
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
})
