import { mergeConfig } from 'vite';
import path from 'path';

const config = {
  stories: [
    "../components/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../components/**/*.stories_*.@(js|jsx|ts|tsx|mdx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test"
  ],
  "framework": {
    "name": "@storybook/experimental-nextjs-vite",
    "options": {}
  },
  "staticDirs": [
    "../public"
  ],
  "viteFinal": async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../'),
        },
      },
      // Handle "use client" directive
      build: {
        sourcemap: true,
        rollupOptions: {
          onwarn(warning, warn) {
            if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && 
                warning.message.includes("use client")) {
              return;
            }
            warn(warning);
          },
        },
      },
    });
  },
  typescript: {
    // Properly handle kebab-case imports
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  }
};

export default config;