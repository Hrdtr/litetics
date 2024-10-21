import unjs from 'eslint-config-unjs'
import stylistic from '@stylistic/eslint-plugin'

export default unjs({
  ignores: ['docs/.vitepress/dist', 'docs/.vitepress/cache'],
  rules: {
    'unicorn/no-null': 'off',
    'unicorn/no-typeof-undefined': 'off',
  },
}, stylistic.configs['recommended-flat'])
