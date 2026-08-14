'use client'

import { usePlannerStore } from '@/store/usePlannerStore'
import { useRecipeStore } from '@/store/useRecipeStore'
import { CalendarPlanner } from '@/components/planner/CalendarPlanner'
import { FreeformPlanner } from '@/components/planner/FreeformPlanner'
import { PlanTabBar } from '@/components/planner/PlanTabBar'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageShell, PageHeader } from '@/components/shared/layout'
import { ScrollTabBar } from '@jasmine/design-system'
import { useState, useEffect, useRef } from 'react'
import { Calendar, Gift } from 'react-feather'
import type { CalendarPlan, FreeformPlan, PlanMode, Recipe } from '@/types'
import { useIsMobile } from '@/lib/useMediaQuery'

/** Build every day of a given month as PlanDay[] */
function buildMonthDays(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1)
    return { date: d.toISOString().split('T')[0], slots: [] }
  })
}

const MODE_OPTIONS: { value: PlanMode; label: string; icon: React.ReactNode }[] = [
  { value: 'calendar', label: 'Weekly Meal Plan', icon: <Calendar size={14} /> },
  { value: 'freeform', label: 'Occasion Plan', icon: <Gift size={14} /> },
]

export default function PlannerPage() {
  const { plans, createPlan, updateFreeformPlan, deletePlan, duplicatePlan } =
    usePlannerStore()
  const seedPlans = usePlannerStore((s) => s.seedPlans)
  const recipes: Recipe[] = useRecipeStore((s: { recipes: Recipe[] }) => s.recipes)

  const [activeMode, setActiveMode] = useState<PlanMode>('calendar')
  const [ready, setReady] = useState(false)
  const isMobile = useIsMobile()

  // ── Calendar state ──────────────────────────────────────────
  const calendarPlanIdRef = useRef<string | null>(null)
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
  const [selectedYear] = useState(now.getFullYear())

  // ── Occasion state ──────────────────────────────────────────
  const [activeOccasionId, setActiveOccasionId] = useState<string | null>(null)
  const [namingPlanId, setNamingPlanId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  // ── Initialization ──────────────────────────────────────────
  useEffect(() => {
    // Seed the demo week first (idempotent) so the calendar lands on real data
    // before we look for / create a plan. This avoids a race where this page's
    // effect runs before the parent layout's seed effect.
    seedPlans()

    const currentPlans = usePlannerStore.getState().plans

    let calPlan = currentPlans.find((p) => p.mode === 'calendar')
    if (!calPlan) {
      const today = new Date()
      const id = crypto.randomUUID()
      const newPlan: CalendarPlan = {
        id,
        name: 'Weekly Meal Plan',
        mode: 'calendar',
        days: buildMonthDays(today.getFullYear(), today.getMonth()),
        createdAt: new Date().toISOString(),
        shareToken: null,
      }
      createPlan(newPlan)
      calendarPlanIdRef.current = id
    } else {
      calendarPlanIdRef.current = calPlan.id
    }

    const occasionPlans = currentPlans.filter((p) => p.mode === 'freeform')
    if (occasionPlans.length > 0) {
      setActiveOccasionId(occasionPlans[0].id)
    }

    setReady(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Derived data ────────────────────────────────────────────
  const calendarPlan = plans.find(
    (p) => p.id === calendarPlanIdRef.current && p.mode === 'calendar',
  ) as CalendarPlan | undefined

  const occasionPlans = plans.filter((p): p is FreeformPlan => p.mode === 'freeform')
  const activeOccasion = occasionPlans.find((p) => p.id === activeOccasionId) ?? null

  // ── Occasion callbacks ──────────────────────────────────────
  function handleCreateOccasion() {
    const id = crypto.randomUUID()
    const newPlan: FreeformPlan = {
      id,
      name: 'Plan Name',
      mode: 'freeform',
      dishes: [],
      description: null,
      createdAt: new Date().toISOString(),
      shareToken: null,
    }
    createPlan(newPlan)
    setActiveOccasionId(id)
    setNamingPlanId(id)
    setDraftName('')
    setIsCreatingNew(true)
  }

  function handleDeleteOccasion(planId: string) {
    if (namingPlanId === planId) {
      setNamingPlanId(null)
      setDraftName('')
      setIsCreatingNew(false)
    }
    deletePlan(planId)
    if (activeOccasionId === planId) {
      const remaining = occasionPlans.filter((p) => p.id !== planId)
      setActiveOccasionId(remaining[0]?.id ?? null)
    }
  }

  function handleRenameOccasion(id: string, newName: string) {
    updateFreeformPlan(id, { name: newName })
  }

  function handleStartRename(id: string, currentName: string) {
    setNamingPlanId(id)
    setDraftName(currentName)
  }

  function handleCommitRename() {
    if (!namingPlanId) return
    const trimmed = draftName.trim()
    const existing = occasionPlans.find((p) => p.id === namingPlanId)?.name ?? 'Plan Name'
    handleRenameOccasion(namingPlanId, trimmed || existing)
    setNamingPlanId(null)
    setDraftName('')
    setIsCreatingNew(false)
  }

  function handleDuplicateOccasion(planId: string) {
    const copy = duplicatePlan(planId)
    if (copy) {
      setActiveOccasionId(copy.id)
      setNamingPlanId(copy.id)
      setDraftName(copy.name)
      setIsCreatingNew(false)
    }
  }

  if (!ready) return null

  // ── Month tabs for calendar mode ────────────────────────────
  const MONTH_NAMES = Array.from({ length: 12 }, (_, i) =>
    new Date(selectedYear, i, 1).toLocaleDateString('en-US', { month: 'short' }),
  )
  const monthTabs = MONTH_NAMES.map((label, i) => ({ id: String(i), label }))
  const currentMonthId = String(now.getMonth())

  const subtitle =
    activeMode === 'calendar'
      ? `${MONTH_NAMES[selectedMonth]} ${selectedYear}`
      : 'Occasion planning'

  return (
    <PageShell>
      <PageHeader
        title="Meal Planner"
        subtitle={subtitle}
        actions={
          /* Mode toggle — segmented control */
          <div
            style={{
              display: 'inline-flex',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-background-secondary)',
              padding: '3px',
              gap: '2px',
            }}
          >
            {MODE_OPTIONS.map((opt) => {
              const isActive = activeMode === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setActiveMode(opt.value)}
                  className="text-body-sm"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    borderRadius: 'calc(var(--radius-md) - 2px)',
                    padding: isMobile ? '8px 12px' : '8px 16px',
                    border: 'none',
                    fontWeight: isActive ? 600 : 500,
                    background: isActive
                      ? 'var(--color-background-primary)'
                      : 'transparent',
                    color: isActive
                      ? 'var(--color-text-brand)'
                      : 'var(--color-text-tertiary)',
                    boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                    cursor: 'pointer',
                    transition:
                      'all var(--motion-duration-base) var(--motion-easing-out)',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              )
            })}
          </div>
        }
      >
        {/* Tab bar (contextual) */}
        {activeMode === 'calendar' ? (
          <ScrollTabBar
            items={monthTabs}
            activeId={String(selectedMonth)}
            onSelect={(id) => setSelectedMonth(Number(id))}
            highlightId={currentMonthId}
            variant="inverse"
            size={isMobile ? 'sm' : 'md'}
            gap={isMobile ? '6px' : '4px'}
          />
        ) : (
          <PlanTabBar
            plans={occasionPlans}
            activePlanId={activeOccasionId}
            namingPlanId={namingPlanId}
            draftName={draftName}
            isCreatingNew={isCreatingNew}
            onSelectPlan={setActiveOccasionId}
            onCreatePlan={handleCreateOccasion}
            onDeletePlan={handleDeleteOccasion}
            onDuplicatePlan={handleDuplicateOccasion}
            onStartRename={handleStartRename}
            onDraftNameChange={setDraftName}
            onCommitRename={handleCommitRename}
          />
        )}
      </PageHeader>

      {/* ── Scrollable content area ───────────────────────────── */}
      <div
        style={{
          paddingInline: 'var(--layout-page-x)',
          paddingTop: 'var(--layout-section-y)',
          paddingBottom: 'var(--space-4xl)',
        }}
      >
        {activeMode === 'calendar' ? (
          calendarPlan && (
            <CalendarPlanner
              plan={calendarPlan}
              recipes={recipes}
              viewMonth={selectedMonth}
              viewYear={selectedYear}
            />
          )
        ) : activeOccasion ? (
          <FreeformPlanner plan={activeOccasion} recipes={recipes} />
        ) : (
          <EmptyState
            icon="🎁"
            title="No occasion plans yet"
            description="Plan meals for birthdays, holidays, dinner parties and more."
            actionLabel="+ Create your first plan"
            onAction={handleCreateOccasion}
          />
        )}
      </div>
    </PageShell>
  )
}
