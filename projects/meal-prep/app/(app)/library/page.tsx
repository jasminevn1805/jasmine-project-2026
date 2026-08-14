'use client'

import { useState, useMemo } from 'react'
import { useRecipeStore } from '@/store/useRecipeStore'
import { useCategoryStore, UNSORTED_CATEGORY_ID } from '@/store/useCategoryStore'
import { FilterBar } from '@/components/library/FilterBar'
import { SaveRecipeModal } from '@/components/library/SaveRecipeModal'
import { ManageCategoriesModal } from '@/components/library/ManageCategoriesModal'
import { RecipeCard } from '@/components/library/RecipeCard'
import { ActiveFilterChips } from '@/components/library/ActiveFilterChips'
import { EmptyState } from '@/components/shared/EmptyState'
import {
  PageShell,
  PageHeader,
  SectionHeader,
  Stack,
  ScrollRail,
} from '@/components/shared/layout'
import { Button } from '@jasmine/design-system'
import { useIsMobile } from '@/lib/useMediaQuery'
import { TAG_LABELS } from '@/lib/library-labels'
import type { Tag, Platform, RecipeCategory, Recipe } from '@/types'

/**
 * Library page — premium-minimal, decision-mode-first.
 */
export default function LibraryPage() {
  const recipes = useRecipeStore((s) => s.recipes)
  const categories = useCategoryStore((s) => s.categories)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showManageCategories, setShowManageCategories] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<Tag | null>(null)
  const [activePlatform, setActivePlatform] = useState<Platform | null>(null)
  const [quickPick, setQuickPick] = useState<QuickPickId | null>(null)
  const isMobile = useIsMobile()

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const matchesSearch =
        !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        (r.cuisine?.toLowerCase().includes(search.toLowerCase()) ?? false)
      const matchesTag = !activeTag || r.tags.includes(activeTag)
      const matchesPlatform = !activePlatform || r.platform === activePlatform
      const matchesQuick =
        !quickPick || QUICK_PICKS[quickPick].predicate(r)
      return matchesSearch && matchesTag && matchesPlatform && matchesQuick
    })
  }, [recipes, search, activeTag, activePlatform, quickPick])

  const groupedRecipes = useMemo(() => {
    const sorted = [...filtered].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    )
    const map = new Map<RecipeCategory, Recipe[]>()
    for (const r of sorted) {
      const cat = r.category ?? UNSORTED_CATEGORY_ID
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(r)
    }
    return categories
      .filter((c) => map.has(c.id))
      .map((c) => ({ ...c, recipes: map.get(c.id)! }))
  }, [filtered, categories])

  const quickPickCounts = useMemo(() => {
    const counts: Record<QuickPickId, number> = {
      'under-20': 0,
      'quick-win': 0,
      batch: 0,
      'one-pan': 0,
    }
    for (const r of recipes) {
      for (const id of QUICK_PICK_IDS) {
        if (QUICK_PICKS[id].predicate(r)) counts[id] += 1
      }
    }
    return counts
  }, [recipes])

  const recipeCount = recipes.length
  const hasActiveFilter =
    !!search || !!activeTag || !!activePlatform || !!quickPick
  const subtitle = hasActiveFilter
    ? `${filtered.length} of ${recipeCount} ${
        filtered.length === 1 ? 'recipe' : 'recipes'
      } match`
    : `${recipeCount} saved recipe${recipeCount !== 1 ? 's' : ''}`

  function clearAllFilters() {
    setSearch('')
    setActiveTag(null)
    setActivePlatform(null)
    setQuickPick(null)
  }

  const isLibraryEmpty = recipes.length === 0
  const isFilteredEmpty = !isLibraryEmpty && filtered.length === 0
  const showQuickPicks = !isLibraryEmpty && !hasActiveFilter

  return (
    <PageShell>
      <PageHeader
        title="Recipe library"
        subtitle={subtitle}
        actions={
          <>
            <Button
              onClick={() => setShowManageCategories(true)}
              type="Outline"
              size={isMobile ? 'S' : 'M'}
            >
              Categories
            </Button>
            <Button
              onClick={() => setShowSaveModal(true)}
              type="Primary"
              size={isMobile ? 'S' : 'M'}
            >
              + Save recipe
            </Button>
          </>
        }
      >
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            placeholder="Search recipes, cuisines…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-body w-full outline-none"
            style={{
              paddingInlineStart: 'var(--space-2xl)',
              paddingInlineEnd: 'var(--space-l)',
              height: 'var(--space-3xl)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-default)',
              background: 'var(--color-background-primary)',
              color: 'var(--color-text-primary)',
              transition:
                'border-color var(--motion-duration-fast) var(--motion-easing-out), ' +
                'box-shadow var(--motion-duration-fast) var(--motion-easing-out)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-brand)'
              e.currentTarget.style.boxShadow =
                '0 0 0 3px color-mix(in srgb, var(--color-border-brand) 16%, transparent)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-default)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>

        <FilterBar
          activeTag={activeTag}
          onTagChange={(t) => {
            setActiveTag(t)
            if (t) setQuickPick(null)
          }}
          activePlatform={activePlatform}
          onPlatformChange={setActivePlatform}
        />

        <ActiveFilterChips
          search={search}
          activeTag={activeTag}
          activePlatform={activePlatform}
          quickPickLabel={quickPick ? QUICK_PICKS[quickPick].label : null}
          onClearSearch={() => setSearch('')}
          onClearTag={() => setActiveTag(null)}
          onClearPlatform={() => setActivePlatform(null)}
          onClearQuickPick={() => setQuickPick(null)}
          onClearAll={clearAllFilters}
        />
      </PageHeader>

      {showQuickPicks && (
        <QuickPicks
          counts={quickPickCounts}
          active={quickPick}
          onPick={(id) => {
            setQuickPick((cur) => (cur === id ? null : id))
            setActiveTag(null)
          }}
        />
      )}

      <div
        style={{
          paddingTop: hasActiveFilter
            ? 'var(--layout-stack-loose)'
            : 'var(--layout-section-y)',
          paddingBottom: 'var(--space-4xl)',
        }}
      >
        {isLibraryEmpty ? (
          <div style={{ paddingInline: 'var(--layout-page-x)' }}>
            <EmptyState
              icon="📭"
              title="Your library is empty"
              description="Save your first recipe by pasting a link from Instagram, TikTok, YouTube, or anywhere else."
              actionLabel="+ Save a recipe"
              onAction={() => setShowSaveModal(true)}
            />
          </div>
        ) : isFilteredEmpty ? (
          <div style={{ paddingInline: 'var(--layout-page-x)' }}>
            <EmptyState
              icon="🔍"
              title="No recipes match these filters"
              description="Try removing a filter, broadening your search, or saving something new."
              actionLabel="Clear filters"
              onAction={clearAllFilters}
            />
          </div>
        ) : (
          <Stack gap="section">
            {groupedRecipes.map((group) => (
              <section key={group.id}>
                <SectionHeader
                  title={group.label}
                  icon={group.emoji}
                  count={group.recipes.length}
                />
                <RecipeRail
                  recipes={group.recipes}
                  cardWidth={isMobile ? 200 : 280}
                />
              </section>
            ))}
          </Stack>
        )}
      </div>

      {showSaveModal && (
        <SaveRecipeModal onClose={() => setShowSaveModal(false)} />
      )}
      {showManageCategories && (
        <ManageCategoriesModal onClose={() => setShowManageCategories(false)} />
      )}
    </PageShell>
  )
}

function RecipeRail({
  recipes,
  cardWidth,
}: {
  recipes: Recipe[]
  cardWidth: number
}) {
  return (
    <ScrollRail>
      {recipes.map((recipe) => (
        <ScrollRail.Item key={recipe.id} width={cardWidth}>
          <RecipeCard recipe={recipe} />
        </ScrollRail.Item>
      ))}
    </ScrollRail>
  )
}

type QuickPickId = 'under-20' | 'quick-win' | 'batch' | 'one-pan'

const QUICK_PICK_IDS: QuickPickId[] = [
  'under-20',
  'quick-win',
  'batch',
  'one-pan',
]

const QUICK_PICKS: Record<
  QuickPickId,
  { label: string; hint: string; predicate: (r: Recipe) => boolean }
> = {
  'under-20': {
    label: 'Under 20 min',
    hint: 'Weeknight rescue',
    predicate: (r) => r.estimatedCookTime != null && r.estimatedCookTime <= 20,
  },
  'quick-win': {
    label: TAG_LABELS['quick-win'],
    hint: 'Low effort',
    predicate: (r) => r.tags.includes('quick-win'),
  },
  batch: {
    label: TAG_LABELS['batch'],
    hint: 'Sunday prep',
    predicate: (r) => r.tags.includes('batch'),
  },
  'one-pan': {
    label: TAG_LABELS['one-pan'],
    hint: 'Minimal cleanup',
    predicate: (r) => r.tags.includes('one-pan'),
  },
}

function QuickPicks({
  counts,
  active,
  onPick,
}: {
  counts: Record<QuickPickId, number>
  active: QuickPickId | null
  onPick: (id: QuickPickId) => void
}) {
  const visible = QUICK_PICK_IDS.filter((id) => counts[id] > 0)
  if (visible.length === 0) return null

  return (
    <div
      style={{
        paddingInline: 'var(--layout-page-x)',
        paddingTop: 'var(--layout-stack-loose)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 'var(--space-m)',
          marginBottom: 'var(--space-m)',
        }}
      >
        <h2 className="text-h3 text-ink">Pick for tonight</h2>
        <span className="text-meta text-tertiary">Tap to filter</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-s)',
        }}
      >
        {visible.map((id) => {
          const pick = QUICK_PICKS[id]
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onPick(id)}
              aria-pressed={isActive}
              style={{
                textAlign: 'left',
                padding: 'var(--space-m) var(--space-l)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${
                  isActive
                    ? 'var(--color-border-brand)'
                    : 'var(--color-border-subtle)'
                }`,
                background: isActive
                  ? 'color-mix(in srgb, var(--color-border-brand) 8%, var(--color-background-primary))'
                  : 'var(--color-background-primary)',
                cursor: 'pointer',
                transition:
                  'border-color var(--motion-duration-fast) var(--motion-easing-out), ' +
                  'background var(--motion-duration-fast) var(--motion-easing-out)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor =
                    'var(--color-border-default)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor =
                    'var(--color-border-subtle)'
                }
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: 'var(--space-s)',
                  marginBottom: '2px',
                }}
              >
                <span className="text-body-strong text-ink">{pick.label}</span>
                <span
                  className="text-h3 text-ink"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {counts[id]}
                </span>
              </div>
              <span className="text-meta text-tertiary">{pick.hint}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
