'use client'

import { ScrollTabBar } from '@jasmine/design-system'
import type { ScrollTabItem } from '@jasmine/design-system'
import { useIsMobile } from '@/lib/useMediaQuery'
import { TAGS_LIST, TAG_LABELS, PLATFORM_LABELS } from '@/lib/library-labels'
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

// Tiny inline SVG glyphs — no extra deps, render at the same x-height
// as body text. Stroke uses currentColor so active state can flip color.
const PLATFORM_GLYPHS: Record<Platform, JSX.Element> = {
  instagram: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.5 3v2.2a4.8 4.8 0 0 0 4.5 4.5v2.4a7.2 7.2 0 0 1-4.5-1.6v6.3a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.5a3.3 3.3 0 1 0 2.4 3.1V3z" />
    </svg>
  ),
  youtube: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18 5 12 5 12 5s-6 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C6 19 12 19 12 19s6 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5 3z" />
    </svg>
  ),
  facebook: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 22v-8h3l.5-4H13V7.5c0-1.1.3-1.9 2-1.9h2V2.1A28 28 0 0 0 14.3 2C11.5 2 9.6 3.7 9.6 6.9V10H7v4h2.6v8z" />
    </svg>
  ),
  other: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  ),
}

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

      {PLATFORMS.map((p) => (
        <GlyphButton
          key={p}
          active={active === p}
          onClick={() => onChange(active === p ? null : p)}
          label={PLATFORM_LABELS[p]}
        >
          {PLATFORM_GLYPHS[p]}
        </GlyphButton>
      ))}
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
