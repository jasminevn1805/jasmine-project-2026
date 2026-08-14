/**
 * Semantic Color Tokens — Portfolio Site
 *
 * Maps role-based names to portfolio primitives.
 * This is the API components should use.
 *
 * STRUCTURE mirrors the global DS semantic colors:
 *   text.*       — anything that renders as type
 *   background.* — page, surface, and elevated backgrounds
 *   border.*     — dividers, outlines, focus rings
 *
 * RULE: only reference `primitiveColors` here. Never hardcode hex values.
 */

import { primitiveColors } from '../primitives/colors';

export const semanticColors = {
  text: {
    /** Headlines, body copy, primary content. */
    primary:   primitiveColors.neutral[900],
    /** Subheads, supporting copy, label text. */
    secondary: primitiveColors.neutral[600],
    /** Hint text, captions, decorative meta. */
    muted:     primitiveColors.neutral[400],
    /** Disabled controls / placeholder text. */
    disabled:  primitiveColors.neutral[300],
    /** Type that sits on dark backgrounds. */
    inverse:   primitiveColors.neutral[0],
  },

  background: {
    /** Page / body background — the canvas. */
    canvas:  primitiveColors.canvas,
    /** Cards, image placeholders, elevated surfaces. */
    surface: primitiveColors.neutral[50],
    /** Filled buttons, dark sections, inverted blocks. */
    inverse: primitiveColors.neutral[900],
  },

  border: {
    /** Default dividers, hairlines between sections. */
    subtle: primitiveColors.neutral[100],
    /** Hover state for interactive borders. */
    strong: primitiveColors.neutral[600],
    /** High-contrast outline (filled-button borders). */
    bold:   primitiveColors.neutral[900],
  },
} as const;

export type SemanticColors = typeof semanticColors;
