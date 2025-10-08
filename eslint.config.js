import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("next/core-web-vitals", "next/typescript"),
    
    ignores: [
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
    ],

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
}]);