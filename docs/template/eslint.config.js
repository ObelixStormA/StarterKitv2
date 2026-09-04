import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Allow setState in useEffect for syncing props to state (common pattern)
      // This is needed for form reset on prop change, route change handlers, etc.
      'react-hooks/set-state-in-effect': 'off',
      // Allow exporting non-components from component files (e.g., Icons constant)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
])
