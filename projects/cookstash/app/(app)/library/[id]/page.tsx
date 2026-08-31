'use client'

import { useParams } from 'next/navigation'
import { Search } from 'react-feather'
import { useRecipeStore } from '@/store/useRecipeStore'
import { RecipeDetail } from '@/components/library/RecipeDetail'
import { EmptyState } from '@/components/shared/EmptyState'

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const getRecipeById = useRecipeStore((s) => s.getRecipeById)
  const recipe = getRecipeById(id)

  if (!recipe) {
    return (
      <EmptyState
        icon={<Search size={32} />}
        title="Recipe not found"
        description="This recipe may have been deleted."
        href="/library"
        actionLabel="Back to Library"
      />
    )
  }

  return (
    <div className="h-full">
      <RecipeDetail recipe={recipe} />
    </div>
  )
}
