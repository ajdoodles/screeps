import clear from "rollup-plugin-clear";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import screeps from "rollup-plugin-screeps";

let cfg;
const dest = process.env.DEST;
if (!dest) {
  console.log("No destination specified for screeps code.");
} else if ((cfg = require("./.screeps.json")[dest]) == null) {
  throw new Error("Invalid upload destination");
}

export default {
  input: "src/main.js",
  output: {
    file: "dist/main.js",
    name: "main",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    clear({ targets: ["dist"] }),
    resolve({ rootDir: "src" }),
    commonjs({
      dynamicRequireTargets: [
        "src/roles/*.js",
        "!src/roles/pioneer.js",
        "!src/roles/role.js",
      ],
    }),
    screeps({ config: cfg, dryRun: cfg == null }),
  ],
};
