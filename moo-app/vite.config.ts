import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import external from "rollup-plugin-peer-deps-external"
import { fileURLToPath } from "url"
import { createRequire } from "module"

const { dependencies } = createRequire(import.meta.url)("./package.json")
const runtimeDependencies = Object.keys(dependencies ?? {})

const assetImport = /\.(css|scss|sass|less|svg|png|jpe?g|gif|webp|woff2?)$/

// Runtime dependencies must stay external: bundling one that ships CommonJS inlines a
// `require` shim that throws on import in any environment without `require`. Their assets
// must still be bundled, so the package keeps emitting a single stylesheet.
const isRuntimeDependency = (id: string) =>
  !assetImport.test(id) &&
  runtimeDependencies.some((dep) => id === dep || id.startsWith(`${dep}/`))

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
      external: isRuntimeDependency,
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
  plugins: [
    dts({
      entryRoot: "src",
      exclude: ["src/**/*.test.*", "src/**/__tests__/**", "src/test-utils/**", "src/setupTests.*"],
      afterDiagnostic(diagnostics) {
        if (diagnostics.length > 0) {
          throw new Error(`Declaration generation failed with ${diagnostics.length} error(s)`);
        }
      },
    }),
  ],
})
