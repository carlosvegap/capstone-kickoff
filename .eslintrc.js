module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'google'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-no-bind': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'implicit-arrow-linebreak': 'off',
    'function-paren-newline': 'off',
    'no-param-reassign': 'off',
    'no-shadow': 'off',
    'operator-linebreak': 'off',
    'object-curly-newline': 'off',
    'react/no-array-index-key': 'off',
    'require-jsdoc': 'off',
    'new-cap': 'off',
    'object-curly-spacing': 'off',
    'indent': ['error', 2],
  },
};
