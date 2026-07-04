import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

const [tsBase, tsEslintRecommended, tsRecommended] = tseslint.configs.recommended
const reactHooksRecommended = reactHooks.configs.flat.recommended
const typeScriptFiles = ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts']

export default [
  {
    name: tsBase.name,
    files: typeScriptFiles,
    languageOptions: tsBase.languageOptions,
    plugins: {
      '@typescript-eslint': tsBase.plugins['@typescript-eslint'],
    },
  },
  {
    name: tsEslintRecommended.name,
    files: typeScriptFiles,
    rules: tsEslintRecommended.rules,
  },
  {
    name: tsRecommended.name,
    files: typeScriptFiles,
    rules: {
      ...tsRecommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    name: 'react-hooks/recommended',
    files: typeScriptFiles,
    plugins: {
      'react-hooks': reactHooksRecommended.plugins['react-hooks'],
    },
    rules: {
      ...reactHooksRecommended.rules,
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]
