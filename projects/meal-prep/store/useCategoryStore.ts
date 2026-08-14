'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Category shape ──────────────────────────────────────────
export interface CategoryMeta {
  id: string       // kebab-case slug, e.g. "main-course" or "korean-bbq"
  label: string    // display name
  emoji: string    // single emoji
}

// ── Default catch-all category ──────────────────────────────
// Recipes land here when they haven't been categorized yet,
// or when their original category is deleted.
export const UNSORTED_CATEGORY_ID = 'unsorted'

// ── Defaults (built-in categories) ──────────────────────────
const DEFAULT_CATEGORIES: CategoryMeta[] = [
  { id: UNSORTED_CATEGORY_ID, label: 'Inbox', emoji: '📥' },
  { id: 'main-course', label: 'Main Course', emoji: '🍽️' },
  { id: 'breakfast',   label: 'Breakfast',   emoji: '🥞' },
  { id: 'salad',       label: 'Salads',      emoji: '🥗' },
  { id: 'soup',        label: 'Soups',       emoji: '🍲' },
  { id: 'snack',       label: 'Snacks',      emoji: '🥨' },
  { id: 'dessert',     label: 'Desserts',    emoji: '🍰' },
  { id: 'drink',       label: 'Drinks',      emoji: '🥤' },
  { id: 'side-dish',   label: 'Side Dishes', emoji: '🥦' },
]

// ── Store ───────────────────────────────────────────────────
interface CategoryStore {
  categories: CategoryMeta[]
  seeded: boolean

  seedCategories: () => void
  addCategory: (cat: CategoryMeta) => void
  updateCategory: (id: string, updates: Partial<Omit<CategoryMeta, 'id'>>) => void
  removeCategory: (id: string) => void
  reorderCategories: (ids: string[]) => void
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      seeded: false,

      seedCategories: () => {
        if (get().seeded) return
        set({ categories: DEFAULT_CATEGORIES, seeded: true })
      },

      addCategory: (cat) =>
        set((s) => ({
          categories: [...s.categories, cat],
        })),

      updateCategory: (id, updates) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      removeCategory: (id) => {
        if (id === UNSORTED_CATEGORY_ID) return   // protected
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
        }))
      },

      reorderCategories: (ids) =>
        set((s) => {
          // Ensure unsorted always stays at position 0
          const rest = ids.filter((id) => id !== UNSORTED_CATEGORY_ID)
          const ordered = [UNSORTED_CATEGORY_ID, ...rest]
          const map = new Map(s.categories.map((c) => [c.id, c]))
          return {
            categories: ordered.map((id) => map.get(id)!).filter(Boolean),
          }
        }),
    }),
    {
      name: 'meal-prep-categories',
      version: 3,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as CategoryStore
        let cats = state.categories ?? []

        if (version < 2) {
          // Rename "other" → "unsorted" and move to top
          cats = cats.map((c) =>
            c.id === 'other'
              ? { id: UNSORTED_CATEGORY_ID, label: 'Inbox', emoji: '📥' }
              : c
          )
        }

        if (version < 3) {
          // Rename "Unsorted" label → "Inbox" (id stays the same)
          cats = cats.map((c) =>
            c.id === UNSORTED_CATEGORY_ID
              ? { ...c, label: 'Inbox', emoji: '📥' }
              : c
          )
        }

        const rest = cats.filter((c) => c.id !== UNSORTED_CATEGORY_ID)
        const unsorted =
          cats.find((c) => c.id === UNSORTED_CATEGORY_ID) ??
          { id: UNSORTED_CATEGORY_ID, label: 'Inbox', emoji: '📥' }
        return { ...state, categories: [unsorted, ...rest] }
      },
    }
  )
)
