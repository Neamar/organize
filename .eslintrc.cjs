module.exports = {
  env: {
    node: true,
    es2022: true,
    browser: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    camelcase: 0,
    'no-unused-vars': ['warn'],
  },
};
