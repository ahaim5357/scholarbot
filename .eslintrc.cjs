// Setup linter configuration
// TODO: Look into more detail and determine format and settings to use
module.exports = {
    // Adds the settings recommended by eslint
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],

    // Use typescript parser
    parser: '@typescript-eslint/parser',

    // Add plugin to linter for typescript
    plugins: ['@typescript-eslint'],

    // Set this as the root linter
    root: true,
};
