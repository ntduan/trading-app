import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const [
  typescriptEslintPlugin,
  typescriptEslintParser,
  prettierPlugin,
  importPlugin,
  reactPlugin,
] = await Promise.all([
  import('@typescript-eslint/eslint-plugin'),
  import('@typescript-eslint/parser'),
  import('eslint-plugin-prettier'),
  import('eslint-plugin-import'),
  import('eslint-plugin-react'),
]);

/** @type {import("eslint").Linter.Config[]} */
// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    ignores: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
    ],
  },
  ...compat.extends(
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptEslintParser.default,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin.default,
      prettier: prettierPlugin.default,
      import: importPlugin.default,
      react: reactPlugin.default,
    },
    rules: {
      'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
      'react/self-closing-comp': ['warn', { html: true, component: true }],
      'prettier/prettier': [
        'warn',
        {
          printWidth: 120,
          endOfLine: 'lf',
          singleQuote: true,
          trailingComma: 'es5',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'import/order': [
        'warn',
        {
          'newlines-between': 'always-and-inside-groups',
          alphabetize: { order: 'asc' },
        },
      ],
    },
  },
];