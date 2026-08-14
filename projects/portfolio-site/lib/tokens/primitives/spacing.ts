/**
 * Primitive Spacing Tokens — Portfolio Site
 *
 * The portfolio adopts the global DS spacing scale verbatim.
 * Re-exported here so the import path follows the same convention
 * as the other portfolio primitives.
 */

import { primitiveSpacing as dsSpacing } from '@jasmine/design-system/primitives';

export const primitiveSpacing = dsSpacing;

export type PrimitiveSpacing = typeof primitiveSpacing;
