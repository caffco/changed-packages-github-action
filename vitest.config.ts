/* eslint-disable filenames/match-regex */

// eslint-disable-next-line import/no-unresolved
import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'lcov', 'html']
    }
  }
})
