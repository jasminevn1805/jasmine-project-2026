import type { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@jasmine/design-system'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  href?: string
  actionLabel?: string
  onAction?: () => void
}

/**
 * EmptyState — restrained, calm zero-state for empty lists.
 * Uses typography utilities for headline + body, brand-subtle bg disk for icon.
 */
export function EmptyState({
  icon,
  title,
  description,
  href,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{
        paddingInline: 'var(--space-l)',
        paddingBlock: 'var(--space-5xl)',
      }}
    >
      {/* Illustrated bg circle */}
      <div
        className="flex items-center justify-center"
        style={{
          width: '96px',
          height: '96px',
          marginBottom: 'var(--space-l)',
          color: 'var(--color-text-brand)',
          background: 'var(--color-background-brand-subtle)',
          borderRadius: 'var(--radius-pill)',
        }}
        aria-hidden
      >
        {icon}
      </div>

      <h2 className="text-h3 text-ink">{title}</h2>

      <p
        className="text-body text-secondary"
        style={{
          marginTop: 'var(--space-xs)',
          maxWidth: '32ch',
        }}
      >
        {description}
      </p>

      {actionLabel && (
        <div style={{ marginTop: 'var(--space-xl)' }}>
          {href ? (
            <Link href={href}>
              <Button type="Primary" size="M">
                {actionLabel}
              </Button>
            </Link>
          ) : (
            <Button onClick={onAction} type="Primary" size="M">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
