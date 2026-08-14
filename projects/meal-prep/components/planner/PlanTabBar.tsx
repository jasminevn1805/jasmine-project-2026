'use client'

import { useRef, useEffect } from 'react'
import { Copy, X, Plus } from 'react-feather'
import type { FreeformPlan } from '@/types'

interface PlanTabBarProps {
  plans: FreeformPlan[]
  activePlanId: string | null
  /** When non-null, this tab is in inline-rename mode */
  namingPlanId: string | null
  draftName: string
  /** True while "+ New Plan" created a tab that's still being named */
  isCreatingNew: boolean
  onSelectPlan: (id: string) => void
  onCreatePlan: () => void
  onDeletePlan: (id: string) => void
  onDuplicatePlan: (id: string) => void
  onStartRename: (id: string, currentName: string) => void
  onDraftNameChange: (value: string) => void
  onCommitRename: () => void
}

export function PlanTabBar({
  plans,
  activePlanId,
  namingPlanId,
  draftName,
  isCreatingNew,
  onSelectPlan,
  onCreatePlan,
  onDeletePlan,
  onDuplicatePlan,
  onStartRename,
  onDraftNameChange,
  onCommitRename,
}: PlanTabBarProps) {
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus the name input when a tab enters naming mode
  useEffect(() => {
    if (namingPlanId) {
      requestAnimationFrame(() => nameInputRef.current?.focus())
    }
  }, [namingPlanId])

  function handleDeletePlan(e: React.MouseEvent, planId: string) {
    e.stopPropagation()
    onDeletePlan(planId)
  }

  function handleDuplicatePlan(e: React.MouseEvent, planId: string) {
    e.stopPropagation()
    onDuplicatePlan(planId)
  }

  return (
    <div
      className="hide-scrollbar"
      style={{
        display: 'flex',
        overflowX: 'auto',
        gap: 'var(--space-s)',
        paddingBottom: 'var(--space-xs)',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      } as React.CSSProperties}
    >
      {plans.map((p) => {
        const isActive = activePlanId === p.id
        const isNaming = namingPlanId === p.id

        function startEditing(e: React.MouseEvent) {
          e.stopPropagation()
          onSelectPlan(p.id)
          onStartRename(p.id, p.name)
        }

        return (
          <div
            key={p.id}
            onClick={() => !isNaming && onSelectPlan(p.id)}
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-m)',
              borderRadius: 'var(--border-radius-pill)',
              paddingLeft: 'var(--space-l)',
              paddingRight: !isNaming ? 'var(--space-m)' : 'var(--space-l)',
              paddingTop: 'var(--space-s)',
              paddingBottom: 'var(--space-s)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
              fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
              lineHeight: 'var(--typography-desktop-text-s-semi-bold-line-height)',
              background: isActive
                ? 'var(--color-background-inverse)'
                : 'var(--color-background-secondary)',
              color: isActive
                ? 'var(--color-text-primary-inverse)'
                : 'var(--color-text-secondary)',
              transition: 'background 150ms ease, color 150ms ease',
              cursor: isNaming ? 'default' : 'pointer',
              userSelect: 'none',
            }}
          >
            {isNaming ? (
              <input
                ref={nameInputRef}
                value={draftName}
                placeholder="Plan Name"
                onChange={(e) => onDraftNameChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onCommitRename()
                  if (e.key === 'Escape') onCommitRename()
                }}
                onBlur={onCommitRename}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text-primary-inverse)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
                  fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
                  lineHeight: 'var(--typography-desktop-text-s-semi-bold-line-height)',
                  width: '96px',
                  caretColor: 'var(--color-text-primary-inverse)',
                }}
              />
            ) : (
              <span
                onDoubleClick={startEditing}
                title="Double-click to rename"
              >
                {p.name}
              </span>
            )}
            {!isNaming && (
              <>
                <button
                  onClick={(e) => handleDuplicatePlan(e, p.id)}
                  title="Duplicate plan"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20px',
                    height: '20px',
                    borderRadius: 'var(--border-radius-pill)',
                    border: 'none',
                    background: 'transparent',
                    color: isActive
                      ? 'var(--color-text-primary-inverse)'
                      : 'var(--color-text-tertiary)',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'background 150ms ease, color 150ms ease',
                    opacity: 0.7,
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget as HTMLButtonElement
                    btn.style.background = isActive
                      ? 'var(--color-overlay-30)'
                      : 'var(--color-overlay-30-inverse)'
                    btn.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget as HTMLButtonElement
                    btn.style.background = 'transparent'
                    btn.style.opacity = '0.7'
                  }}
                >
                  <Copy size={11} />
                </button>
                <button
                  onClick={(e) => handleDeletePlan(e, p.id)}
                  title="Delete plan"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20px',
                    height: '20px',
                    borderRadius: 'var(--border-radius-pill)',
                    border: 'none',
                    background: 'transparent',
                    color: isActive
                      ? 'var(--color-text-primary-inverse)'
                      : 'var(--color-text-tertiary)',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'background 150ms ease, color 150ms ease',
                    opacity: 0.7,
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget as HTMLButtonElement
                    btn.style.background = isActive
                      ? 'var(--color-overlay-30)'
                      : 'var(--color-overlay-30-inverse)'
                    btn.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget as HTMLButtonElement
                    btn.style.background = 'transparent'
                    btn.style.opacity = '0.7'
                  }}
                >
                  <X size={11} />
                </button>
              </>
            )}
          </div>
        )
      })}

      {/* + New Plan tab — hidden only while a brand-new tab is being named */}
      {!isCreatingNew && (
        <button
          onClick={onCreatePlan}
          style={{
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-xs)',
            borderRadius: 'var(--border-radius-pill)',
            paddingLeft: 'var(--space-l)',
            paddingRight: 'var(--space-l)',
            paddingTop: 'var(--space-s)',
            paddingBottom: 'var(--space-s)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
            fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
            lineHeight: 'var(--typography-desktop-text-s-semi-bold-line-height)',
            background: 'transparent',
            color: 'var(--color-text-tertiary)',
            border: 'var(--border-width-m) dashed var(--color-border-default)',
            cursor: 'pointer',
            transition: 'border-color 150ms ease, color 150ms ease',
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.borderColor = 'var(--color-border-brand)'
            btn.style.color = 'var(--color-text-brand)'
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement
            btn.style.borderColor = 'var(--color-border-default)'
            btn.style.color = 'var(--color-text-tertiary)'
          }}
        >
          <Plus size={12} />
          <span>New Plan</span>
        </button>
      )}
    </div>
  )
}
