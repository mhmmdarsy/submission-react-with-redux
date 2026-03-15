import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
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
