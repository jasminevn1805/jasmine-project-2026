'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X, ArrowLeft, Camera } from 'react-feather'
import type { Tag, RecipeCategory } from '@/types'
import { useRecipeStore } from '@/store/useRecipeStore'
import { useCategoryStore, UNSORTED_CATEGORY_ID } from '@/store/useCategoryStore'
import { fetchOGMetadata, validateRecipeUrl, detectPlatform } from '@/lib/og-fetch'
import { Button, Input, Select, Textarea } from '@jasmine/design-system'

const ALL_TAGS: Tag[] = [
  'quick-win', 'batch', 'freezer', 'high-protein',
  'vegetarian', 'vegan', 'dairy-free', 'gluten-free',
  'budget', 'kid-friendly', 'low-carb', 'one-pan',
]

const TAG_LABELS: Record<Tag, string> = {
  'quick-win':    '⚡ Quick win',
  'batch':        '📦 Batch',
  'freezer':      '🧊 Freezer',
  'high-protein': '💪 High protein',
  'vegetarian':   '🥦 Vegetarian',
  'vegan':        '🌱 Vegan',
  'dairy-free':   '🥛 Dairy-free',
  'gluten-free':  '🌾 Gluten-free',
  'budget':       '💸 Budget',
  'kid-friendly': '👶 Kid-friendly',
  'low-carb':     '🥗 Low carb',
  'one-pan':      '🍳 One pan',
}

type Step = 'url' | 'preview'

/* ── Shared styles ── */
const sectionLabelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
  fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)' as unknown as number,
  lineHeight: 'var(--typography-desktop-text-m-semi-bold-line-height)',
  color: 'var(--color-text-primary)',
  marginBottom: 0,
}

interface SaveRecipeModalProps {
  onClose: () => void
}

