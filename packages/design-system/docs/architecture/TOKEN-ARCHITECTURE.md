# Design Token Architecture

## Overview

Design tokens flow from Figma to two generated outputs, both derived from the same source data:

```
┌─────────────────┐
│  Figma Design    │
│   (Source)       │
└────────┬─────────┘
         │  manual export via Figma plugin
         ↓
┌──────────────────┐
│ figma-export.json│
│  (raw export)     │
└────────┬─────────┘
         │  npm run sync:figma  →  scripts/convert-figma-tokens.js
         ↓
┌───────────────────────┐
│  TypeScript Tokens     │
│  src/tokens/           │
├───────────────────────┤
│ primitives/*.ts        │
│ semantic/*.ts           │
└────────┬──────────────┘
         │  npm run generate:css-vars  →  scripts/generate-css-from-ts.js
         ↓
┌───────────────────────┐
│  CSS Variables          │
│  src/styles/variables.css│
└───────────────────────┘
```

`npm run sync:all` runs both steps in sequence. There is no separate Figma-API-fetch
step today — `sync:figma` converts the JSON file already sitting in the repo
(`figma-export.json`), which itself is refreshed by manually re-exporting from Figma
via a plugin. The npm script name is a bit aspirational; it doesn't talk to Figma
over the network.

For the brand/mode contract this architecture implements (`data-theme`, `data-mode`,
`@layer` order, and the rules project theme files follow), see
**[THEMING-CONTRACT.md](./THEMING-CONTRACT.md)** — that document is the authoritative
spec. This document covers the token *pipeline* (Figma → TS → CSS); THEMING-CONTRACT
covers how the *output* is structured and consumed.

## Token layers

### 1. Primitives (foundation)

Raw, context-free values. **Never used directly in components.**

```typescript
// src/tokens/primitives/colors.ts
export const primitiveColors = {
  neutral: { '0': '#ffffff', '900': '#1a1a1a', ... },
  brand:   { '500': '#3355ff', ... },   // Figma's own "Brand" primitive scale
  blue:    { '500': '#3355ff', ... },
  green:   { '500': '#009933', ... },
  red:     { '500': '#e61a1a', ... },
  warmNeutral:  { '500': '#7d7d7c', ... },  // see "Local primitive additions" below
  forestGreen:  { '500': '#2d6a4f', ... },  // see "Local primitive additions" below
};
```

**Important caveat — local primitive additions.** `figma-export.json` is not
currently complete: it's missing `warmNeutral`, `forestGreen` (both colors), and
`plusJakartaSans` (a typography family) — all three of which shipped code already
depends on (`meal-prep/app/theme.css` references
`--primitive-warm-neutral-*`, `--primitive-forest-green-*`, and
`--primitive-typography-family-plus-jakarta-sans`). Regenerating purely from
`figma-export.json` would silently delete them — confirmed by actually running the
converter and diffing the output.

`scripts/convert-figma-tokens.js` merges these back in via
`LOCAL_PRIMITIVE_COLOR_ADDITIONS` / `LOCAL_PRIMITIVE_TYPOGRAPHY_FAMILY_ADDITIONS`
(defined near the top of the file), so re-running `sync:figma` doesn't lose them.
This is meant as temporary scaffolding — once Figma's own export includes an
entry, delete it from the local-additions block so `figma-export.json` goes back
to being the single source for it. If you see the converter emitting an unfamiliar
color scale or font family that also isn't in `LOCAL_PRIMITIVE_*` — that's just
Figma's export having grown a new scale (this already happened once: `brand` was
added to Figma's `Primitive: Color` collection after this file was last regenerated).

### 2. Semantic (purpose-driven, split by mode)

References primitives, gives them meaning by role. **Use these in components.**
Split into `light` and `dark` — both branches exist because Figma's
`Semantic: Color` collection has `Light` and `Dark` modes, and the converter now
converts both (it used to silently keep only the first mode it found).

```typescript
// src/tokens/semantic/colors.ts
export const semanticColors = {
  light: {
    text:       { primary: primitiveColors.neutral[900], brand: primitiveColors.brand[500], ... },
    background: { primary: primitiveColors.neutral[0],   brand: primitiveColors.brand[500], ... },
  },
  dark: {
    text:       { primary: primitiveColors.neutral[50],  brand: primitiveColors.brand[400], ... },
    background: { primary: primitiveColors.neutral[900], brand: primitiveColors.brand[400], ... },
  },
};
```

