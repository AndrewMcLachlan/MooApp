import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr";
import { fileURLToPath } from "url"
import { resolve } from "path"

// https://vitejs.dev/config/
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
    react(),
  ],
  server: {
    port: 3002
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
