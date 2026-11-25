/**
 * Primitive Typography Tokens
 * 
 * Raw typography values
 * 
 * Auto-generated from Figma export.
 * Do not edit manually - run 'npm run sync:figma' to update.
 */

export const primitiveTypography = {
  family: {
    inter: 'Inter',
    sFProText: 'SF Pro Text',
    roboto: 'Roboto',
    plusJakartaSans: 'Plus Jakarta Sans',
    amiri: 'Amiri',
    mono: 'ui-monospace',
    instrumentSans: 'Instrument Sans'
  },
  weight: {
    light: 'Light',
    regular: 'Regular',
    semiBold: 'Semi Bold'
  },
  size: {
    xS: 10,
    s: 12,
    m: 14,
    l: 16,
    xL: 18,
    xL2: 20,
    xL3: 24,
    xL4: 28,
    xL5: 32,
    xL6: 40,
    xL7: 48,
    xL8: 56,
    xL9: 64,
    xL10: 72
  },
  lineHeight: {
    xS: 14,
    s: 16,
    m: 20,
    l: 24,
    xL: 26,
    xL2: 28,
    xL3: 32,
    xL4: 36,
    xL5: 40,
    xL6: 48,
    xL7: 56,
    xL8: 64,
    xL9: 72,
    xL10: 80
  },
  letterSpacing: {
    xS: -1,
    s: -0.5,
    none: 0
  }
} as const;

// Type for autocomplete
export type PrimitiveTypography = typeof primitiveTypography;
