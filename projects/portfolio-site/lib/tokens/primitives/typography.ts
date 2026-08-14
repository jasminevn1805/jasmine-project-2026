/**
 * Primitive Typography Tokens — Portfolio Site
 *
 * Combines the global DS type scale (size, lineHeight, letterSpacing, weight)
 * with the portfolio's font families. `amiri` and `mono` are DS "product
 * family" primitives (manually added, not Figma-sourced — see
 * packages/design-system/src/tokens/primitives/typography.ts) rather than
 * DS product-UI families like Inter / Plus Jakarta Sans.
 */

import { primitiveTypography as dsTypography } from '@jasmine/design-system/primitives';

export const primitiveTypography = {
  family: {
    /**
     * Editorial display family. The DS primitive (`amiri`) holds the raw
     * font name; the actual @font-face is loaded via next/font/google in
     * app/layout.tsx and exposed as the CSS variable `--font-amiri`. The
     * variable comes first so the loaded font wins — `dsTypography.family.amiri`
     * is a secondary fallback (in case a system install matches by name)
     * ahead of the generic serif stack.
     */
    display: `var(--font-amiri), ${dsTypography.family.amiri}, Georgia, "Times New Roman", serif`,
    /** System sans fallback — used sparingly (eyebrows, labels). */
    sans:    dsTypography.family.inter,
    /** Monospace — used for project meta, dates, technical details. */
    mono:    dsTypography.family.mono,
  },

  /** Re-export the DS size scale verbatim — same numeric values, same names. */
  size:          dsTypography.size,
  lineHeight:    dsTypography.lineHeight,
  letterSpacing: dsTypography.letterSpacing,
  weight:        dsTypography.weight,
} as const;

export type PrimitiveTypography = typeof primitiveTypography;
