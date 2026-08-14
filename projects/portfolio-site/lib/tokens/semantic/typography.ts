/**
 * Semantic Typography Tokens — Portfolio Site
 *
 * Purpose-driven type styles. Each token bundles family + size +
 * lineHeight + letterSpacing + weight into a single role.
 *
 * STRUCTURE mirrors the global DS semantic typography (purpose-named slots),
 * trimmed to the roles the portfolio actually needs:
 *   display    — hero headline (Amiri serif)
 *   heading.*  — section / project headings (Amiri serif)
 *   text.*     — paragraph copy
 *   label      — inline labels, button text
 *   caption    — meta info, dates, fine print
 *   eyebrow    — uppercase pre-headers (sans, tracked)
 *
 * NAMING matches the DS convention exactly: category names (`heading`,
 * `text`) and multi-step categories key their steps with the shared
 * primitive step vocabulary — xS/s/m/l/xL/xL2... largest to smallest — the
 * same way DS's `heading` and `text` categories do, rather than a generic
 * xl/lg/md/sm t-shirt scale. Each category is its own namespaced mini-scale,
 * so `heading.l` and `text.l` reuse the same step name for different
 * (category-relative) sizes — exactly as DS's `heading.l` and `text.l` do.
 */

import { primitiveTypography as t } from '../primitives/typography';

export const semanticTypography = {
  display: {
    family:        t.family.display,
    weight:        t.weight.regular,
    size:          t.size.xL10,        // 72px
    lineHeight:    t.lineHeight.xL10,
    letterSpacing: t.letterSpacing.xS,
  },

  heading: {
    xL: {
      family:        t.family.display,
      weight:        t.weight.regular,
      size:          t.size.xL8,       // 56px
      lineHeight:    t.lineHeight.xL8,
      letterSpacing: t.letterSpacing.xS,
    },
    l: {
      family:        t.family.display,
      weight:        t.weight.regular,
      size:          t.size.xL6,       // 40px
      lineHeight:    t.lineHeight.xL6,
      letterSpacing: t.letterSpacing.xS,
    },
    m: {
      family:        t.family.display,
      weight:        t.weight.regular,
      size:          t.size.xL4,       // 28px
      lineHeight:    t.lineHeight.xL4,
      letterSpacing: t.letterSpacing.xS,
    },
    s: {
      family:        t.family.display,
      weight:        t.weight.regular,
      size:          t.size.xL2,       // 20px
      lineHeight:    t.lineHeight.xL2,
      letterSpacing: t.letterSpacing.xS,
    },
  },

  text: {
    l: {
      family:        t.family.display,
      weight:        t.weight.regular,
      size:          t.size.xL,        // 18px
      lineHeight:    t.lineHeight.xL,
      letterSpacing: t.letterSpacing.xS,
    },
    m: {
      family:        t.family.display,
      weight:        t.weight.regular,
      size:          t.size.l,         // 16px
      lineHeight:    t.lineHeight.l,
      letterSpacing: t.letterSpacing.xS,
    },
    s: {
      family:        t.family.display,
      weight:        t.weight.regular,
      size:          t.size.m,         // 14px
      lineHeight:    t.lineHeight.m,
      letterSpacing: t.letterSpacing.xS,
    },
  },

  label: {
    family:        t.family.sans,
    weight:        t.weight.semiBold,
    size:          t.size.m,           // 14px
    lineHeight:    t.lineHeight.m,
    letterSpacing: t.letterSpacing.xS,
  },

  caption: {
    family:        t.family.sans,
    weight:        t.weight.regular,
    size:          t.size.s,           // 12px
    lineHeight:    t.lineHeight.s,
    letterSpacing: t.letterSpacing.xS,
  },

  /** Uppercase pre-headers: "01 — About", section markers, etc. */
  eyebrow: {
    family:        t.family.sans,
    weight:        t.weight.semiBold,
    size:          t.size.s,           // 12px
    lineHeight:    t.lineHeight.s,
    letterSpacing: '0.18em',           // tracked-wide for caps
    textTransform: 'uppercase' as const,
  },
} as const;

export type SemanticTypography = typeof semanticTypography;
