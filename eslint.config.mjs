/**
 * ESLint configuration ("flat config", ESLint 9+). Run with:  npm run lint
 *
 * What is checked:
 *   - eslint:recommended        common JavaScript mistakes (unused variables, typos in names…)
 *   - plugin:vue flat/essential Vue 3 template errors (missing keys, invalid v-for…)
 * Formatting (quotes, semicolons, line length) is Prettier's job, not ESLint's.
 */
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'node_modules/**', 'public/**', '.ocr-cache/**'] },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.{js,mjs,vue}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node }
    }
  }
]
