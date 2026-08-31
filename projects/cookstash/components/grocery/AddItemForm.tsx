'use client'

import type { GroceryItem } from '@/types'
import { useGroceryStore } from '@/store/useGroceryStore'
import { QuickAddPanel } from './QuickAddPanel'

interface AddItemFormProps {
  listId: string
  /** Forwarded to QuickAddPanel so the drawer can react to level changes */
  onLevelChange?: (level: 1 | 2) => void
}

export function AddItemForm({ listId, onLevelChange }: AddItemFormProps) {
  const listItems = useGroceryStore(
    (s: { getListById: (id: string) => { items: { name: string }[] } | undefined }) =>
      s.getListById(listId)?.items ?? [],
  )

  const existingNames = new Set(
    listItems.map((i: { name: string }) => i.name.toLowerCase()),
  )

  return <QuickAddPanel listId={listId} existingNames={existingNames} onLevelChange={onLevelChange} />
}
