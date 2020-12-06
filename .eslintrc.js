module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:import/errors',
        'plugin:import/typescript',
        'plugin:react/recommended',
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
        'plugin:jsx-a11y/recommended'
    ],
    plugins: ['emotion', 'react', 'react-hooks', 'import', '@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
        project: `./tsconfig.json`
    },
    rules: {
        '@typescript-eslint/no-unused-vars': [2],
        '@typescript-eslint/no-explicit-any': [2],

        'react-hooks/rules-of-hooks': [2],
        'react-hooks/exhaustive-deps': [2],

        'emotion/jsx-import': [2],
        'emotion/no-vanilla': [2],
        'emotion/import-from-emotion': [2],
        'emotion/styled-import': [2],

        'import/no-unresolved': [1],
        'import/no-cycle': [2],

        'no-console': [2],
        'react/prop-types': [0],
        'react/jsx-props-no-spreading': [0],
    },
    settings: {
        react: {
            version: 'detect',
        },
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"]
        },
        "import/resolver": {
            "typescript": {}
        },
    },
};
