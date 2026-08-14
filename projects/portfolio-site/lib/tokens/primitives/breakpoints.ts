/**
 * Primitive Breakpoint Tokens — Portfolio Site
 *
 * Adopts the global DS breakpoints. Re-exported so all portfolio
 * primitives sit behind a uniform import path.
 */

import { primitiveBreakpoints as dsBreakpoints } from '@jasmine/design-system/primitives';

export const primitiveBreakpoints = dsBreakpoints;

export type PrimitiveBreakpoints = typeof primitiveBreakpoints;
