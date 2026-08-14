'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronRight, Layers, RotateCcw } from 'react-feather'
import type { CalendarPlan, MealType, PlanDay, Recipe } from '@/types'
import { DayColumn } from './DayColumn'
import { CopyWeekPopover } from './CopyWeekPopover'
import { useIsMobile } from '@/lib/useMediaQuery'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface MonthGridProps {
  plan: CalendarPlan
  recipes: Recipe[]
  viewMonth: number
  viewYear: number
  onAssignRecipes: (date: string, mealType: MealType, recipeIds: string[]) => void
  onAssignCustom: (date: string, mealType: MealType, label: string) => void
  onRemoveSlot: (date: string, mealType: MealType, recipeId: string | null, customLabel: string | null) => void
  onCopyWeek: (sourceDates: string[], targetStartDate: string) => void
  onClearWeek: (dates: string[]) => void
}

function groupByWeek(days: PlanDay[]): PlanDay[][] {
  if (days.length === 0) return []
  const weeks: PlanDay[][] = []
  let current: PlanDay[] = []
  for (const day of days) {
    const dow = new Date(day.date + 'T12:00:00').getDay()
    if (dow === 0 && current.length > 0) {
      weeks.push(current)
      current = []
    }
    current.push(day)
  }
  if (current.length > 0) weeks.push(current)
  return weeks
}

function weekRangeLabel(week: PlanDay[]): string {
  const first = new Date(week[0].date + 'T12:00:00')
  const last = new Date(week[week.length - 1].date + 'T12:00:00')
  const mo = first.toLocaleDateString('en-US', { month: 'short' })
  if (first.getMonth() === last.getMonth()) {
    return `${mo} ${first.getDate()} – ${last.getDate()}`
  }
  const mo2 = last.toLocaleDateString('en-US', { month: 'short' })
  return `${mo} ${first.getDate()} – ${mo2} ${last.getDate()}`
}

function currentWeekIndex(weeks: PlanDay[][]): number {
  const todayStr = new Date().toISOString().split('T')[0]
  return weeks.findIndex((w) => w.some((d) => d.date === todayStr))
}

/** Portal-based delete confirmation popover that flips above when near bottom of viewport */
function DeleteWeekPopover({
  weekIndex,
  totalSlots,
  anchorEl,
  onConfirm,
  onCancel,
}: {
  weekIndex: number
  totalSlots: number
  anchorEl: HTMLElement | null
  onConfirm: () => void
  onCancel: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [measured, setMeasured] = useState(false)

  useEffect(() => {
    let raf: number

    function update() {
      const popoverEl = ref.current
      if (!anchorEl || !popoverEl) return

      const rect = anchorEl.getBoundingClientRect()
      const popH = popoverEl.offsetHeight
      const popW = popoverEl.offsetWidth
      const gap = 4

      // Right-align popover to the anchor button's right edge
      let left = rect.right - popW
      if (left < 8) left = 8
      if (left + popW > window.innerWidth - 8) left = window.innerWidth - popW - 8

      const spaceBelow = window.innerHeight - rect.bottom - gap
      let top = spaceBelow >= popH ? rect.bottom + gap : rect.top - popH - gap
      if (top < 8) top = 8

      setPos({ top, left })
      setMeasured(true)
    }

    raf = requestAnimationFrame(() => {
      update()
    })

    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [anchorEl])

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onCancel()
    }
    const t = setTimeout(() => document.addEventListener('mousedown', handle), 0)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', handle) }
  }, [onCancel])

  // Close on Escape
  useEffect(() => {
    function handle(e: KeyboardEvent) { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [onCancel])

  return createPortal(
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: pos ? pos.top : -9999,
        left: pos ? pos.left : -9999,
        opacity: measured ? 1 : 0,
        pointerEvents: measured ? 'auto' : 'none',
        transition: 'opacity 0.15s ease',
        background: 'var(--color-background-primary)',
        borderRadius: 'var(--border-radius-m)',
        boxShadow: 'var(--shadow-hover)',
        border: 'var(--border-width-s) solid var(--color-border-subtle)',
        padding: 'var(--space-l)',
        zIndex: 9999,
        minWidth: '220px',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
          fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)' as unknown as number,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-xs)',
        }}
      >
        Delete all meals?
      </p>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--typography-desktop-text-xs-regular-size)',
          color: 'var(--color-text-tertiary)',
          marginBottom: 'var(--space-m)',
        }}
      >
        This will remove {totalSlots} meal{totalSlots !== 1 ? 's' : ''} from Week {weekIndex + 1}. This can&apos;t be undone.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-s)', justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--typography-desktop-text-s-regular-size)',
            padding: 'var(--space-xs) var(--space-m)',
            borderRadius: 'var(--border-radius-s)',
            border: 'var(--border-width-s) solid var(--color-border-default)',
            background: 'var(--color-background-primary)',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--typography-desktop-text-s-regular-size)',
            padding: 'var(--space-xs) var(--space-m)',
            borderRadius: 'var(--border-radius-s)',
            border: 'none',
            background: 'var(--color-background-negative)',
            color: 'var(--color-text-primary-inverse)',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Delete
        </button>
      </div>
    </div>,
    document.body,
  )
}

