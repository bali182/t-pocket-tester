import { createNodeResolver, importX } from 'eslint-plugin-import-x'
import reactHooks from 'eslint-plugin-react-hooks'
import { createRequire } from 'node:module'
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
      'react-hooks/static-components': 'off',
    },
  },
  {
    name: 'import-x/no-unresolved',
    files: typeScriptFiles,
    plugins: {
      'import-x': importX,
    },
    settings: {
      'import-x/resolver-next': [createWorkerAwareImportResolver(), createNodeResolver()],
    },
    rules: {
      'import-x/no-unresolved': 'error',
    },
  },
]

function createWorkerAwareImportResolver() {
  const require = createRequire(import.meta.url)
  const { createViteImportResolver } = require('eslint-import-resolver-vite')
  const viteImportResolver = createViteImportResolver({ viteConfig: {} })

  return {
    ...viteImportResolver,
    resolve(source, file, options) {
      const resolvedSource = source.endsWith('?worker') ? source.slice(0, -'?worker'.length) : source
      return viteImportResolver.resolve(resolvedSource, file, options)
    },
  }
}
