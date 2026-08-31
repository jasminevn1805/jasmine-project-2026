'use client'

import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check } from 'react-feather'
import type { PlanDay } from '@/types'

/** Format a week as "Mar 1 – 7" or cross-month "Mar 29 – Apr 4" */
function weekLabel(week: PlanDay[]): string {
  const first = new Date(week[0].date + 'T12:00:00')
  const last = new Date(week[week.length - 1].date + 'T12:00:00')
  const mo = first.toLocaleDateString('en-US', { month: 'short' })
  if (first.getMonth() === last.getMonth()) {
    return `${mo} ${first.getDate()} – ${last.getDate()}`
  }
  const mo2 = last.toLocaleDateString('en-US', { month: 'short' })
  return `${mo} ${first.getDate()} – ${mo2} ${last.getDate()}`
}

interface CopyWeekPopoverProps {
  /** All weeks in the current month view */
  allWeeks: PlanDay[][]
  /** Index of the source week (the one being copied FROM) */
  sourceWeekIndex: number
  /** Called when user picks a target week */
  onCopy: (targetWeekIndex: number) => void
  /** Called when dismissed */
  onClose: () => void
  /** The trigger element to anchor the popover to */
  anchorRef?: React.RefObject<HTMLElement | null>
}

export function CopyWeekPopover({
  allWeeks,
  sourceWeekIndex,
  onCopy,
  onClose,
  anchorRef,
}: CopyWeekPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [measured, setMeasured] = useState(false)

  // Position the popover relative to the anchor element,
  // flipping above if there isn't enough room below.
  useEffect(() => {
    let raf: number

    function updatePosition() {
      const anchor = anchorRef?.current
      const popoverEl = popoverRef.current
      if (!anchor || !popoverEl) return

      const rect = anchor.getBoundingClientRect()
      const popH = popoverEl.offsetHeight
      const popW = popoverEl.offsetWidth
      const gap = 4

      // Right-align popover to the anchor button's right edge
      let left = rect.right - popW
      if (left < 8) left = 8
      // Don't let it overflow the right side of the viewport either
      if (left + popW > window.innerWidth - 8) left = window.innerWidth - popW - 8

      // Flip logic: show below if space, otherwise above
      const spaceBelow = window.innerHeight - rect.bottom - gap
      let top: number
      if (spaceBelow >= popH) {
        top = rect.bottom + gap
      } else {
        top = rect.top - popH - gap
        if (top < 8) top = 8
      }

      setPos({ top, left })
      setMeasured(true)
    }

    // First render: place off-screen to measure, then reposition
    raf = requestAnimationFrame(() => {
      updatePosition()
    })

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [anchorRef])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // Delay to avoid the trigger click itself closing the popover
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick)
    }, 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  function handleCopy(targetIdx: number) {
    onCopy(targetIdx)
    setCopiedIndex(targetIdx)
    setTimeout(() => onClose(), 600)
  }

  const sourceLabel = `Week ${sourceWeekIndex + 1} (${weekLabel(allWeeks[sourceWeekIndex])})`

  return createPortal(
    <div
      ref={popoverRef}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        top: pos ? pos.top : -9999,
        left: pos ? pos.left : -9999,
        opacity: measured ? 1 : 0,
        pointerEvents: measured ? 'auto' : 'none',
        background: 'var(--color-background-primary)',
        borderRadius: 'var(--border-radius-m)',
        boxShadow: 'var(--shadow-hover)',
        border: 'var(--border-width-s) solid var(--color-border-subtle)',
        padding: 'var(--space-l)',
        zIndex: 9999,
        minWidth: '240px',
      }}
    >
      {/* Header */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
          fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
          lineHeight: 'var(--typography-desktop-text-s-semi-bold-line-height)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-xs)',
        }}
      >
        Copy {sourceLabel} to…
      </p>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--typography-desktop-text-xs-regular-size)',
          color: 'var(--color-text-tertiary)',
          marginBottom: 'var(--space-m)',
        }}
      >
        Existing meals won't be overwritten.
      </p>

      {/* Target week list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
        {allWeeks.map((week, i) => {
          const isSource = i === sourceWeekIndex
          const justCopied = copiedIndex === i
          const totalSlots = week.reduce((sum, d) => sum + d.slots.length, 0)

          return (
            <button
              key={i}
              disabled={isSource}
              onClick={() => handleCopy(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-s)',
                borderRadius: 'var(--border-radius-s)',
                paddingLeft: 'var(--space-m)',
                paddingRight: 'var(--space-m)',
                paddingTop: 'var(--space-s)',
                paddingBottom: 'var(--space-s)',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--typography-desktop-text-s-regular-size)',
                lineHeight: 'var(--typography-desktop-text-s-regular-line-height)',
                textAlign: 'left',
                background: justCopied
                  ? 'var(--color-background-positive)'
                  : isSource
                    ? 'var(--color-background-disabled)'
                    : 'var(--color-background-secondary)',
                color: justCopied
                  ? 'var(--color-text-primary-inverse)'
                  : isSource
                    ? 'var(--color-text-disabled)'
                    : 'var(--color-text-primary)',
                cursor: isSource ? 'not-allowed' : 'pointer',
                transition: 'all 150ms ease',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isSource && !justCopied) {
                  e.currentTarget.style.background = 'var(--color-background-brand)'
                  e.currentTarget.style.color = 'var(--color-text-primary-inverse)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSource && !justCopied) {
                  e.currentTarget.style.background = 'var(--color-background-secondary)'
                  e.currentTarget.style.color = 'var(--color-text-primary)'
                }
              }}
            >
              <span>
                {justCopied ? <><Check size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}</> : ''}
                <strong>Week {i + 1}</strong>{' '}
                <span style={{ opacity: 0.7 }}>{weekLabel(week)}</span>
              </span>
              {!isSource && totalSlots > 0 && !justCopied && (
                <span
                  style={{
                    fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                    opacity: 0.6,
                  }}
                >
                  {totalSlots} meal{totalSlots !== 1 ? 's' : ''}
                </span>
              )}
              {isSource && (
                <span
                  style={{
                    fontSize: 'var(--typography-desktop-text-xs-regular-size)',
                    fontStyle: 'italic',
                  }}
                >
                  source
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>,
    document.body,
  )
}
