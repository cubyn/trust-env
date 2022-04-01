module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  plugins: ['@typescript-eslint', 'jest'],
  env: {
    node: true,
    es6: true,
    'jest/globals': true,
  },
  rules: {
    // Turn on again when TS is well accepted
    '@typescript-eslint/no-explicit-any': 'error',
  },
};
