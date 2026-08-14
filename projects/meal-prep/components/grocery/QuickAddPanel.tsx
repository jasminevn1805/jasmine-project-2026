'use client'

import { useState, useMemo, useCallback, useRef, useEffect, useId } from 'react'
import type { Icon } from 'react-feather'
import {
  Check, Search, ChevronRight, ArrowLeft, Plus, X,
  Sun, Droplet, Zap, Archive, Thermometer, Star, Coffee, Package,
} from 'react-feather'
import type { GroceryCategory, GroceryItem } from '@/types'
import { useGroceryStore } from '@/store/useGroceryStore'
import { COMMON_ITEMS } from '@/lib/commonGroceryItems'
import type { CommonItem } from '@/lib/commonGroceryItems'

/* ── Category metadata ── */
const CATEGORY_META: { value: GroceryCategory; icon: Icon; label: string }[] = [
  { value: 'produce',   icon: Sun,          label: 'Produce' },
  { value: 'dairy',     icon: Droplet,      label: 'Dairy' },
  { value: 'meat',      icon: Zap,          label: 'Meat & Protein' },
  { value: 'pantry',    icon: Archive,      label: 'Pantry' },
  { value: 'frozen',    icon: Thermometer,  label: 'Frozen' },
  { value: 'bakery',    icon: Star,         label: 'Bakery' },
  { value: 'beverages', icon: Coffee,       label: 'Beverages' },
  { value: 'other',     icon: Package,      label: 'Other' },
]

function sortAlpha(items: CommonItem[]): CommonItem[] {
  return [...items].sort((a, b) => a.name.localeCompare(b.name))
}

