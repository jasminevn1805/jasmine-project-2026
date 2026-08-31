'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * PageHeader — the title cluster every page wears.
 *
 * Layout contract:
 *  ┌─ sticky, backdrop-blur veil ─────────────────────────────┐
 *  │ ┌── title row ──────────────────────────┬── actions ──┐ │
 *  │ │ <title (h1, semi-bold)>               │ [Button]   │ │
 *  │ │ <subtitle (meta, tertiary, tabular)>  │ [Button]   │ │
 *  │ └───────────────────────────────────────┴────────────┘ │
 *  │ {children}                                              │
 *  └─ hairline reveals on scroll ────────────────────────────┘
 *
 *  - Padding uses --layout-page-x / --layout-page-y (responsive)
 *  - Gap uses --layout-stack-default
 *  - Hairline border reveals via IntersectionObserver when page scrolls
 *  - {children} slot is for filters / tabs / search that ride along
 */

interface PageHeaderProps {
  title: string
  subtitle?: ReactNode
  actions?: ReactNode
  children?: ReactNode
  /** When true, header sticks to viewport top with backdrop blur. Default: true. */
  sticky?: boolean
}

export function PageHeader({
  title,
  subtitle,
  actions,
  children,
  sticky = true,
}: PageHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!sticky) return
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [sticky])

  return (
    <>
      {sticky && (
        <div ref={sentinelRef} aria-hidden style={{ height: 1, width: '100%' }} />
      )}
      <header
        style={{
          position: sticky ? 'sticky' : 'static',
          top: 0,
          zIndex: 20,
          background: sticky
            ? 'var(--color-background-veil)'
            : 'var(--color-background-primary)',
          backdropFilter: sticky ? 'blur(12px)' : undefined,
          WebkitBackdropFilter: sticky ? 'blur(12px)' : undefined,
          paddingInline: 'var(--layout-page-x)',
          paddingTop: 'var(--layout-page-y)',
          paddingBottom: 'var(--layout-stack-default)',
          borderBottom: `var(--layout-hairline) solid ${
            sticky && scrolled
              ? 'var(--color-border-subtle)'
              : 'transparent'
          }`,
          transition:
            'border-color var(--motion-duration-base) var(--motion-easing-out)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--layout-stack-default)',
          }}
        >
          {/* Title + actions row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 'var(--layout-stack-default)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h1 className="text-h1 text-ink">{title}</h1>
              {subtitle && (
                <p
                  className="text-meta"
                  style={{ marginTop: 'var(--space-xs)' }}
                >
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--layout-stack-tight)',
                }}
              >
                {actions}
              </div>
            )}
          </div>

          {/* Child slot — filters, search, tabs */}
          {children}
        </div>
      </header>
    </>
  )
}
