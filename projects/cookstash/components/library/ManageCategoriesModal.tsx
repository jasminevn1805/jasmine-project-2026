'use client'

import React, { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback } from 'react'
import { Edit2, Check, X, ChevronUp, ChevronDown, Plus, Folder } from 'react-feather'
import { useCategoryStore, UNSORTED_CATEGORY_ID, type CategoryMeta } from '@/store/useCategoryStore'
import { useRecipeStore } from '@/store/useRecipeStore'
import { Button } from '@jasmine/design-system'
import { SlideDrawer } from '@/components/shared/SlideDrawer'
import { useToast } from '@/components/shared/Toast'

/* ── FLIP animation for reorder ── */
const FLIP_DURATION = 550 // ms – leisurely enough to follow with your eyes

const EMOJI_PRESETS = [
  '🍽️','🥞','🥗','🍲','🥨','🍰','🥤','🥦','📌',
  '🥘','🍜','🌮','🍕','🥙','🍝','🍱','🥡','🧁',
]

function toSlug(label: string): string {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Shared column template — identical string on the header row and every
// data row is what makes them line up like real table columns, even
// though each row is its own grid container.
const TABLE_COLS = '32px 1fr 56px 1px 140px'

/* ── Styles ── */
const inputStyle: React.CSSProperties = {
  flex: 1,
  height: '36px',
  borderRadius: 'var(--border-radius-s)',
  border: 'var(--border-width-s) solid var(--color-border-default)',
  background: 'var(--color-background-primary)',
  padding: '0 var(--space-m)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--typography-desktop-text-s-regular-size)',
  lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
  color: 'var(--color-text-primary)',
  outline: 'none',
  transition: 'border-color 150ms ease',
}

interface Props {
  open: boolean
  onClose: () => void
}

export function ManageCategoriesModal({ open, onClose }: Props) {
  const categories = useCategoryStore((s) => s.categories)
  const addCategory = useCategoryStore((s) => s.addCategory)
  const updateCategory = useCategoryStore((s) => s.updateCategory)
  const removeCategory = useCategoryStore((s) => s.removeCategory)
  const reorderCategories = useCategoryStore((s) => s.reorderCategories)

  const recipes = useRecipeStore((s) => s.recipes)
  const reassignCategory = useRecipeStore((s) => s.reassignCategory)

  const toast = useToast()

  // Unsorted is a system bucket, not a category the user creates or
  // manages — it can't be renamed, reordered, or deleted, so it doesn't
  // belong in this list at all. Everything below — the count, the row
  // list, reorder indices — operates on this filtered list.
  const manageableCategories = useMemo(
    () => categories.filter((c) => c.id !== UNSORTED_CATEGORY_ID),
    [categories],
  )

  // Count recipes per category
  const recipeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const r of recipes) {
      counts[r.category] = (counts[r.category] || 0) + 1
    }
    return counts
  }, [recipes])

  // Inline form state
  const [mode, setMode] = useState<'idle' | 'add' | 'edit'>('idle')
  const [editId, setEditId] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [emoji, setEmoji] = useState('🍽️')
  const [showEmoji, setShowEmoji] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ── FLIP animation refs ──
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const prevRectsRef = useRef<Map<string, DOMRect>>(new Map())
  const movedIdRef = useRef<string | null>(null)

  // Capture positions before a reorder
  const capturePositions = useCallback(() => {
    const rects = new Map<string, DOMRect>()
    rowRefs.current.forEach((el, id) => {
      rects.set(id, el.getBoundingClientRect())
    })
    prevRectsRef.current = rects
  }, [])

  // After categories change, animate from old → new using Web Animations API
  useLayoutEffect(() => {
    const prev = prevRectsRef.current
    if (prev.size === 0) return
    const activeId = movedIdRef.current

    rowRefs.current.forEach((el, id) => {
      const oldRect = prev.get(id)
      if (!oldRect) return
      const newRect = el.getBoundingClientRect()
      const deltaY = oldRect.top - newRect.top
      if (Math.abs(deltaY) < 1) return

      const isActive = id === activeId

      // The actively-moved row gets a gentle lift arc; displaced rows glide
      if (isActive) {
        el.style.zIndex = '2'
        el.style.position = 'relative'
        el.animate(
          [
            { transform: `translateY(${deltaY}px) scale(1)`,       offset: 0 },
            { transform: `translateY(${deltaY * 0.6}px) scale(1.015)`, offset: 0.25 },
            { transform: `translateY(${deltaY * 0.15}px) scale(1.015)`, offset: 0.65 },
            { transform: 'translateY(0) scale(1)',                  offset: 1 },
          ],
          {
            duration: FLIP_DURATION,
            easing: 'ease-in-out',
            fill: 'none',
          }
        ).onfinish = () => {
          el.style.zIndex = ''
        }
      } else {
        el.animate(
          [
            { transform: `translateY(${deltaY}px)`, offset: 0 },
            { transform: `translateY(${deltaY * 0.3}px)`, offset: 0.5 },
            { transform: 'translateY(0)',            offset: 1 },
          ],
          {
            duration: FLIP_DURATION,
            easing: 'ease-in-out',
            fill: 'none',
          }
        )
      }
    })

    prevRectsRef.current = new Map()
    movedIdRef.current = null
  }, [categories])

  useEffect(() => {
    if (mode !== 'idle' && inputRef.current) inputRef.current.focus()
  }, [mode])

  function startAdd() {
    setMode('add')
    setEditId(null)
    setLabel('')
    setEmoji('🍽️')
    setShowEmoji(false)
    setDeleteConfirm(null)
  }

  function startEdit(cat: CategoryMeta) {
    setMode('edit')
    setEditId(cat.id)
    setLabel(cat.label)
    setEmoji(cat.emoji)
    setShowEmoji(false)
    setDeleteConfirm(null)
  }

  function save() {
    const trimmed = label.trim()
    if (!trimmed) return
    if (mode === 'add') {
      const id = toSlug(trimmed)
      if (categories.some((c) => c.id === id)) return
      addCategory({ id, label: trimmed, emoji })
    } else if (mode === 'edit' && editId) {
      updateCategory(editId, { label: trimmed, emoji })
    }
    cancel()
  }

  function cancel() {
    setMode('idle')
    setEditId(null)
    setLabel('')
    setEmoji('🍽️')
    setShowEmoji(false)
  }

  function confirmDelete(id: string) {
    if (id === UNSORTED_CATEGORY_ID) return   // protected
    const label = categories.find((c) => c.id === id)?.label ?? 'Category'
    const unsortedLabel = categories.find((c) => c.id === UNSORTED_CATEGORY_ID)?.label ?? 'Unsorted'
    const count = recipeCounts[id] || 0
    if (count > 0) {
      // Always reassign orphaned recipes to the Unsorted category
      reassignCategory(id, UNSORTED_CATEGORY_ID)
    }
    removeCategory(id)
    setDeleteConfirm(null)
    if (editId === id) cancel()
    toast.show(
      count > 0
        ? `"${label}" deleted — ${count} recipe${count === 1 ? '' : 's'} moved to ${unsortedLabel}.`
        : `"${label}" deleted.`
    )
  }

  // `idx` here is 0-based over manageableCategories (Unsorted excluded).
  // The underlying store's `categories` array still carries Unsorted at
  // index 0, so the real index there is always idx + 1.
  function moveUp(idx: number) {
    if (idx <= 0) return   // already the first movable category
    capturePositions()
    const ids = categories.map((c) => c.id)
    const realIdx = idx + 1
    movedIdRef.current = ids[realIdx]
    ;[ids[realIdx - 1], ids[realIdx]] = [ids[realIdx], ids[realIdx - 1]]
    reorderCategories(ids)
  }

  function moveDown(idx: number) {
    if (idx >= manageableCategories.length - 1) return
    capturePositions()
    const ids = categories.map((c) => c.id)
    const realIdx = idx + 1
    movedIdRef.current = ids[realIdx]
    ;[ids[realIdx], ids[realIdx + 1]] = [ids[realIdx + 1], ids[realIdx]]
    reorderCategories(ids)
  }

  return (
    <SlideDrawer
      open={open}
      onClose={onClose}
      title="Manage category"
      footer={
        <Button onClick={onClose} type="Primary" size="M">
          Done
        </Button>
      }
    >
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--typography-desktop-text-s-regular-size)',
        lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
        color: 'var(--color-text-secondary)',
        margin: '0 0 var(--space-l) 0',
      }}>
        Organize how recipes are grouped in your library.
      </p>

      {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: TABLE_COLS,
            alignItems: 'end',
            columnGap: 'var(--space-m)',
            padding: '0 var(--space-l) var(--space-s) var(--space-l)',
            marginBottom: 'var(--space-s)',
            borderBottom: 'var(--border-width-m) solid var(--color-border-default)',
          }}>
            <span />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
              fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
              lineHeight: 'var(--typography-desktop-text-s-semi-bold-line-height)',
              color: 'var(--color-text-primary)',
            }}>
              {manageableCategories.length > 0
                ? `Category (${manageableCategories.length})`
                : 'Category'}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--typography-desktop-text-xs-semi-bold-size)',
              fontWeight: 'var(--typography-desktop-text-xs-semi-bold-weight)',
              lineHeight: 'var(--typography-desktop-text-xs-semi-bold-line-height)',
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              textAlign: 'right',
            }}>
              Recipes
            </span>
            <span />
            {manageableCategories.length > 1 ? (
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                lineHeight: 'var(--typography-desktop-text-xs-regular-line-height)',
                color: 'var(--color-text-disabled)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 'var(--space-xs)',
              }}>
                <ChevronUp size={10} />
                <ChevronDown size={10} />
                Reorder
              </span>
            ) : <span />}
          </div>

          {/* Category list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>

            {/* Empty state */}
            {manageableCategories.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: 'var(--space-2xl) var(--space-xl)',
                borderRadius: 'var(--border-radius-m)',
                border: 'var(--border-width-s) dashed var(--color-border-default)',
                background: 'var(--color-background-secondary)',
              }}>
                <Folder size={28} style={{ display: 'block', margin: '0 auto var(--space-s)', color: 'var(--color-text-tertiary)' }} />
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
                  fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
                  lineHeight: 'var(--typography-desktop-text-s-semi-bold-line-height)',
                  color: 'var(--color-text-primary)',
                  margin: '0 0 var(--space-xs) 0',
                }}>
                  No categories yet
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                  lineHeight: 'var(--typography-desktop-text-xs-regular-line-height)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}>
                  Add your first category to start organizing recipes.
                </p>
              </div>
            )}

            {/* Category rows */}
            {manageableCategories.map((cat, idx) => {
              const isEditing = mode === 'edit' && editId === cat.id
              const isDeleting = deleteConfirm === cat.id
              const count = recipeCounts[cat.id] || 0

              /* Editing row — same neutral card shell as the delete
                 confirmation below, so the two inline states read as one
                 consistent "focused row" pattern rather than two designs. */
              if (isEditing) {
                return (
                  <div key={cat.id} ref={(el) => { if (el) rowRefs.current.set(cat.id, el); else rowRefs.current.delete(cat.id) }} style={{
                    borderRadius: 'var(--border-radius-s)',
                    border: 'var(--border-width-s) solid var(--color-border-default)',
                    background: 'var(--color-background-secondary)',
                    padding: 'var(--space-m)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-m)',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
                      fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)',
                      lineHeight: 'var(--typography-desktop-text-m-semi-bold-line-height)',
                      color: 'var(--color-text-primary)',
                    }}>
                      Edit category
                    </span>
                    <InlineForm
                      inputRef={inputRef}
                      label={label}
                      emoji={emoji}
                      showEmoji={showEmoji}
                      onLabelChange={setLabel}
                      onEmojiChange={setEmoji}
                      onToggleEmoji={() => setShowEmoji(!showEmoji)}
                      onSave={save}
                      onCancel={cancel}
                    />
                  </div>
                )
              }

              /* Delete confirmation — replaces the row in place (no popover
                 stacked on top of the drawer). Same neutral card shell as
                 the Editing row above — a subtle gray border, not a red
                 accent, since the red Delete button already carries that
                 signal on its own. */
              if (isDeleting) {
                const unsortedCat = categories.find((c) => c.id === UNSORTED_CATEGORY_ID)
                return (
                  <div key={cat.id} ref={(el) => { if (el) rowRefs.current.set(cat.id, el); else rowRefs.current.delete(cat.id) }} style={{
                    borderRadius: 'var(--border-radius-s)',
                    border: 'var(--border-width-s) solid var(--color-border-default)',
                    background: 'var(--color-background-secondary)',
                    padding: 'var(--space-m)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-m)',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
                        fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)',
                        lineHeight: 'var(--typography-desktop-text-m-semi-bold-line-height)',
                        color: 'var(--color-text-primary)',
                      }}>
                        Delete &ldquo;{cat.label}&rdquo;?
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--typography-desktop-text-s-regular-size)',
                        lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
                        color: 'var(--color-text-secondary)',
                      }}>
                        {count > 0 && unsortedCat
                          ? `Recipes won't be deleted — ${count} recipe${count === 1 ? '' : 's'} will move to "${unsortedCat.label}" instead.`
                          : 'No recipes are using this category, so nothing else will be affected.'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-s)' }}>
                      <Button onClick={() => confirmDelete(cat.id)} type="Negative Primary" size="S">
                        Delete
                      </Button>
                      <Button onClick={() => setDeleteConfirm(null)} type="Outline" size="S">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )
              }

              /* Normal row — same TABLE_COLS grid as the header, so every
                 column lines up exactly like a real table. */
              return (
                <div
                  key={cat.id}
                  ref={(el) => { if (el) rowRefs.current.set(cat.id, el); else rowRefs.current.delete(cat.id) }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: TABLE_COLS,
                    alignItems: 'center',
                    columnGap: 'var(--space-m)',
                    padding: 'var(--space-m) var(--space-l)',
                    borderRadius: 'var(--border-radius-s)',
                    background: 'var(--color-background-secondary)',
                  }}
                >
                  {/* Emoji */}
                  <span style={{ fontSize: '20px', lineHeight: 1, justifySelf: 'center' }}>{cat.emoji}</span>

                  {/* Label */}
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
                    fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)',
                    lineHeight: 'var(--typography-desktop-text-m-semi-bold-line-height)',
                    color: 'var(--color-text-primary)',
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {cat.label}
                  </span>

                  {/* Recipe count */}
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--typography-desktop-text-s-regular-size)',
                    fontWeight: 'var(--typography-desktop-text-s-regular-weight)',
                    lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
                    color: count > 0 ? 'var(--color-text-tertiary)' : 'var(--color-text-disabled)',
                    textAlign: 'right',
                  }}>
                    {count > 0 ? `${count}` : '—'}
                  </span>

                  {/* Divider */}
                  <div style={{
                    width: 'var(--border-width-s)',
                    height: '24px',
                    background: 'var(--color-border-default)',
                    justifySelf: 'center',
                  }} />

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-xs)' }}>
                    <IconBtn title="Move up" disabled={idx <= 0} onClick={() => moveUp(idx)}>
                      <ChevronUp size={18} />
                    </IconBtn>
                    <IconBtn title="Move down" disabled={idx >= manageableCategories.length - 1} onClick={() => moveDown(idx)}>
                      <ChevronDown size={18} />
                    </IconBtn>
                    <IconBtn title="Edit" onClick={() => startEdit(cat)}>
                      <Edit2 size={16} />
                    </IconBtn>
                    <IconBtn
                      title="Delete"
                      onClick={() => setDeleteConfirm(cat.id)}
                      danger
                    >
                      <X size={16} />
                    </IconBtn>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Add category ── */}
          <div style={{ marginTop: 'var(--space-m)' }}>
            {mode === 'add' ? (
              <div style={{
                borderRadius: 'var(--border-radius-s)',
                border: 'var(--border-width-s) solid var(--color-border-default)',
                background: 'var(--color-background-secondary)',
                padding: 'var(--space-m)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-m)',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
                    fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)',
                    lineHeight: 'var(--typography-desktop-text-m-semi-bold-line-height)',
                    color: 'var(--color-text-primary)',
                  }}>
                    New category
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--typography-desktop-text-s-regular-size)',
                    lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
                    color: 'var(--color-text-secondary)',
                  }}>
                    Group recipes your own way — pick an icon and give it a name.
                  </span>
                </div>
                <InlineForm
                  inputRef={inputRef}
                  label={label}
                  emoji={emoji}
                  showEmoji={showEmoji}
                  onLabelChange={setLabel}
                  onEmojiChange={setEmoji}
                  onToggleEmoji={() => setShowEmoji(!showEmoji)}
                  onSave={save}
                  onCancel={cancel}
                />
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                  lineHeight: 'var(--typography-desktop-text-xs-regular-line-height)',
                  color: 'var(--color-text-tertiary)',
                }}>
                  Tap the emoji to change the icon · Press <b>Enter</b> to save
                </span>
              </div>
            ) : (
              <button
                onClick={startAdd}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-xs)',
                  height: '36px',
                  borderRadius: 'var(--border-radius-s)',
                  border: 'var(--border-width-s) dashed var(--color-border-default)',
                  background: 'transparent',
                  color: 'var(--color-text-secondary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--typography-desktop-text-s-regular-size)',
                  fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
                  lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                <Plus size={14} />
                New category
              </button>
            )}
          </div>
    </SlideDrawer>
  )
}

