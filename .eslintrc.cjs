/* eslint-env node */
module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    "react-native/react-native": true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: { jsx: true },
    sourceType: "module",
    // без type-aware правил, щоб не вимагати tsconfig project
  },
  plugins: [
    "react",
    "react-hooks",
    "react-native",
    "@typescript-eslint",
    "import",
    "prettier",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-native/all",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier", // завжди останнім: вимикає конфлікти з Prettier
  ],
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        // якщо захочеш alias у майбутньому — тут додамо paths з tsconfig
      },
    },
  },
  rules: {
    // Prettier як ESLint-правило
    "prettier/prettier": ["warn"],

    // React/TS
    "react/prop-types": "off", // ми на TS
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/consistent-type-imports": "warn",

    // React Hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // Import hygiene
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "import/no-unresolved": "error",
    "import/no-duplicates": "warn",

    // React Native best practices
    "react-native/no-inline-styles": "off", // у RN інколи ок
    "react-native/no-raw-text": "off", // дозволимо сирий текст в <Text>
    "react-native/sort-styles": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
      },
    },
  ],
};
