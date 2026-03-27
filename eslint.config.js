'use strict';

const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "strict": "off",
    },
  },
  {
    files: ["src/**/*.js", "public/**/*"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        // CommonJS globals
        require: "readonly",
        module: "readonly",
        exports: "writable",
        __dirname: "readonly",
        __filename: "readonly",
        console: "readonly",
        // ... include more if needed from globals.node
        ...globals.node,
      },
    },
    rules: {
      "no-param-reassign": "error",
      "strict": ["error", "global"],
    },
  },
  {
    files: ["tests/**/*.js", "test/**/*.js"],
    languageOptions: {
      globals: {
        // Test globals
        require: "readonly",
        module: "readonly",
        console: "readonly",
        ...globals.jest,
      },
    },
  },
];