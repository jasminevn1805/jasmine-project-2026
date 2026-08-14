/**
 * Semantic Spacing Tokens
 * 
 * Maps primitive numeric spacing to semantic size names.
 * Used for component spacing (padding, margin, gap).
 */

import { primitiveSpacing } from '../primitives/spacing';

export const semanticSpacing = {
  xs: primitiveSpacing['4'],      // 4px
  s: primitiveSpacing['8'],       // 8px
  m: primitiveSpacing['12'],      // 12px
  l: primitiveSpacing['16'],      // 16px
  xl: primitiveSpacing['24'],     // 24px
  '2xl': primitiveSpacing['32'],  // 32px
  '3xl': primitiveSpacing['40'],  // 40px
  '4xl': primitiveSpacing['64'],  // 64px
  '5xl': primitiveSpacing['80'],  // 80px
} as const;
