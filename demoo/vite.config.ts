import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr";
import { fileURLToPath } from "url"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  server: {
    port: 3002
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("../node_modules/", import.meta.url)),
    }
  }
})
