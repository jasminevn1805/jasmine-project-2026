'use client'

import React, { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback } from 'react'
import { Edit2, Check, X, ChevronUp, ChevronDown, HelpCircle, Plus, Folder } from 'react-feather'
import { useCategoryStore, UNSORTED_CATEGORY_ID, type CategoryMeta } from '@/store/useCategoryStore'
import { useRecipeStore } from '@/store/useRecipeStore'
import { Button } from '@jasmine/design-system'

/* ── FLIP animation for reorder ── */
const FLIP_DURATION = 550 // ms – leisurely enough to follow with your eyes

const EMOJI_PRESETS = [
  '🍽️','🥞','🥗','🍲','🥨','🍰','🥤','🥦','📌',
  '🥘','🍜','🌮','🍕','🥙','🍝','🍱','🥡','🧁',
]

function toSlug(label: string): string {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

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
  onClose: () => void
}

export function ManageCategoriesModal({ onClose }: Props) {
  const categories = useCategoryStore((s) => s.categories)
  const addCategory = useCategoryStore((s) => s.addCategory)
  const updateCategory = useCategoryStore((s) => s.updateCategory)
  const removeCategory = useCategoryStore((s) => s.removeCategory)
  const reorderCategories = useCategoryStore((s) => s.reorderCategories)

  const recipes = useRecipeStore((s) => s.recipes)
  const reassignCategory = useRecipeStore((s) => s.reassignCategory)

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
    const count = recipeCounts[id] || 0
    if (count > 0) {
      // Always reassign orphaned recipes to the Unsorted category
      reassignCategory(id, UNSORTED_CATEGORY_ID)
    }
    removeCategory(id)
    setDeleteConfirm(null)
    if (editId === id) cancel()
  }

  function moveUp(idx: number) {
    if (idx <= 1) return   // 0 = unsorted (pinned), 1 = already first movable
    capturePositions()
    const ids = categories.map((c) => c.id)
    movedIdRef.current = ids[idx]
    ;[ids[idx - 1], ids[idx]] = [ids[idx], ids[idx - 1]]
    reorderCategories(ids)
  }

  function moveDown(idx: number) {
    if (idx >= categories.length - 1) return
    capturePositions()
    const ids = categories.map((c) => c.id)
    movedIdRef.current = ids[idx]
    ;[ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]]
    reorderCategories(ids)
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center"
      style={{ background: 'var(--color-overlay-30-inverse)', padding: 'var(--space-l)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          maxHeight: 'calc(100vh - var(--space-3xl) * 2)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--border-radius-xl)',
          background: 'var(--color-background-primary)',
          boxShadow: 'var(--shadow-modal)',
          overflow: 'hidden',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          padding: 'var(--space-xl) var(--space-xl) var(--space-l)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--space-m)',
          }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--typography-desktop-heading-s-semi-bold-size)',
                fontWeight: 'var(--typography-desktop-heading-s-semi-bold-weight)',
                lineHeight: 'var(--typography-desktop-heading-s-semi-bold-line-height)',
                letterSpacing: 'var(--typography-desktop-heading-s-semi-bold-letter-spacing)',
                color: 'var(--color-text-primary)',
                margin: 0,
              }}>
                Manage categories
              </h2>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--typography-desktop-text-s-regular-size)',
                lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
                color: 'var(--color-text-secondary)',
                margin: 'var(--space-xs) 0 0 0',
              }}>
                Organize how recipes are grouped in your library.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: 'var(--border-radius-pill)',
                border: 'none',
                background: 'transparent',
                color: 'var(--color-text-tertiary)',
                cursor: 'pointer',
                flexShrink: 0,
                padding: 0,
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--space-l) var(--space-xl)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}>

          {/* Section label */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-s)',
          }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--typography-desktop-text-xs-semi-bold-size)',
              fontWeight: 'var(--typography-desktop-text-xs-semi-bold-weight)',
              lineHeight: 'var(--typography-desktop-text-xs-semi-bold-line-height)',
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {categories.length > 0
                ? `${categories.length} ${categories.length === 1 ? 'category' : 'categories'}`
                : 'Categories'}
            </span>
            {categories.length > 1 && (
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                lineHeight: 'var(--typography-desktop-text-xs-regular-line-height)',
                color: 'var(--color-text-disabled)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
              }}>
                <ChevronUp size={10} />
                <ChevronDown size={10} />
                Reorder
              </span>
            )}
          </div>

          {/* Category list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-s)' }}>

            {/* Empty state */}
            {categories.length === 0 && (
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
            {categories.map((cat, idx) => {
              const isUnsorted = cat.id === UNSORTED_CATEGORY_ID
              const isEditing = mode === 'edit' && editId === cat.id
              const isDeleting = deleteConfirm === cat.id
              const count = recipeCounts[cat.id] || 0

              /* ── Unsorted (pinned default) ── */
              if (isUnsorted) {
                return (
                  <div
                    key={cat.id}
                    ref={(el) => { if (el) rowRefs.current.set(cat.id, el); else rowRefs.current.delete(cat.id) }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-s)',
                      padding: 'var(--space-s) var(--space-m)',
                      borderRadius: 'var(--border-radius-s)',
                      background: 'var(--color-background-secondary)',
                      borderLeft: '3px solid var(--color-border-brand)',
                    }}
                  >
                    {/* Emoji */}
                    <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>{cat.emoji}</span>

                    {/* Label */}
                    <span style={{
                      flex: 1,
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--typography-desktop-text-s-regular-size)',
                      fontWeight: 'var(--typography-desktop-label-s-semi-bold-weight)',
                      lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
                      color: 'var(--color-text-primary)',
                      minWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {cat.label}
                    </span>

                    {/* Badge */}
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                      lineHeight: 'var(--typography-desktop-text-xs-regular-line-height)',
                      color: 'var(--color-text-brand)',
                      background: 'var(--color-background-brand-subtle)',
                      padding: '1px var(--space-s)',
                      borderRadius: 'var(--border-radius-pill)',
                      flexShrink: 0,
                    }}>
                      Default
                    </span>

                    {/* Recipe count */}
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                      fontWeight: 'var(--typography-desktop-text-xs-regular-weight)',
                      lineHeight: 'var(--typography-desktop-text-xs-regular-line-height)',
                      color: count > 0 ? 'var(--color-text-tertiary)' : 'var(--color-text-disabled)',
                      flexShrink: 0,
                    }}>
                      {count > 0 ? `${count}` : '—'}
                    </span>
                  </div>
                )
              }

              /* Editing row */
              if (isEditing) {
                return (
                  <div key={cat.id} ref={(el) => { if (el) rowRefs.current.set(cat.id, el); else rowRefs.current.delete(cat.id) }} style={{
                    borderRadius: 'var(--border-radius-s)',
                    border: 'var(--border-width-s) solid var(--color-border-brand)',
                    background: 'var(--color-background-brand-subtle)',
                    padding: 'var(--space-m)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-s)',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--typography-desktop-text-xs-semi-bold-size)',
                      fontWeight: 'var(--typography-desktop-text-xs-semi-bold-weight)',
                      lineHeight: 'var(--typography-desktop-text-xs-semi-bold-line-height)',
                      color: 'var(--color-text-brand)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>
                      Editing
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

              /* Normal row */
              return (
                <div
                  key={cat.id}
                  ref={(el) => { if (el) rowRefs.current.set(cat.id, el); else rowRefs.current.delete(cat.id) }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-s)',
                    padding: 'var(--space-s) var(--space-m)',
                    borderRadius: 'var(--border-radius-s)',
                    background: 'var(--color-background-secondary)',
                    position: 'relative',
                  }}
                >
                  {/* Emoji */}
                  <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>{cat.emoji}</span>

                  {/* Label */}
                  <span style={{
                    flex: 1,
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--typography-desktop-text-s-regular-size)',
                    fontWeight: 'var(--typography-desktop-label-s-semi-bold-weight)',
                    lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
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
                    fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                    fontWeight: 'var(--typography-desktop-text-xs-regular-weight)',
                    lineHeight: 'var(--typography-desktop-text-xs-regular-line-height)',
                    color: count > 0 ? 'var(--color-text-tertiary)' : 'var(--color-text-disabled)',
                    flexShrink: 0,
                  }}>
                    {count > 0 ? `${count}` : '—'}
                  </span>

                  {/* Divider */}
                  <div style={{
                    width: 'var(--border-width-s)',
                    height: '16px',
                    background: 'var(--color-border-default)',
                    flexShrink: 0,
                  }} />

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', flexShrink: 0 }}>
                    <IconBtn title="Move up" disabled={idx <= 1} onClick={() => moveUp(idx)}>
                      <ChevronUp size={14} />
                    </IconBtn>
                    <IconBtn title="Move down" disabled={idx >= categories.length - 1} onClick={() => moveDown(idx)}>
                      <ChevronDown size={14} />
                    </IconBtn>
                    <IconBtn title="Edit" onClick={() => startEdit(cat)}>
                      <Edit2 size={12} />
                    </IconBtn>
                    <IconBtn
                      title="Delete"
                      onClick={() => setDeleteConfirm(cat.id)}
                      danger
                    >
                      <X size={12} />
                    </IconBtn>
                  </div>

                  {/* Delete confirmation popover */}
                  {isDeleting && (() => {
                    const unsortedCat = categories.find((c) => c.id === UNSORTED_CATEGORY_ID)

                    return (
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + var(--space-xs))',
                        right: 0,
                        zIndex: 10,
                        background: 'var(--color-background-primary)',
                        border: 'var(--border-width-s) solid var(--color-border-default)',
                        borderRadius: 'var(--border-radius-m)',
                        boxShadow: 'var(--shadow-card)',
                        padding: 'var(--space-m)',
                        minWidth: '220px',
                      }}>
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
                          fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
                          lineHeight: 'var(--typography-desktop-text-s-semi-bold-line-height)',
                          color: 'var(--color-text-primary)',
                          margin: '0 0 var(--space-xs) 0',
                        }}>
                          Delete &ldquo;{cat.label}&rdquo;?
                        </p>
                        <p style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                          lineHeight: 'var(--typography-desktop-text-xs-regular-line-height)',
                          color: 'var(--color-text-secondary)',
                          margin: '0 0 var(--space-m) 0',
                        }}>
                          {count > 0 && unsortedCat
                            ? `${count} recipe${count === 1 ? '' : 's'} will be moved to "${unsortedCat.label}".`
                            : 'No recipes are using this category.'}
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-s)' }}>
                          <button onClick={() => confirmDelete(cat.id)} style={{
                            flex: 1,
                            height: '32px',
                            borderRadius: 'var(--border-radius-s)',
                            border: 'none',
                            background: 'var(--color-background-negative)',
                            color: 'var(--color-text-primary-inverse)',
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--typography-desktop-text-xs-semi-bold-size)',
                            fontWeight: 'var(--typography-desktop-text-xs-semi-bold-weight)',
                            cursor: 'pointer',
                          }}>
                            Delete
                          </button>
                          <button onClick={() => setDeleteConfirm(null)} style={{
                            flex: 1,
                            height: '32px',
                            borderRadius: 'var(--border-radius-s)',
                            border: 'var(--border-width-s) solid var(--color-border-default)',
                            background: 'var(--color-background-primary)',
                            color: 'var(--color-text-secondary)',
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--typography-desktop-text-xs-semi-bold-size)',
                            fontWeight: 'var(--typography-desktop-text-xs-regular-weight)',
                            cursor: 'pointer',
                          }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )
            })}
          </div>

          {/* ── Add category ── */}
          <div style={{ marginTop: 'var(--space-m)' }}>
            {mode === 'add' ? (
              <div style={{
                borderRadius: 'var(--border-radius-s)',
                border: 'var(--border-width-s) solid var(--color-border-brand)',
                background: 'var(--color-background-brand-subtle)',
                padding: 'var(--space-m)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-s)',
              }}>
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
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                  lineHeight: 'var(--typography-desktop-text-xs-regular-line-height)',
                  color: 'var(--color-text-tertiary)',
                  margin: 0,
                  paddingLeft: 'var(--space-xs)',
                }}>
                  Tap the emoji to pick an icon · Press <b>Enter</b> to save
                </p>
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
                Add category
              </button>
            )}
          </div>

          {/* ── Hint ── */}
          <div style={{
            marginTop: 'var(--space-l)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-s)',
          }}>
            <HelpCircle
              size={12}
              style={{ color: 'var(--color-text-disabled)', flexShrink: 0, marginTop: '1px' }}
            />
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--typography-desktop-text-xs-regular-size)',
              lineHeight: 'var(--typography-desktop-text-xs-regular-line-height)',
              color: 'var(--color-text-disabled)',
              margin: 0,
            }}>
              Categories appear as sections in your Library and as filters in the meal planner. Recipes without a category are placed in <b>Unsorted</b>.
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: 'var(--space-m) var(--space-xl)',
          borderTop: 'var(--border-width-s) solid var(--color-border-default)',
        }}>
          <Button onClick={onClose} type="Primary" size="M" className="w-full">
            Done
          </Button>
        </div>
      </div>
    </div>
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
        width: '24px',
        height: '24px',
        borderRadius: 'var(--border-radius-xs)',
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
