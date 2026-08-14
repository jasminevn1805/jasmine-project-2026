'use client'

import { useEffect, useMemo } from 'react'
import { usePlannerStore } from '@/store/usePlannerStore'
import { useToast } from '@/components/shared/Toast'
import { MonthGrid } from '@/components/planner/MonthGrid'
import type { CalendarPlan, MealType, PlanDay, Recipe } from '@/types'

/** Build PlanDay stubs for a date range (inclusive). */
function buildDayRange(startDate: Date, endDate: Date): PlanDay[] {
  const days: PlanDay[] = []
  const d = new Date(startDate)
  while (d <= endDate) {
    days.push({ date: d.toISOString().split('T')[0], slots: [] })
    d.setDate(d.getDate() + 1)
  }
  return days
}

/**
 * Compute the padded date range for a month view.
 * Extends backward to Sunday of the first week and forward to Saturday
 * of the last week so every accordion row is a full 7-day week.
 */
function getPaddedRange(year: number, month: number): { start: Date; end: Date } {
  // First day of month → back up to its Sunday
  const first = new Date(year, month, 1)
  const start = new Date(first)
  start.setDate(first.getDate() - first.getDay()) // getDay() 0=Sun

  // Last day of month → advance to its Saturday
  const last = new Date(year, month + 1, 0) // last day of month
  const end = new Date(last)
  end.setDate(last.getDate() + (6 - last.getDay())) // 6=Sat

  return { start, end }
}

interface CalendarPlannerProps {
  plan: CalendarPlan
  recipes: Recipe[]
  /** The month to display (0-11), controlled by the parent */
  viewMonth: number
  /** The year to display, controlled by the parent */
  viewYear: number
}

export function CalendarPlanner({ plan, recipes, viewMonth, viewYear }: CalendarPlannerProps) {
  const { assignRecipeToSlot, addDaysToCalendar, copyWeekToWeek, clearWeek, assignCustomDish, removeSlot } = usePlannerStore()
  const { show: showToast } = useToast()

  // Compute the padded date range (Sun–Sat complete weeks)
  const { start: rangeStart, end: rangeEnd } = useMemo(
    () => getPaddedRange(viewYear, viewMonth),
    [viewYear, viewMonth],
  )

  // Lazily ensure days exist for the entire padded range
  useEffect(() => {
    const allNeeded = buildDayRange(rangeStart, rangeEnd)
    const existingDates = new Set(plan.days.map((d) => d.date))
    const newDays = allNeeded.filter((d) => !existingDates.has(d.date))
    if (newDays.length > 0) {
      addDaysToCalendar(plan.id, newDays)
    }
  }, [viewMonth, viewYear, plan.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Filter the plan's days to the padded range
  const startStr = rangeStart.toISOString().split('T')[0]
  const endStr = rangeEnd.toISOString().split('T')[0]

  const viewedDays = plan.days
    .filter((d) => d.date >= startStr && d.date <= endStr)
    .sort((a, b) => a.date.localeCompare(b.date))

  // Build a plan slice with the padded days
  const viewedPlan: CalendarPlan = { ...plan, days: viewedDays }

  return (
    <MonthGrid
      plan={viewedPlan}
      recipes={recipes}
      viewMonth={viewMonth}
      viewYear={viewYear}
      onAssignRecipes={(date, mealType, recipeIds) => {
        recipeIds.forEach((id) => assignRecipeToSlot(plan.id, date, mealType, id))
      }}
      onAssignCustom={(date, mealType, label) => assignCustomDish(plan.id, date, mealType, label)}
      onRemoveSlot={(date, mealType, recipeId, customLabel) => removeSlot(plan.id, date, mealType, recipeId, customLabel)}
      onCopyWeek={(sourceDates, targetStartDate) => {
        copyWeekToWeek(plan.id, sourceDates, targetStartDate)
        showToast('Week copied', 'success')
      }}
      onClearWeek={(dates) => {
        clearWeek(plan.id, dates)
        showToast('Week cleared', 'success')
      }}
    />
  )
}
