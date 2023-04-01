// Setup linter configuration
// TODO: Look into more detail and determine format and settings to use
module.exports = {
    // Adds the settings recommended by eslint
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],

    // Use typescript parser
    parser: '@typescript-eslint/parser',

    // Add plugin to linter for typescript
    plugins: ['@typescript-eslint'],

    rules: {
        // Disable unused vars because of interface logic
        "@typescript-eslint/no-unused-vars": "off",

        // Disable no inferrable types for better clarity
        "@typescript-eslint/no-inferrable-types": "off"
    },

    // Set this as the root linter
    root: true,
};
