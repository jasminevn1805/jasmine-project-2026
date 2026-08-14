// ============================================================
// Meal Prep App — Shared TypeScript Types
// These mirror the future DB schema for easy v2 wiring
// ============================================================

export type Tag =
  | 'quick-win'
  | 'batch'
  | 'freezer'
  | 'high-protein'
  | 'vegetarian'
  | 'vegan'
  | 'dairy-free'
  | 'gluten-free'
  | 'budget'
  | 'kid-friendly'
  | 'low-carb'
  | 'one-pan'

export type Platform = 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'other'

// RecipeCategory is a string so users can create custom categories.
// Default built-in categories are seeded via useCategoryStore.
export type RecipeCategory = string

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export type GroceryCategory =
  | 'produce'
  | 'dairy'
  | 'meat'
  | 'pantry'
  | 'frozen'
  | 'bakery'
  | 'beverages'
  | 'other'

// ── Recipe ──────────────────────────────────────────────────

export interface Recipe {
  id: string
  url: string
  title: string
  thumbnail: string | null
  platform: Platform
  tags: Tag[]
  category: RecipeCategory
  cuisine: string | null
  estimatedCookTime: number | null // minutes
  notes: string | null
  createdAt: string                // ISO date string
}

// ── Meal Planner ─────────────────────────────────────────────

export type PlanMode = 'calendar' | 'freeform'

export interface MealSlot {
  mealType: MealType
  recipeId: string | null
  /** User-typed dish name (used when no library recipe is linked) */
  customLabel: string | null
}

export interface PlanDay {
  date: string    // ISO date e.g. "2026-03-10"
  slots: MealSlot[]
}

/** A dish added to a freeform (occasion) plan */
export interface FreeformDish {
  id: string           // unique per entry
  recipeId: string     // reference to Recipe.id
  mealType: MealType   // which meal this dish belongs to
  servings: number     // default 1
  note: string | null  // e.g. "double the sauce"
}

// ── Plan types (discriminated union) ─────────────────────────

interface BasePlan {
  id: string
  name: string
  createdAt: string
  shareToken: string | null
}

export interface CalendarPlan extends BasePlan {
  mode: 'calendar'
  days: PlanDay[]         // lazily filled per month
}

export interface FreeformPlan extends BasePlan {
  mode: 'freeform'
  dishes: FreeformDish[]
  description: string | null
}

export type MealPlan = CalendarPlan | FreeformPlan

// ── Grocery List ─────────────────────────────────────────────

export interface GroceryItem {
  id: string
  name: string
  quantity: string | null    // e.g. "2 cups", "1 bunch"
  category: GroceryCategory
  checked: boolean           // false = need to buy, true = in cart / have it
  inPantry: boolean          // persists after shopping trip as pantry inventory
}

export interface GroceryList {
  id: string
  name: string
  items: GroceryItem[]
  linkedPlanId: string | null
  createdAt: string
  shareToken: string | null
}

// ── Auth (Mock v1) ───────────────────────────────────────────

export interface UserSession {
  username: string
  loggedIn: boolean
}

// ── OG Metadata (from /api/og) ───────────────────────────────

export interface OGMetadata {
  title: string | null
  thumbnail: string | null
  platform: Platform
}

// ── Share ────────────────────────────────────────────────────

export type ShareableType = 'meal-plan' | 'grocery-list'

export interface SharePayload {
  type: ShareableType
  id: string
  /** V1: full list snapshot embedded in the token so recipients don't need the sharer's localStorage */
  snapshot?: GroceryList
}