/* ── Self-contained checkbox — SVG always in DOM, shown via opacity ── */
/* Avoids DS dist bundle whose conditional SVG mount/unmount causes     */
/* 1-2px vertical shift on toggle.                                      */
interface PanelCheckboxProps {
  label: string
  checked: boolean
  onChange: () => void
}
function PanelCheckbox({ label, checked, onChange }: PanelCheckboxProps) {
  const id = useId()
  return (
    <label
      htmlFor={id}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        userSelect: 'none',
        height: '20px',
        width: '100%',
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      />
      <span
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px',
          borderRadius: '4px',
          boxSizing: 'border-box',
          border: checked
            ? '1.5px solid var(--color-background-brand)'
            : '1.5px solid var(--color-border-primary)',
          background: checked
            ? 'var(--color-background-brand)'
            : 'var(--color-background-primary)',
          transition: 'background 150ms ease, border-color 150ms ease',
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 12 9"
          fill="none"
          style={{
            width: '8px',
            height: '6px',
            overflow: 'visible',
            opacity: checked ? 1 : 0,
            transition: 'opacity 150ms ease',
          }}
          aria-hidden="true"
        >
          <path
            d="M1 4L4.5 7.5L11 1"
            stroke="white"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        style={{
          fontFamily: 'var(--typography-desktop-family-main)',
          fontSize: 'var(--typography-desktop-text-s-regular-size)',
          fontWeight: 'var(--typography-desktop-text-s-regular-weight)',
          lineHeight: '16px',
          color: 'var(--color-text-primary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </label>
  )
}

/* ── Transition duration (matches SlideDrawer / Button pattern) ── */
const TRANSITION_MS = 250

/* ── Props ── */
interface QuickAddPanelProps {
  listId: string
  existingNames: Set<string>
  /** Called when the panel navigates between Level 1 (categories) and Level 2 (items) */
  onLevelChange?: (level: 1 | 2) => void
}

export function QuickAddPanel({ listId, existingNames, onLevelChange }: QuickAddPanelProps) {
  const addItem = useGroceryStore(
    (s: { addItem: (listId: string, item: GroceryItem) => void }) => s.addItem,
  )
  const deleteItem = useGroceryStore(
    (s: { deleteItem: (listId: string, itemId: string) => void }) => s.deleteItem,
  )
  const updateItem = useGroceryStore(
    (s: { updateItem: (listId: string, itemId: string, updates: Partial<GroceryItem>) => void }) => s.updateItem,
  )
  const listItems = useGroceryStore(
    (s: { getListById: (id: string) => { items: GroceryItem[] } | undefined }) =>
      s.getListById(listId)?.items ?? [],
  )
  const customItems = useGroceryStore(
    (s: { customItems: CommonItem[] }) => s.customItems,
  )
  const addCustomCommonItem = useGroceryStore(
    (s: { addCustomCommonItem: (item: CommonItem) => void }) => s.addCustomCommonItem,
  )

  /* ── Navigation state ── */
  const [activeCategory, setActiveCategory] = useState<GroceryCategory | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  /* ── Item interaction state ── */
  const [search, setSearch] = useState('')
  const [justAdded, setJustAdded] = useState<Set<string>>(new Set())
  const [qtyOverrides, setQtyOverrides] = useState<Record<string, string>>({})

  /* ── Inline custom-item state ── */
  const [addingInCategory, setAddingInCategory] = useState<GroceryCategory | null>(null)
  const [newItemName, setNewItemName] = useState('')
  const [newItemQty, setNewItemQty] = useState('')

  /* ── Refs ── */
  const searchRef = useRef<HTMLInputElement>(null)

  /* ── Helpers ── */
  function isInList(name: string) {
    return existingNames.has(name.toLowerCase()) || justAdded.has(name.toLowerCase())
  }

  function findExistingItem(name: string): GroceryItem | undefined {
    return listItems.find((i: GroceryItem) => i.name.toLowerCase() === name.toLowerCase())
  }

  /* ── Build merged items per category ── */
  const mergedItems = useMemo(() => {
    const result: Record<GroceryCategory, CommonItem[]> = {} as Record<GroceryCategory, CommonItem[]>
    for (const meta of CATEGORY_META) {
      const builtIn = COMMON_ITEMS[meta.value]
      const custom = customItems.filter((ci) => ci.category === meta.value)
      const builtInNames = new Set(builtIn.map((i) => i.name.toLowerCase()))
      const uniqueCustom = custom.filter((ci) => !builtInNames.has(ci.name.toLowerCase()))
      result[meta.value] = sortAlpha([...builtIn, ...uniqueCustom])
    }
    return result
  }, [customItems])

  /* ── Filtered items for active category ── */
  const filteredItems = useMemo(() => {
    if (!activeCategory) return []
    const q = search.trim().toLowerCase()
    const items = mergedItems[activeCategory] ?? []
    if (!q) return items
    return items.filter((item) => item.name.toLowerCase().includes(q))
  }, [activeCategory, search, mergedItems])

  /* ── Group filtered items by first letter for quick scanning ── */
  const letterGroups = useMemo(() => {
    const groups: { letter: string; items: CommonItem[] }[] = []
    let currentLetter = ''
    for (const item of filteredItems) {
      const l = item.name[0].toUpperCase()
      if (l !== currentLetter) {
        currentLetter = l
        groups.push({ letter: l, items: [] })
      }
      groups[groups.length - 1].items.push(item)
    }
    return groups
  }, [filteredItems])

  /* ── Count selected per category ── */
  const selectedCounts = useMemo(() => {
    const counts: Record<GroceryCategory, number> = {} as Record<GroceryCategory, number>
    for (const meta of CATEGORY_META) {
      // Count actual list items in this category (source of truth)
      counts[meta.value] = listItems.filter(
        (i: GroceryItem) => i.category === meta.value,
      ).length
    }
    return counts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listItems])

  /* ── Navigation ── */
  function navigateToCategory(cat: GroceryCategory) {
    if (isAnimating) return
    setIsAnimating(true)
    requestAnimationFrame(() => {
      setActiveCategory(cat)
      setSearch('')
      setAddingInCategory(null)
      onLevelChange?.(2)
      setTimeout(() => setIsAnimating(false), TRANSITION_MS)
    })
  }

  function navigateBack() {
    if (isAnimating) return
    setIsAnimating(true)
    requestAnimationFrame(() => {
      setActiveCategory(null)
      setSearch('')
      setAddingInCategory(null)
      onLevelChange?.(1)
      setTimeout(() => setIsAnimating(false), TRANSITION_MS)
    })
  }

  /* ── Item toggle ── */
  const handleToggle = useCallback(
    (item: CommonItem) => {
      const key = item.name.toLowerCase()
      if (isInList(item.name)) {
        const existing = findExistingItem(item.name)
        if (existing) deleteItem(listId, existing.id)
        setJustAdded((prev) => {
          const next = new Set(prev)
          next.delete(key)
          return next
        })
      } else {
        const qty = qtyOverrides[key] ?? item.defaultQty
        addItem(listId, {
          id: crypto.randomUUID(),
          name: item.name,
          quantity: qty,
          category: item.category,
          checked: false,
          inPantry: false,
        })
        setJustAdded((prev) => new Set(prev).add(key))
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listId, existingNames, justAdded, listItems, qtyOverrides],
  )

  /* ── Inline custom item handlers ── */
  function startInlineAdd(cat: GroceryCategory) {
    setAddingInCategory(cat)
    setNewItemName('')
    setNewItemQty('')
  }

  function cancelInlineAdd() {
    setAddingInCategory(null)
    setNewItemName('')
    setNewItemQty('')
  }

  function submitInlineAdd(cat: GroceryCategory) {
    const trimmed = newItemName.trim()
    if (!trimmed) return
    const titleCase = trimmed.replace(/\b\w/g, (c) => c.toUpperCase())
    const customItem: CommonItem = {
      name: titleCase,
      category: cat,
      defaultQty: newItemQty.trim() || null,
    }
    addCustomCommonItem(customItem)
    addItem(listId, {
      id: crypto.randomUUID(),
      name: titleCase,
      quantity: newItemQty.trim() || null,
      category: cat,
      checked: false,
      inPantry: false,
    })
    setJustAdded((prev) => new Set(prev).add(titleCase.toLowerCase()))
    cancelInlineAdd()
  }

  /* ── Focus search on Level 2 mount ── */
  useEffect(() => {
    if (activeCategory && searchRef.current) {
      const t = setTimeout(() => searchRef.current?.focus(), TRANSITION_MS)
      return () => clearTimeout(t)
    }
  }, [activeCategory])

  /* ── Active category meta ── */
  const activeMeta = activeCategory
    ? CATEGORY_META.find((m) => m.value === activeCategory)
    : null

  const totalSelected = Object.values(selectedCounts).reduce((a, b) => a + b, 0)

  /* ══════════════════════════════════ RENDER ══════════════════════════════════ */

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 0,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── LEVEL 1: Category List ── */}
      <div
        style={{
          position: activeCategory ? 'absolute' : 'relative',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-s)',
          transform: activeCategory ? 'translateX(-100%)' : 'translateX(0)',
          opacity: activeCategory ? 0 : 1,
          transition: `transform ${TRANSITION_MS}ms ease-in-out, opacity ${TRANSITION_MS}ms ease-in-out`,
          pointerEvents: activeCategory ? 'none' : 'auto',
        }}
      >
        {/* Summary chip */}
        {totalSelected > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-s)',
              padding: 'var(--space-m) var(--space-l)',
              borderRadius: 'var(--border-radius-s)',
              background: 'var(--color-background-secondary)',
              border: 'var(--border-width-s) solid var(--color-border-tertiary)',
              marginBottom: 'var(--space-m)',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '18px',
                borderRadius: 'var(--border-radius-pill)',
                background: 'var(--color-background-brand)',
                color: 'var(--color-text-primary-inverse)',
                fontSize: '10px',
                fontWeight: 600,
                lineHeight: 1,
                fontFamily: 'var(--font-body)',
              }}
            >
              {totalSelected}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--typography-desktop-text-s-regular-size)',
                fontWeight: 'var(--typography-desktop-text-s-regular-weight)',
                lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
                color: 'var(--color-text-primary)',
              }}
            >
              item{totalSelected !== 1 ? 's' : ''} added to your list
            </span>
          </div>
        )}

        {/* Category rows */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-xs)',
          }}
        >
          {CATEGORY_META.map((meta) => {
            const count = selectedCounts[meta.value]
            const CategoryIcon = meta.icon

            return (
              <button
                key={meta.value}
                type="button"
                onClick={() => navigateToCategory(meta.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-m)',
                  width: '100%',
                  padding: 'var(--space-m) var(--space-l)',
                  border: 'none',
                  borderRadius: 'var(--border-radius-s)',
                  background: 'var(--color-background-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: `background ${TRANSITION_MS}ms ease-in-out`,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'var(--color-background-hover)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'var(--color-background-primary)')
                }
              >
                {/* Icon */}
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--border-radius-s)',
                    background: 'var(--color-background-secondary)',
                    color: 'var(--color-text-secondary)',
                    flexShrink: 0,
                  }}
                >
                  <CategoryIcon size={16} />
                </span>

                {/* Label + count */}
                <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--space-s)' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
                      fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)',
                      lineHeight: 'var(--typography-desktop-text-m-semi-bold-line-height)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {meta.label}
                  </span>
                  {count > 0 && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '20px',
                        height: '20px',
                        padding: '0 var(--space-xs)',
                        borderRadius: 'var(--border-radius-pill)',
                        background: 'var(--color-background-secondary)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                        fontWeight: 'var(--typography-desktop-text-xs-regular-weight)',
                        lineHeight: '1',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      {count}
                    </span>
                  )}
                </span>

                {/* Chevron */}
                <ChevronRight size={16} style={{ color: 'var(--color-icon-subtle)', flexShrink: 0 }} />
              </button>
            )
          })}
        </div>
      </div>

      {/* ── LEVEL 2: Items List ── */}
      <div
        style={{
          position: activeCategory ? 'relative' : 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          transform: activeCategory ? 'translateX(0)' : 'translateX(100%)',
          opacity: activeCategory ? 1 : 0,
          transition: `transform ${TRANSITION_MS}ms ease-in-out, opacity ${TRANSITION_MS}ms ease-in-out`,
          pointerEvents: activeCategory ? 'auto' : 'none',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {activeMeta && (
          <>
            {/* ── Pinned top: back button + header card ── */}
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
              {/* Navigation bar */}
              <button
                type="button"
                onClick={navigateBack}
                aria-label="Back to categories"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  padding: 'var(--space-xs) 0 var(--space-s)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'opacity 120ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <ArrowLeft size={14} style={{ color: 'var(--color-text-tertiary)' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--typography-desktop-text-s-regular-size)',
                    fontWeight: 'var(--typography-desktop-text-s-regular-weight)',
                    lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  All categories
                </span>
              </button>

              {/* Header zone: title · search */}
              <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-m)',
                padding: 'var(--space-m)',
                background: 'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-l)',
                flexShrink: 0,
              }}
            >
              {/* Row: category icon + label + count */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)' }}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--border-radius-s)',
                    background: 'var(--color-background-primary)',
                    color: 'var(--color-text-brand)',
                    flexShrink: 0,
                  }}
                >
                  <activeMeta.icon size={14} />
                </span>

                <span
                  style={{
                    flex: 1,
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
                    fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)',
                    lineHeight: 'var(--typography-desktop-text-m-semi-bold-line-height)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {activeMeta.label}
                </span>

                {selectedCounts[activeCategory!] > 0 && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '20px',
                      height: '20px',
                      padding: '0 var(--space-xs)',
                      borderRadius: 'var(--border-radius-pill)',
                      background: 'var(--color-background-brand-subtle)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--typography-desktop-text-xs-semi-bold-size)',
                      fontWeight: 'var(--typography-desktop-text-xs-semi-bold-weight)',
                      lineHeight: '1',
                      color: 'var(--color-text-brand)',
                    }}
                  >
                    {selectedCounts[activeCategory!]}
                  </span>
                )}
              </div>

              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search
                  size={14}
                  style={{
                    position: 'absolute',
                    left: 'var(--space-m)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-icon-subtle)',
                  }}
                />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search items…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    height: 'var(--primitive-spacing-36)',
                    borderRadius: 'var(--border-radius-m)',
                    border: 'none',
                    background: 'var(--color-background-primary)',
                    paddingLeft: 'var(--primitive-spacing-36)',
                    paddingRight: 'var(--space-m)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--typography-desktop-text-s-regular-size)',
                    fontWeight: 'var(--typography-desktop-text-s-regular-weight)',
                    lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'box-shadow 150ms ease',
                  }}
                  onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px var(--color-border-brand)')}
                  onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                />
              </div>
            </div>
            </div>
            {/* end pinned top */}

            {/* ── Scrollable content area: items list ── */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                marginTop: 'var(--space-m)',
                padding: '0 var(--space-xs)',
              }}
            >
              {letterGroups.length > 0 ? (
                letterGroups.map((group, groupIdx) => (
                  <div key={group.letter} style={{ marginTop: groupIdx > 0 ? 'var(--space-l)' : '0' }}>
                    {/* Letter header */}
                    <div
                      style={{
                        padding: 'var(--space-xs) 0',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
                        fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
                        lineHeight: 'var(--typography-desktop-text-s-semi-bold-line-height)',
                        color: 'var(--color-text-tertiary)',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase' as const,
                      }}
                    >
                      {group.letter}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {group.items.map((item) => {
                      const added = isInList(item.name)
                      const key = item.name.toLowerCase()
                      // Show stored qty for items in list, local override, or default
                      const existingItem = added ? findExistingItem(item.name) : undefined
                      const qtyValue = qtyOverrides[key] ?? existingItem?.quantity ?? item.defaultQty ?? ''

                      return (
                        <div
                          key={item.name}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-s)',
                            padding: 'var(--space-xs) var(--space-s)',
                            minHeight: 'var(--primitive-spacing-40)',
                            borderRadius: 'var(--border-radius-s)',
                            background: added ? 'color-mix(in srgb, var(--color-background-secondary) 50%, transparent)' : 'transparent',
                            transition: 'background 120ms ease',
                          }}
                        >
                          {/* Self-contained checkbox — no DS dist dependency */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <PanelCheckbox
                              label={item.name}
                              checked={added}
                              onChange={() => handleToggle(item)}
                            />
                          </div>

                          {/* Qty */}
                          <input
                            type="text"
                            value={qtyValue}
                            placeholder="Qty"
                            onChange={(e) => {
                              const newQty = e.target.value
                              setQtyOverrides((prev) => ({ ...prev, [key]: newQty }))
                              // If item is already in the list, persist qty change to the store
                              if (added) {
                                const existing = findExistingItem(item.name)
                                if (existing) {
                                  updateItem(listId, existing.id, { quantity: newQty || null })
                                }
                              }
                            }}
                            style={{
                              width: '120px',
                              height: 'var(--primitive-spacing-28)',
                              borderRadius: 'var(--border-radius-s)',
                              border: 'var(--border-width-s) solid var(--color-border-subtle)',
                              background: 'var(--color-background-primary)',
                              paddingLeft: 'var(--space-s)',
                              paddingRight: 'var(--space-s)',
                              fontFamily: 'var(--font-body)',
                              fontSize: 'var(--typography-desktop-text-s-regular-size)',
                              fontWeight: 'var(--typography-desktop-text-s-regular-weight)',
                              lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
                              color: 'var(--color-text-secondary)',
                              outline: 'none',
                              boxSizing: 'border-box',
                              textAlign: 'right',
                              flexShrink: 0,
                              transition: 'border-color 120ms ease',
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-brand)')}
                            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-subtle)')}
                          />

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleToggle(item)}
                            aria-label={`Remove ${item.name}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '16px',
                              height: '16px',
                              border: 'none',
                              background: 'none',
                              color: 'var(--color-text-secondary)',
                              cursor: 'pointer',
                              flexShrink: 0,
                              padding: 0,
                              borderRadius: 'var(--border-radius-pill)',
                              transition: 'color 120ms ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = 'var(--primitive-red-400)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'var(--color-text-secondary)'
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )
                    })}
                    </div>
                  </div>
                ))
              ) : search.trim() ? (
                <div
                  style={{
                    padding: 'var(--space-2xl) var(--space-l)',
                    textAlign: 'center',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--typography-desktop-text-m-regular-size)',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  No matching items
                </div>
              ) : null}

              {/* ── Custom item section ── */}
              {activeCategory && addingInCategory === activeCategory ? (
                <div
                  style={{
                    marginTop: 'var(--space-l)',
                    padding: 'var(--space-m)',
                    background: 'var(--color-background-secondary)',
                    borderRadius: 'var(--border-radius-l)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-m)',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
                      fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
                      lineHeight: 'var(--typography-desktop-text-s-semi-bold-line-height)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    Add a custom item
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)' }}>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Item name…"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); submitInlineAdd(activeCategory) }
                        if (e.key === 'Escape') cancelInlineAdd()
                      }}
                      style={{
                        flex: 1,
                        minWidth: 0,
                        height: 'var(--primitive-spacing-36)',
                        borderRadius: 'var(--border-radius-s)',
                        border: 'var(--border-width-s) solid var(--color-border-default)',
                        background: 'var(--color-background-primary)',
                        paddingLeft: 'var(--space-m)',
                        paddingRight: 'var(--space-m)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--typography-desktop-text-s-regular-size)',
                        color: 'var(--color-text-primary)',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 120ms ease',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-brand)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-default)')}
                    />
                    <input
                      type="text"
                      placeholder="Qty"
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); submitInlineAdd(activeCategory) }
                        if (e.key === 'Escape') cancelInlineAdd()
                      }}
                      style={{
                        width: '120px',
                        height: 'var(--primitive-spacing-36)',
                        borderRadius: 'var(--border-radius-s)',
                        border: 'var(--border-width-s) solid var(--color-border-default)',
                        background: 'var(--color-background-primary)',
                        paddingLeft: 'var(--space-s)',
                        paddingRight: 'var(--space-s)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--typography-desktop-text-s-regular-size)',
                        color: 'var(--color-text-secondary)',
                        outline: 'none',
                        boxSizing: 'border-box',
                        textAlign: 'right',
                        flexShrink: 0,
                        transition: 'border-color 120ms ease',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-brand)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-default)')}
                    />
                    <button
                      type="button"
                      onClick={() => submitInlineAdd(activeCategory)}
                      disabled={!newItemName.trim()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--border-radius-pill)',
                        border: 'none',
                        background: newItemName.trim()
                          ? 'var(--color-background-brand)'
                          : 'var(--color-background-hover)',
                        color: newItemName.trim()
                          ? 'var(--color-text-primary-inverse)'
                          : 'var(--color-text-tertiary)',
                        cursor: newItemName.trim() ? 'pointer' : 'default',
                        flexShrink: 0,
                        padding: 0,
                        transition: 'all 120ms ease',
                      }}
                    >
                      <Check size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={cancelInlineAdd}
                    style={{
                      alignSelf: 'flex-start',
                      padding: 0,
                      border: 'none',
                      background: 'none',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                      color: 'var(--color-text-tertiary)',
                      cursor: 'pointer',
                      transition: 'color 120ms ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
                  >
                    Cancel
                  </button>
                </div>
              ) : activeCategory ? (
                <button
                  type="button"
                  onClick={() => startInlineAdd(activeCategory)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-s)',
                    width: '100%',
                    marginTop: 'var(--space-l)',
                    padding: 'var(--space-l) var(--space-m)',
                    border: 'var(--border-width-m) dashed var(--color-border-default)',
                    borderRadius: 'var(--border-radius-l)',
                    background: 'var(--color-background-secondary)',
                    cursor: 'pointer',
                    transition: 'border-color 150ms ease, background 150ms ease',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border-brand)'
                    e.currentTarget.style.background = 'var(--color-background-brand-subtle)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border-default)'
                    e.currentTarget.style.background = 'var(--color-background-secondary)'
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--border-radius-pill)',
                      background: 'var(--color-background-primary)',
                      color: 'var(--color-text-brand)',
                    }}
                  >
                    <Plus size={14} />
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
                      fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
                      lineHeight: 'var(--typography-desktop-text-s-semi-bold-line-height)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    Add custom item
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                      fontWeight: 'var(--typography-desktop-text-xs-regular-weight)',
                      lineHeight: 'var(--typography-desktop-text-xs-regular-line-height)',
                      color: 'var(--color-text-tertiary)',
                    }}
                  >
                    Can't find what you need? Add it here.
                  </span>
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
