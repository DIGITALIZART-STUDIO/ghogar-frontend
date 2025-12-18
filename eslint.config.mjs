import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import reactPlugin from "eslint-plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
      "@typescript-eslint/prefer-nullish-coalescing": [
        "error",
        {
          ignoreConditionalTests: true,
          ignoreMixedLogicalExpressions: true,
        },
      ],
    },
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      reactPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "react/jsx-boolean-value": "error",
      "react/jsx-pascal-case": "error",
      "react/jsx-no-useless-fragment": "error",
      "react/self-closing-comp": "error",
      // Desactivar reglas de formato - Prettier se encarga de esto
      "react/jsx-closing-bracket-location": "off",
      "react/jsx-tag-spacing": "off",
      "react/jsx-first-prop-new-line": "off",
      "react/jsx-indent": "off",
      "react/jsx-indent-props": "off",
    },
  },
  {
    rules: {
      "@next/next/no-img-element": "off",
      // Desactivar reglas de formato/espacios - Prettier se encarga de esto
      indent: "off",
      "brace-style": "off",
      "no-tabs": "off",
      quotes: "off", // Prettier maneja las comillas
      semi: "off", // Prettier maneja los punto y coma
      "semi-spacing": "off",
      camelcase: [
        "error",
        {
          ignoreDestructuring: true,
          ignoreImports: true,
          ignoreGlobals: true,
          properties: "never",
        },
      ],
      "no-multiple-empty-lines": ["warn", { max: 2, maxEOF: 1 }], // Más permisivo, Prettier puede manejar esto
      "prefer-const": "error",
      "no-const-assign": "error",
      "no-var": "error",
      "array-callback-return": "error",
      "prefer-template": "error",
      "template-curly-spacing": "off", // Prettier maneja esto
      "no-useless-escape": "error",
      "wrap-iife": "error",
      "no-loop-func": "error",
      "default-param-last": "error",
      "space-before-blocks": "off", // Prettier maneja esto
      "no-param-reassign": "error",
      "arrow-spacing": "off", // Prettier maneja esto
      "arrow-parens": "off", // Prettier maneja esto
      "arrow-body-style": "error",
      "no-confusing-arrow": "error",
      "implicit-arrow-linebreak": "off", // Prettier maneja esto
      "no-duplicate-imports": "error",
      "object-curly-newline": "off", // Prettier maneja esto
      "dot-notation": "error",
      "one-var": ["error", "never"],
      "no-multi-assign": "error",
      "no-plusplus": "error",
      "operator-linebreak": "off", // Prettier maneja esto
      eqeqeq: "error",
      "no-case-declarations": "error",
      "no-nested-ternary": "off",
      "no-unneeded-ternary": "error",
      "nonblock-statement-body-position": "error",
      "keyword-spacing": "off", // Prettier maneja esto
      "space-infix-ops": "off", // Prettier maneja esto
      "eol-last": "off", // Prettier maneja esto
      "newline-per-chained-call": "off", // Prettier maneja esto
      "no-whitespace-before-property": "off", // Prettier maneja esto
      "space-in-parens": "off", // Prettier maneja esto
      "array-bracket-spacing": "off", // Prettier maneja esto
      "key-spacing": "off", // Prettier maneja esto
      "no-trailing-spaces": "off", // Prettier maneja esto
      "comma-style": "off", // Prettier maneja esto
      radix: "error",
      "no-new-wrappers": "error",
      curly: ["error", "all"],
    },
  },
];

export default eslintConfig;
