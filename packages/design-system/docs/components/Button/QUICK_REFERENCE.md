# Quick Reference: Using Design Tokens in Button Component

## 🎯 Quick Start

### In CSS Modules
```css
/* ✅ DO - Use semantic CSS variables */
.myButton {
  background-color: var(--color-background-brand);
  padding: var(--space-m) var(--space-xl);
  border-radius: var(--border-radius-m);
  font-size: var(--typography-desktop-label-l-semi-bold-size);
}

/* ❌ DON'T - Use hardcoded values */
.myButton {
  background-color: #3355FF;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
}
```

### In TypeScript (for inline styles or JS logic)
```tsx
import { semanticColors, semanticSpacing } from '@/tokens';

// ✅ DO - Use TypeScript tokens
const styles = {
  backgroundColor: semanticColors.background.brand,
  padding: `${semanticSpacing.m}px ${semanticSpacing.xl}px`,
};

// ❌ DON'T - Use hardcoded values
const styles = {
  backgroundColor: '#3355FF',
  padding: '12px 24px',
};
```

## 📊 Token Categories

### 1. Colors
```css
/* Backgrounds */
--color-background-brand
--color-background-brand-hover
--color-background-brand-pressed
--color-background-neutral
--color-background-negative

/* Text */
--color-text-primary
--color-text-primary-inverse
--color-text-link
--color-text-negative

/* Borders */
--color-border-primary
--color-border-focus
--color-border-negative
```

### 2. Spacing
```css
--space-xs    /* 4px  - Tight gaps */
--space-s     /* 8px  - Small padding */
--space-m     /* 12px - Medium padding */
--space-l     /* 16px - Default padding */
--space-xl    /* 24px - Large padding */
--space-2-xl  /* 32px - Extra large */
```

### 3. Typography
```css
/* Desktop Labels */
--typography-desktop-label-m-semi-bold-size         /* 14px */
--typography-desktop-label-m-semi-bold-line-height  /* 20px */
--typography-desktop-label-m-semi-bold-weight       /* 600 */
--typography-desktop-label-m-semi-bold-letter-spacing

--typography-desktop-label-l-semi-bold-size         /* 16px */
--typography-desktop-label-l-semi-bold-line-height  /* 24px */

/* Mobile Labels (use in @media queries) */
--typography-mobile-label-m-semi-bold-size
--typography-mobile-label-l-semi-bold-size
```

### 4. Borders
```css
/* Border Radius */
--border-radius-s     /* 8px  - Small buttons */
--border-radius-m     /* 12px - Large buttons */
--border-radius-l     /* 16px - Cards */

/* Border Width */
--border-width-s      /* 1px   - Subtle borders */
--border-width-l      /* 2px   - Outline buttons */
--border-width-xl     /* 4px   - Strong emphasis */
```

## 🎨 Button Variant Patterns

### Primary Button
```css
.primary {
  background-color: var(--color-background-brand);
  color: var(--color-text-primary-inverse);
}

.primary:hover {
  background-color: var(--color-background-brand-hover);
}

.primary:active {
  background-color: var(--color-background-brand-pressed);
}
```

### Secondary Button
```css
.secondary {
  background-color: var(--color-background-neutral);
  color: var(--color-text-primary);
}

.secondary:hover {
  background-color: var(--color-background-neutral-hover);
}
```

### Outline Button
```css
.outline {
  background-color: transparent;
  color: var(--color-text-primary);
  border: var(--border-width-l) solid var(--color-border-primary);
}

.outline:hover {
  background-color: var(--color-background-hover);
}
```

### Negative/Destructive Button
```css
.negative {
  background-color: var(--color-background-negative);
  color: var(--color-text-primary-inverse);
}

.negative:hover {
  background-color: var(--color-background-negative-hover);
}

.negative:active {
  background-color: var(--color-background-negative-pressed);
}
```

## 📐 Size Patterns

### Small Button
```css
.button-small {
  padding: var(--space-xs) var(--space-m);     /* 4px 12px */
  border-radius: var(--border-radius-s);       /* 8px */
  font-size: var(--typography-desktop-label-m-semi-bold-size);
  line-height: var(--typography-desktop-label-m-semi-bold-line-height);
  min-height: 32px;
}
```

### Medium Button (Default)
```css
.button-medium {
  padding: var(--space-s) var(--space-l);      /* 8px 16px */
  border-radius: var(--border-radius-s);       /* 8px */
  font-size: var(--typography-desktop-label-m-semi-bold-size);
  min-height: 40px;
}
```

