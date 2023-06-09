module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true,
    "node": true,
    "jest": true
  },
  "extends": "eslint:recommended",
  "overrides": [
  ],
  "parserOptions": {
    "ecmaVersion": "latest"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "never"
    ],
    "comma-dangle": [
      "error",
      "never"
    ],
    "eqeqeq": "error",
    "object-curly-spacing": [
      "error",
      "always"
    ],
    "arrow-spacing": [
      "error", { "before": true, "after": true }
    ],
    "no-unused-vars": ["error", { "vars": "all", "args": "after-used", "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }]
  }
}
