/**
 * Semantic Radius Tokens — Portfolio Site
 *
 * Maps primitive border-radius values to the t-shirt scale mirrored in
 * `app/globals.css` (--radius-*). STRUCTURE follows the same pattern as
 * `semantic/spacing.ts`.
 *
 * DS primitives store xS–xL2 as unitless numbers (Figma export), so `px`
 * is appended here to produce valid CSS length values. `pill` is already
 * a px string in the DS source.
 */

import { primitiveBorders } from '../primitives/borders';

const radius = primitiveBorders.borderRadius;

export const semanticRadius = {
  xs:    `${radius.xS}px`,  // 4px
  sm:    `${radius.s}px`,   // 8px
  md:    `${radius.m}px`,   // 12px
  lg:    `${radius.l}px`,   // 16px
  xl:    `${radius.xL}px`,  // 24px
  '2xl': `${radius.xL2}px`, // 32px
  pill:  radius.pill,       // 999px
} as const;

export type SemanticRadius = typeof semanticRadius;