/* ── Inline form (shared for add & edit) ── */
function InlineForm({
  inputRef,
  label,
  emoji,
  showEmoji,
  onLabelChange,
  onEmojiChange,
  onToggleEmoji,
  onSave,
  onCancel,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  label: string
  emoji: string
  showEmoji: boolean
  onLabelChange: (v: string) => void
  onEmojiChange: (v: string) => void
  onToggleEmoji: () => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-s)', alignItems: 'center' }}>
      {/* Emoji button */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={onToggleEmoji}
          title="Pick emoji"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--border-radius-s)',
            border: 'var(--border-width-s) solid var(--color-border-default)',
            background: 'var(--color-background-primary)',
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'border-color 150ms ease',
          }}
        >
          {emoji}
        </button>
        {showEmoji && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + var(--space-xs))',
            left: 0,
            zIndex: 20,
            background: 'var(--color-background-primary)',
            border: 'var(--border-width-s) solid var(--color-border-default)',
            borderRadius: 'var(--border-radius-m)',
            boxShadow: 'var(--shadow-card)',
            padding: 'var(--space-s)',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 'var(--space-xs)',
            width: '200px',
          }}>
            {EMOJI_PRESETS.map((em) => (
              <button
                key={em}
                onClick={() => onEmojiChange(em)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--border-radius-xs)',
                  border: 'none',
                  background: emoji === em ? 'var(--color-background-brand-subtle)' : 'transparent',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 100ms ease',
                }}
              >
                {em}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Name input */}
      <input
        ref={inputRef}
        type="text"
        placeholder="e.g. Quick meals, Desserts, Date night..."
        value={label}
        onChange={(e) => onLabelChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave()
          if (e.key === 'Escape') onCancel()
        }}
        style={inputStyle}
      />

      {/* Confirm */}
      <button
        onClick={onSave}
        disabled={!label.trim()}
        title="Save"
        style={{
          width: '28px',
          height: '28px',
          borderRadius: 'var(--border-radius-pill)',
          border: 'none',
          background: label.trim() ? 'var(--color-background-brand)' : 'var(--color-background-secondary)',
          color: label.trim() ? 'var(--color-text-primary-inverse)' : 'var(--color-text-disabled)',
          cursor: label.trim() ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          flexShrink: 0,
          transition: 'all 150ms ease',
        }}
      >
        <Check size={14} />
      </button>

      {/* Cancel */}
      <button
        onClick={onCancel}
        title="Cancel"
        style={{
          width: '28px',
          height: '28px',
          borderRadius: 'var(--border-radius-pill)',
          border: 'var(--border-width-s) solid var(--color-border-default)',
          background: 'var(--color-background-primary)',
          color: 'var(--color-text-tertiary)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          flexShrink: 0,
          transition: 'all 150ms ease',
        }}
      >
        <X size={14} />
      </button>
    </div>
  )
}

/* ── Icon button helper ── */
function IconBtn({
  children,
  title,
  disabled,
  onClick,
  danger,
}: {
  children: React.ReactNode
  title: string
  disabled?: boolean
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: 'var(--border-radius-s)',
        border: 'none',
        background: 'transparent',
        color: disabled
          ? 'var(--color-text-disabled)'
          : danger
            ? 'var(--color-text-negative)'
            : 'var(--color-text-tertiary)',
        cursor: disabled ? 'default' : 'pointer',
        padding: 0,
        opacity: disabled ? 0.35 : 1,
        transition: 'all 150ms ease',
      }}
    >
      {children}
    </button>
  )
}
