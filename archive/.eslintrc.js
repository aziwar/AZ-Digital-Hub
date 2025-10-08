module.exports = {
  extends: ["next/core-web-vitals", "next/typescript"],
  rules: {
    "import/order": ["error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "always",
      "alphabetize": { "order": "asc", "caseInsensitive": true }
    }],
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/consistent-type-imports": ["error", { "prefer": "type-imports" }],
    "react-hooks/exhaustive-deps": "off",
    "react-hooks/rules-of-hooks": "error",
    "react/no-unescaped-entities": "error",
    "no-console": ["error"]
  },
  // Ignore scripts and utility files
  ignorePatterns: [
    "scripts/**/*",
    "*.js",
    "*.mjs",
    "*.cjs",
    "node_modules",
    ".next",
    "out",
    "public"
  ]
}