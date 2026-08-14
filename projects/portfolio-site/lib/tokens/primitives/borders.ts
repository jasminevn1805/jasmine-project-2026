/**
 * Primitive Border Tokens — Portfolio Site
 *
 * The portfolio adopts the global DS border-radius scale verbatim.
 * Re-exported here so the import path follows the same convention
 * as the other portfolio primitives.
 */

import { primitiveBorders as dsBorders } from '@jasmine/design-system/primitives';

export const primitiveBorders = dsBorders;

export type PrimitiveBorders = typeof primitiveBorders;
