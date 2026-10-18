const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  { ignores: ['dist/*', 'design/*'] },
  {
    settings: {
      'import/resolver': { node: { paths: ['src'], extensions: ['.js', '.jsx'] } },
    },
    rules: { 'import/no-unresolved': ['error', { ignore: ['^@/'] }] },
  },
]);