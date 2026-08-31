import type { ReactNode } from 'react'

/**
 * SectionHeader — a section's title cluster.
 *
 * Layout contract:
 *  <title (h2)> [icon] [count chip] ……………… [actions]
 *  [description]
 *
 *  - Horizontal padding: --layout-page-x (matches PageHeader)
 *  - Title uses .text-h2 + .text-ink (display font, semi-bold)
 *  - Title leads (not the icon) so its text starts flush at the page
 *    gutter, aligned with every other left edge on the page — the icon
 *    trails as a decorative marker instead of eating into that gutter.
 *  - Count is rendered as a muted pill chip with tabular-nums
 *  - Optional icon (emoji or React node) sits right of title
 *  - Optional `description` is a quiet caption line below the title row —
 *    for a section whose purpose isn't obvious from its name alone
 *  - Optional `actions` slot floats right (e.g. "View all", "+ Add")
 */

interface SectionHeaderProps {
  title: string
  icon?: ReactNode
  count?: number
  description?: ReactNode
  actions?: ReactNode
}

export function SectionHeader({
  title,
  icon,
  count,
  description,
  actions,
}: SectionHeaderProps) {
  return (
    <div
      style={{
        paddingInline: 'var(--layout-page-x)',
        marginBottom: 'var(--layout-stack-default)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-xs)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-m)' }}>
        <h2 className="text-h2 text-ink">{title}</h2>
        {icon && (
          <span style={{ fontSize: '20px', lineHeight: 1 }} aria-hidden>
            {icon}
          </span>
        )}
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
      {description && (
        <p className="text-body-sm text-tertiary">{description}</p>
      )}
    </div>
  )
}
