'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { X, Check, Search, Image as ImageIcon } from 'react-feather'
import type { MealType, Recipe, RecipeCategory } from '@/types'
import { useCategoryStore, UNSORTED_CATEGORY_ID } from '@/store/useCategoryStore'

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

interface AddDishesModalProps {
  planName: string
  mealType: MealType
  recipes: Recipe[]
  existingRecipeIds: string[]
  onAdd: (recipeIds: string[]) => void
  onClose: () => void
}

export function AddDishesModal({
  planName,
  mealType,
  recipes,
  existingRecipeIds,
  onAdd,
  onClose,
}: AddDishesModalProps) {
  const categories = useCategoryStore((s) => s.categories)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string[]>([])

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  const groupedFiltered = useMemo(() => {
    const map = new Map<RecipeCategory, Recipe[]>()
    for (const r of filtered) {
      const cat = r.category ?? UNSORTED_CATEGORY_ID
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(r)
    }
    return categories.filter((c) => map.has(c.id)).map((c) => ({
      ...c,
      recipes: map.get(c.id)!,
    }))
  }, [filtered, categories])

  const toggleSelect = (id: string) => {
    if (existingRecipeIds.includes(id)) return
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleConfirm = () => {
    if (selected.length > 0) {
      onAdd(selected)
      setSelected([])
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: 'var(--space-l)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '440px',
          maxHeight: '80vh',
          background: 'var(--color-background-primary)',
          borderRadius: 'var(--border-radius-l)',
          boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          fontFamily: 'var(--font-body)',
        }}
      >
        {/* ── Header ───────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-2xl) var(--space-xl) var(--space-l)',
            flexShrink: 0,
          }}
        >
          <div>
            <h2 style={{
              fontSize: 'var(--typography-desktop-heading-s-semi-bold-size)',
              fontWeight: 'var(--typography-desktop-heading-s-semi-bold-weight)' as unknown as number,
              lineHeight: 'var(--typography-desktop-heading-s-semi-bold-line-height)',
              color: 'var(--color-text-primary)',
              margin: 0,
            }}>
              Add {MEAL_LABELS[mealType]}
            </h2>
            <p style={{
              fontSize: 'var(--typography-desktop-text-xs-regular-size)',
              color: 'var(--color-text-tertiary)',
              margin: 0,
              marginTop: '2px',
            }}>
              {planName}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: 'var(--border-radius-pill)',
              border: 'none',
              background: 'var(--color-background-secondary)',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
              transition: 'background 120ms ease, color 120ms ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-background-tertiary)'
              e.currentTarget.style.color = 'var(--color-text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-background-secondary)'
              e.currentTarget.style.color = 'var(--color-text-tertiary)'
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Search ───────────────────────────────────────── */}
        <div style={{ padding: '0 var(--space-xl) var(--space-l)', flexShrink: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-s)',
              height: '40px',
              borderRadius: 'var(--border-radius-s)',
              border: 'var(--border-width-s) solid var(--color-border-default)',
              background: 'var(--color-background-secondary)',
              paddingLeft: 'var(--space-m)',
              paddingRight: 'var(--space-m)',
              transition: 'border-color 150ms ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-brand)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-default)'
            }}
          >
            <Search size={14} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
            <input
              type="text"
              autoFocus
              placeholder="Search recipes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                height: '100%',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 'var(--typography-desktop-text-s-regular-size)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)',
              }}
            />
          </div>
        </div>

        {/* ── Divider ──────────────────────────────────────── */}
        <hr style={{
          border: 'none',
          borderTop: 'var(--border-width-s) solid var(--color-border-subtle)',
          margin: 0,
        }} />

        {/* ── Recipe list (grouped by category) ────────────── */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
          }}
        >
          {groupedFiltered.length === 0 && (
            <div style={{
              padding: 'var(--space-3xl) var(--space-xl)',
              textAlign: 'center',
              fontSize: 'var(--typography-desktop-text-s-regular-size)',
              color: 'var(--color-text-tertiary)',
            }}>
              {recipes.length === 0
                ? 'No recipes in your library yet.'
                : 'No recipes match your search.'}
            </div>
          )}

          {groupedFiltered.map((group, groupIdx) => (
            <div key={group.id} style={{ paddingTop: groupIdx > 0 ? 'var(--space-s)' : undefined }}>
              {/* Category header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-s)',
                  padding: 'var(--space-l) var(--space-xl)',
                  background: 'var(--color-background-secondary)',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                <span style={{ fontSize: '15px', lineHeight: 1 }}>{group.emoji}</span>
                <span style={{
                  fontSize: 'var(--typography-desktop-text-xs-semi-bold-size)',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  letterSpacing: '0.02em',
                }}>
                  {group.label}
                </span>
                <span style={{
                  fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                  color: 'var(--color-text-tertiary)',
                  marginLeft: 'auto',
                }}>
                  {group.recipes.length}
                </span>
              </div>

              {/* Recipes */}
              {group.recipes.map((recipe) => {
                const alreadyAdded = existingRecipeIds.includes(recipe.id)
                const isSelected = selected.includes(recipe.id)
                return (
                  <button
                    key={recipe.id}
                    type="button"
                    onClick={() => toggleSelect(recipe.id)}
                    disabled={alreadyAdded}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-m)',
                      width: '100%',
                      padding: 'var(--space-m) var(--space-xl)',
                      border: 'none',
                      borderRadius: 0,
                      background: isSelected ? 'var(--color-background-brand-subtle)' : 'transparent',
                      cursor: alreadyAdded ? 'not-allowed' : 'pointer',
                      opacity: alreadyAdded ? 0.4 : 1,
                      textAlign: 'left',
                      transition: 'background 100ms ease',
                      fontFamily: 'var(--font-body)',
                    }}
                    onMouseEnter={(e) => {
                      if (!alreadyAdded && !isSelected) e.currentTarget.style.background = 'var(--color-background-secondary)'
                    }}
                    onMouseLeave={(e) => {
                      if (!alreadyAdded && !isSelected) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {recipe.thumbnail ? (
                      <div style={{
                        position: 'relative',
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--border-radius-s)',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}>
                        <Image src={recipe.thumbnail} alt={recipe.title} fill style={{ objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--border-radius-s)',
                        background: 'var(--color-background-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: 'var(--color-text-tertiary)',
                      }}>
                        <ImageIcon size={18} />
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 'var(--typography-desktop-text-s-regular-size)',
                        fontWeight: 500,
                        color: 'var(--color-text-primary)',
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '1.4',
                      }}>
                        {recipe.title}
                      </p>
                      {alreadyAdded ? (
                        <p style={{
                          fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                          color: 'var(--color-text-tertiary)',
                          margin: 0,
                          marginTop: '1px',
                        }}>
                          Already added
                        </p>
                      ) : recipe.estimatedCookTime ? (
                        <p style={{
                          fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                          color: 'var(--color-text-tertiary)',
                          margin: 0,
                          marginTop: '1px',
                        }}>
                          {recipe.estimatedCookTime} min
                        </p>
                      ) : null}
                    </div>

                    {/* Selection indicator */}
                    {!alreadyAdded && (
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: 'var(--border-radius-pill)',
                          border: isSelected ? 'none' : 'var(--border-width-m) solid var(--color-border-default)',
                          background: isSelected ? 'var(--color-background-brand)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 120ms ease',
                        }}
                      >
                        {isSelected && <Check size={12} style={{ color: '#fff' }} />}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* ── Footer ───────────────────────────────────────── */}
        <div
          style={{
            flexShrink: 0,
            padding: 'var(--space-l) var(--space-xl)',
            borderTop: 'var(--border-width-s) solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{
            fontSize: 'var(--typography-desktop-text-xs-regular-size)',
            color: 'var(--color-text-tertiary)',
          }}>
            {selected.length > 0 ? `${selected.length} selected` : '\u00A0'}
          </span>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={selected.length === 0}
            style={{
              height: '36px',
              paddingLeft: 'var(--space-xl)',
              paddingRight: 'var(--space-xl)',
              borderRadius: 'var(--border-radius-s)',
              border: 'none',
              fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'background 120ms ease, opacity 120ms ease',
              background: selected.length === 0 ? 'var(--color-background-secondary)' : 'var(--color-background-brand)',
              color: selected.length === 0 ? 'var(--color-text-tertiary)' : '#fff',
              opacity: selected.length === 0 ? 0.6 : 1,
            }}
          >
            {selected.length > 0
              ? `Add ${selected.length} dish${selected.length > 1 ? 'es' : ''}`
              : 'Select dishes'}
          </button>
        </div>
      </div>
    </div>
  )
}
