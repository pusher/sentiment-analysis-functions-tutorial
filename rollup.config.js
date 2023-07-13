import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import dotenv from "dotenv";

dotenv.config();

export default [
  {
    input: "sentiment-analysis-function/index.js",
    output: {
      dir: "sentiment-analysis-function/dist",
      format: "cjs",
    },
    plugins: [json(), nodeResolve(), commonjs()],
  },
];
