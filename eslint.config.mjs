import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        ignores: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                React: 'readonly',
                JSX: 'readonly',
            },
        },
        rules: {
            // Your custom rules here
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
]

export default eslintConfig
