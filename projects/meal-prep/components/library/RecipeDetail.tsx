'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useRef } from 'react'
import type { Recipe } from '@/types'
import { useRecipeStore } from '@/store/useRecipeStore'
import { TagBadge } from '@/components/shared/TagBadge'
import { RecipeNotes } from '@/components/library/RecipeNotes'
import { EditRecipeModal } from '@/components/library/EditRecipeModal'
import { DeleteConfirmModal } from '@/components/library/DeleteConfirmModal'
import { AddToPlanModal } from '@/components/library/AddToPlanModal'
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook } from 'react-icons/si'
import { FiGlobe, FiExternalLink, FiArrowLeft, FiEdit2, FiCamera } from 'react-icons/fi'

const PLATFORM_LABEL: Record<string, string> = {
  instagram: 'Instagram',
  tiktok:    'TikTok',
  youtube:   'YouTube',
  facebook:  'Facebook',
  other:     'Web',
}

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  instagram: SiInstagram,
  tiktok:    SiTiktok,
  youtube:   SiYoutube,
  facebook:  SiFacebook,
  other:     FiGlobe,
}

interface RecipeDetailProps {
  recipe: Recipe
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showAddToPlan, setShowAddToPlan] = useState(false)
  const [showPhotoInput, setShowPhotoInput] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const updateRecipe = useRecipeStore((s) => s.updateRecipe)

  // Live thumbnail from store so edits reflect instantly
  const liveThumbnail = useRecipeStore((s) => s.getRecipeById(recipe.id)?.thumbnail ?? null)
  const [photoUrl, setPhotoUrl] = useState(liveThumbnail ?? '')

  // Sync local input when thumbnail changes externally (e.g. via EditRecipeModal)
  const prevThumbnail = useRef(liveThumbnail)
  if (prevThumbnail.current !== liveThumbnail) {
    prevThumbnail.current = liveThumbnail
    setPhotoUrl(liveThumbnail ?? '')
  }

  function handlePhotoSave() {
    const trimmed = photoUrl.trim()
    const value = trimmed || null
    if (value !== liveThumbnail) {
      updateRecipe(recipe.id, { thumbnail: value })
    }
    setShowPhotoInput(false)
  }

  const PlatformIcon = PLATFORM_ICONS[recipe.platform] ?? FiGlobe

  return (
    <div className="flex flex-col h-full lg:overflow-hidden overflow-y-auto hide-scrollbar"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
    >

      {/* Back nav — pinned top */}
      <div
        className="shrink-0 mx-auto w-full max-w-7xl"
        style={{
          paddingLeft: 'var(--space-20)',
          paddingRight: 'var(--space-20)',
          paddingTop: 'var(--space-xl)',
          paddingBottom: 'var(--space-l)',
        }}
      >
        <Link
          href="/library"
          className="inline-flex items-center"
          style={{
            gap: 'var(--space-s)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--typography-desktop-text-m-regular-size)',
            fontWeight: 'var(--typography-desktop-text-m-regular-weight)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <FiArrowLeft size={16} />
          Back to Library
        </Link>
      </div>

      {/* Two-column area — fills remaining height on desktop, flows on mobile */}
      <div
        className="flex flex-col lg:flex-row lg:flex-1 lg:min-h-0 mx-auto w-full max-w-7xl"
        style={{
          paddingLeft: 'var(--space-20)',
          paddingRight: 'var(--space-20)',
          gap: 'var(--space-2xl)',
        }}
      >

        {/* Photo — compact landscape on mobile, tall portrait pinned on desktop */}
        <div
          className="w-full lg:w-5/12 shrink-0 lg:self-stretch flex items-start"
          style={{ paddingBottom: 'var(--space-xl)' }}
        >
          <div
            className="w-full overflow-hidden"
            style={{
              borderRadius: 'var(--radius-xl)',
              background: 'var(--color-background-secondary)',
              maxHeight: '100%',
              position: 'relative',
            }}
          >
            {/* Mobile: 16:9 landscape hero / Desktop: 4:5 portrait */}
            <div className="aspect-video lg:hidden" style={{ position: 'relative', width: '100%' }}>
              {liveThumbnail ? (
                <Image src={liveThumbnail} alt={recipe.title} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-5xl opacity-20">🍽️</div>
              )}
            </div>
            <div className="hidden lg:block" style={{ aspectRatio: '4 / 5', position: 'relative', width: '100%' }}>
              {liveThumbnail ? (
                <Image src={liveThumbnail} alt={recipe.title} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl opacity-20">🍽️</div>
              )}
            </div>

            {/* Camera button */}
            <button
              onClick={() => {
                setShowPhotoInput((v) => !v)
                setTimeout(() => photoInputRef.current?.focus(), 50)
              }}
              style={{
                position: 'absolute',
                bottom: 'var(--space-m)',
                right: 'var(--space-m)',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(8px)',
                border: 'none',
                display: showPhotoInput ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-text-secondary)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
              }}
              title="Change photo"
            >
              <FiCamera size={15} />
            </button>

            {/* Photo URL input — floating pill at bottom */}
            {showPhotoInput && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 'var(--space-m)',
                  right: 'var(--space-m)',
                  width: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-xs)',
                  padding: '4px 4px 4px var(--space-m)',
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                }}
              >
                <FiCamera size={14} style={{ flexShrink: 0, color: 'var(--color-text-tertiary)' }} />
                <input
                  ref={photoInputRef}
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  onBlur={handlePhotoSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handlePhotoSave()
                    if (e.key === 'Escape') { setPhotoUrl(liveThumbnail ?? ''); setShowPhotoInput(false) }
                  }}
                  placeholder="Paste image URL…"
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--typography-desktop-text-s-regular-size)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                    padding: 0,
                    minWidth: 0,
                  }}
                />
                <button
                  onClick={handlePhotoSave}
                  style={{
                    flexShrink: 0,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'var(--color-background-brand)',
                    color: 'var(--color-text-primary-inverse)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  title="Save"
                >
                  ✓
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Details — pinned header + scrollable guide on desktop; flows on mobile */}
        <div
          className="flex-1 min-w-0 flex flex-col lg:min-h-0"
          style={{ gap: 'var(--space-xl)' }}
        >

          {/* Pinned on desktop, flows on mobile */}
          <div className="lg:shrink-0 flex flex-col" style={{ gap: 'var(--space-xl)' }}>

          {/* Source badge */}
          <div
            className="inline-flex items-center self-start"
            style={{
              gap: 'var(--space-s)',
              paddingLeft: 'var(--space-m)',
              paddingRight: 'var(--space-m)',
              paddingTop: 'var(--space-xs)',
              paddingBottom: 'var(--space-xs)',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--color-background-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
              fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <PlatformIcon size={13} />
            {PLATFORM_LABEL[recipe.platform] ?? 'Web'}
          </div>

          {/* Title + actions */}
          <div className="flex items-start justify-between" style={{ gap: 'var(--space-m)' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--typography-desktop-heading-l-semi-bold-size)',
                fontWeight: 'var(--typography-desktop-heading-l-semi-bold-weight)',
                lineHeight: 'var(--typography-desktop-heading-l-semi-bold-line-height)',
                letterSpacing: 'var(--typography-desktop-heading-l-semi-bold-letter-spacing)',
                color: 'var(--color-text-primary)',
              }}
            >
              {recipe.title}
            </h1>
            <div className="flex shrink-0" style={{ gap: 'var(--space-s)' }}>
              <button
                onClick={() => setShowEdit(true)}
                title="Edit recipe"
                className="flex items-center justify-center"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--border-radius-pill)',
                  border: 'none',
                  background: 'var(--color-background-secondary)',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                <FiEdit2 size={16} />
              </button>
            </div>
          </div>

          {/* Tags */}
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap" style={{ gap: 'var(--space-s)' }}>
              {recipe.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap" style={{ gap: 'var(--space-m)' }}>
            <a
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
              style={{
                gap: 'var(--space-s)',
                paddingLeft: 'var(--space-xl)',
                paddingRight: 'var(--space-xl)',
                paddingTop: 'var(--space-m)',
                paddingBottom: 'var(--space-m)',
                borderRadius: 'var(--radius-md)',
                borderWidth: 'var(--border-width-s)',
                borderStyle: 'solid',
                borderColor: 'var(--color-border-default)',
                background: 'var(--color-background-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
                fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)',
                color: 'var(--color-text-primary)',
              }}
            >
              <FiExternalLink size={16} />
              Watch on {PLATFORM_LABEL[recipe.platform] ?? 'source'}
            </a>

            <button
              onClick={() => setShowAddToPlan(true)}
              className="inline-flex items-center"
              style={{
                gap: 'var(--space-s)',
                paddingLeft: 'var(--space-xl)',
                paddingRight: 'var(--space-xl)',
                paddingTop: 'var(--space-m)',
                paddingBottom: 'var(--space-m)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-background-brand)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
                fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)',
                color: 'var(--color-text-primary-inverse)',
              }}
            >
              📅 Add to meal plan
            </button>
          </div>

          </div>{/* end pinned section */}

          {/* Recipe guide — flows on mobile; caps + scrolls on desktop */}
          <div
            className="lg:min-h-0 lg:shrink"
            style={{ marginBottom: '40px' }}
          >
            <RecipeNotes recipeId={recipe.id} initialNotes={recipe.notes} className="lg:max-h-full" />
          </div>

        </div>
      </div>

      {/* Edit modal */}
      {showEdit && (
        <EditRecipeModal recipe={recipe} onClose={() => setShowEdit(false)} onDelete={() => { setShowEdit(false); setShowDelete(true) }} />
      )}

      {/* Delete confirmation modal */}
      {showDelete && (
        <DeleteConfirmModal
          recipeId={recipe.id}
          recipeTitle={recipe.title}
          onClose={() => setShowDelete(false)}
          onCancel={() => { setShowDelete(false); setShowEdit(true) }}
        />
      )}

      {/* Add to meal plan modal */}
      {showAddToPlan && (
        <AddToPlanModal recipeId={recipe.id} onClose={() => setShowAddToPlan(false)} />
      )}
    </div>
  )
}
