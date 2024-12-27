import typescript from "@rollup/plugin-typescript";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import postcssImport from "postcss-import";
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
    typescript(),
    postcss({
      plugins: [postcssImport()],
      extract: true,
      extensions: [".css"],
      sourceMap: true
    }),
    terser(),
  ]
}
