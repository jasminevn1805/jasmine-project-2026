/**
 * Primitive Shadow Tokens
 * 
 * Raw shadow values for elevation and depth.
 */

export const primitiveShadows = {
  // Elevation shadows
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  s: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  m: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  l: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Special shadows
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',

  // Focus rings
  focusRing: '0 0 0 3px rgba(51, 85, 255, 0.4)',
  focusRingError: '0 0 0 3px rgba(230, 26, 26, 0.4)',
} as const;

// Type for autocomplete
export type PrimitiveShadows = typeof primitiveShadows;