export function SaveRecipeModal({ onClose }: SaveRecipeModalProps) {
  const addRecipe = useRecipeStore((s) => s.addRecipe)
  const categories = useCategoryStore((s) => s.categories)

  const [step, setStep] = useState<Step>('url')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Preview state
  const [title, setTitle] = useState('')
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [platform, setPlatform] = useState<string>('other')
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>(UNSORTED_CATEGORY_ID)
  const [cookTime, setCookTime] = useState('')
  const [notes, setNotes] = useState('')
  const [showThumbnailInput, setShowThumbnailInput] = useState(false)

  async function handleFetch() {
    if (!url.trim()) return

    const check = validateRecipeUrl(url)
    if (!check.ok) {
      setError(check.error)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const og = await fetchOGMetadata(url.trim())
      setTitle(og.title ?? '')
      setThumbnail(og.thumbnail ?? null)
      setPlatform(og.platform)
      setError(null)
      setStep('preview')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not fetch recipe info.'

      if (check.isKnownDomain) {
        setError(msg + ' You can still fill in the details manually.')
        setPlatform(detectPlatform(url.trim()))
        setStep('preview')
      } else {
        setError(msg || 'We could not verify this is a cooking or recipe page. Please use a link from Instagram, TikTok, YouTube, Facebook, or a known cooking website.')
      }
    } finally {
      setLoading(false)
    }
  }

  function toggleTag(tag: Tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  function handleSave() {
    addRecipe({
      id: crypto.randomUUID(),
      url: url.trim(),
      title: title.trim() || url,
      thumbnail,
      platform: platform as import('@/types').Platform,
      tags: selectedTags,
      category: selectedCategory,
      cuisine: null,
      estimatedCookTime: cookTime ? parseInt(cookTime, 10) : null,
      notes: notes.trim() || null,
      createdAt: new Date().toISOString(),
    })
    onClose()
  }

  /* ── Step subtitles ── */
  const headerTitle = step === 'url' ? 'Save a recipe' : 'Complete details'
  const headerSubtitle = step === 'url'
    ? 'Paste a link to save a recipe to your library.'
    : 'Review and organize before saving.'

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-60 flex items-center justify-center"
      style={{ background: 'var(--color-overlay-30-inverse)', padding: 'var(--space-l)' }}
      onClick={onClose}
    >
      {/* Modal panel */}
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
        <div style={{ padding: 'var(--space-xl) var(--space-xl) var(--space-l)', flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--space-m)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-s)' }}>
              {step === 'preview' && (
                <button
                  onClick={() => setStep('url')}
                  aria-label="Back"
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
                    marginTop: '1px',
                  }}
                >
                  <ArrowLeft size={16} />
                </button>
              )}
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
                  {headerTitle}
                </h2>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--typography-desktop-text-s-regular-size)',
                  lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
                  color: 'var(--color-text-secondary)',
                  margin: 'var(--space-xs) 0 0 0',
                }}>
                  {headerSubtitle}
                </p>
              </div>
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

          {/* Step indicator */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-xs)',
            marginTop: 'var(--space-l)',
          }}>
            {(['url', 'preview'] as Step[]).map((s, i) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '3px',
                  borderRadius: 'var(--border-radius-pill)',
                  background: i <= (step === 'url' ? 0 : 1)
                    ? 'var(--color-background-brand)'
                    : 'var(--color-border-default)',
                  transition: 'background 250ms ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 var(--space-xl) var(--space-xl)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}>

          {/* ── Step 1: URL input ── */}
          {step === 'url' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-l)' }}>
              <Input
                label="Recipe URL"
                type="url"
                autoFocus
                placeholder="https://www.instagram.com/reel/…"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(null) }}
                onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
                error={!!error}
              />
              {error && (
                <div style={{
                  borderRadius: 'var(--border-radius-s)',
                  background: 'var(--color-background-negative-subtle)',
                  padding: 'var(--space-m)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-s)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--typography-desktop-text-s-regular-size)',
                    fontWeight: 600,
                    color: 'var(--color-text-negative)',
                    margin: 0,
                  }}>
                    {error}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                    lineHeight: 1.5,
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                  }}>
                    Supported: Instagram, TikTok, YouTube, Facebook, and cooking sites like AllRecipes, Epicurious, Budget Bytes, and more.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Preview / complete details ── */}
          {step === 'preview' && (
            <div className="flex flex-col" style={{ gap: 'var(--space-xl)' }}>

              {/* ── Recipe ── */}
              <div className="flex flex-col" style={{ gap: 'var(--space-m)' }}>
                <label style={sectionLabelStyle}>Recipe</label>

                {/* Thumbnail + fields row */}
                <div style={{ display: 'flex', gap: 'var(--space-m)', alignItems: 'stretch' }}>
                  <div
                    className="shrink-0"
                    style={{
                      position: 'relative',
                      width: 108,
                      borderRadius: 'var(--border-radius-s)',
                      overflow: 'hidden',
                      background: 'var(--color-background-secondary)',
                    }}
                  >
                    {thumbnail ? (
                      <Image
                        src={thumbnail}
                        alt="thumbnail"
                        fill
                        className="object-cover"
                        style={{ objectPosition: 'top center' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        color: 'var(--color-text-disabled)',
                      }}>
                        🍽
                      </div>
                    )}
                    {/* Edit overlay button */}
                    <button
                      type="button"
                      onClick={() => setShowThumbnailInput(!showThumbnailInput)}
                      title={thumbnail ? 'Change photo' : 'Add photo'}
                      style={{
                        position: 'absolute',
                        bottom: 6,
                        right: 6,
                        width: 28,
                        height: 28,
                        borderRadius: 'var(--border-radius-pill)',
                        border: 'none',
                        background: 'var(--color-overlay-30-inverse)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <Camera size={14} />
                    </button>
                  </div>

                  {/* Right side — title, category, cook time */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
                    <Input
                      label="Title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Recipe title"
                    />

                    <div style={{ display: 'flex', gap: 'var(--space-m)' }}>
                      <Select
                        label="Category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        wrapperClassName="flex-1"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.emoji} {cat.label}
                          </option>
                        ))}
                      </Select>

                      <div style={{ width: '100px', flexShrink: 0 }}>
                        <div style={{ position: 'relative' }}>
                          <Input
                            label="Cook time"
                            type="number"
                            min={1}
                            placeholder="30"
                            value={cookTime}
                            onChange={(e) => setCookTime(e.target.value)}
                            style={{ paddingRight: 'var(--space-2xl)' }}
                          />
                          <span style={{
                            position: 'absolute',
                            right: 'var(--space-m)',
                            bottom: '10px',
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                            color: 'var(--color-text-disabled)',
                            pointerEvents: 'none',
                          }}>
                            min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thumbnail URL input (toggled) */}
                {showThumbnailInput && (
                  <Input
                    label="Photo URL"
                    type="url"
                    autoFocus
                    placeholder="https://example.com/photo.jpg"
                    value={thumbnail ?? ''}
                    onChange={(e) => setThumbnail(e.target.value || null)}
                  />
                )}
              </div>

              {/* ── Tags ── */}
              <div className="flex flex-col" style={{ gap: 'var(--space-m)' }}>
                <label style={sectionLabelStyle}>Tags</label>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                  {ALL_TAGS.map((tag) => {
                    const active = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        style={{
                          borderRadius: 'var(--border-radius-pill)',
                          padding: '4px var(--space-s)',
                          border: 'none',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                          fontWeight: active ? 600 : 400,
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                          background: active
                            ? 'var(--color-background-brand)'
                            : 'var(--color-background-secondary)',
                          color: active
                            ? 'var(--color-text-primary-inverse)'
                            : 'var(--color-text-tertiary)',
                          lineHeight: 1.4,
                        }}
                      >
                        {TAG_LABELS[tag]}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ── Notes ── */}
              <div className="flex flex-col" style={{ gap: 'var(--space-m)' }}>
                <label style={sectionLabelStyle}>
                  Notes <span style={{ fontWeight: 400, color: 'var(--color-text-disabled)' }}>· optional</span>
                </label>

                <Textarea
                  rows={2}
                  placeholder="e.g. Double the sauce, swap chicken for tofu…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: 'var(--space-m) var(--space-xl)',
          borderTop: 'var(--border-width-s) solid var(--color-border-default)',
          flexShrink: 0,
        }}>
          {step === 'url' ? (
            <Button
              onClick={handleFetch}
              type="Primary"
              size="M"
              loading={loading}
              disabled={!url.trim() || loading || !!error}
              className="w-full"
            >
              Fetch recipe info
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: 'var(--space-m)' }}>
              <Button onClick={() => setStep('url')} type="Outline" size="M" className="flex-1">
                Back
              </Button>
              <Button onClick={handleSave} type="Primary" size="M" className="flex-1">
                Save recipe
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
