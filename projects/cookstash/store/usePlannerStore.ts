'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MealPlan, CalendarPlan, FreeformPlan, MealType, PlanDay, MealSlot, FreeformDish } from '@/types'

// ─── Demo seed: a realistic week of meals ─────────────────────────────────────
// Each entry maps an offset from Sunday-of-current-week to slots.
// Uses real seed recipe IDs from useRecipeStore so cards render with thumbnails.
const SEED_WEEK_TEMPLATE: Array<{ dayOffset: number; slots: MealSlot[] }> = [
  // Sunday — prep day, full coverage
  { dayOffset: 0, slots: [
    { mealType: 'breakfast', recipeId: 'seed-03', customLabel: null }, // Overnight Oats
    { mealType: 'lunch',     recipeId: 'seed-04', customLabel: null }, // Thai Peanut Noodle Salad
    { mealType: 'dinner',    recipeId: 'seed-01', customLabel: null }, // Teriyaki Salmon Rice Bowls
  ]},
  // Monday — leftovers + new dinner
  { dayOffset: 1, slots: [
    { mealType: 'breakfast', recipeId: 'seed-03', customLabel: null }, // Overnight Oats (batch)
    { mealType: 'lunch',     recipeId: 'seed-06', customLabel: null }, // Chicken Burrito Bowls
    { mealType: 'dinner',    recipeId: 'seed-02', customLabel: null }, // Sheet Pan Chicken
  ]},
  // Tuesday
  { dayOffset: 2, slots: [
    { mealType: 'breakfast', recipeId: 'seed-03', customLabel: null },
    { mealType: 'lunch',     recipeId: 'seed-04', customLabel: null },
    { mealType: 'dinner',    recipeId: 'seed-05', customLabel: null }, // Stuffed Peppers
  ]},
  // Wednesday — lighter day
  { dayOffset: 3, slots: [
    { mealType: 'lunch',  recipeId: 'seed-06', customLabel: null },
    { mealType: 'dinner', recipeId: 'seed-01', customLabel: null },
  ]},
  // Thursday
  { dayOffset: 4, slots: [
    { mealType: 'breakfast', recipeId: 'seed-03', customLabel: null },
    { mealType: 'dinner',    recipeId: 'seed-02', customLabel: null },
  ]},
  // Friday — eating out kind of night
  { dayOffset: 5, slots: [
    { mealType: 'dinner', recipeId: 'seed-05', customLabel: null },
  ]},
  // Saturday
  { dayOffset: 6, slots: [
    { mealType: 'lunch',  recipeId: 'seed-04', customLabel: null },
    { mealType: 'dinner', recipeId: 'seed-01', customLabel: null },
  ]},
]

/** ISO yyyy-mm-dd in local time (avoids UTC off-by-one) */
function toISODate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/** Build every day of a given month as PlanDay[] */
function buildMonthDays(year: number, month: number): PlanDay[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => ({
    date: toISODate(new Date(year, month, i + 1)),
    slots: [],
  }))
}

/** Build a CalendarPlan for the current month with this week pre-filled. */
function buildSeedCalendarPlan(): CalendarPlan {
  const now = new Date()
  const sundayOfWeek = new Date(now)
  sundayOfWeek.setDate(now.getDate() - now.getDay())

  const monthDays = buildMonthDays(now.getFullYear(), now.getMonth())

  // Overlay this week's seed slots onto the matching dates
  const seededDates = new Map<string, MealSlot[]>()
  for (const { dayOffset, slots } of SEED_WEEK_TEMPLATE) {
    const d = new Date(sundayOfWeek)
    d.setDate(sundayOfWeek.getDate() + dayOffset)
    seededDates.set(toISODate(d), slots)
  }

  const days: PlanDay[] = monthDays.map((day) =>
    seededDates.has(day.date) ? { ...day, slots: seededDates.get(day.date)! } : day
  )

  return {
    id: 'seed-plan-current-week',
    name: 'This Week',
    mode: 'calendar',
    days,
    createdAt: new Date().toISOString(),
    shareToken: null,
  }
}

