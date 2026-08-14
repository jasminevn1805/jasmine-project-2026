import type { Recipe } from '@/types'
import { RecipeCard } from './RecipeCard'
import { EmptyState } from '@/components/shared/EmptyState'

interface RecipeGridProps {
  recipes: Recipe[]
  onAddRecipe: () => void
}

export function RecipeGrid({ recipes, onAddRecipe }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="Your library is empty"
        description="Save your first recipe by pasting a link from Instagram, TikTok, YouTube, or anywhere else."
        actionLabel="+ Save a recipe"
        onAction={onAddRecipe}
      />
    )
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      style={{ columnGap: 'var(--space-s)', rowGap: 'var(--space-2xl)' }}
    >
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}
