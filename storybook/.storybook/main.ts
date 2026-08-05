import type { StorybookConfig } from '@storybook/react-vite';
import { resolve } from "path"

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    '@storybook/addon-onboarding',
    '@storybook/addon-docs',
  ],
  "framework": {
    "name": '@storybook/react-vite',
    "options": {}
  },
  viteFinal: async (config) => {
    config.server = config.server || {};
    config.server.watch = config.server.watch || {};
    config.server.watch.ignored = [
      '!**/node_modules/@andrewmclachlan/moo-ds/**',
      '!**/node_modules/@andrewmclachlan/moo-app/**',
      '!**/node_modules/@andrewmclachlan/moo-icons/**',
    ];

    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@andrewmclachlan/moo-ds': resolve(import.meta.dirname, '../../moo-ds/src'),
      '@andrewmclachlan/moo-app': resolve(import.meta.dirname, '../../moo-app/src'),
      '@andrewmclachlan/moo-icons': resolve(import.meta.dirname, '../../moo-icons/src'),
    };

    config.build = config.build || {};
    config.build.cssMinify = 'esbuild';

    return config;
  },
};

export default config;
