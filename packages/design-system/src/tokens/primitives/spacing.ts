/**
 * Primitive Spacing Tokens
 * 
 * Raw spacing scale derived from Figma Units.
 * References primitiveUnits from units.ts
 * 
 * Auto-generated from Figma export.
 * Do not edit manually - run 'npm run sync:figma' to update.
 */

import { primitiveUnits } from './units';

export const primitiveSpacing = {
  // Special values
  '0': '0px',
  
  // Standard scale from Figma units
  '2': `${primitiveUnits.unit['2']}px`,      // 2px
  '4': `${primitiveUnits.unit['4']}px`,      // 4px
  '8': `${primitiveUnits.unit['8']}px`,      // 8px
  '10': `${primitiveUnits.unit['10']}px`,    // 10px
  '12': `${primitiveUnits.unit['12']}px`,    // 12px
  '14': `${primitiveUnits.unit['14']}px`,    // 14px
  '16': `${primitiveUnits.unit['16']}px`,    // 16px
  '18': `${primitiveUnits.unit['18']}px`,    // 18px
  '20': `${primitiveUnits.unit['20']}px`,    // 20px
  '24': `${primitiveUnits.unit['24']}px`,    // 24px
  '26': `${primitiveUnits.unit['26']}px`,    // 26px
  '28': `${primitiveUnits.unit['28']}px`,    // 28px
  '32': `${primitiveUnits.unit['32']}px`,    // 32px
  '36': `${primitiveUnits.unit['36']}px`,    // 36px
  '40': `${primitiveUnits.unit['40']}px`,    // 40px
  '48': `${primitiveUnits.unit['48']}px`,    // 48px
  '56': `${primitiveUnits.unit['56']}px`,    // 56px
  '64': `${primitiveUnits.unit['64']}px`,    // 64px
  '72': `${primitiveUnits.unit['72']}px`,    // 72px
  '80': `${primitiveUnits.unit['80']}px`,    // 80px
  '88': `${primitiveUnits.unit['88']}px`,    // 88px
  '96': `${primitiveUnits.unit['96']}px`,    // 96px
  '104': `${primitiveUnits.unit['104']}px`,  // 104px
  '112': `${primitiveUnits.unit['112']}px`,  // 112px
  '120': `${primitiveUnits.unit['120']}px`,  // 120px
} as const;

// Type for autocomplete
export type PrimitiveSpacing = typeof primitiveSpacing;
