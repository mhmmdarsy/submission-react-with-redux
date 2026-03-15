import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const googleConfig = compat.extends("google").map((config) => {
  const rules = { ...config.rules };

  // Removed from ESLint v9; keep Google config while dropping deprecated rules.
  delete rules["valid-jsdoc"];
  delete rules["require-jsdoc"];

  return {
    ...config,
    rules,
  };
});

const eslintConfig = defineConfig([
  ...googleConfig,
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "arrow-parens": ["error", "always"],
      curly: ["error", "all"],
      "comma-dangle": ["error", "always-multiline"],
      eqeqeq: ["error", "always"],
      indent: ["error", 2, { SwitchCase: 1 }],
      "no-var": "error",
      "object-curly-spacing": ["error", "always"],
      "prefer-const": "error",
      quotes: ["error", "double", { avoidEscape: true }],
      semi: ["error", "always"],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
