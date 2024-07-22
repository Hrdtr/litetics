import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
      exclude: [
        'commitlint.config.ts',
        'docs/**',
        '**/fetch.ts'
      ]
    },
  },
})
