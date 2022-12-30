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
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
  rules: {
    semi: 1,
    camelcase: 0,
    'no-unused-vars': ['warn'],
  },
};
