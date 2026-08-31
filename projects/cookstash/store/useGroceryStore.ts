'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GroceryList, GroceryItem, GroceryCategory } from '@/types'
import type { CommonItem } from '@/lib/commonGroceryItems'

interface GroceryStore {
  lists: GroceryList[]
  /** User-created custom items that appear alongside the built-in common items */
  customItems: CommonItem[]
  createList: (list: GroceryList) => void
  updateList: (id: string, updates: Partial<GroceryList>) => void
  deleteList: (id: string) => void
  getListById: (id: string) => GroceryList | undefined
  addItem: (listId: string, item: GroceryItem) => void
  updateItem: (listId: string, itemId: string, updates: Partial<GroceryItem>) => void
  deleteItem: (listId: string, itemId: string) => void
  toggleItem: (listId: string, itemId: string) => void
  setShareToken: (listId: string, token: string) => void
  /** Save a custom item so it appears in the common-items panel going forward */
  addCustomCommonItem: (item: CommonItem) => void
}

export const useGroceryStore = create<GroceryStore>()(
  persist(
    (set, get) => ({
      lists: [],
      customItems: [],

      createList: (list) =>
        set((state) => ({ lists: [list, ...state.lists] })),

      updateList: (id, updates) =>
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
        })),

      deleteList: (id) =>
        set((state) => ({
          lists: state.lists.filter((l) => l.id !== id),
        })),

      getListById: (id) => get().lists.find((l) => l.id === id),

      addItem: (listId, item) =>
        set((state) => ({
          lists: state.lists.map((l) => {
            if (l.id !== listId) return l
            // Deduplicate: if item name already exists in same category, skip
            const duplicate = l.items.find(
              (i) =>
                i.name.toLowerCase() === item.name.toLowerCase() &&
                i.category === item.category
            )
            if (duplicate) return l
            return { ...l, items: [...l.items, item] }
          }),
        })),

      updateItem: (listId, itemId, updates) =>
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id !== listId
              ? l
              : {
                  ...l,
                  items: l.items.map((i) =>
                    i.id === itemId ? { ...i, ...updates } : i
                  ),
                }
          ),
        })),

      deleteItem: (listId, itemId) =>
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id !== listId
              ? l
              : { ...l, items: l.items.filter((i) => i.id !== itemId) }
          ),
        })),

      toggleItem: (listId, itemId) =>
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id !== listId
              ? l
              : {
                  ...l,
                  items: l.items.map((i) =>
                    i.id === itemId
                      ? { ...i, checked: !i.checked, inPantry: !i.checked }
                      : i
                  ),
                }
          ),
        })),

      setShareToken: (listId, token) =>
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === listId ? { ...l, shareToken: token } : l
          ),
        })),

      addCustomCommonItem: (item) =>
        set((state) => {
          // Deduplicate by name+category (case-insensitive)
          const exists = state.customItems.some(
            (ci) =>
              ci.name.toLowerCase() === item.name.toLowerCase() &&
              ci.category === item.category,
          )
          if (exists) return state
          return { customItems: [...state.customItems, item] }
        }),
    }),
    { name: 'cookstash-grocery' }
  )
)
