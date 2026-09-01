'use client'

import React, { useState } from 'react'
import { Trash2 } from 'react-feather'
import type { Recipe, Tag, RecipeCategory } from '@/types'
import { useRecipeStore } from '@/store/useRecipeStore'
import { useCategoryStore } from '@/store/useCategoryStore'
import { TAG_LABELS, TAG_ICONS } from '@/lib/library-labels'
import { Button, Input, Select, Modal } from '@jasmine/design-system'

const ALL_TAGS: Tag[] = [
  'quick-win', 'batch', 'freezer', 'high-protein',
  'vegetarian', 'vegan', 'dairy-free', 'gluten-free',
  'budget', 'kid-friendly', 'low-carb', 'one-pan',
]

/* ── Shared styles ── */
const sectionLabelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
  fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)' as unknown as number,
  lineHeight: 'var(--typography-desktop-text-m-semi-bold-line-height)',
  color: 'var(--color-text-primary)',
  marginBottom: 0,
}

interface EditRecipeModalProps {
  recipe: Recipe
  onClose: () => void
  onDelete: () => void
}

export function EditRecipeModal({ recipe, onClose, onDelete }: EditRecipeModalProps) {
  const updateRecipe = useRecipeStore((s) => s.updateRecipe)
  const categories = useCategoryStore((s) => s.categories)

  const [title, setTitle] = useState(recipe.title)
  const [selectedTags, setSelectedTags] = useState<Tag[]>([...recipe.tags])
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory>(recipe.category)
  const [cookTime, setCookTime] = useState(recipe.estimatedCookTime?.toString() ?? '')
  function toggleTag(tag: Tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  function handleDone() {
    if (hasChanges) {
      updateRecipe(recipe.id, {
        title: title.trim() || recipe.title,
        tags: selectedTags,
        category: selectedCategory,
        estimatedCookTime: cookTime ? parseInt(cookTime, 10) : null,
      })
    }
    onClose()
  }

  const hasChanges =
    title.trim() !== recipe.title ||
    selectedCategory !== recipe.category ||
    cookTime !== (recipe.estimatedCookTime?.toString() ?? '') ||
    JSON.stringify(selectedTags) !== JSON.stringify(recipe.tags)

  return (
    <Modal
      open
      onClose={onClose}
      title="Edit details"
      variant="form"
      size="M"
      footer={
        <Button
          onClick={handleDone}
          type="Primary"
          size="M"
          disabled={!title.trim()}
        >
          Done
        </Button>
      }
    >

          <div className="flex flex-col" style={{ gap: 'var(--space-xl)' }}>

            {/* ── Recipe ── */}
            <div className="flex flex-col" style={{ gap: 'var(--space-m)' }}>
              <label style={sectionLabelStyle}>Recipe</label>

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

            {/* ── Tags ── */}
            <div className="flex flex-col" style={{ gap: 'var(--space-m)' }}>
              <label style={sectionLabelStyle}>Tags</label>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                {ALL_TAGS.map((tag) => {
                  const active = selectedTags.includes(tag)
                  const Icon = TAG_ICONS[tag]
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
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
                      {Icon && <Icon size={12} />}
                      {TAG_LABELS[tag]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Delete ── */}
            <div style={{
              borderTop: 'var(--border-width-s) solid var(--color-border-default)',
              paddingTop: 'var(--space-xl)',
            }}>
              <button
                onClick={onDelete}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-s)',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--typography-desktop-text-s-regular-size)',
                  lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
                  color: 'var(--color-text-tertiary)',
                  transition: 'color 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-error)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
              >
                <Trash2 size={14} />
                Delete this recipe
              </button>
            </div>

          </div>
    </Modal>
  )
}
