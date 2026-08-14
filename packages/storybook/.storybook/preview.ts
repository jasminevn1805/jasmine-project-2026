import type { Preview } from '@storybook/react';
import '../../design-system/src/styles/index.css';
// Imported from source (not the built package), matching the styles import
// above - stories stay in sync with in-progress DS changes without needing
// a build step first.
import { applyMode, type Mode } from '../../design-system/src/utils/mode';
// Makes the Docs page's embedded story canvas follow `data-mode` too - see
// the file's own header comment for why this is needed in addition to
// applyMode() below.
import './docs-mode.css';

// Only a Mode (light/dark) toggle is wired up here, not a Theme toggle.
// Reason: meal-prep/app/theme.css doesn't yet wrap its rules in `@layer
// theme` (see THEMING-CONTRACT.md §2's correction), so it isn't correctly
// participating in the cascade layer this toolbar would rely on - adding a
// Theme picker before that's fixed would demonstrate something that only
// coincidentally looks right. Add one once a project theme file actually
// uses `@layer theme`.
const preview: Preview = {
  globalTypes: {
    mode: {
      name: 'Mode',
      description: 'data-mode on the preview root (Brand default, light/dark)',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      applyMode(context.globals.mode as Mode);
      return Story();
    },
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      // Ensure the Docs page body is always scrollable, regardless of any
      // story's layout parameter (e.g. 'fullscreen' on Modal stories).
      story: {
        inline: true,
      },
    },
    layout: 'centered',
  },
};

export default preview;
