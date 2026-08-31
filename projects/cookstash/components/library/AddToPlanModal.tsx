'use client'

import React, { useState, useMemo } from 'react'
import type { MealPlan, CalendarPlan, FreeformPlan, MealType } from '@/types'
import { usePlannerStore } from '@/store/usePlannerStore'
import { Button, Input, Select, Radio } from '@jasmine/design-system'
import { FiCalendar, FiList, FiPlus, FiCheck, FiSunrise, FiSun, FiMoon, FiCoffee, FiX } from 'react-icons/fi'

/* ── Constants ── */
const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']
const MEAL_ICON: Record<MealType, React.ElementType> = {
  breakfast: FiSunrise,
  lunch: FiSun,
  dinner: FiMoon,
  snack: FiCoffee,
}

type PlanTab = 'calendar' | 'custom'
type FlowState = 'pick' | 'success'

/* ── Shared styles ── */
const sectionLabelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
  fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)' as unknown as number,
  lineHeight: 'var(--typography-desktop-text-m-semi-bold-line-height)',
  color: 'var(--color-text-primary)',
  marginBottom: 0,
}

/* ── Component ── */

interface AddToPlanModalProps {
  recipeId: string
  onClose: () => void
}

export function AddToPlanModal({ recipeId, onClose }: AddToPlanModalProps) {
  const plans = usePlannerStore((s) => s.plans)
  const createPlan = usePlannerStore((s) => s.createPlan)
  const assignRecipeToSlot = usePlannerStore((s) => s.assignRecipeToSlot)
  const addDaysToCalendar = usePlannerStore((s) => s.addDaysToCalendar)
  const addDishToFreeform = usePlannerStore((s) => s.addDishToFreeform)

  const calendarPlans = useMemo(() => plans.filter((p): p is CalendarPlan => p.mode === 'calendar'), [plans])
  const freeformPlans = useMemo(() => plans.filter((p): p is FreeformPlan => p.mode === 'freeform'), [plans])

  // ── State ──
  const [tab, setTab] = useState<PlanTab>('calendar')
  const [flow, setFlow] = useState<FlowState>('pick')
  const [selectedMeal, setSelectedMeal] = useState<MealType>('lunch')

  // Calendar state — just date, no plan picker
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  // Custom (freeform) state
  const [ffPlanId, setFfPlanId] = useState<string>(freeformPlans[0]?.id ?? '__new__')
  const [newFfName, setNewFfName] = useState('')

  // ── Handlers ──

  /** Find (or create) a calendar plan that covers the selected date. */
  function getOrCreateCalendarPlan(): string {
    // Use the first existing calendar plan, or create one automatically
    if (calendarPlans.length > 0) return calendarPlans[0].id

    const newPlan: CalendarPlan = {
      id: crypto.randomUUID(),
      name: 'My Meal Plan',
      mode: 'calendar',
      days: [],
      createdAt: new Date().toISOString(),
      shareToken: null,
    }
    createPlan(newPlan)
    return newPlan.id
  }

  function handleAdd() {
    if (tab === 'calendar') {
      const planId = getOrCreateCalendarPlan()
      // Ensure the date row exists
      addDaysToCalendar(planId, [{ date: selectedDate, slots: [] }])
      // Assign recipe
      assignRecipeToSlot(planId, selectedDate, selectedMeal, recipeId)
    } else {
      let planId = ffPlanId

      // Create new freeform plan if needed
      if (planId === '__new__') {
        const name = newFfName.trim() || `Custom Plan ${freeformPlans.length + 1}`
        const newPlan: FreeformPlan = {
          id: crypto.randomUUID(),
          name,
          mode: 'freeform',
          dishes: [],
          description: null,
          createdAt: new Date().toISOString(),
          shareToken: null,
        }
        createPlan(newPlan)
        planId = newPlan.id
      }

      addDishToFreeform(planId, selectedMeal, recipeId)
    }

    setFlow('success')
    setTimeout(onClose, 1200)
  }

  // ── Derived ──
  const canSubmit =
    tab === 'calendar'
      ? !!selectedDate
      : (ffPlanId !== '__new__' || newFfName.trim())

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-60 flex items-center justify-center"
      style={{ background: 'var(--color-overlay-30-inverse)', padding: 'var(--space-l)' }}
      onClick={onClose}
    >
      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          maxHeight: 'calc(100vh - var(--space-3xl) * 2)',
          overflowY: 'auto',
          borderRadius: 'var(--border-radius-xl)',
          background: 'var(--color-background-primary)',
          boxShadow: 'var(--shadow-modal)',
          padding: 'var(--space-xl)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
      >
        {/* ── Success state ── */}
        {flow === 'success' ? (
          <div className="flex flex-col items-center" style={{ gap: 'var(--space-xl)', padding: 'var(--space-2xl) 0' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--color-background-positive-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-positive)',
              }}
            >
              <FiCheck size={28} />
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
                fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)',
                color: 'var(--color-text-primary)',
                textAlign: 'center',
              }}
            >
              Recipe added to your plan!
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--space-s)',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--typography-desktop-heading-s-semi-bold-size)',
                    fontWeight: 'var(--typography-desktop-heading-s-semi-bold-weight)',
                    lineHeight: 'var(--typography-desktop-heading-s-semi-bold-line-height)',
                    letterSpacing: 'var(--typography-desktop-heading-s-semi-bold-letter-spacing)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  Add to meal plan
                </h2>
                <button
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--border-radius-pill)',
                    border: 'none',
                    background: 'var(--color-background-secondary)',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  <FiX size={14} />
                </button>
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--typography-desktop-text-s-regular-size)',
                  lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                }}
              >
                Choose how you'd like to plan this recipe — schedule it on a specific day or add it to a custom collection.
              </p>
            </div>

            <div className="flex flex-col" style={{ gap: 'var(--space-xl)' }}>

              {/* ── Plan type section ── */}
              <div className="flex flex-col" style={{ gap: 'var(--space-m)' }}>
              <label style={sectionLabelStyle}>Where should this go?</label>

              {/* ── Calendar option card ── */}
              {(() => {
                const selected = tab === 'calendar'
                return (
                  <button
                    onClick={() => setTab('calendar')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-l)',
                      padding: 'var(--space-l)',
                      borderRadius: 'var(--border-radius-m)',
                      border: 'none',
                      background: selected ? 'var(--color-background-brand-subtle)' : 'var(--color-background-secondary)',
                      cursor: 'pointer',
                      transition: 'background 200ms',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    {/* Card header row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-m)' }}>
                      {/* Radio indicator */}
                      <span style={{ pointerEvents: 'none', flexShrink: 0 }}>
                        <Radio
                          name="plan-tab"
                          value="calendar"
                          checked={selected}
                          onChange={() => setTab('calendar')}
                        />
                      </span>

                      <FiCalendar
                        size={18}
                        style={{
                          color: selected ? 'var(--color-text-brand)' : 'var(--color-text-tertiary)',
                          flexShrink: 0,
                          transition: 'color 200ms',
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
                            fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)',
                            lineHeight: 'var(--typography-desktop-text-m-semi-bold-line-height)',
                            color: selected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            transition: 'color 200ms',
                          }}
                        >
                          Schedule on calendar
                        </span>
                      </div>
                    </div>

                    {/* Expanded inputs */}
                    {selected && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--space-m)',
                          paddingLeft: 'calc(24px + var(--space-m))',
                        }}
                      >
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                            lineHeight: 'var(--typography-desktop-text-xs-regular-line-height)',
                            color: 'var(--color-text-secondary)',
                            margin: 0,
                          }}
                        >
                          Pick a date to add this recipe to your weekly plan.
                        </p>
                        <Input
                          label="Date"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                    )}
                  </button>
                )
              })()}

              {/* ── Custom option card ── */}
              {(() => {
                const selected = tab === 'custom'
                return (
                  <button
                    onClick={() => setTab('custom')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-l)',
                      padding: 'var(--space-l)',
                      borderRadius: 'var(--border-radius-m)',
                      border: 'none',
                      background: selected ? 'var(--color-background-brand-subtle)' : 'var(--color-background-secondary)',
                      cursor: 'pointer',
                      transition: 'background 200ms',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    {/* Card header row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-m)' }}>
                      {/* Radio indicator */}
                      <span style={{ pointerEvents: 'none', flexShrink: 0 }}>
                        <Radio
                          name="plan-tab"
                          value="custom"
                          checked={selected}
                          onChange={() => setTab('custom')}
                        />
                      </span>

                      <FiList
                        size={18}
                        style={{
                          color: selected ? 'var(--color-text-brand)' : 'var(--color-text-tertiary)',
                          flexShrink: 0,
                          transition: 'color 200ms',
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
                            fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)',
                            lineHeight: 'var(--typography-desktop-text-m-semi-bold-line-height)',
                            color: selected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            transition: 'color 200ms',
                          }}
                        >
                          Add to custom plan
                        </span>
                      </div>
                    </div>

                    {/* Expanded inputs */}
                    {selected && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--space-m)',
                          paddingLeft: 'calc(24px + var(--space-m))',
                        }}
                      >
                        <p
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                            lineHeight: 'var(--typography-desktop-text-xs-regular-line-height)',
                            color: 'var(--color-text-secondary)',
                            margin: 0,
                          }}
                        >
                          Group recipes for a party, holiday, or any themed collection.
                        </p>
                        <Select
                          label="Plan"
                          value={ffPlanId}
                          onChange={(e) => setFfPlanId(e.target.value)}
                        >
                          {freeformPlans.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                          <option value="__new__">＋ Create new plan</option>
                        </Select>

                        {ffPlanId === '__new__' && (
                          <Input
                            label="Plan name"
                            type="text"
                            autoFocus
                            placeholder="e.g. Thanksgiving Menu"
                            value={newFfName}
                            onChange={(e) => setNewFfName(e.target.value)}
                          />
                        )}
                      </div>
                    )}
                  </button>
                )
              })()}
              </div>

              {/* ── Meal type (shared) ── */}
              <div>
                <label style={{ ...sectionLabelStyle, marginBottom: 'var(--space-s)' }}>What meal is this for?</label>
                <div className="flex" style={{ gap: 'var(--space-s)' }}>
                  {MEAL_TYPES.map((mt) => {
                    const MealIcon = MEAL_ICON[mt]
                    const active = selectedMeal === mt
                    return (
                      <button
                        key={mt}
                        onClick={() => setSelectedMeal(mt)}
                        className="flex-1"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 'var(--space-xs)',
                          padding: 'var(--space-m) var(--space-xs)',
                          borderRadius: 'var(--border-radius-m)',
                          border: 'none',
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background 200ms, color 200ms',
                          background: active
                            ? 'var(--color-background-brand-subtle)'
                            : 'var(--color-background-secondary)',
                          color: active
                            ? 'var(--color-text-brand)'
                            : 'var(--color-text-tertiary)',
                          textTransform: 'capitalize',
                        }}
                      >
                        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MealIcon
                            size={18}
                            style={{
                              color: active ? 'var(--color-text-brand)' : 'var(--color-text-tertiary)',
                              transition: 'color 200ms',
                            }}
                          />
                          {active && (
                            <FiCheck
                              size={10}
                              style={{
                                color: 'var(--color-text-brand)',
                                strokeWidth: 3,
                                marginLeft: 2,
                              }}
                            />
                          )}
                        </div>
                        {mt}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ── Submit ── */}
              <div style={{ paddingTop: 'var(--space-s)' }}>
                <Button
                  onClick={handleAdd}
                  type="Primary"
                  size="M"
                  disabled={!canSubmit}
                  className="w-full"
                >
                  <span className="inline-flex items-center" style={{ gap: 'var(--space-xs)' }}>
                    <FiPlus size={16} />
                    Add to plan
                  </span>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
