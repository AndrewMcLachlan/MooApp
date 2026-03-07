import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import dts from "vite-plugin-dts"
import external from "rollup-plugin-peer-deps-external"
import { fileURLToPath } from "url"
import { createRequire } from "module"

const require = createRequire(import.meta.url)

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        template: require("./svgr-template.cjs"),
        jsx: {
          babelConfig: {
            plugins: [require.resolve("./svgr-unique-ids.cjs")],
          },
        },
        svgoConfig: {
          plugins: [{
            name: "preset-default",
            params: { overrides: { removeViewBox: false, cleanupIds: false, removeUselessDefs: false, removeUselessStrokeAndFill: false } },
          },
          "prefixIds",
          ],
        },
      },
      include: "**/*.svg",
    }),
    dts({
      exclude: ["src/**/*.test.*", "src/**/__tests__/**", "src/setupTests.*"],
      afterDiagnostic(diagnostics) {
        if (diagnostics.length > 0) {
          throw new Error(`Declaration generation failed with ${diagnostics.length} error(s)`);
        }
      },
    }),
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