### Large Button
```css
.button-large {
  padding: var(--space-m) var(--space-xl);     /* 12px 24px */
  border-radius: var(--border-radius-m);       /* 12px */
  font-size: var(--typography-desktop-label-l-semi-bold-size);
  min-height: 48px;
}
```

## 🎯 Interactive States Pattern

```css
/* Default state - use semantic tokens */
.interactive {
  background-color: var(--color-background-brand);
  color: var(--color-text-primary-inverse);
}

/* Hover state - use *-hover tokens */
.interactive:hover:not(:disabled) {
  background-color: var(--color-background-brand-hover);
}

/* Active/Pressed state - use *-pressed tokens */
.interactive:active:not(:disabled) {
  background-color: var(--color-background-brand-pressed);
}

/* Focus state - always use border-focus */
.interactive:focus-visible {
  outline: var(--border-width-l) solid var(--color-border-focus);
  outline-offset: var(--space-xs);
}

/* Disabled state - rely on opacity */
.interactive:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
```

## 📱 Responsive Pattern

```css
/* Desktop typography (default) */
.responsive-text {
  font-size: var(--typography-desktop-label-m-semi-bold-size);
  line-height: var(--typography-desktop-label-m-semi-bold-line-height);
}

/* Mobile typography (override) */
@media (max-width: 768px) {
  .responsive-text {
    font-size: var(--typography-mobile-label-m-semi-bold-size);
    line-height: var(--typography-mobile-label-m-semi-bold-line-height);
  }
}
```

## 🌓 Dark Mode Pattern

```css
/* No code needed! Just use semantic tokens */
.auto-dark-mode {
  background-color: var(--color-background-brand);
  color: var(--color-text-primary);
}

/* CSS variables automatically update based on [data-theme="dark"] */
```

### How to Toggle Dark Mode
```tsx
// Set theme attribute on root element
document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.setAttribute('data-theme', 'light');
```

## 🚫 Common Mistakes

### ❌ Don't Do This
```css
/* Hardcoded colors */
color: #3355FF;
background: #1a1a1a;

/* Hardcoded spacing */
padding: 12px 24px;
margin: 16px;

/* Hardcoded typography */
font-size: 14px;
line-height: 20px;

/* Magic numbers */
border-radius: 8px;
border: 2px solid #000;
```

### ✅ Do This Instead
```css
/* Semantic color tokens */
color: var(--color-text-brand);
background: var(--color-background-primary);

/* Spacing tokens */
padding: var(--space-m) var(--space-xl);
margin: var(--space-l);

/* Typography tokens */
font-size: var(--typography-desktop-label-m-semi-bold-size);
line-height: var(--typography-desktop-label-m-semi-bold-line-height);

/* Border tokens */
border-radius: var(--border-radius-s);
border: var(--border-width-l) solid var(--color-border-primary);
```

## 🔍 Finding the Right Token

### For Colors
1. Ask: "What is the semantic meaning?" (brand, negative, neutral, etc.)
2. Ask: "What element?" (background, text, border, icon)
3. Ask: "What state?" (default, hover, pressed, disabled)
4. Pattern: `--color-{element}-{semantic}-{state}`

Examples:
- `--color-background-brand-hover`
- `--color-text-negative-pressed`
- `--color-border-focus`

### For Spacing
1. Ask: "How much space?" (xs=4px, s=8px, m=12px, l=16px, xl=24px)
2. Pattern: `--space-{size}`

Examples:
- `--space-xs` for tight gaps
- `--space-l` for comfortable padding
- `--space-xl` for spacious layouts

### For Typography
1. Ask: "Desktop or mobile?"
2. Ask: "Text type?" (heading, text, label, link)
3. Ask: "Size?" (xs, s, m, l, xl, 2xl, etc.)
4. Ask: "Weight?" (light, regular, semi-bold)
5. Pattern: `--typography-{device}-{type}-{size}-{weight}-{property}`

Examples:
- `--typography-desktop-label-m-semi-bold-size`
- `--typography-mobile-heading-l-regular-line-height`

## 📚 Full Token Reference

See `variables.css` for the complete list of available tokens:
- `/packages/design-system/src/styles/variables.css`

Or check TypeScript tokens:
- `/packages/design-system/src/tokens/`

## 🛠 Tools & Commands

```bash
# View all available tokens
cat packages/design-system/src/styles/variables.css

# Sync latest design from Figma
npm run sync:figma

# Regenerate CSS variables
npm run generate:css-vars

# View in Storybook
npm run storybook
```

---

**Remember**: Always use semantic tokens, never hardcode values!
