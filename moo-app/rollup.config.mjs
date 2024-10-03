import typescript from "@rollup/plugin-typescript";
//import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import svgr from "@svgr/rollup";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json" assert { type: "json" }

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
    //resolve({browser: true}),
    postcss({
      modules: false,
      extensions: [".scss"],
      sourceMap: true
    }),
    svgr(),
    typescript(),
    terser(),
    //commonjs()
  ]
}
