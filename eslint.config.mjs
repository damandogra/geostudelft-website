import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

// eslint-config-next already registers the jsx-a11y plugin, so reuse that instance for its recommended rules
const jsxA11y = nextVitals.find((config) => config.plugins?.['jsx-a11y']).plugins['jsx-a11y']

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  { rules: jsxA11y.configs.recommended.rules },
  prettierRecommended,
  globalIgnores(['.next/**', '.contentlayer/**', 'out/**', 'build/**', 'public/**', 'next-env.d.ts']),
  {
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',

      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton'],
        },
      ],
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
])
