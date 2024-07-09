// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      eqeqeq: "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/restrict-plus-operands": ["error", { allowAny: false, allowBoolean: false, allowNullish: false, allowNumberAndString: false, allowRegExp: false }],
      "@typescript-eslint/restrict-template-expressions": "error",
      "@typescript-eslint/strict-boolean-expressions": ["error", { allowNumber: false, allowString: false }],
      "@typescript-eslint/use-unknown-in-catch-callback-variable": "error",
    },
  },
  eslintPluginPrettierRecommended,
);
