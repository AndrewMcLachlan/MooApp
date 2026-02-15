import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
  ],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("../node_modules/", import.meta.url)),
    }
  }
});
