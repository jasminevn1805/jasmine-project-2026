/**
 * Semantic Spacing Tokens — Portfolio Site
 *
 * Maps primitive numeric spacing to t-shirt size names.
 * STRUCTURE mirrors the global DS semantic spacing exactly,
 * extended with `6xl` for the larger section gaps the portfolio uses.
 */

import { primitiveSpacing } from '../primitives/spacing';

export const semanticSpacing = {
  xs:    primitiveSpacing['4'],     // 4px   — tight inline
  s:     primitiveSpacing['8'],     // 8px   — chip / button padding
  m:     primitiveSpacing['12'],    // 12px  — default gap
  l:     primitiveSpacing['16'],    // 16px  — card padding
  xl:    primitiveSpacing['24'],    // 24px  — block gap
  '2xl': primitiveSpacing['32'],    // 32px  — small section
  '3xl': primitiveSpacing['40'],    // 40px  — section padding
  '4xl': primitiveSpacing['64'],    // 64px  — large section
  '5xl': primitiveSpacing['80'],    // 80px  — major section break
  '6xl': primitiveSpacing['120'],   // 120px — hero / page rhythm (portfolio-specific)
} as const;

export type SemanticSpacing = typeof semanticSpacing;
