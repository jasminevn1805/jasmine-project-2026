'use client'

import { X, Plus } from 'react-feather'
import type { FreeformDish, MealType, Recipe } from '@/types'

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

interface FreeformBoardProps {
  planId: string
  dishes: FreeformDish[]
  recipes: Recipe[]
  onAddDishes: (mealType: MealType) => void
  onRemoveDish: (dishId: string) => void
  onUpdateDish: (dishId: string, updates: Partial<FreeformDish>) => void
}

export function FreeformBoard({
  dishes,
  recipes,
  onAddDishes,
  onRemoveDish,
}: FreeformBoardProps) {
  const getRecipe = (recipeId: string) =>
    recipes.find((r) => r.id === recipeId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
      {MEAL_TYPES.map((mealType) => {
        const sectionDishes = dishes.filter((d) => d.mealType === mealType)

        return (
          <div
            key={mealType}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-s)' }}
          >
            {/* Meal type label — matches DayColumn */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
                fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
                lineHeight: 'var(--typography-desktop-text-s-semi-bold-line-height)',
                letterSpacing: 'var(--typography-desktop-text-s-semi-bold-letter-spacing)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-xs)',
              }}
            >
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </p>

            {/* Dish rows — matches DayColumn recipe rows */}
            {sectionDishes.map((dish) => {
              const recipe = getRecipe(dish.recipeId)
              if (!recipe) return null
              return (
                <div
                  key={dish.id}
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
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                      color: 'var(--color-text-primary)',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      flex: 1,
                    }}
                  >
                    {recipe.title}
                  </span>
                  <button
                    onClick={() => onRemoveDish(dish.id)}
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
              )
            })}

            {/* + Add button — dashed border, matches DayColumn */}
            <button
              onClick={() => onAddDishes(mealType)}
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
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                  'var(--color-border-brand)'
                ;(e.currentTarget as HTMLButtonElement).style.color =
                  'var(--color-text-brand)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                  'var(--color-border-default)'
                ;(e.currentTarget as HTMLButtonElement).style.color =
                  'var(--color-text-tertiary)'
              }}
            >
              <Plus size={12} />
              <span>Add</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
