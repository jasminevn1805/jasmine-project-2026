# Button Component

A comprehensive button component from Jasmine Design System v1.0, based on Figma design specifications.

## Features

- ✅ **13 Button Variants**: Primary, Secondary, Tertiary, Tertiary Mono, Inverse, Mono, Outline, Outline Mono, Text, Text Mono, Negative Primary, Negative Outline, Negative Text
- ✅ **3 Sizes**: Small (S), Medium (M), Large (L)
- ✅ **Multiple States**: Default, Hover, Pressed, Loading, Disabled
- ✅ **Icon Support**: Leading and trailing icons using react-feather
- ✅ **Full Accessibility**: ARIA labels, keyboard navigation, screen reader support
- ✅ **TypeScript**: Strict typing with PropTypes validation
- ✅ **CSS Modules**: Scoped styles with SCSS variables
- ✅ **Storybook Ready**: Comprehensive stories for all variants
- ✅ **Unit Tested**: Full test coverage with React Testing Library

## Installation

```bash
npm install react react-feather prop-types
```

## Usage

```tsx
import { Button } from '@/components/Button';
import { Download } from 'react-feather';

// Basic usage
<Button label="Click me" />

// With size and type
<Button label="Primary Large" size="L" type="Primary" />

// With icons
<Button
  label="Download"
  type="Primary"
  showLeadingIcon
  leadingIcon={<Download size={20} />}
/>

// Loading state
<Button label="Loading..." loading />

// Disabled state
<Button label="Disabled" disabled />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **required** | Button text content |
| `size` | `'S' \| 'M' \| 'L'` | `'M'` | Button size variant |
| `type` | `ButtonType` | `'Primary'` | Button style variant |
| `loading` | `boolean` | `false` | Shows loading spinner |
| `disabled` | `boolean` | `false` | Disables the button |
| `showLeadingIcon` | `boolean` | `false` | Shows leading icon |
| `showTrailingIcon` | `boolean` | `false` | Shows trailing icon |
| `leadingIcon` | `ReactNode` | `null` | Custom leading icon |
| `trailingIcon` | `ReactNode` | `null` | Custom trailing icon |
| `onClick` | `function` | `undefined` | Click event handler |
| `className` | `string` | `''` | Additional CSS classes |
| `htmlType` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `ariaLabel` | `string` | `undefined` | Custom ARIA label |

## Button Types

- **Primary**: Main call-to-action buttons
- **Secondary**: Secondary actions
- **Tertiary**: Subtle actions
- **Tertiary Mono**: Monochrome tertiary buttons
- **Inverse**: For use on dark backgrounds
- **Mono**: Monochrome filled buttons
- **Outline**: Bordered buttons
- **Outline Mono**: Monochrome bordered buttons
- **Text**: Text-only buttons
- **Text Mono**: Monochrome text buttons
- **Negative Primary**: Destructive actions (filled)
- **Negative Outline**: Destructive actions (outlined)
- **Negative Text**: Destructive actions (text-only)

## Sizes

- **S (Small)**: 32px height, 14px font
- **M (Medium)**: 40px height, 14px font
- **L (Large)**: 48px height, 16px font

## Accessibility

The Button component follows WAI-ARIA best practices:

- Proper semantic HTML (`<button>` element)
- `aria-label` for screen readers
- `aria-busy` when loading
- `aria-disabled` when disabled
- `aria-hidden` on decorative icons
- Full keyboard navigation support
- Focus visible styles

## Design Tokens

The component uses semantic SCSS variables from the design system:

- **Colors**: `$background-brand`, `$text-primary`, etc.
- **Spacing**: `$space-xs`, `$space-s`, `$space-m`
- **Borders**: `$border-radius-s`, `$border-radius-m`
- **Typography**: `$label-l-size`, `$label-m-size`, etc.

## Storybook

Run Storybook to view all button variants:

```bash
npm run storybook
```

## Testing

Run tests with:

```bash
npm test
```

## Examples

### Action Buttons

```tsx
// Add button
<Button
  label="Add Item"
  type="Primary"
  showLeadingIcon
  leadingIcon={<Plus size={20} />}
/>

// Delete button
<Button
  label="Delete"
  type="Negative Primary"
  showLeadingIcon
  leadingIcon={<Trash2 size={20} />}
/>
```

### Form Submit

```tsx
<Button
  label="Submit Form"
  type="Primary"
  htmlType="submit"
  size="L"
/>
```

### Navigation

```tsx
<Button
  label="Continue"
  type="Primary"
  showTrailingIcon
  trailingIcon={<ChevronRight size={20} />}
  onClick={handleNext}
/>
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Part of Jasmine Design System v1.0
