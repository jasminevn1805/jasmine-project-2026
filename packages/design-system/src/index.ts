// Main entry point for Jasmine Design System

// Styles — only the CSS custom properties (variables) are bundled into dist/style.css.
// Projects using Tailwind import this via @jasmine/design-system/styles — they get
// only the token variables, no reset or global styles that would conflict with Tailwind.
//
// Storybook (no Tailwind) imports the full stack directly from source:
//   import '../../design-system/src/styles/index.css'
import './styles/tokens.css';
import './styles/safe-utilities.css';

// Export all components
export * from './components/Button';
export * from './components/ScrollTabBar';
export * from './components/Input';
export * from './components/Textarea';
export * from './components/Select';
export * from './components/Modal';
export * from './components/Radio';
export * from './components/Checkbox';
export * from './components/Divider';
export * from './components/Row';
export * from './components/Image';

// Shared light/dark mode helper - see THEMING-CONTRACT.md §4
export * from './utils/mode';

// Version
export const VERSION = '1.0.0';
