/**
 * Primitive Tokens — Index
 *
 * Re-exports every primitive token group for the portfolio site.
 * These are RAW VALUES with no semantic meaning — components should
 * never import from this file directly. Use `semantic/` instead.
 *
 * Mirrors the structure of `packages/design-system/src/tokens/primitives/`.
 */

export { primitiveColors }      from './colors';
export { primitiveTypography }  from './typography';
export { primitiveSpacing }     from './spacing';
export { primitiveBreakpoints } from './breakpoints';
export { primitiveBorders }     from './borders';

export type { PrimitiveColors }      from './colors';
export type { PrimitiveTypography }  from './typography';
export type { PrimitiveSpacing }     from './spacing';
export type { PrimitiveBreakpoints } from './breakpoints';
export type { PrimitiveBorders }     from './borders';
