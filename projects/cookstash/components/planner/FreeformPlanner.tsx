'use client'

import { useState } from 'react'
import { usePlannerStore } from '@/store/usePlannerStore'
import { FreeformBoard } from '@/components/planner/FreeformBoard'
import { AddDishesModal } from '@/components/planner/AddDishesModal'
import type { FreeformPlan, FreeformDish, MealType, Recipe } from '@/types'

interface FreeformPlannerProps {
  plan: FreeformPlan
  recipes: Recipe[]
}

export function FreeformPlanner({ plan, recipes }: FreeformPlannerProps) {
  const { addDishToFreeform, removeDishFromFreeform, updateFreeformDish } = usePlannerStore()

  const [showAddDishes, setShowAddDishes] = useState<MealType | null>(null)

  return (
    <>
      {/* Freeform board */}
      <FreeformBoard
        planId={plan.id}
        dishes={plan.dishes}
        recipes={recipes}
        onAddDishes={(mealType: MealType) => setShowAddDishes(mealType)}
        onRemoveDish={(dishId: string) => removeDishFromFreeform(plan.id, dishId)}
        onUpdateDish={(dishId: string, updates: Partial<FreeformDish>) =>
          updateFreeformDish(plan.id, dishId, updates)
        }
      />

      {/* Add-dishes modal */}
      {showAddDishes && (
        <AddDishesModal
          planName={plan.name}
          mealType={showAddDishes}
          recipes={recipes}
          existingRecipeIds={plan.dishes
            .filter((d) => d.mealType === showAddDishes)
            .map((d) => d.recipeId)}
          onAdd={(recipeIds) => {
            recipeIds.forEach((recipeId) => {
              addDishToFreeform(plan.id, showAddDishes, recipeId)
            })
            setShowAddDishes(null)
          }}
          onClose={() => setShowAddDishes(null)}
        />
      )}
    </>
  )
}
