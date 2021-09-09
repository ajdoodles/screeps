import clear from "rollup-plugin-clear";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import screeps from "rollup-plugin-screeps";
import typescript from "@rollup/plugin-typescript";

let cfg;
const dest = process.env.DEST;
if (!dest) {
  console.log("No destination specified for screeps code.");
} else if ((cfg = require("./.screeps.json")[dest]) == null) {
  throw new Error("Invalid upload destination");
}

export default {
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    name: "main",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    clear({ targets: ["dist"] }),
    resolve({ rootDir: "src" }),
    commonjs(),
    typescript({
      include: [
        "./src/*.ts+(|x)",
        "./src/**/*.ts+(|x)",
        "./src/*.js+(|x)",
        "./src/**/*.js+(|x)",
      ],
      exclude: ["node_modules"],
      // Uncomment to have rollup fail when encountering typescript errors
      // noEmitOnError: true,
    }),
    screeps({ config: cfg, dryRun: cfg == null }),
  ],
};
