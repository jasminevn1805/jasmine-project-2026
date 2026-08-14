/**
 * Design System Tokens
 * 
 * Complete token system with three layers:
 * 
 * 1. PRIMITIVES - Raw values (colors, spacing, etc.)
 *    - Never use directly in components
 *    - Foundation for semantic tokens
 * 
 * 2. SEMANTIC - Purpose-driven tokens
 *    - USE THESE in your components
 *    - Reference primitive values
 *    - Define what tokens MEAN (primary, danger, etc.)
 * 
 * 3. CSS VARIABLES - Bridge to CSS
 *    - Generated from semantic tokens
 *    - Used in CSS files
 * 
 * @example
 * // ❌ DON'T use primitives directly
 * import { primitiveColors } from './tokens/primitives';
 * const color = primitiveColors.blue[500];
 *
 * // ✅ DO use semantic tokens - split by mode (light/dark)
 * import { semanticColors } from './tokens/semantic';
 * const color = semanticColors.light.background.brand;
 */

// Export all primitives (for reference/documentation)
export * from './primitives';

// Export all semantic tokens (USE THESE in components)
export * from './semantic';

// Re-export commonly used tokens with shorter names
export { semanticColors as colors } from './semantic/colors';
export { semanticTypography as typography } from './semantic/typography';