interface PlannerStore {
  plans: MealPlan[]
  /** True once the demo week has been seeded for this browser. */
  seeded: boolean
  createPlan: (plan: MealPlan) => void
  updateCalendarPlan: (id: string, updates: Partial<Omit<CalendarPlan, 'mode'>>) => void
  updateFreeformPlan: (id: string, updates: Partial<Omit<FreeformPlan, 'mode'>>) => void
  deletePlan: (id: string) => void
  duplicatePlan: (id: string) => MealPlan | undefined
  /**
   * Copy all meal slots from one week to another within a CalendarPlan.
   * Maps by day-of-week (Sun=0..Sat=6). Non-destructive merge.
   * sourceDates: the date strings of the source week (up to 7)
   * targetStartDate: the Sunday date string of the target week
   */
  copyWeekToWeek: (
    planId: string,
    sourceDates: string[],
    targetStartDate: string,
  ) => void
  /** Remove all meal slots for the given dates within a CalendarPlan. */
  clearWeek: (planId: string, dates: string[]) => void
  assignRecipeToSlot: (
    planId: string,
    date: string,
    mealType: MealSlot['mealType'],
    recipeId: string
  ) => void
  /** Add a user-typed custom dish (no library recipe) */
  assignCustomDish: (
    planId: string,
    date: string,
    mealType: MealSlot['mealType'],
    label: string
  ) => void
  removeSlot: (
    planId: string,
    date: string,
    mealType: MealSlot['mealType'],
    recipeId: string | null,
    customLabel: string | null,
  ) => void
  removeRecipeFromSlot: (
    planId: string,
    date: string,
    mealType: MealSlot['mealType'],
    recipeId: string
  ) => void
  addDaysToCalendar: (planId: string, newDays: PlanDay[]) => void
  // Freeform plan actions
  addDishToFreeform: (planId: string, mealType: MealType, recipeId: string) => void
  removeDishFromFreeform: (planId: string, dishId: string) => void
  updateFreeformDish: (planId: string, dishId: string, updates: Partial<FreeformDish>) => void
  getPlanById: (id: string) => MealPlan | undefined
  setShareToken: (planId: string, token: string) => void
  /**
   * Seed a sample week into the calendar planner on first launch.
   * Idempotent: only runs once per browser AND only if no calendar plan exists,
   * so a user's real plans are never overwritten.
   */
  seedPlans: () => void
}

