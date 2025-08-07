import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        files: ['**/*.{js,mjs,cjs}'],
        ...js.configs.recommended,
        languageOptions: { 
            globals: {
                ...globals.node,
                ...globals.es2021
            },
            ecmaVersion: 2021,
            sourceType: 'commonjs'
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'error'
        }
    },
    {
        files: ['eslint.config.mjs'],
        languageOptions: {
            sourceType: 'module'
        }
    }
];
