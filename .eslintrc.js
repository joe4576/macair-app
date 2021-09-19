module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],

  rules: {
    "vue/component-name-in-template-casing": ["error", "kebab-case"],
    "vue/name-property-casing": ["error", "PascalCase"],
    "@typescript-eslint/no-unused-vars": "warn",
    "prefer-const": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "vue/script-setup-uses-vars": "off",
    "no-var": "error",
  },
};
