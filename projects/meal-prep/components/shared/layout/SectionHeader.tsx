import type { ReactNode } from 'react'

/**
 * SectionHeader — a section's title cluster.
 *
 * Layout contract:
 *  [icon] <title (h2)> [count chip] ……………… [actions]
 *
 *  - Horizontal padding: --layout-page-x (matches PageHeader)
 *  - Title uses .text-h2 + .text-ink (display font, semi-bold)
 *  - Count is rendered as a muted pill chip with tabular-nums
 *  - Optional icon (emoji or React node) sits left of title
 *  - Optional `actions` slot floats right (e.g. "View all", "+ Add")
 */

interface SectionHeaderProps {
  title: string
  icon?: ReactNode
  count?: number
  actions?: ReactNode
}

export function SectionHeader({
  title,
  icon,
  count,
  actions,
}: SectionHeaderProps) {
  return (
    <div
      style={{
        paddingInline: 'var(--layout-page-x)',
        marginBottom: 'var(--layout-stack-default)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-m)',
      }}
    >
      {icon && (
        <span style={{ fontSize: '20px', lineHeight: 1 }} aria-hidden>
          {icon}
        </span>
      )}
      <h2 className="text-h2 text-ink">{title}</h2>
      {typeof count === 'number' && (
        <span
          className="text-meta"
          style={{
            paddingInline: 'var(--space-s)',
            paddingBlock: '2px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--color-background-secondary)',
          }}
        >
          {count}
        </span>
      )}
      {actions && <div style={{ marginInlineStart: 'auto' }}>{actions}</div>}
    </div>
  )
}
