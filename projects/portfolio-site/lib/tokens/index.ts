/**
 * Portfolio Tokens — Top-Level Barrel
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  TOKEN ARCHITECTURE                                             │
 * │                                                                 │
 * │  1. GLOBAL DS PRIMITIVES                                        │
 * │     packages/design-system/src/tokens/primitives/               │
 * │     Raw values auto-generated from Figma. Cross-project.        │
 * │            ↓                                                    │
 * │  2. PORTFOLIO PRIMITIVES                                        │
 * │     lib/tokens/primitives/                                      │
 * │     Re-exports DS primitives + portfolio-specific raw values    │
 * │     (warm grayscale, Amiri serif, custom canvas).               │
 * │            ↓                                                    │
 * │  3. PORTFOLIO SEMANTICS                                         │
 * │     lib/tokens/semantic/                                        │
 * │     Role-named tokens used by components.                       │
 * │            ↓                                                    │
 * │  4. CSS @theme                                                  │
 * │     app/globals.css                                             │
 * │     Mirrors semantic tokens as Tailwind v4 utility classes.     │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * Usage:
 *   // Tailwind classes (preferred)
 *   <div className="bg-canvas text-ink border-line" />
 *
 *   // TypeScript (when dynamic)
 *   import { semanticColors } from '@/lib/tokens';
 *   style={{ color: semanticColors.text.primary }}
 *
 *   // Or import the whole bundle
 *   import { tokens } from '@/lib/tokens';
 *   tokens.colors.text.primary
 */

import * as primitives from './primitives';
import * as semantic   from './semantic';

// Named re-exports — direct access to each layer
export {
  primitiveColors,
  primitiveTypography,
  primitiveSpacing,
  primitiveBreakpoints,
  primitiveBorders,
} from './primitives';

export {
  semanticColors,
  semanticTypography,
  semanticSpacing,
  semanticRadius,
} from './semantic';

export type {
  PrimitiveColors,
  PrimitiveTypography,
  PrimitiveSpacing,
  PrimitiveBreakpoints,
  PrimitiveBorders,
} from './primitives';

export type {
  SemanticColors,
  SemanticTypography,
  SemanticSpacing,
  SemanticRadius,
} from './semantic';

/**
 * Convenience bundle — short aliases via the semantic layer.
 * Use this when you want a single import: `import { tokens } from '@/lib/tokens';`
 */
export const tokens = {
  colors:      semantic.semanticColors,
  typography:  semantic.semanticTypography,
  spacing:     semantic.semanticSpacing,
  radius:      semantic.semanticRadius,
  breakpoints: primitives.primitiveBreakpoints,
} as const;

export type Tokens = typeof tokens;
