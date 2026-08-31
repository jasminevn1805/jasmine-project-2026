'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Clock, Image as ImageIcon } from 'react-feather'
import { Input } from '@jasmine/design-system'
import type { MealType, Recipe } from '@/types'


interface AssignDishModalProps {
  date: string
  mealType: MealType
  recipes: Recipe[]
  onAssign: (recipeIds: string[]) => void
  onClose: () => void
}

export function AssignDishModal({
  date,
  mealType,
  recipes,
  onAssign,
  onClose,
}: AssignDishModalProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleBulkAssign = () => {
    if (selected.length > 0) {
      onAssign(selected)
      setSelected([])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-2xl bg-(--color-background-primary) shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-(--color-border-default) p-4">
          <div>
            <h2 className="text-base font-semibold text-(--color-text-primary) capitalize">
              Assign {mealType}
            </h2>
            <p className="text-xs text-(--color-text-secondary)">{formattedDate}</p>
          </div>
          <button
            onClick={onClose}
            className="text-(--color-text-secondary) hover:text-(--color-text-primary)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-(--color-border-default) px-4 py-3">
          <Input
            type="search"
            autoFocus
            placeholder="Search your library…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Recipe list */}
        <ul className="min-h-0 flex-1 overflow-y-auto divide-y divide-(--color-border-default)">
          {filtered.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-(--color-text-secondary)">
              {recipes.length === 0
                ? 'No recipes in your library yet.'
                : 'No recipes match your search.'}
            </li>
          )}
          {filtered.map((recipe) => {
            const isSelected = selected.includes(recipe.id)
            return (
              <li key={recipe.id}>
                <button
                  type="button"
                  onClick={() => toggleSelect(recipe.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-(--color-background-secondary) ${isSelected ? 'bg-(--color-background-secondary) ring-2 ring-(--color-border-brand)' : ''}`}
                  aria-pressed={isSelected}
                >
                  {recipe.thumbnail ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      <Image src={recipe.thumbnail} alt={recipe.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-(--color-background-secondary) text-(--color-text-tertiary)">
                      <ImageIcon size={20} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-(--color-text-primary)">
                      {recipe.title}
                    </p>
                    {recipe.estimatedCookTime && (
                      <p className="flex items-center gap-1 text-xs text-(--color-text-secondary)">
                        <Clock size={11} strokeWidth={2.25} />
                        {recipe.estimatedCookTime} min
                      </p>
                    )}
                  </div>
                  <div className={`ml-2 h-5 w-5 rounded-full border-2 ${isSelected ? 'border-(--color-border-brand) bg-(--color-border-brand)' : 'border-(--color-border-default) bg-transparent'}`}></div>
                </button>
              </li>
            )
          })}
        </ul>
        {/* Bulk assign button */}
        <div className="shrink-0 border-t border-(--color-border-default) px-4 py-3 flex justify-end">
          <button
            type="button"
            onClick={handleBulkAssign}
            disabled={selected.length === 0}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${selected.length === 0 ? 'bg-(--color-background-secondary) text-(--color-text-secondary) cursor-not-allowed opacity-50' : 'bg-(--color-background-brand) text-white hover:bg-(--color-background-brand-hover) active:bg-(--color-background-brand-pressed)'}`}
          >
            {selected.length > 0
              ? `Assign ${selected.length} dish${selected.length > 1 ? 'es' : ''}`
              : 'Select dishes'}
          </button>
        </div>
      </div>
    </div>
  )
}
