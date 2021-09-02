module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    "screeps/screeps": true,
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
  plugins: ["screeps"],
};
