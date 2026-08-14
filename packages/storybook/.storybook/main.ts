import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // Without a propFilter, docgen walks every prop inherited from
      // node_modules - for anything extending React.InputHTMLAttributes
      // (Input, Checkbox, Radio, Select, Textarea) that is ~250 DOM props
      // analysed per component, and it dominates startup cost. Keeping only
      // first-party props also makes the generated props tables readable.
      propFilter: (prop) => !/node_modules/.test(prop.parent?.fileName ?? ''),
    },
  },
};

export default config;
