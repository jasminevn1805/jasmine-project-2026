// Shared label maps so the page, FilterBar, ActiveFilterChips, and RecipeCard
// all speak the same human-readable vocabulary.

import type { Platform, Tag } from '@/types'

export const TAGS_LIST: Tag[] = [
  'quick-win',
  'batch',
  'freezer',
  'high-protein',
  'vegetarian',
  'vegan',
  'dairy-free',
  'gluten-free',
  'budget',
  'kid-friendly',
  'low-carb',
  'one-pan',
]

export const TAG_LABELS: Record<Tag, string> = {
  'quick-win': 'Quick win',
  'batch': 'Batch',
  'freezer': 'Freezer',
  'high-protein': 'High protein',
  'vegetarian': 'Vegetarian',
  'vegan': 'Vegan',
  'dairy-free': 'Dairy-free',
  'gluten-free': 'Gluten-free',
  'budget': 'Budget',
  'kid-friendly': 'Kid-friendly',
  'low-carb': 'Low carb',
  'one-pan': 'One pan',
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  facebook: 'Facebook',
  other: 'Other',
}
