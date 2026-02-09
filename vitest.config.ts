import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: ['moo-*/vitest.config.ts'],
  },
});
