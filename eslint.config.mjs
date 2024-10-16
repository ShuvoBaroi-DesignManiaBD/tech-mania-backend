import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [{
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    ignores: ["**/node_modules/", ".dist/"]
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "no-console": "warn",
      "prefer-const": "warn",
      "no-unused-expressions": "error",
      // "@typescript-eslint/no-unused-vars": "error",
      // "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    }
  },
  {
    languageOptions: {
      globals: {
        "process": "readonly"
      }
    }
  },
  {
    "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  }
];