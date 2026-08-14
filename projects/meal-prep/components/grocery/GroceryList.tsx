'use client'

import { useState, useCallback } from 'react'
import { Plus } from 'react-feather'
import { Button } from '@jasmine/design-system'
import type { GroceryList as GroceryListType } from '@/types'
import { useGroceryStore } from '@/store/useGroceryStore'
import { CategorySection } from './CategorySection'
import { AddItemForm } from './AddItemForm'
import { SlideDrawer } from '@/components/shared/SlideDrawer'
import type { GroceryCategory } from '@/types'

const CATEGORY_ORDER: GroceryCategory[] = [
  'produce', 'meat', 'dairy', 'pantry', 'frozen', 'bakery', 'beverages', 'other',
]

interface GroceryListProps {
  list: GroceryListType
  drawerOpen: boolean
  onOpenDrawer: () => void
  onCloseDrawer: () => void
}

export function GroceryList({ list, drawerOpen, onOpenDrawer, onCloseDrawer }: GroceryListProps) {
  const toggleItem = useGroceryStore((s: { toggleItem: (listId: string, itemId: string) => void }) => s.toggleItem)
  const deleteItem = useGroceryStore((s: { deleteItem: (listId: string, itemId: string) => void }) => s.deleteItem)

  const totalCount = list.items.length

  /** Tracks whether the QuickAddPanel is at Level 2 (items list) */
  const [drawerExpanded, setDrawerExpanded] = useState(false)

  const closeDrawer = useCallback(() => {
    onCloseDrawer()
    setDrawerExpanded(false)
  }, [onCloseDrawer])

  const handleLevelChange = useCallback((level: 1 | 2) => {
    setDrawerExpanded(level === 2)
  }, [])

  // Group items by category
  const grouped = CATEGORY_ORDER.reduce<Record<GroceryCategory, typeof list.items>>(
    (acc, cat) => {
      acc[cat] = list.items.filter((i) => i.category === cat)
      return acc
    },
    {} as Record<GroceryCategory, typeof list.items>
  )

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-xl)' }}>
      {/* Category sections — masonry columns so cards flow naturally */}
      <div
        style={{
          columns: '3 320px',
          columnGap: 'var(--space-l)',
        }}
      >
        {CATEGORY_ORDER.map((cat) => {
          const items = grouped[cat]
          if (items.length === 0) return null
          return (
            <CategorySection
              key={cat}
              category={cat}
              items={items}
              onToggle={(itemId: string) => toggleItem(list.id, itemId)}
              onDelete={(itemId: string) => deleteItem(list.id, itemId)}
            />
          )
        })}
      </div>

      {/* Empty state — Add Items in content area */}
      {totalCount === 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px var(--space-xl)',
            gap: 'var(--space-l)',
            borderRadius: 'var(--border-radius-l)',
            border: 'var(--border-width-s) dashed var(--color-border-default)',
            background: 'var(--color-background-secondary)',
          }}
        >
          <span style={{ fontSize: '32px' }}>🛒</span>
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--typography-desktop-text-l-semi-bold-size)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '4px',
              }}
            >
              Your list is empty
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--typography-desktop-text-s-regular-size)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              Add items to start building your shopping trip.
            </p>
          </div>
          <Button
            onClick={onOpenDrawer}
            type="Primary"
            size="M"
          >
            <Plus size={14} />
            Add items
          </Button>
        </div>
      )}

      {/* Add-items slide drawer */}
      <SlideDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        title="Add Items"
        expanded={drawerExpanded}
        footer={
          <button
            onClick={closeDrawer}
            className="rounded-xl bg-(--color-background-brand) px-6 py-2.5 text-sm font-semibold text-(--color-text-primary-inverse) transition hover:opacity-90"
          >
            Done
          </button>
        }
      >
        <AddItemForm listId={list.id} onLevelChange={handleLevelChange} />
      </SlideDrawer>
    </div>
  )
}