export const usePlannerStore = create<PlannerStore>()(
  persist(
    (set, get) => ({
      plans: [],
      seeded: false,

      seedPlans: () => {
        const { seeded, plans } = get()
        if (seeded) return
        // Don't clobber an existing calendar plan (e.g. user already started planning)
        const hasCalendar = plans.some((p) => p.mode === 'calendar')
        if (hasCalendar) {
          set({ seeded: true })
          return
        }
        const seedPlan = buildSeedCalendarPlan()
        set((state) => ({ plans: [seedPlan, ...state.plans], seeded: true }))
      },

      createPlan: (plan) =>
        set((state) => ({ plans: [plan, ...state.plans] })),

      updateCalendarPlan: (id, updates) =>
        set((state) => ({
          plans: state.plans.map((p) =>
            p.id === id && p.mode === 'calendar' ? { ...p, ...updates } : p
          ),
        })),

      updateFreeformPlan: (id, updates) =>
        set((state) => ({
          plans: state.plans.map((p) =>
            p.id === id && p.mode === 'freeform' ? { ...p, ...updates } : p
          ),
        })),

      deletePlan: (id) =>
        set((state) => ({
          plans: state.plans.filter((p) => p.id !== id),
        })),

      duplicatePlan: (id) => {
        const original = get().plans.find((p) => p.id === id)
        if (!original) return undefined
        const base = {
          id: crypto.randomUUID(),
          name: `${original.name} (Copy)`,
          createdAt: new Date().toISOString(),
          shareToken: null,
        }
        let copy: MealPlan
        if (original.mode === 'calendar') {
          // Deep-clone days & slots
          copy = {
            ...original,
            ...base,
            days: original.days.map((d) => ({
              date: d.date,
              slots: d.slots.map((s) => ({ ...s })),
            })),
          }
        } else {
          // Deep-clone dishes with new IDs
          copy = {
            ...original,
            ...base,
            dishes: original.dishes.map((d) => ({
              ...d,
              id: crypto.randomUUID(),
            })),
          }
        }
        set((state) => ({ plans: [copy, ...state.plans] }))
        return copy
      },

      copyWeekToWeek: (planId, sourceDates, targetStartDate) =>
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId || p.mode !== 'calendar') return p

            // Build a map: day-of-week (0=Sun..6=Sat) → slots from source week
            const srcSlotsByDow = new Map<number, MealSlot[]>()
            for (const dateStr of sourceDates) {
              const day = p.days.find((d) => d.date === dateStr)
              if (day && day.slots.length > 0) {
                const dow = new Date(dateStr + 'T12:00:00').getDay()
                srcSlotsByDow.set(dow, day.slots)
              }
            }
            if (srcSlotsByDow.size === 0) return p

            // Build the 7 target dates (Sun–Sat) from targetStartDate
            const startDt = new Date(targetStartDate + 'T12:00:00')
            const targetDates: string[] = []
            for (let i = 0; i < 7; i++) {
              const d = new Date(startDt)
              d.setDate(startDt.getDate() + i)
              targetDates.push(d.toISOString().split('T')[0])
            }

            // Ensure target days exist
            const existingDates = new Set(p.days.map((d) => d.date))
            const newDays: PlanDay[] = targetDates
              .filter((d) => !existingDates.has(d))
              .map((d) => ({ date: d, slots: [] }))

            const allDays = [...p.days, ...newDays]

            // Merge source slots into target days by day-of-week (non-destructive)
            const targetSet = new Set(targetDates)
            const merged = allDays.map((day) => {
              if (!targetSet.has(day.date)) return day
              const dow = new Date(day.date + 'T12:00:00').getDay()
              const srcSlots = srcSlotsByDow.get(dow)
              if (!srcSlots) return day

              const existingKeys = new Set(
                day.slots.map((s) => `${s.mealType}:${s.recipeId}:${s.customLabel ?? ''}`),
              )
              const toAdd = srcSlots.filter(
                (s) => !existingKeys.has(`${s.mealType}:${s.recipeId}:${s.customLabel ?? ''}`),
              )
              if (toAdd.length === 0) return day
              return { ...day, slots: [...day.slots, ...toAdd.map((s) => ({ ...s }))] }
            })

            return { ...p, days: merged }
          }),
        })),

      clearWeek: (planId, dates) =>
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId || p.mode !== 'calendar') return p
            const dateSet = new Set(dates)
            const days: PlanDay[] = p.days.map((day) => {
              if (!dateSet.has(day.date)) return day
              if (day.slots.length === 0) return day
              return { ...day, slots: [] }
            })
            return { ...p, days }
          }),
        })),

      assignRecipeToSlot: (planId, date, mealType, recipeId) =>
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId || p.mode !== 'calendar') return p
            const days: PlanDay[] = p.days.map((day) => {
              if (day.date !== date) return day
              const alreadyAdded = day.slots.some(
                (s) => s.mealType === mealType && s.recipeId === recipeId
              )
              if (alreadyAdded) return day
              const slots: MealSlot[] = [...day.slots, { mealType, recipeId, customLabel: null }]
              return { ...day, slots }
            })
            return { ...p, days }
          }),
        })),

      removeRecipeFromSlot: (planId, date, mealType, recipeId) =>
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId || p.mode !== 'calendar') return p
            const days: PlanDay[] = p.days.map((day) => {
              if (day.date !== date) return day
              const slots: MealSlot[] = day.slots.filter(
                (s) => !(s.mealType === mealType && s.recipeId === recipeId)
              )
              return { ...day, slots }
            })
            return { ...p, days }
          }),
        })),

      assignCustomDish: (planId, date, mealType, label) =>
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId || p.mode !== 'calendar') return p
            const days: PlanDay[] = p.days.map((day) => {
              if (day.date !== date) return day
              const alreadyAdded = day.slots.some(
                (s) => s.mealType === mealType && s.customLabel === label
              )
              if (alreadyAdded) return day
              const slots: MealSlot[] = [...day.slots, { mealType, recipeId: null, customLabel: label }]
              return { ...day, slots }
            })
            return { ...p, days }
          }),
        })),

      removeSlot: (planId, date, mealType, recipeId, customLabel) =>
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId || p.mode !== 'calendar') return p
            const days: PlanDay[] = p.days.map((day) => {
              if (day.date !== date) return day
              // Remove the first matching slot
              let removed = false
              const slots: MealSlot[] = day.slots.filter((s) => {
                if (removed) return true
                const match = s.mealType === mealType && s.recipeId === recipeId && s.customLabel === customLabel
                if (match) { removed = true; return false }
                return true
              })
              return { ...day, slots }
            })
            return { ...p, days }
          }),
        })),

      addDaysToCalendar: (planId, newDays) =>
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId || p.mode !== 'calendar') return p
            const existingDates = new Set(p.days.map((d) => d.date))
            const toAdd = newDays.filter((d) => !existingDates.has(d.date))
            if (toAdd.length === 0) return p
            return { ...p, days: [...p.days, ...toAdd] }
          }),
        })),

      // ── Freeform plan actions ──────────────────────────────────

      addDishToFreeform: (planId, mealType, recipeId) =>
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId || p.mode !== 'freeform') return p
            if (p.dishes.some((d) => d.recipeId === recipeId && d.mealType === mealType)) return p
            const dish: FreeformDish = {
              id: crypto.randomUUID(),
              recipeId,
              mealType,
              servings: 1,
              note: null,
            }
            return { ...p, dishes: [...p.dishes, dish] }
          }),
        })),

      removeDishFromFreeform: (planId, dishId) =>
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId || p.mode !== 'freeform') return p
            return { ...p, dishes: p.dishes.filter((d) => d.id !== dishId) }
          }),
        })),

      updateFreeformDish: (planId, dishId, updates) =>
        set((state) => ({
          plans: state.plans.map((p) => {
            if (p.id !== planId || p.mode !== 'freeform') return p
            return {
              ...p,
              dishes: p.dishes.map((d) =>
                d.id === dishId ? { ...d, ...updates } : d
              ),
            }
          }),
        })),

      getPlanById: (id) => get().plans.find((p) => p.id === id),

      setShareToken: (planId, token) =>
        set((state) => ({
          plans: state.plans.map((p) =>
            p.id === planId
              ? p.mode === 'calendar'
                ? { ...p, shareToken: token }
                : { ...p, shareToken: token }
              : p
          ),
        })),
    }),
    {
      name: 'cookstash-planner',
      storage: {
        getItem: (name) => {
          const raw = localStorage.getItem(name)
          return raw ? JSON.parse(raw) : null
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value))
          } catch {
            localStorage.removeItem(name)
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      version: 3,
      migrate: (persisted: unknown, version: number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const state = persisted as { plans?: any[]; seeded?: boolean }
        if (!state.plans) return state

        // v0/v1 → v2: convert to discriminated union (CalendarPlan | FreeformPlan)
        if (version < 2) {
          state.plans = state.plans.map((p) => {
            const mode = p.mode ?? 'calendar'
            if (mode === 'freeform') {
              return {
                id: p.id,
                name: p.name,
                mode: 'freeform' as const,
                dishes: p.dishes ?? [],
                description: p.description ?? null,
                createdAt: p.createdAt,
                shareToken: p.shareToken ?? null,
              } satisfies FreeformPlan
            }
            return {
              id: p.id,
              name: p.name,
              mode: 'calendar' as const,
              days: p.days ?? [],
              createdAt: p.createdAt,
              shareToken: p.shareToken ?? null,
            } satisfies CalendarPlan
          })
        }

        // v2 → v3: introduce `seeded` flag. Existing sessions that already
        // have a calendar plan are considered "seeded" so we don't drop a
        // demo week on top of real user data.
        if (version < 3) {
          const hasCalendar = (state.plans ?? []).some((p) => p?.mode === 'calendar')
          state.seeded = hasCalendar
        }
        return state
      },
    }
  )
)