Access as `semanticColors.light.text.primary` / `semanticColors.dark.text.primary`.

### 3. CSS variables (bridge to CSS, `@layer`-scoped)

Generated from `semantic/colors.ts` by `generate-css-from-ts.js`. The two color
modes become two separate `@layer` blocks with the *same* variable names, scoped
by the `data-mode` attribute — this is what lets a project's `theme.css` override
a single variable without needing to know which mode is active:

```css
@layer primitives, brand-light, brand-dark, theme, theme-mode;

@layer primitives {
  :root { --primitive-neutral-900: #1a1a1a; /* ... */ }
}

@layer brand-light {
  :root, [data-mode="light"] { --color-text-primary: #1a1a1a; /* ... */ }
}

@layer brand-dark {
  [data-mode="dark"] { --color-text-primary: #f2f2f2; /* ... */ }
}
```

`theme` and `theme-mode` are reserved, empty layers — populated by each
*project's* `theme.css` / `theme.dark.css`, never by this package. Full detail
on that mechanism, including why `@layer` (not `@import` order) decides
precedence, is in [THEMING-CONTRACT.md](./THEMING-CONTRACT.md).

Everything that isn't part of the color/mode axis today — typography scale,
spacing, border radius/width, breakpoints — doesn't have Light/Dark variants in
Figma, so it lives inside `@layer primitives` alongside the raw palette rather
than getting its own layer.

## Scripts workflow

### 1. Convert Figma export → TypeScript
```bash
npm run sync:figma
```
Reads `figma-export.json`, writes `src/tokens/primitives/*.ts` and
`src/tokens/semantic/*.ts`. Script: `scripts/convert-figma-tokens.js`.

### 2. Generate CSS variables from TypeScript
```bash
npm run generate:css-vars
```
Reads the TS token files (via a throwaway `tsc` compile to a temp dir), writes
`src/styles/variables.css`. Script: `scripts/generate-css-from-ts.js`.

### Both together
```bash
npm run sync:all
```

### Then, to actually ship it
```bash
npm run build
```
Runs `vite build` (bundles components + copies `variables.css` → `dist/style.css`)
then `scripts/copy-tokens-css.js` (produces `dist/tokens.css`, the
variables-only entry point that Tailwind-based projects like portfolio-site
import instead of the full reset+globals `dist/style.css`). Neither `sync:all`
nor `generate:css-vars` touches `dist/` on their own — you need `build` after
them for consumers to actually see the change.

## When to use each format

| Scenario | TypeScript tokens | CSS variables |
|---|---|---|
| React inline styles / conditionals | ✅ | ❌ |
| CSS Modules / plain CSS | ❌ | ✅ `var(--color-text-primary)` |
| Runtime theming (brand or mode switch) | ❌ | ✅ `<html data-theme="..." data-mode="...">` |
| Type checking | ✅ | ❌ |

In practice, no shipped component currently imports `semanticColors` at runtime —
every component's `.module.css` uses `var(--token-name)` exclusively. The
TypeScript export exists for type safety and for any future code that needs to
reason about a token value in JS (e.g. computing something from
`primitiveSpacing`), not because components consume it directly today.

## FAQ

**Should I edit `variables.css` directly?** No — it's regenerated by
`generate:css-vars` from the TypeScript tokens, which are themselves regenerated
by `sync:figma` from `figma-export.json`. Edit the TypeScript tokens directly only
for the local-additions case described above; everything else should come from
Figma.

**Can primitives and semantics ever go out of sync?** Not structurally — both
CSS and TypeScript are generated from the same TypeScript token files in one
pipeline run. What *can* drift is `figma-export.json` itself vs. what's actually
depended on downstream (see the local-additions caveat) — that's a real, observed
failure mode, not a hypothetical, so re-run `sync:all` and skim the diff before
trusting it blindly.

**How do I add a new token?** Add it in Figma, re-export
`figma-export.json`, run `npm run sync:all`, then `npm run build` so `dist/`
picks it up.
