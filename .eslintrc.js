module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    "screeps/screeps": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {},
  plugins: ["@typescript-eslint", "screeps"],
};
