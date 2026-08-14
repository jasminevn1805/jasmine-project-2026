# Button Component - Design Token Mapping

This document explains how the Button component is mapped to the Jasmine Design System tokens and CSS variables.

## Architecture Overview

```
Figma Design → figma-export.json
                     ↓
        ┌────────────┴────────────┐
        ↓                         ↓
  TypeScript Tokens          CSS Variables
  (src/tokens/)        (src/styles/variables.css)
        ↓                         ↓
  Component Logic    →    Component Styles
  (Button.tsx)            (Button.module.css)
```

## Token Mappings

### 1. COLOR TOKENS

#### Primary Button
- **Background**: `--color-background-brand` (#3355FF)
- **Hover**: `--color-background-brand-hover` (#2945CE)
- **Pressed**: `--color-background-brand-pressed` (#1F349D)
- **Text**: `--color-text-primary-inverse` (#F2F2F2)

#### Secondary Button
- **Background**: `--color-background-neutral` (#E5E5E5)
- **Hover**: `--color-background-neutral-hover` (#D9D9D9)
- **Pressed**: `--color-background-neutral-pressed` (#CCCCCC)
- **Text**: `--color-text-primary` (#1A1A1A)

#### Tertiary Button
- **Background**: `transparent`
- **Hover**: `--color-background-hover` (#F2F2F2)
- **Pressed**: `--color-background-pressed` (#E5E5E5)
- **Text**: `--color-text-primary` (#1A1A1A)

#### Mono Button
- **Background**: `--color-background-mono` (#1A1A1A)
- **Hover**: `--color-background-mono-hover` (#333333)
- **Pressed**: `--color-background-mono-pressed` (#4C4C4C)
- **Text**: `--color-text-primary-inverse` (#F2F2F2)

#### Outline Variants
- **Background**: `transparent`
- **Border**: `--color-border-primary` (#B3B3B3)
- **Border (Mono)**: `--color-border-mono` (#1A1A1A)
- **Border Width**: `--border-width-l` (2px)

#### Text/Link Variants
- **Text**: `--color-text-link` (#3355FF)
- **Text Hover**: `--color-text-link-hover` (#2945CE)

#### Negative Variants
- **Background**: `--color-background-negative` (#E61A1A)
- **Hover**: `--color-background-negative-hover` (#BA1515)
- **Pressed**: `--color-background-negative-pressed` (#8E1010)
- **Text**: `--color-text-negative` (#BA1515)
- **Text Hover**: `--color-text-negative-hover` (#8E1010)
- **Text Pressed**: `--color-text-negative-pressed` (#620B0B)
- **Border**: `--color-border-negative` (#E61A1A)

#### Focus States
- **Focus Outline**: `--color-border-focus` (#3355FF)
- **Focus Outline Width**: `--border-width-l` (2px)

### 2. SPACING TOKENS

#### Button Padding
- **Size S**: `var(--space-xs)` (4px) vertical, `var(--space-m)` (12px) horizontal
- **Size M**: `var(--space-s)` (8px) vertical, `var(--space-l)` (16px) horizontal
- **Size L**: `var(--space-m)` (12px) vertical, `var(--space-xl)` (24px) horizontal

#### Internal Spacing
- **Content Gap (S)**: `var(--space-xs)` (4px)
- **Content Gap (M)**: `var(--space-s)` (8px)
- **Content Gap (L)**: `var(--space-s)` (8px)
- **Focus Outline Offset**: `var(--space-xs)` (4px)

### 3. TYPOGRAPHY TOKENS

#### Desktop Typography

**Size S & M**
- **Font Weight**: `var(--typography-desktop-label-m-semi-bold-weight)` (Semi Bold / 600)
- **Font Size**: `var(--typography-desktop-label-m-semi-bold-size)` (14px)
- **Line Height**: `var(--typography-desktop-label-m-semi-bold-line-height)` (20px)
- **Letter Spacing**: `var(--typography-desktop-label-m-semi-bold-letter-spacing)` (0px)

**Size L**
- **Font Weight**: `var(--typography-desktop-label-l-semi-bold-weight)` (Semi Bold / 600)
- **Font Size**: `var(--typography-desktop-label-l-semi-bold-size)` (16px)
- **Line Height**: `var(--typography-desktop-label-l-semi-bold-line-height)` (24px)
- **Letter Spacing**: `var(--typography-desktop-label-l-semi-bold-letter-spacing)` (0px)

#### Mobile Typography (Responsive @media max-width: 768px)

**Size S & M**
- **Font Weight**: `var(--typography-mobile-label-m-semi-bold-weight)` (Semi Bold / 600)
- **Font Size**: `var(--typography-mobile-label-m-semi-bold-size)` (14px)
- **Line Height**: `var(--typography-mobile-label-m-semi-bold-line-height)` (20px)
- **Letter Spacing**: `var(--typography-mobile-label-m-semi-bold-letter-spacing)` (0px)

**Size L**
- **Font Weight**: `var(--typography-mobile-label-l-semi-bold-weight)` (Semi Bold / 600)
- **Font Size**: `var(--typography-mobile-label-l-semi-bold-size)` (16px)
- **Line Height**: `var(--typography-mobile-label-l-semi-bold-line-height)` (24px)
- **Letter Spacing**: `var(--typography-mobile-label-l-semi-bold-letter-spacing)` (0px)

### 4. BORDER TOKENS

#### Border Radius
- **Size S & M**: `var(--border-radius-s)` (8px)
- **Size L**: `var(--border-radius-m)` (12px)

#### Border Width
- **Outline Variants**: `var(--border-width-l)` (2px)
- **Focus Outline**: `var(--border-width-l)` (2px)

### 5. SIZE SPECIFICATIONS

| Size | Min Height | Padding (V×H) | Gap | Border Radius | Font Size |
|------|-----------|---------------|-----|---------------|-----------|
| **S** | 32px | 4px × 12px | 4px | 8px | 14px |
| **M** | 40px | 8px × 16px | 8px | 8px | 14px |
| **L** | 48px | 12px × 24px | 8px | 12px | 16px |

## Dark Mode Support

All color tokens automatically adapt to dark mode via the `[data-theme="dark"]` selector in `variables.css`. The Button component requires no additional code - colors are automatically swapped based on the theme attribute.

### Dark Mode Examples

**Primary Button (Dark Mode)**
- Background: `#5A76FF` (lighter blue)
- Hover: `#8196FF`
- Pressed: `#A9B7FF`

**Text Colors (Dark Mode)**
- Primary: `#F2F2F2` (light gray)
- Inverse: `#1A1A1A` (dark gray)

## Usage in Component

### CSS Module (Button.module.css)
```css
.button.primary {
  background-color: var(--color-background-brand);
  color: var(--color-text-primary-inverse);
}

.button.m {
  padding: var(--space-s) var(--space-l);
  border-radius: var(--border-radius-s);
  font-size: var(--typography-desktop-label-m-semi-bold-size);
}
```

### TypeScript Component (Button.tsx)
```tsx
// Component uses CSS modules that reference CSS variables
import styles from './Button.module.css';

// CSS classes are applied based on props
const buttonClasses = [
  styles.button,
  styles[size.toLowerCase()],
  styles[typeClassName],
].join(' ');
```

## Maintenance

When design tokens are updated:

1. **Sync Figma**: `npm run sync:figma` - Updates `figma-export.json`
2. **Generate CSS**: `npm run generate:css-vars` - Updates `variables.css`
3. **Test**: Component automatically uses new token values
4. **Verify**: Check Storybook for visual changes

## Benefits of Token-Based Architecture

✅ **Single Source of Truth**: All values come from Figma design
✅ **Automatic Dark Mode**: Theme switching without code changes
✅ **Easy Updates**: Change tokens once, update everywhere
✅ **Type Safety**: TypeScript tokens with IntelliSense
✅ **CSS Variables**: Native browser support for dynamic theming
✅ **Maintainability**: Clear mapping between design and code

## Related Files

- **Design Tokens (TS)**: `/packages/design-system/src/tokens/`
- **CSS Variables**: `/packages/design-system/src/styles/variables.css`
- **Button Component**: `/packages/design-system/src/components/Button/`
- **Figma Export**: `/packages/design-system/figma-export.json`
- **Generation Script**: `/packages/design-system/scripts/generate-css-variables.js`

## Token Flow Example

```
1. Designer updates button color in Figma
   → Variable: "colors/background/brand" = #3355FF

2. Run sync command
   → npm run sync:figma

3. Updates figma-export.json
   → "background-brand": "#3355FF"

4. Generate CSS variables
   → npm run generate:css-vars

5. Updates variables.css
   → --color-background-brand: #3355FF;

6. Button component uses variable
   → background-color: var(--color-background-brand)

7. Button renders with new color
   → Automatic, no code changes needed!
```

## Accessibility Considerations

All color tokens maintain WCAG 2.1 AA contrast ratios:
- Text on buttons: Minimum 4.5:1
- Focus indicators: Minimum 3:1
- Interactive states: Clear visual feedback

The token system ensures accessibility by design - all colors are pre-validated in Figma before export.
