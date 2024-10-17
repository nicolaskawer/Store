module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true, // If you're using Node.js
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended', // If you are using React
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module', // Allows for the use of imports
    },
    ruls: {
      "no-undef": "off"
    },
  };
  