# Typography T-Shirt Sizing System

## Overview

The typography system has been converted from traditional h1-h6 semantic elements to a flexible, class-based t-shirt sizing system. This allows you to apply typography styles to any HTML element without being constrained by semantic markup.

## Benefits

1. **Flexibility**: Apply heading styles to divs, spans, or any element
2. **Semantic HTML**: Use proper semantic tags (h1-h6) for SEO/accessibility, style them as needed
3. **Consistency**: All typography follows the same sizing scale
4. **Maintainability**: Easy to adjust styles across the entire design system

## Available Classes

### Headings (10 sizes)
- `.heading-5xl` - Hero/Landing page titles (72px desktop)
- `.heading-4xl` - Section titles (60px desktop)
- `.heading-3xl` - Sub-section titles (48px desktop)
- `.heading-2xl` - (40px desktop)
- `.heading-xl` - (32px desktop)
- `.heading-l` - (28px desktop)
- `.heading-m` - (24px desktop)
- `.heading-s` - (20px desktop)
- `.heading-xs` - (16px desktop)
- `.heading-2xs` - (14px desktop)

### Text (6 sizes)
- `.text-2xl` - Large body text (24px desktop)
- `.text-xl` - (20px desktop)
- `.text-l` - Standard body text (18px desktop)
- `.text-m` - (16px desktop)
- `.text-s` - Small text (14px desktop)
- `.text-xs` - Captions/helper text (12px desktop)

### Labels (3 sizes)
- `.label-l` - Large form labels (18px, semi-bold)
- `.label-m` - Standard form labels (16px, semi-bold)
- `.label-s` - Small form labels (14px, semi-bold)

### Links (3 sizes)
- `.link-l` - Large navigation links (18px)
- `.link-m` - Standard navigation links (16px)
- `.link-s` - Small links (14px)

## Utility Classes

### Font Weight
- `.font-light` - 300 weight
- `.font-regular` - 400 weight
- `.font-semibold` - 600 weight
- `.font-bold` - 700 weight

### Text Color
- `.text-primary` - Primary text color
- `.text-secondary` - Secondary text color
- `.text-tertiary` - Tertiary text color
- `.text-brand` - Brand color
- `.text-warning` - Warning color
- `.text-negative` - Error/negative color
- `.text-positive` - Success/positive color
- `.text-inverse` - Inverse color (for dark backgrounds)
- `.text-link` - Link color

### Text Alignment
- `.text-left` - Left align
- `.text-center` - Center align
- `.text-right` - Right align

### Text Truncation
- `.truncate` - Single line ellipsis
- `.line-clamp-2` - Truncate to 2 lines
- `.line-clamp-3` - Truncate to 3 lines

## Usage Examples

### Basic Usage

```html
<!-- Use semantic HTML with typography classes -->
<h1 class="heading-5xl">Hero Title</h1>
<h2 class="heading-3xl">Section Title</h2>
<p class="text-l">Body paragraph text</p>
```

### Non-Semantic Usage

```html
<!-- Apply heading styles to non-heading elements -->
<div class="heading-4xl">Card Title</div>
<span class="text-s">Small helper text</span>
```

### Combining Classes

```html
<!-- Combine size + weight + color -->
<h1 class="heading-5xl font-light text-brand">Light Brand Hero</h1>
<p class="text-xl font-semibold text-center">Bold Centered Text</p>
<a href="#" class="link-l font-bold">Bold Large Link</a>
```

### Form Labels

```html
<label class="label-m" for="email">Email Address</label>
<input type="email" id="email" />

<label class="label-s text-secondary">Optional field</label>
```

### Responsive Typography

All typography classes automatically adjust for mobile:
- Desktop styles apply at widths > 768px
- Mobile styles apply at widths ≤ 768px
- No additional classes needed!

```html
<!-- This heading will automatically resize on mobile -->
<h1 class="heading-5xl">Responsive Hero</h1>
```

## React Component Usage

### With Typography Component (coming soon)

```tsx
<Typography variant="heading" size="5xl" weight="light">
  Hero Title
</Typography>

<Typography variant="text" size="l">
  Body paragraph
</Typography>

<Typography variant="label" size="m">
  Form Label
</Typography>

<Typography variant="link" size="l" href="/about">
  Navigation Link
</Typography>
```

### Without Typography Component

```tsx
<h1 className="heading-5xl font-light text-brand">
  Hero Title
</h1>

<p className="text-l">
  Body paragraph
</p>

<label className="label-m">
  Form Label
</label>

<a href="/about" className="link-l">
  Navigation Link
</a>
```

## Migration Guide

### Before (Old h1-h6 System)
```html
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>
<p>Paragraph</p>
```

### After (T-Shirt Sizing)
```html
<h1 class="heading-5xl">Main Title</h1>
<h2 class="heading-3xl">Section Title</h2>
<h3 class="heading-xl">Subsection</h3>
<p class="text-l">Paragraph</p>
```

## Best Practices

1. **Maintain Semantic HTML**: Still use h1-h6 for SEO and accessibility, but style them with classes
2. **Use Consistent Sizes**: Pick 2-3 text sizes and stick to them throughout your app
3. **Respect the Scale**: Don't jump from heading-5xl to heading-xs in the same context
4. **Combine Wisely**: Use utilities to enhance, not replace, base typography classes
5. **Test Responsive**: Always check typography on mobile devices

## CSS Variables Used

All typography classes reference CSS custom properties from `variables.css`:

```css
/* Example: heading-5xl uses these variables */
--typography-desktop-heading-5-xl-regular-family
--typography-desktop-heading-5-xl-regular-size
--typography-desktop-heading-5-xl-regular-weight
--typography-desktop-heading-5-xl-regular-line-height
--typography-desktop-heading-5-xl-regular-letter-spacing
```

Mobile overrides are applied automatically via media query:
```css
@media (max-width: 768px) {
  --typography-mobile-heading-5-xl-regular-size: 48px;
  /* ... other mobile overrides */
}
```

## Testing

Open `typography-example.html` in your browser to see all typography classes in action.

```bash
# From packages/design-system directory
open src/styles/typography-example.html
```

## Notes

- All typography styles automatically support dark mode via CSS custom properties
- Font families default to Inter with system font fallbacks
- Line heights, letter spacing, and sizes are optimized per Figma design system
- Mobile typography automatically scales down for better readability on small screens
