'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronUp, ChevronDown, Plus, Check, Search, Image as ImageIcon } from 'react-feather'
import Image from 'next/image'
import type { MealType, MealSlot, PlanDay, Recipe, RecipeCategory } from '@/types'
import { useCategoryStore, UNSORTED_CATEGORY_ID } from '@/store/useCategoryStore'

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']
const SHOW_MAX = 5
const DROPDOWN_MAX = 6

interface DayColumnProps {
  day: PlanDay
  recipes: Recipe[]
  isOverflow?: boolean
  isMobile?: boolean
  onAssignRecipes: (date: string, mealType: MealType, recipeIds: string[]) => void
  onAssignCustom: (date: string, mealType: MealType, label: string) => void
  onRemoveSlot: (date: string, mealType: MealType, recipeId: string | null, customLabel: string | null) => void
}

export function DayColumn({ day, recipes, isOverflow = false, isMobile = false, onAssignRecipes, onAssignCustom, onRemoveSlot }: DayColumnProps) {
  const categories = useCategoryStore((s) => s.categories)
  const date = new Date(day.date + 'T12:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  const isToday = today.getTime() === date.getTime()
  const [hovered, setHovered] = useState(false)
  const [expandedSlots, setExpandedSlots] = useState<Set<MealType>>(new Set())

  // Unified add state
  const [addingMealType, setAddingMealType] = useState<MealType | null>(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const dropdownPortalRef = useRef<HTMLDivElement>(null)
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number; direction: 'below' | 'above' } | null>(null)

  const getRecipe = (id: string | null) =>
    id ? recipes.find((r) => r.id === id) : undefined

  const accentColor = hovered || isToday ? 'var(--color-text-brand)' : undefined

  // Close dropdown on outside click
  useEffect(() => {
    if (!addingMealType) return
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        (!dropdownPortalRef.current || !dropdownPortalRef.current.contains(target))
      ) {
        if (selected.size > 0 && addingMealType) {
          onAssignRecipes(day.date, addingMealType, Array.from(selected))
        }
        setSearch('')
        setSelected(new Set())
        setAddingMealType(null)
      }
    }
    const timer = setTimeout(() => document.addEventListener('mousedown', handleClick), 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [addingMealType, selected, day.date, onAssignRecipes])

  // Auto-focus input
  useEffect(() => {
    if (addingMealType && inputRef.current) inputRef.current.focus()
  }, [addingMealType])

  // Position the dropdown portal relative to the input wrapper
  useEffect(() => {
    if (!addingMealType) {
      setDropdownPos(null)
      return
    }

    function updatePos() {
      const anchor = inputWrapperRef.current
      if (!anchor) return
      const rect = anchor.getBoundingClientRect()
      const gap = 4
      const maxDropdownH = 320 // matches maxHeight on the dropdown
      const confirmH = 36 // approximate height of confirm button row
      const totalH = maxDropdownH + confirmH
      const spaceBelow = window.innerHeight - rect.bottom - gap
      const spaceAbove = rect.top - gap
      const viewportPad = 12

      // Width: expand to 320px but don't exceed viewport
      const preferredW = Math.max(rect.width, 320)
      const maxW = window.innerWidth - viewportPad * 2
      const w = Math.min(preferredW, maxW)

      // Right-align to the input's right edge, clamped to viewport
      let l = rect.left
      // If left-aligning would overflow the right edge, right-align instead
      if (l + w > window.innerWidth - viewportPad) {
        l = rect.right - w
      }
      // Final clamp to keep within viewport
      if (l < viewportPad) l = viewportPad
      if (l + w > window.innerWidth - viewportPad) l = window.innerWidth - viewportPad - w

      if (spaceBelow >= totalH) {
        setDropdownPos({ top: rect.bottom + gap, left: l, width: w, direction: 'below' })
      } else if (spaceAbove >= totalH) {
        setDropdownPos({ top: rect.top - gap, left: l, width: w, direction: 'above' })
      } else {
        // Not enough room either way — pick the side with more space
        if (spaceBelow >= spaceAbove) {
          setDropdownPos({ top: rect.bottom + gap, left: l, width: w, direction: 'below' })
        } else {
          setDropdownPos({ top: rect.top - gap, left: l, width: w, direction: 'above' })
        }
      }
    }

    // Initial position after render
    requestAnimationFrame(updatePos)

    // Reposition on any scroll (capture catches all scrollable ancestors) and resize
    document.addEventListener('scroll', updatePos, { capture: true, passive: true })
    window.addEventListener('resize', updatePos, { passive: true })
    return () => {
      document.removeEventListener('scroll', updatePos, { capture: true })
      window.removeEventListener('resize', updatePos)
    }
  }, [addingMealType])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (selected.size > 0 && addingMealType) {
        onAssignRecipes(day.date, addingMealType, Array.from(selected))
      }
      setSearch('')
      setSelected(new Set())
      setAddingMealType(null)
    }
    if (e.key === 'Enter' && search.trim()) {
      const exactMatch = recipes.find((r) => r.title.toLowerCase() === search.trim().toLowerCase())
      if (exactMatch) {
        setSelected((prev) => {
          const next = new Set(prev)
          if (next.has(exactMatch.id)) next.delete(exactMatch.id)
          else next.add(exactMatch.id)
          return next
        })
        setSearch('')
      } else {
        if (addingMealType) onAssignCustom(day.date, addingMealType, search.trim())
        setSearch('')
      }
    }
  }, [search, selected, addingMealType, day.date, recipes, onAssignRecipes, onAssignCustom])

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function commitAndClose() {
    if (selected.size > 0 && addingMealType) {
      onAssignRecipes(day.date, addingMealType, Array.from(selected))
    }
    setSearch('')
    setSelected(new Set())
    setAddingMealType(null)
  }

  function toggleExpand(mealType: MealType) {
    setExpandedSlots((prev) => {
      const next = new Set(prev)
      if (next.has(mealType)) next.delete(mealType)
      else next.add(mealType)
      return next
    })
  }

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  // Group filtered recipes by category (same order as library)
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

  const weekdayShort = date.toLocaleDateString('en-US', { weekday: 'short' })

  return (
    <div
      className="flex flex-col"
      style={{
        background: 'transparent',
        minWidth: 0,
        overflow: 'hidden',
        opacity: isOverflow ? 0.45 : 1,
        transition: 'opacity 150ms ease',
        ...(isMobile ? {
          border: `var(--border-width-s) solid ${isToday ? 'var(--color-border-brand)' : 'var(--color-border-subtle)'}`,
          borderRadius: 'var(--border-radius-s)',
        } : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent line — desktop only */}
      {!isMobile && (
        <hr style={{
          border: 'none',
          borderTop: `var(--border-width-s) solid ${accentColor ?? 'var(--color-border-default)'}`,
          margin: 0,
          transition: 'border-color 150ms ease',
        }} />
      )}

      <div
        style={{
          background: hovered || isToday ? 'var(--color-background-secondary)' : 'transparent',
          paddingLeft: 'var(--space-m)',
          paddingRight: 'var(--space-m)',
          paddingTop: 'var(--space-m)',
          paddingBottom: isMobile ? 'var(--space-m)' : 'var(--space-xl)',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 'var(--space-m)' : 'var(--space-xl)',
          transition: 'background 150ms ease',
        }}
      >
        {/* Date heading */}
        <p style={{
          fontSize: 'var(--typography-desktop-heading-m-semi-bold-size)',
          fontWeight: 'var(--typography-desktop-heading-m-semi-bold-weight)',
          lineHeight: 'var(--typography-desktop-heading-m-semi-bold-line-height)',
          color: accentColor ?? 'var(--color-text-primary)',
          transition: 'color 150ms ease',
          display: 'flex',
          alignItems: 'baseline',
          gap: 'var(--space-xs)',
        }}>
          {isMobile && (
            <span style={{
              fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
              fontWeight: 600,
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {weekdayShort}
            </span>
          )}
          <span>
            {isOverflow && date.getDate() === 1
              ? `${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getDate()}`
              : date.getDate()}
          </span>
        </p>

        <div style={isMobile
          ? { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-m)' }
          : { display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)', alignSelf: 'stretch' }
        }>
          {MEAL_TYPES.map((mealType) => {
            const slots = day.slots.filter((s) => s.mealType === mealType)
            const items: { key: string; label: string; slot: MealSlot }[] = slots.map((s, i) => {
              if (s.recipeId) {
                const recipe = getRecipe(s.recipeId)
                return { key: `${s.recipeId}-${i}`, label: recipe?.title ?? 'Unknown dish', slot: s }
              }
              return { key: `custom-${s.customLabel}-${i}`, label: s.customLabel ?? 'Untitled', slot: s }
            })

            const isExpanded = expandedSlots.has(mealType)
            const visibleItems = isExpanded ? items : items.slice(0, SHOW_MAX)
            const hiddenCount = items.length - SHOW_MAX
            const isAdding = addingMealType === mealType

            return (
              <div key={mealType} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-s)', minWidth: 0 }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
                  fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
                  lineHeight: 'var(--typography-desktop-text-s-semi-bold-line-height)',
                  letterSpacing: 'var(--typography-desktop-text-s-semi-bold-letter-spacing)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-xs)',
                }}>
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </p>

                {visibleItems.map(({ key, label, slot }) => (
                  <div
                    key={key}
                    className="group"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--space-xs)',
                      minHeight: 'var(--primitive-spacing-36)',
                      borderRadius: 'var(--border-radius-s)',
                      background: 'var(--color-background-secondary)',
                      paddingLeft: 'var(--space-s)',
                      paddingRight: 'var(--space-xs)',
                      minWidth: 0,
                    }}
                  >
                    <span style={{
                      fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                      color: slot.customLabel ? 'var(--color-text-secondary)' : 'var(--color-text-primary)',
                      fontStyle: slot.customLabel ? 'italic' : 'normal',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      flex: 1,
                      minWidth: 0,
                    }}>
                      {label}
                    </span>
                    <button
                      onClick={() => onRemoveSlot(day.date, mealType, slot.recipeId, slot.customLabel)}
                      className="hidden group-hover:flex"
                      style={{
                        flexShrink: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 'var(--space-l)',
                        height: 'var(--space-l)',
                        borderRadius: 'var(--border-radius-pill)',
                        background: 'var(--color-overlay-30-inverse)',
                        color: 'var(--color-text-secondary)',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}

                {items.length > SHOW_MAX && (
                  <button
                    onClick={() => toggleExpand(mealType)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-xs)',
                      width: '100%',
                      height: '28px',
                      borderRadius: 'var(--border-radius-s)',
                      border: 'none',
                      background: 'transparent',
                      fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                      color: 'var(--color-text-brand)',
                      cursor: 'pointer',
                    }}
                  >
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {isExpanded ? 'Show less' : `+${hiddenCount} more`}
                  </button>
                )}

                {/* Unified Add */}
                <div ref={isAdding ? (node) => { dropdownRef.current = node; inputWrapperRef.current = node } : undefined}>
                  {isAdding ? (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-xs)',
                          width: '100%',
                          height: '36px',
                          borderRadius: 'var(--border-radius-s)',
                          border: 'var(--border-width-s) solid var(--color-border-brand)',
                          background: 'var(--color-background-primary)',
                          paddingLeft: 'var(--space-s)',
                          paddingRight: 'var(--space-s)',
                          boxSizing: 'border-box',
                        }}
                      >
                        <Search size={13} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
                        <input
                          ref={inputRef}
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Search recipes…"
                          style={{
                            flex: 1,
                            height: '100%',
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                            color: 'var(--color-text-primary)',
                            fontFamily: 'var(--font-body)',
                          }}
                        />
                      </div>

                      {/* Portal dropdown */}
                      {createPortal(
                        <div
                          ref={dropdownPortalRef}
                          style={{
                            position: 'fixed',
                            top: dropdownPos
                              ? dropdownPos.direction === 'below'
                                ? dropdownPos.top
                                : undefined
                              : -9999,
                            bottom: dropdownPos
                              ? dropdownPos.direction === 'above'
                                ? window.innerHeight - dropdownPos.top
                                : undefined
                              : undefined,
                            left: dropdownPos ? dropdownPos.left : -9999,
                            width: dropdownPos ? dropdownPos.width : 'auto',
                            zIndex: 9999,
                            display: 'flex',
                            flexDirection: dropdownPos?.direction === 'above' ? 'column-reverse' : 'column',
                            opacity: dropdownPos ? 1 : 0,
                            pointerEvents: dropdownPos ? 'auto' : 'none',
                            transition: 'opacity 0.12s ease',
                          }}
                        >
                          {/* Recipe list grouped by category */}
                          <div
                            style={{
                              background: 'var(--color-background-primary)',
                              borderRadius: 'var(--border-radius-l)',
                              boxShadow: '0 16px 40px -8px rgba(0,0,0,0.16)',
                              maxHeight: '360px',
                              overflowY: 'auto',
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            {groupedFiltered.map((group, groupIdx) => (
                              <div key={group.id} style={{ marginTop: groupIdx > 0 ? 'var(--space-l)' : undefined }}>
                                {/* Category header */}
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-s)',
                                    padding: 'var(--space-m) var(--space-l)',
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
                                    fontFamily: 'var(--font-body)',
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

                                {/* Recipes in this category */}
                                {group.recipes.map((recipe) => {
                                  const isSelected = selected.has(recipe.id)
                                  return (
                                    <button
                                      key={recipe.id}
                                      type="button"
                                      onMouseDown={(e) => e.preventDefault()}
                                      onClick={() => toggleSelect(recipe.id)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-m)',
                                        padding: 'var(--space-s) var(--space-l)',
                                        border: 'none',
                                        background: isSelected
                                          ? 'var(--color-background-brand-subtle)'
                                          : 'transparent',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'background 100ms ease',
                                        width: '100%',
                                        fontFamily: 'var(--font-body)',
                                      }}
                                      onMouseEnter={(e) => {
                                        if (!isSelected) e.currentTarget.style.background = 'var(--color-background-secondary)'
                                      }}
                                      onMouseLeave={(e) => {
                                        if (!isSelected) e.currentTarget.style.background = 'transparent'
                                      }}
                                    >
                                      {recipe.thumbnail ? (
                                        <div style={{
                                          position: 'relative',
                                          width: '36px',
                                          height: '36px',
                                          borderRadius: 'var(--border-radius-s)',
                                          overflow: 'hidden',
                                          flexShrink: 0,
                                        }}>
                                          <Image src={recipe.thumbnail} alt="" fill style={{ objectFit: 'cover' }} />
                                        </div>
                                      ) : (
                                        <div style={{
                                          width: '36px',
                                          height: '36px',
                                          borderRadius: 'var(--border-radius-s)',
                                          background: 'var(--color-background-secondary)',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          flexShrink: 0,
                                          color: 'var(--color-text-tertiary)',
                                        }}>
                                          <ImageIcon size={16} />
                                        </div>
                                      )}

                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <span style={{
                                          fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                                          fontWeight: 500,
                                          color: 'var(--color-text-primary)',
                                          fontFamily: 'var(--font-body)',
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden',
                                          lineHeight: '1.4',
                                        }}>
                                          {recipe.title}
                                        </span>
                                        {recipe.estimatedCookTime ? (
                                          <p style={{
                                            fontSize: '10px',
                                            color: 'var(--color-text-tertiary)',
                                            margin: 0,
                                            marginTop: '1px',
                                          }}>
                                            {recipe.estimatedCookTime} min
                                          </p>
                                        ) : null}
                                      </div>

                                      {/* Selection indicator */}
                                      <div
                                        style={{
                                          width: '18px',
                                          height: '18px',
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
                                        {isSelected && <Check size={10} style={{ color: '#fff' }} />}
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                            ))}

                            {search.trim() && !recipes.some((r) => r.title.toLowerCase() === search.trim().toLowerCase()) && (
                              <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  if (addingMealType) onAssignCustom(day.date, addingMealType, search.trim())
                                  setSearch('')
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 'var(--space-s)',
                                  padding: 'var(--space-s) var(--space-l)',
                                  border: 'none',
                                  background: 'transparent',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  fontFamily: 'var(--font-body)',
                                  fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                                  color: 'var(--color-text-brand)',
                                  fontStyle: 'italic',
                                  width: '100%',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'var(--color-background-secondary)'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent'
                                }}
                              >
                                <Plus size={11} />
                                <span>Add &quot;{search.trim()}&quot; as custom dish</span>
                              </button>
                            )}

                            {filtered.length === 0 && !search.trim() && (
                              <div style={{
                                padding: 'var(--space-2xl) var(--space-l)',
                                textAlign: 'center',
                                fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                                color: 'var(--color-text-tertiary)',
                                fontFamily: 'var(--font-body)',
                              }}>
                                No recipes in library
                              </div>
                            )}
                          </div>

                          {/* Confirm button */}
                          {selected.size > 0 && (
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={commitAndClose}
                              style={{
                                marginTop: dropdownPos?.direction === 'below' ? 'var(--space-xs)' : 0,
                                marginBottom: dropdownPos?.direction === 'above' ? 'var(--space-xs)' : 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '32px',
                                borderRadius: 'var(--border-radius-s)',
                                border: 'none',
                                background: 'var(--color-background-brand)',
                                color: '#fff',
                                fontSize: 'var(--typography-desktop-text-xs-semi-bold-size)',
                                fontWeight: 600,
                                fontFamily: 'var(--font-body)',
                                cursor: 'pointer',
                                transition: 'background 120ms ease, opacity 120ms ease',
                              }}
                            >
                              Add {selected.size} dish{selected.size !== 1 ? 'es' : ''}
                            </button>
                          )}
                        </div>,
                        document.body
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => setAddingMealType(mealType)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        width: '100%',
                        height: '32px',
                        borderRadius: 'var(--border-radius-s)',
                        border: 'var(--border-width-s) dashed var(--color-border-default)',
                        background: 'transparent',
                        fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                        color: 'var(--color-text-tertiary)',
                        cursor: 'pointer',
                        transition: 'border-color 150ms ease, color 150ms ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--color-border-brand)'
                        e.currentTarget.style.color = 'var(--color-text-brand)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--color-border-default)'
                        e.currentTarget.style.color = 'var(--color-text-tertiary)'
                      }}
                    >
                      <Plus size={12} />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
