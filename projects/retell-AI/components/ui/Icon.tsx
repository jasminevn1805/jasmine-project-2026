import type { LucideIcon } from 'lucide-react'

// One icon family (Lucide), one stroke weight, two sizes — enforced here so
// no call site can drift. [DS-NEW] candidate once the DS moves to lucide-react.
//
// Icon ↔ text spacing rule (set on the parent's `gap`):
//   16px icon before text → 8px   (--space-8)
//   20px icon before text → 12px  (--space-12)
//   chevron/caret after text → 4px — pass `caret` when the parent gap is 8px
//   icon stacked over a label → 4px
//   Optical exception: the warning triangle fills its box edge-to-edge, so a
//   16px triangle before text gets 12px, not 8px.
// Vertical: centre on the first line — 16px icon on 20px text = 2px offset.
export function Icon({
  icon: Glyph,
  size = 'm',
  caret,
  className,
}: {
  icon: LucideIcon
  size?: 's' | 'm'
  /** Trailing chevron/caret: pulls 4px closer inside an 8px-gap parent. */
  caret?: boolean
  className?: string
}) {
  const cls = [caret && 'icon-caret', className].filter(Boolean).join(' ') || undefined
  return <Glyph size={size === 's' ? 16 : 20} strokeWidth={1.75} aria-hidden="true" focusable="false" className={cls} />
}
