import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  globalIgnores([
        ".next/**/*",
        "out/**/*", 
        "dist/**/*",
        "node_modules/**/*",
        "**/.next/**/*",
        "**/out/**/*",
        "**/dist/**/*",
        "cleanup-and-setup.js",
        "force-cleanup.js",
        "scripts/complete-fix.js",
        "scripts/enhanced-fix.js",
        "scripts/final-eslint-fix.js",
        "scripts/**/*",
        "next-env.d.ts",
        "postcss.config.js"
  ]),
  {
    rules: {
        "import/order": ["error", {
            groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
            "newlines-between": "always",

            alphabetize: {
                order: "asc",
                caseInsensitive: true,
            },
        }],

        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
        }],

        "no-console": ["error"],
        "react/no-unescaped-entities": "error",
    },
  },
]);