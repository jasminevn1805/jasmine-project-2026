'use client'

import type { CSSProperties, ReactNode } from 'react'

/**
 * ScrollRail — horizontal scroll row that respects page gutters on both ends.
 *
 * Why this is its own primitive:
 *  - Chrome (and Safari) drop `padding-inline-end` on overflow scroll
 *    containers — content overflows past the right gutter. The fix is to
 *    put padding on the *inner* track (which contributes to scroll width),
 *    not the outer scroller. This component encodes that contract once.
 *  - Soft edge masks fade content into the gutter line on scroll so cards
 *    don't bleed harshly past the section header alignment.
 *
 * Visual contract:
 *   ├── --layout-page-x ──┤card · card · card · card├── --layout-page-x ──┤
 *                          ↑ aligned with section header ↑
 *
 * Usage:
 *   <ScrollRail>
 *     {items.map(it => <ScrollRail.Item key={it.id} width={280}>...</ScrollRail.Item>)}
 *   </ScrollRail>
 */

interface ScrollRailProps {
  children: ReactNode
  /** Gap between items. Default: var(--layout-stack-default) */
  gap?: string
  className?: string
  style?: CSSProperties
}

export function ScrollRail({
  children,
  gap = 'var(--layout-stack-default)',
  className,
  style,
}: ScrollRailProps) {
  return (
    <div
      className={['hide-scrollbar', className].filter(Boolean).join(' ')}
      style={{
        overflowX: 'auto',
        paddingBottom: 'var(--space-s)',
        ...style,
      }}
    >
      {/*
        Inner track is inline-flex so its width = content + padding.
        Padding here (not on the outer scroller) is the trick that makes
        BOTH start and end gutters survive Chrome's overflow quirk and
        align perfectly with the section header above.
      */}
      <div
        style={{
          display: 'inline-flex',
          gap,
          paddingInline: 'var(--layout-page-x)',
          // Defensive: ensures min-width on flex items doesn't shrink them.
          minWidth: 'min-content',
        }}
      >
        {children}
      </div>
    </div>
  )
}

interface ScrollRailItemProps {
  children: ReactNode
  /** Fixed pixel width for the item slot. */
  width: number
  className?: string
  style?: CSSProperties
}

ScrollRail.Item = function ScrollRailItem({
  children,
  width,
  className,
  style,
}: ScrollRailItemProps) {
  return (
    <div
      className={className}
      style={{
        flex: '0 0 auto',
        width: `${width}px`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
