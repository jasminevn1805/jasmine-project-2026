'use client'

import { useId } from 'react'
import Image from 'next/image'
import { useState } from 'react'
import Link from 'next/link'
import {
  Sun, Droplet, Zap, Archive, Thermometer, Star, Coffee, Package, Check, Eye, Clock,
} from 'react-feather'
import type { Icon } from 'react-feather'
import type { GroceryList, GroceryCategory, CalendarPlan, Recipe } from '@/types'
import { TagBadge } from './TagBadge'

// ─── Category meta ────────────────────────────────────────────────────────────

const CATEGORY_META: Record<GroceryCategory, { icon: Icon; label: string }> = {
  produce:   { icon: Sun,         label: 'Produce' },
  dairy:     { icon: Droplet,     label: 'Dairy' },
  meat:      { icon: Zap,         label: 'Meat & Protein' },
  pantry:    { icon: Archive,     label: 'Pantry' },
  frozen:    { icon: Thermometer, label: 'Frozen' },
  bakery:    { icon: Star,        label: 'Bakery' },
  beverages: { icon: Coffee,      label: 'Beverages' },
  other:     { icon: Package,     label: 'Other' },
}

const CATEGORY_ORDER: GroceryCategory[] = [
  'produce', 'meat', 'dairy', 'pantry', 'frozen', 'bakery', 'beverages', 'other',
]

function titleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase())
}

// ─── Self-contained checkbox (no DS dist dependency) ─────────────────────────
// SVG is ALWAYS in the DOM — shown/hidden via opacity only.
// This guarantees zero layout shift on toggle (no element mount/unmount).

interface ShareCheckboxRowProps {
  name: string
  checked: boolean
  onChange: () => void
}

function ShareCheckboxRow({ name, checked, onChange }: ShareCheckboxRowProps) {
  const id = useId()
  return (
    <label
      htmlFor={id}
      style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        userSelect: 'none',
        height: '20px',
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
        <Check
          size={10}
          strokeWidth={2.5}
          color="white"
          style={{
            opacity: checked ? 1 : 0,
            transition: 'opacity 150ms ease',
          }}
          aria-hidden="true"
        />
      </span>
      <span
        style={{
          fontFamily: 'var(--typography-desktop-family-main)',
          fontSize: 'var(--typography-desktop-text-s-regular-size)',
          fontWeight: 'var(--typography-desktop-text-s-regular-weight)',
          lineHeight: '16px',
          color: 'var(--color-text-primary)',
        }}
      >
        {name}
      </span>
    </label>
  )
}

// ─── Shared grocery view ──────────────────────────────────────────────────────

interface ShareGroceryProps {
  list: GroceryList
}

