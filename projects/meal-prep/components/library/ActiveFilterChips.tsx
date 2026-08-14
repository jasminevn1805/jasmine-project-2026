'use client'

import { X } from 'react-feather'
import { TAG_LABELS, PLATFORM_LABELS } from '@/lib/library-labels'
import type { Platform, Tag } from '@/types'

interface ActiveFilterChipsProps {
  search: string
  activeTag: Tag | null
  activePlatform: Platform | null
  quickPickLabel?: string | null
  onClearSearch: () => void
  onClearTag: () => void
  onClearPlatform: () => void
  onClearQuickPick?: () => void
  onClearAll: () => void
}

/**
 * ActiveFilterChips — surfaces the currently applied filters as dismissible
 * chips with a single "Clear all" affordance. Renders nothing when no filter
 * is active so the header stays calm.
 *
 *  [Search: "ramen" ×]  [Source: TikTok ×]  [Tag: Quick win ×]    Clear all
 */
export function ActiveFilterChips({
  search,
  activeTag,
  activePlatform,
  quickPickLabel,
  onClearSearch,
  onClearTag,
  onClearPlatform,
  onClearQuickPick,
  onClearAll,
}: ActiveFilterChipsProps) {
  const hasAny =
    !!search || !!activeTag || !!activePlatform || !!quickPickLabel
  if (!hasAny) return null

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 'var(--space-s)',
      }}
    >
      {search && (
        <Chip
          label={`“${search}”`}
          eyebrow="Search"
          onRemove={onClearSearch}
        />
      )}
      {quickPickLabel && onClearQuickPick && (
        <Chip
          label={quickPickLabel}
          eyebrow="Pick"
          onRemove={onClearQuickPick}
        />
      )}
      {activePlatform && (
        <Chip
          label={PLATFORM_LABELS[activePlatform]}
          eyebrow="Source"
          onRemove={onClearPlatform}
        />
      )}
      {activeTag && (
        <Chip
          label={TAG_LABELS[activeTag]}
          eyebrow="Tag"
          onRemove={onClearTag}
        />
      )}

      <button
        onClick={onClearAll}
        className="text-body-sm"
        style={{
          marginInlineStart: 'auto',
          background: 'transparent',
          border: 'none',
          color: 'var(--color-text-tertiary)',
          cursor: 'pointer',
          padding: 'var(--space-xs) var(--space-s)',
          borderRadius: 'var(--radius-pill)',
          transition:
            'color var(--motion-duration-fast) var(--motion-easing-out)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--color-text-primary)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-tertiary)'
        }}
      >
        Clear all
      </button>
    </div>
  )
}

function Chip({
  label,
  eyebrow,
  onRemove,
}: {
  label: string
  eyebrow: string
  onRemove: () => void
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-xs)',
        paddingInline: 'var(--space-m)',
        paddingBlock: 'var(--space-xs)',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--color-background-brand-subtle)',
        border: '1px solid var(--color-border-subtle)',
      }}
    >
      <span
        className="text-body-sm"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        {eyebrow}:
      </span>
      <span
        className="text-body-sm"
        style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}
      >
        {label}
      </span>
      <button
        onClick={onRemove}
        aria-label={`Remove ${eyebrow.toLowerCase()} filter`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '18px',
          height: '18px',
          marginInlineStart: '2px',
          padding: 0,
          background: 'transparent',
          border: 'none',
          borderRadius: 'var(--radius-pill)',
          color: 'var(--color-text-tertiary)',
          cursor: 'pointer',
          transition:
            'color var(--motion-duration-fast) var(--motion-easing-out), background var(--motion-duration-fast) var(--motion-easing-out)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--color-text-primary)'
          e.currentTarget.style.background =
            'color-mix(in srgb, var(--color-background-inverse) 8%, transparent)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-tertiary)'
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <X size={12} />
      </button>
    </span>
  )
}