export function MonthGrid({ plan, recipes, viewMonth, viewYear, onAssignRecipes, onAssignCustom, onRemoveSlot, onCopyWeek, onClearWeek }: MonthGridProps) {
  const weeks = groupByWeek(plan.days)
  const todayWeek = currentWeekIndex(weeks)
  const isMobile = useIsMobile()

  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(() => {
    return new Set([todayWeek >= 0 ? todayWeek : 0])
  })
  const [copyPopoverWeek, setCopyPopoverWeek] = useState(-1)
  const [deleteConfirmWeek, setDeleteConfirmWeek] = useState(-1)
  const copyBtnRefs = useRef<Map<number, HTMLButtonElement>>(new Map())
  const deleteBtnRefs = useRef<Map<number, HTMLButtonElement>>(new Map())

  function toggleWeek(index: number) {
    setExpandedWeeks((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function handleCopyWeek(sourceWeekIdx: number, targetWeekIdx: number) {
    const sourceWeek = weeks[sourceWeekIdx]
    const targetWeek = weeks[targetWeekIdx]
    if (!sourceWeek || !targetWeek) return
    const firstTargetDate = new Date(targetWeek[0].date + 'T12:00:00')
    const targetSunday = new Date(firstTargetDate)
    targetSunday.setDate(firstTargetDate.getDate() - firstTargetDate.getDay())
    const targetStartDate = targetSunday.toISOString().split('T')[0]
    const sourceDates = sourceWeek.map((d) => d.date)
    onCopyWeek(sourceDates, targetStartDate)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
      {weeks.map((week, wi) => {
        const isExpanded = expandedWeeks.has(wi)
        const totalSlots = week.reduce((sum, d) => sum + d.slots.length, 0)
        const isCurrentWeek = wi === todayWeek

        return (
          <div
            key={wi}
            style={{
              borderRadius: 'var(--border-radius-m)',
              background: isExpanded
                ? 'var(--color-background-primary)'
                : 'var(--color-background-primary)',
              boxShadow: isExpanded
                ? 'var(--shadow-hover)'
                : 'var(--shadow-card)',
              /*borderTop: isCurrentWeek
                ? 'var(--border-width-l) solid var(--color-border-brand)'
                : 'var(--border-width-s) solid var(--color-border-subtle)',*/
              overflow: 'visible',
              transform: isExpanded ? 'translateY(-1px)' : 'translateY(0)',
              transition: 'box-shadow 250ms cubic-bezier(.4,0,.2,1), border-color 200ms ease, background 200ms ease, transform 250ms cubic-bezier(.4,0,.2,1)',
            }}
          >
            {/* Accordion header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-s)',
                padding: isMobile ? 'var(--space-s) var(--space-m)' : 'var(--space-10) var(--space-14)',
                position: 'relative',
                flexWrap: isMobile ? 'wrap' : 'nowrap',
              }}
            >
              {/* Toggle */}
              <button
                onClick={() => toggleWeek(wi)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: 1,
                  gap: 'var(--space-s)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {/* Chevron */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 'var(--space-18)',
                    height: 'var(--space-18)',
                    color: 'var(--color-text-tertiary)',
                    transition: 'transform 250ms cubic-bezier(.4,0,.2,1)',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    flexShrink: 0,
                  }}
                >
                  <ChevronRight size={14} />
                </span>

                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
                    fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)' as unknown as number,
                    color: isCurrentWeek ? 'var(--color-text-brand)' : 'var(--color-text-primary)',
                  }}
                >
                  Week {wi + 1}
                </span>

                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--typography-desktop-text-s-regular-size)',
                    fontWeight: 'var(--typography-desktop-text-s-regular-weight)' as unknown as number,
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  {weekRangeLabel(week)}
                </span>

                {/* Meal count badge */}
                {totalSlots > 0 && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 'var(--space-24)',
                      height: 'var(--space-18)',
                      borderRadius: 'var(--border-radius-pill)',
                      padding: '0 var(--space-xs)',
                      background: isCurrentWeek
                        ? 'var(--color-background-brand)'
                        : 'var(--color-background-secondary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--typography-desktop-text-xs-semi-bold-size)',
                      fontWeight: 700,
                      color: isCurrentWeek
                        ? 'var(--color-text-primary-inverse)'
                        : 'var(--color-text-tertiary)',
                    }}
                  >
                    {totalSlots}
                  </span>
                )}
              </button>

              {/* Copy week — icon button */}
              {totalSlots > 0 && (
                <button
                  ref={(el) => {
                    if (el) copyBtnRefs.current.set(wi, el)
                    else copyBtnRefs.current.delete(wi)
                  }}
                  onMouseDown={(e) => {
                    // Stop the native event from reaching the popover's
                    // document-level mousedown outside-click listener so
                    // the toggle click can close the popover cleanly.
                    e.nativeEvent.stopImmediatePropagation()
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteConfirmWeek(-1)
                    setCopyPopoverWeek(copyPopoverWeek === wi ? -1 : wi)
                  }}
                  title="Duplicate this week to another week"
                  style={{
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 'var(--space-26)',
                    height: 'var(--space-26)',
                    borderRadius: 'var(--border-radius-s)',
                    border: 'none',
                    background: copyPopoverWeek === wi
                      ? 'var(--color-background-brand-subtle)'
                      : 'transparent',
                    color: copyPopoverWeek === wi
                      ? 'var(--color-text-brand)'
                      : 'var(--color-text-tertiary)',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
                  }}
                  onMouseEnter={(e) => {
                    if (copyPopoverWeek !== wi) {
                      e.currentTarget.style.background = 'var(--color-background-secondary)'
                      e.currentTarget.style.color = 'var(--color-text-brand)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (copyPopoverWeek !== wi) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--color-text-tertiary)'
                    }
                  }}
                >
                  <Layers size={13} />
                </button>
              )}

              {/* Delete week — icon button */}
              {totalSlots > 0 && (
                <button
                  ref={(el) => {
                    if (el) deleteBtnRefs.current.set(wi, el)
                    else deleteBtnRefs.current.delete(wi)
                  }}
                  onMouseDown={(e) => {
                    e.nativeEvent.stopImmediatePropagation()
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCopyPopoverWeek(-1)
                    setDeleteConfirmWeek(deleteConfirmWeek === wi ? -1 : wi)
                  }}
                  title="Clear all meals this week"
                  style={{
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 'var(--space-26)',
                    height: 'var(--space-26)',
                    borderRadius: 'var(--border-radius-s)',
                    border: 'none',
                    background: deleteConfirmWeek === wi
                      ? 'var(--color-background-negative-subtle)'
                      : 'transparent',
                    color: deleteConfirmWeek === wi
                      ? 'var(--color-text-negative)'
                      : 'var(--color-text-tertiary)',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
                  }}
                  onMouseEnter={(e) => {
                    if (deleteConfirmWeek !== wi) {
                      e.currentTarget.style.background = 'var(--color-background-negative-subtle)'
                      e.currentTarget.style.color = 'var(--color-text-negative)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (deleteConfirmWeek !== wi) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--color-text-tertiary)'
                    }
                  }}
                >
                  <RotateCcw size={13} />
                </button>
              )}

              {/* Copy week popover */}
              {copyPopoverWeek === wi && (
                <CopyWeekPopover
                  allWeeks={weeks}
                  sourceWeekIndex={wi}
                  onCopy={(targetIdx) => {
                    handleCopyWeek(wi, targetIdx)
                    setCopyPopoverWeek(-1)
                  }}
                  onClose={() => setCopyPopoverWeek(-1)}
                  anchorRef={{ current: copyBtnRefs.current.get(wi) ?? null }}
                />
              )}

              {/* Delete week confirmation popover */}
              {deleteConfirmWeek === wi && (
                <DeleteWeekPopover
                  weekIndex={wi}
                  totalSlots={totalSlots}
                  anchorEl={deleteBtnRefs.current.get(wi) ?? null}
                  onConfirm={() => {
                    onClearWeek(week.map((d) => d.date))
                    setDeleteConfirmWeek(-1)
                  }}
                  onCancel={() => setDeleteConfirmWeek(-1)}
                />
              )}
            </div>

            {/* Collapsible content */}
            {isExpanded && (
              <div style={{ padding: isMobile ? 'var(--space-s) var(--space-s) var(--space-10)' : 'var(--space-s) var(--space-10) var(--space-14)' }}>
                {/* Weekday headers — desktop only */}
                {!isMobile && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, 1fr)',
                      columnGap: 'var(--space-xs)',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    {WEEKDAY_LABELS.map((label) => (
                      <div
                        key={label}
                        style={{
                          padding: 'var(--space-xs) 0 var(--space-xs)',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--typography-desktop-text-xs-semi-bold-size)',
                          fontWeight: 'var(--typography-desktop-text-xs-semi-bold-weight)' as unknown as number,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: 'var(--color-text-tertiary)',
                          textAlign: 'center',
                        }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                )}

                {/* Day cells */}
                <div
                  style={isMobile
                    ? { display: 'flex', flexDirection: 'column', gap: 'var(--space-s)' }
                    : { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', columnGap: 'var(--space-xs)', rowGap: 0 }
                  }
                >
                  {week.map((day) => {
                    const date = new Date(day.date + 'T12:00:00')
                    const col = date.getDay() + 1
                    const isOverflow =
                      date.getFullYear() !== viewYear || date.getMonth() !== viewMonth
                    return (
                      <div key={day.date} style={isMobile ? {} : { gridColumn: col, minWidth: 0, overflow: 'hidden' }}>
                        <DayColumn
                          day={day}
                          recipes={recipes}
                          isOverflow={isOverflow}
                          isMobile={isMobile}
                          onAssignRecipes={onAssignRecipes}
                          onAssignCustom={onAssignCustom}
                          onRemoveSlot={onRemoveSlot}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
