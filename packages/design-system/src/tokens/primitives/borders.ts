/**
 * Primitive Border Tokens
 * 
 * Raw border radius and width values that reference primitive units
 * 
 * Auto-generated from Figma export.
 * Do not edit manually - run 'npm run sync:figma' to update.
 */

import { primitiveUnits } from './units';

export const primitiveBorders = {
  borderRadius: {
    none: '0px',
    xS: primitiveUnits.unit[4],
    s: primitiveUnits.unit[8],
    m: primitiveUnits.unit[12],
    l: primitiveUnits.unit[16],
    xL: primitiveUnits.unit[24],
    xL2: primitiveUnits.unit[32],
    xL3: primitiveUnits.unit[40],
    xL4: primitiveUnits.unit[48],
    xL5: primitiveUnits.unit[56],
    xL6: primitiveUnits.unit[64],
    pill: '999px'
  },
  borderWidth: {
    none: '0px',
    xS: '0.5px',
    s: '1px',
    m: '1.5px',
    l: primitiveUnits.unit[2],
    xL: primitiveUnits.unit[4],
    xL2: primitiveUnits.unit[8]
  }
} as const;

// Type for autocomplete
export type PrimitiveBorders = typeof primitiveBorders;