function ShareGroceryView({ list }: ShareGroceryProps) {
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(list.items.filter((i) => i.checked).map((i) => i.id))
  )

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const totalCount   = list.items.length
  const checkedCount = checked.size
  const progress     = totalCount === 0 ? 0 : Math.round((checkedCount / totalCount) * 100)
  const allDone      = totalCount > 0 && checkedCount === totalCount

  const grouped = CATEGORY_ORDER.reduce<Record<GroceryCategory, typeof list.items>>(
    (acc, cat) => { acc[cat] = list.items.filter((i) => i.category === cat); return acc },
    {} as Record<GroceryCategory, typeof list.items>
  )

  return (
    <div>
      {/* ── Header ───────────────────────────────────────────── */}
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <div
          style={{
            display:        'flex',
            alignItems:     'flex-start',
            justifyContent: 'space-between',
            gap:            'var(--space-m)',
            marginBottom:   'var(--space-xs)',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize:   'var(--typography-desktop-heading-l-size)',
              fontWeight: 'var(--typography-desktop-heading-l-weight)',
              lineHeight: 'var(--typography-desktop-heading-l-line-height)',
              color:      'var(--color-text-primary)',
              margin:     0,
            }}
          >
            {list.name}
          </h1>

          {/* View-only badge */}
          <span
            style={{
              display:      'inline-flex',
              alignItems:   'center',
              gap:          'var(--space-xs)',
              padding:      'var(--space-xs) var(--space-s)',
              borderRadius: 'var(--border-radius-pill)',
              background:   'var(--color-background-secondary)',
              fontFamily:   'var(--font-body)',
              fontSize:     'var(--typography-desktop-text-xs-regular-size)',
              color:        'var(--color-text-tertiary)',
              whiteSpace:   'nowrap',
              flexShrink:   0,
            }}
          >
            <Eye size={10} />
            View only
          </span>
        </div>

        <p
          style={{
            fontFamily:   'var(--font-body)',
            fontSize:     'var(--typography-desktop-text-s-regular-size)',
            color:        'var(--color-text-secondary)',
            marginBottom: 'var(--space-m)',
          }}
        >
          {checkedCount} of {totalCount} item{totalCount !== 1 ? 's' : ''} collected
        </p>

        {/* Progress bar */}
        {totalCount > 0 && (
          <div>
            <div
              style={{
                height:       '4px',
                width:        '100%',
                borderRadius: 'var(--border-radius-pill)',
                background:   'var(--color-background-secondary)',
                overflow:     'hidden',
              }}
            >
              <div
                style={{
                  height:     '100%',
                  width:      `${progress}%`,
                  borderRadius: 'var(--border-radius-pill)',
                  background: allDone ? 'var(--color-background-positive)' : 'var(--color-text-brand)',
                  transition: 'width 300ms ease',
                }}
              />
            </div>
            {allDone && (
              <p
                style={{
                  display:    'inline-flex',
                  alignItems: 'center',
                  gap:        'var(--space-xs)',
                  marginTop:  'var(--space-s)',
                  fontFamily: 'var(--font-body)',
                  fontSize:   'var(--typography-desktop-text-xs-regular-size)',
                  color:      'var(--color-text-positive)',
                }}
              >
                <Check size={12} strokeWidth={2.5} />
                All items collected
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Category cards ────────────────────────────────────── */}
      {totalCount === 0 ? (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'var(--typography-desktop-text-m-regular-size)',
            color:      'var(--color-text-secondary)',
          }}
        >
          This list is empty.
        </p>
      ) : (
        /* Masonry columns — same as GroceryList */
        <div
          style={{
            columns:     '3 320px',
            columnGap:   'var(--space-l)',
          }}
        >
          {CATEGORY_ORDER.map((cat) => {
            const items = grouped[cat]
            if (items.length === 0) return null
            const meta       = CATEGORY_META[cat]
            const IconComp   = meta.icon
            const catChecked = items.filter((i) => checked.has(i.id)).length

            return (
              <div
                key={cat}
                style={{
                  background:      'var(--color-background-secondary)',
                  borderRadius:    'var(--border-radius-l)',
                  padding:         'var(--space-l)',
                  breakInside:     'avoid',
                  pageBreakInside: 'avoid',
                  marginBottom:    'var(--space-l)',
                  display:         'inline-block',
                  width:           '100%',
                }}
              >
                {/* Category header — identical to CategorySection */}
                <div
                  style={{
                    display:       'flex',
                    alignItems:    'center',
                    gap:           'var(--space-s)',
                    paddingBottom: 'var(--space-m)',
                    marginBottom:  'var(--space-s)',
                  }}
                >
                  <span
                    style={{
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      width:          '24px',
                      height:         '24px',
                      borderRadius:   'var(--border-radius-s)',
                      background:     'var(--color-background-primary)',
                      color:          'var(--color-text-brand)',
                      flexShrink:     0,
                    }}
                  >
                    <IconComp size={14} />
                  </span>
                  <h3
                    style={{
                      fontFamily:    'var(--font-body)',
                      fontSize:      'var(--typography-desktop-text-s-semi-bold-size)',
                      fontWeight:    'var(--typography-desktop-text-s-semi-bold-weight)',
                      lineHeight:    'var(--typography-desktop-text-s-semi-bold-line-height)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      color:         'var(--color-text-primary)',
                      margin:        0,
                    }}
                  >
                    {meta.label}
                  </h3>
                  <span
                    style={{
                      display:        'inline-flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      minWidth:       '20px',
                      height:         '20px',
                      padding:        '0 var(--space-xs)',
                      borderRadius:   'var(--border-radius-pill)',
                      background:     'var(--color-background-primary)',
                      fontFamily:     'var(--font-body)',
                      fontSize:       'var(--typography-desktop-text-xs-regular-size)',
                      fontWeight:     'var(--typography-desktop-text-xs-regular-weight)',
                      lineHeight:     '1',
                      color:          'var(--color-text-tertiary)',
                    }}
                  >
                    {catChecked}/{items.length}
                  </span>
                </div>

                {/* Items — vertical list, one per row (same as CategorySection) */}
                <ul
                  style={{
                    listStyle:     'none',
                    margin:        0,
                    padding:       0,
                    display:       'flex',
                    flexDirection: 'column',
                  }}
                >
                  {items.map((item) => {
                    const isChecked = checked.has(item.id)
                    return (
                      <li
                        key={item.id}
                        style={{
                          display:     'flex',
                          alignItems:  'center',
                          gap:         'var(--space-s)',
                          padding:     'var(--space-xs) 0',
                          minHeight:   'var(--primitive-spacing-36)',
                          breakInside: 'avoid',
                          width:       '100%',
                        }}
                      >
                        {/* Self-contained checkbox — no DS dist dependency */}
                        <ShareCheckboxRow
                          name={titleCase(item.name)}
                          checked={isChecked}
                          onChange={() => toggle(item.id)}
                        />

                        {/* Quantity badge */}
                        {item.quantity && (
                          <span
                            style={{
                              flexShrink: 0,
                              fontFamily: 'var(--typography-desktop-family-main)',
                              fontSize:   'var(--typography-desktop-text-s-regular-size)',
                              fontWeight: 'var(--typography-desktop-text-s-regular-weight)',
                              lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
                              color:      'var(--color-text-tertiary)',
                            }}
                          >
                            {titleCase(item.quantity)}
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      )}

      {/* ── App CTA ──────────────────────────────────────────── */}
      <div
        style={{
          marginTop:    'var(--space-2xl)',
          background:   'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-l)',
          padding:      'var(--space-xl)',
          textAlign:    'center',
        }}
      >
        <p
          style={{
            fontFamily:   'var(--font-display)',
            fontSize:     'var(--typography-desktop-text-m-semi-bold-size)',
            fontWeight:   'var(--typography-desktop-text-m-semi-bold-weight)',
            color:        'var(--color-text-primary)',
            marginBottom: 'var(--space-xs)',
          }}
        >
          Plan your own meals
        </p>
        <p
          style={{
            fontFamily:   'var(--font-body)',
            fontSize:     'var(--typography-desktop-text-s-regular-size)',
            color:        'var(--color-text-secondary)',
            marginBottom: 'var(--space-l)',
          }}
        >
          Save recipes, plan the week, build your grocery list.
        </p>
        <Link
          href="/"
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            padding:        'var(--space-s) var(--space-xl)',
            borderRadius:   'var(--border-radius-pill)',
            background:     'var(--color-background-brand)',
            color:          'var(--color-text-primary-inverse)',
            fontFamily:     'var(--font-body)',
            fontSize:       'var(--typography-desktop-text-s-semi-bold-size)',
            fontWeight:     'var(--typography-desktop-text-s-semi-bold-weight)',
            textDecoration: 'none',
          }}
        >
          Try Cookstash →
        </Link>
      </div>
    </div>
  )
}

// ─── Shared plan view ─────────────────────────────────────────────────────────

interface SharePlanProps {
  plan: CalendarPlan
  recipes: Recipe[]
}

function SharePlanView({ plan, recipes }: SharePlanProps) {
  const getRecipe = (id: string) => recipes.find((r) => r.id === id)

  return (
    <div>
      <h1
        style={{
          fontFamily:   'var(--font-display)',
          fontSize:     'var(--typography-desktop-heading-l-size)',
          fontWeight:   'var(--typography-desktop-heading-l-weight)',
          color:        'var(--color-text-primary)',
          marginBottom: 'var(--space-xl)',
        }}
      >
        {plan.name}
      </h1>
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap:                 'var(--space-m)',
        }}
      >
        {plan.days.map((day) => {
          const date = new Date(day.date)
          return (
            <div
              key={day.date}
              style={{
                background:   'var(--color-background-secondary)',
                borderRadius: 'var(--border-radius-m)',
                padding:      'var(--space-m)',
              }}
            >
              <p
                style={{
                  fontFamily:    'var(--font-body)',
                  fontSize:      'var(--typography-desktop-text-xs-regular-size)',
                  fontWeight:    600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color:         'var(--color-text-secondary)',
                  marginBottom:  'var(--space-s)',
                }}
              >
                {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              {day.slots.length === 0 ? (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--typography-desktop-text-xs-regular-size)', color: 'var(--color-text-tertiary)' }}>
                  No meals
                </p>
              ) : (
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                  {day.slots.map((slot, i) => {
                    const recipe = slot.recipeId ? getRecipe(slot.recipeId) : undefined
                    return (
                      <li key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--typography-desktop-text-xs-regular-size)', color: 'var(--color-text-primary)' }}>
                        <span style={{ color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>{slot.mealType}: </span>
                        {recipe?.title ?? slot.customLabel ?? 'Unknown'}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Shared recipe view ───────────────────────────────────────────────────────

interface ShareRecipeProps {
  recipe: Recipe
}

function ShareRecipeView({ recipe }: ShareRecipeProps) {
  return (
    <div>
      {recipe.thumbnail && (
        <div className="relative h-56 w-full overflow-hidden rounded-2xl">
          <Image src={recipe.thumbnail} alt={recipe.title} fill className="object-cover" />
        </div>
      )}
      <h1
        style={{
          fontFamily:   'var(--font-display)',
          fontSize:     'var(--typography-desktop-heading-l-size)',
          fontWeight:   'var(--typography-desktop-heading-l-weight)',
          color:        'var(--color-text-primary)',
          marginTop:    'var(--space-l)',
          marginBottom: 'var(--space-xs)',
        }}
      >
        {recipe.title}
      </h1>
      {recipe.estimatedCookTime && (
        <p style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-xs)', fontFamily: 'var(--font-body)', fontSize: 'var(--typography-desktop-text-s-regular-size)', color: 'var(--color-text-secondary)' }}>
          <Clock size={13} strokeWidth={2.25} />
          {recipe.estimatedCookTime} min
        </p>
      )}
      {recipe.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', marginTop: 'var(--space-m)' }}>
          {recipe.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
      {recipe.notes && (
        <p
          style={{
            marginTop:    'var(--space-l)',
            background:   'var(--color-background-secondary)',
            borderRadius: 'var(--border-radius-m)',
            padding:      'var(--space-l)',
            fontFamily:   'var(--font-body)',
            fontSize:     'var(--typography-desktop-text-s-regular-size)',
            color:        'var(--color-text-secondary)',
          }}
        >
          {recipe.notes}
        </p>
      )}
      <a
        href={recipe.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          marginTop:      'var(--space-l)',
          fontFamily:     'var(--font-body)',
          fontSize:       'var(--typography-desktop-text-s-semi-bold-size)',
          fontWeight:     'var(--typography-desktop-text-s-semi-bold-weight)',
          color:          'var(--color-text-brand)',
          textDecoration: 'none',
        }}
      >
        View original source ↗
      </a>
    </div>
  )
}

// ─── Main ShareView dispatcher ────────────────────────────────────────────────

type ShareViewProps =
  | { type: 'grocery'; list: GroceryList }
  | { type: 'plan'; plan: CalendarPlan; recipes: Recipe[] }
  | { type: 'recipe'; recipe: Recipe }

export function ShareView(props: ShareViewProps) {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-background-primary)' }}>
      {/* Top bar */}
      <header
        style={{
          padding:      'var(--space-xl) var(--space-none)',
          marginBottom: 'var(--space-2xl)',
        }}
      >
        <Link
          href="/"
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            'var(--space-xs)',
            fontFamily:     'var(--font-body)',
            fontSize:       'var(--typography-desktop-text-s-semi-bold-size)',
            fontWeight:     'var(--typography-desktop-text-s-semi-bold-weight)',
            color:          'var(--color-text-primary)',
            textDecoration: 'none',
          }}
        >
          🍱 Cookstash
        </Link>
      </header>

      {/* Content — no inner max-width; layout.tsx owns that */}
      <div>
        {props.type === 'grocery' && <ShareGroceryView list={props.list} />}
        {props.type === 'plan'    && <SharePlanView plan={props.plan} recipes={props.recipes} />}
        {props.type === 'recipe'  && <ShareRecipeView recipe={props.recipe} />}
      </div>
    </div>
  )
}
