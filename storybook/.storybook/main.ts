import type { StorybookConfig } from '@storybook/react-vite';
import { join, dirname, resolve } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}

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
      '@andrewmclachlan/moo-ds': resolve(__dirname, '../../moo-ds/src'),
      '@andrewmclachlan/moo-app': resolve(__dirname, '../../moo-app/src'),
      '@andrewmclachlan/moo-icons': resolve(__dirname, '../../moo-icons/src'),
    };

    return config;
  },
};

export default config;
