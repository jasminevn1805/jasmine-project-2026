/**
 * Primitive Color Tokens — Portfolio Site
 *
 * RAW VALUES with no semantic meaning.
 * The portfolio uses a warm-leaning grayscale palette that is intentionally
 * distinct from the global DS neutrals (which skew cooler / more clinical).
 *
 * Formerly a partial fork (some steps re-exported from the DS, others
 * hand-copied hex requiring "update both files together" whenever a value
 * changed). The whole palette now lives in the DS's shared primitives as
 * its own scale - `primitiveColors.warmGray` - so every step here is a
 * plain re-export, zero hardcoded hex. This file keeps portfolio's own
 * `neutral` / `canvas` naming (its semantic layer and every component
 * downstream already use these names) - only the *source* of the values
 * changed, not the API this file exposes.
 *
 * Rule: components NEVER reference this file directly.
 *       Always go through `semantic/` for role-based tokens.
 */

import { primitiveColors as dsColors } from '@jasmine/design-system/primitives';

export const primitiveColors = {
  neutral: {
    0:   dsColors.warmGray['0'],
    50:  dsColors.warmGray['50'],
    100: dsColors.warmGray['100'],
    200: dsColors.warmGray['200'],
    300: dsColors.warmGray['300'],
    400: dsColors.warmGray['400'],
    500: dsColors.warmGray['500'],
    600: dsColors.warmGray['600'],
    700: dsColors.warmGray['700'],
    800: dsColors.warmGray['800'],
    900: dsColors.warmGray['900'],
  },

  /**
   * Page canvas — sits between pure white and warm neutral 50.
   * Portfolio-specific: cooler than DS warmNeutral['0'] (#fafaf8)
   * to keep the grid feel crisp.
   */
  canvas: dsColors.warmGray.canvas,
} as const;

export type PrimitiveColors = typeof primitiveColors;
