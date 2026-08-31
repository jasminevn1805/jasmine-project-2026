// Shared label maps so the page, FilterBar, ActiveFilterChips, and RecipeCard
// all speak the same human-readable vocabulary.

import type { IconType } from 'react-icons'
import {
  LuInbox,
  LuUtensils,
  LuCroissant,
  LuSalad,
  LuSoup,
  LuCookie,
  LuCakeSlice,
  LuCupSoda,
  LuCarrot,
  LuSnowflake,
  LuDumbbell,
  LuLeaf,
  LuSprout,
  LuMilkOff,
  LuWheatOff,
  LuBaby,
  LuCookingPot,
} from 'react-icons/lu'
import { Zap, Package, DollarSign } from 'react-feather'
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook } from 'react-icons/si'
import { FiGlobe } from 'react-icons/fi'
import type { Platform, Tag } from '@/types'
import { UNSORTED_CATEGORY_ID } from '@/store/useCategoryStore'

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

// Shared platform glyphs — brand marks for the named platforms (Lucide/
// Feather don't ship logos, so these come from react-icons' brand set),
// generic globe for anything else. One source so RecipeCard, RecipeDetail,
// and FilterBar don't each hand-roll their own copy.
export const PLATFORM_ICONS: Record<Platform, IconType> = {
  instagram: SiInstagram,
  tiktok: SiTiktok,
  youtube: SiYoutube,
  facebook: SiFacebook,
  other: FiGlobe,
}

// Minimal line-icon set for tags — same Feather-first, Lucide-fallback
// approach as CATEGORY_ICONS below (Feather where it has the icon, Lucide
// where it doesn't — e.g. no food-specific glyphs in Feather).
export const TAG_ICONS: Record<Tag, IconType> = {
  'quick-win': Zap,
  batch: Package,
  freezer: LuSnowflake,
  'high-protein': LuDumbbell,
  vegetarian: LuLeaf,
  vegan: LuSprout,
  'dairy-free': LuMilkOff,
  'gluten-free': LuWheatOff,
  budget: DollarSign,
  'kid-friendly': LuBaby,
  'low-carb': LuSalad,
  'one-pan': LuCookingPot,
}

// Minimal line-icon set for the built-in categories — Lucide, the actively
// maintained continuation of Feather (same 2px-stroke, 24x24 visual
// language already used elsewhere in the app), swapped in for the emoji
// glyph on category headers.
//
// Custom, user-created categories aren't in here: they pick their own
// emoji in ManageCategoriesModal, and there's no fixed icon for an
// arbitrary user-typed category name — callers should fall back to the
// category's own `emoji` when its id isn't present in this map.
export const CATEGORY_ICONS: Record<string, IconType> = {
  [UNSORTED_CATEGORY_ID]: LuInbox,
  'main-course': LuUtensils,
  breakfast: LuCroissant,
  salad: LuSalad,
  soup: LuSoup,
  snack: LuCookie,
  dessert: LuCakeSlice,
  drink: LuCupSoda,
  'side-dish': LuCarrot,
}
