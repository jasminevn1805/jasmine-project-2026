'use client'

import { ScrollTabBar } from '@jasmine/design-system'
import type { ScrollTabItem } from '@jasmine/design-system'
import { useIsMobile } from '@/lib/useMediaQuery'
import { TAGS_LIST, TAG_LABELS, PLATFORM_LABELS, PLATFORM_ICONS } from '@/lib/library-labels'
import type { Platform, Tag } from '@/types'

/**
 * FilterBar — IA hierarchy:
 *
 *   ── Primary: Tag rail (intent) ───────────────────
 *      The decision lever. Visually dominant.
 *      "What do I want to cook?" — quick, batch, vegetarian, etc.
 *
 *   ── Secondary: Source filter (platform) ──────────
 *      Where the recipe came from. Used rarely (hunt mode).
 *      Rendered as a quiet inline row of compact glyph buttons
 *      so it reads as metadata, not as a peer filter.
 */

const TAG_ITEMS: ScrollTabItem[] = [
  { id: 'all', label: 'All' },
  ...TAGS_LIST.map((tag) => ({ id: tag, label: TAG_LABELS[tag] })),
]

const PLATFORMS: Platform[] = ['instagram', 'tiktok', 'youtube', 'facebook', 'other']

interface FilterBarProps {
  activeTag: Tag | null
  onTagChange: (tag: Tag | null) => void
  activePlatform: Platform | null
  onPlatformChange: (platform: Platform | null) => void
}

export function FilterBar({
  activeTag,
  onTagChange,
  activePlatform,
  onPlatformChange,
}: FilterBarProps) {
  const isMobile = useIsMobile()

  return (
    <div
      className="flex flex-col"
      style={{ gap: 'var(--layout-stack-tight)' }}
    >
      {/* PRIMARY: tag rail */}
      <ScrollTabBar
        items={TAG_ITEMS}
        activeId={activeTag ?? 'all'}
        onSelect={(id) => onTagChange(id === 'all' ? null : (id as Tag))}
        variant="inverse"
        size={isMobile ? 'sm' : 'md'}
        gap={isMobile ? '6px' : '4px'}
      />

      {/* SECONDARY: source / platform — quiet glyph row */}
      <PlatformGlyphRow
        active={activePlatform}
        onChange={onPlatformChange}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Platform glyph row — secondary filter, visually subdued
// ─────────────────────────────────────────────────────────────

function PlatformGlyphRow({
  active,
  onChange,
}: {
  active: Platform | null
  onChange: (p: Platform | null) => void
}) {
  return (
    <div
      role="toolbar"
      aria-label="Filter by source"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-s)',
        paddingTop: '2px',
      }}
    >
      <span
        className="text-eyebrow"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        Source
      </span>

      <GlyphButton
        active={active === null}
        onClick={() => onChange(null)}
        label="All sources"
      >
        <span className="text-body-sm" style={{ fontWeight: 500 }}>All</span>
      </GlyphButton>

      {PLATFORMS.map((p) => {
        const Icon = PLATFORM_ICONS[p]
        return (
          <GlyphButton
            key={p}
            active={active === p}
            onClick={() => onChange(active === p ? null : p)}
            label={PLATFORM_LABELS[p]}
          >
            <Icon size={14} aria-hidden />
          </GlyphButton>
        )
      })}
    </div>
  )
}

function GlyphButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '28px',
        minWidth: '28px',
        paddingInline: 'var(--space-s)',
        borderRadius: 'var(--radius-pill)',
        border: '1px solid transparent',
        background: active
          ? 'var(--color-background-tertiary)'
          : 'transparent',
        color: active
          ? 'var(--color-text-primary)'
          : 'var(--color-text-tertiary)',
        cursor: 'pointer',
        transition:
          'background var(--motion-duration-fast) var(--motion-easing-out), ' +
          'color var(--motion-duration-fast) var(--motion-easing-out), ' +
          'border-color var(--motion-duration-fast) var(--motion-easing-out)',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.color = 'var(--color-text-primary)'
          e.currentTarget.style.background = 'var(--color-background-secondary)'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.color = 'var(--color-text-tertiary)'
          e.currentTarget.style.background = 'transparent'
        }
      }}
    >
      {children}
    </button>
  )
}
