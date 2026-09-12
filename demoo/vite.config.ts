import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { fileURLToPath } from "url"
import { createRequire } from "module"
import { Features } from "lightningcss"

const require = createRequire(import.meta.url)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        template: require("../moo-icons/svgr-template.cjs"),
        jsx: {
          babelConfig: {
            plugins: [require.resolve("../moo-icons/svgr-unique-ids.cjs")],
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
    react(),
    /* Entra permits http only for loopback, so testing on a real device needs
       the origin to be https before its redirect URI can be registered. */
    basicSsl(),
  ],
  build: {
    chunkSizeWarningLimit: Infinity,
    cssMinify: "esbuild",
  },
  css: {
    transformer: "postcss",
    lightningcss: {
      include: Features.VendorPrefixes | Features.Colors | Features.Selectors,
      exclude: Features.Nesting
    },
  },
  server: {
    port: 3002,
    host: true,
    allowedHosts: ["ra.mclachlan.family"]
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("../node_modules/", import.meta.url)),
      "@andrewmclachlan/moo-ds": fileURLToPath(new URL("../moo-ds/src", import.meta.url)),
      "@andrewmclachlan/moo-app": fileURLToPath(new URL("../moo-app/src", import.meta.url)),
      "@andrewmclachlan/moo-icons": fileURLToPath(new URL("../moo-icons/src", import.meta.url)),
    }
  }
})
