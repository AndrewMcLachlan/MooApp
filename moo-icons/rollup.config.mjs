import typescript from "@rollup/plugin-typescript";
import external from "rollup-plugin-peer-deps-external";
import svgr from "@svgr/rollup";
import terser from "@rollup/plugin-terser";

import pkg from "./package.json" with { type: "json" }

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    svgr({
      svgoConfig: {
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                removeViewBox: false,
                cleanupIds: false,
              },
            },

          }]
      }
    }),
    typescript(),
    terser(),
  ]
}
