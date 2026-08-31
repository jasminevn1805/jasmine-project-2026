'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { X } from 'react-feather'

interface SlideDrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  /** When true the mobile bottom-sheet expands taller (e.g. Level 2 detail view) */
  expanded?: boolean
}

/**
 * Responsive drawer:
 *   Desktop (≥640px) — right-anchored slide-in panel (1/3 viewport, min 380px).
 *   Mobile  (<640px) — bottom sheet that slides up, keeping the page header
 *                       visible so the user never loses context.
 *
 *   `expanded` prop controls the mobile sheet height:
 *     false (default) → 60 vh  (category list)
 *     true            → 90 vh  (items list — needs more room)
 *
 * Motion: 250ms ease-in-out for all transitions.
 */
const DURATION = 250

export function SlideDrawer({ open, onClose, title, children, footer, expanded = false }: SlideDrawerProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Detect mobile vs desktop via matchMedia
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)')
    setIsMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  // Mount / transition flow
  useEffect(() => {
    if (open) {
      setMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
    } else {
      setVisible(false)
      const timer = setTimeout(() => setMounted(false), DURATION)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose],
  )
  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, handleKeyDown])

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [open])

  if (!mounted) return null

  /* ── Transform helpers ── */
  const INSET = '24px'
  // Mobile bottom nav is ~72px + safe-area; keep the sheet above it
  const MOBILE_NAV_HEIGHT = '80px'
  const INSET_MOBILE = '12px'
  const mobileBottom = `calc(${MOBILE_NAV_HEIGHT} + ${INSET_MOBILE})`
  const sheetHeight = expanded
    ? `calc(100vh - ${MOBILE_NAV_HEIGHT} - ${INSET_MOBILE} * 2)`
    : `calc(60vh - ${INSET_MOBILE})`
  const panelTransform = isMobile
    ? (visible ? 'translateY(0)' : `translateY(calc(100% + ${mobileBottom}))`)
    : (visible ? 'translateX(0)' : `translateX(calc(100% + ${INSET}))`)

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'var(--color-overlay-30-inverse)',
          opacity: visible ? 1 : 0,
          transition: `opacity ${DURATION}ms ease-in-out`,
        }}
      />

      {/* ── Panel ── */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-background-primary)',
          boxShadow: 'var(--shadow-modal)',
          overflow: 'hidden',
          transform: panelTransform,
          transition: `transform ${DURATION}ms ease-in-out, height ${DURATION}ms ease-in-out`,
          ...(isMobile
            ? {
                /* Floating bottom sheet — above the mobile nav bar */
                bottom: mobileBottom,
                left: INSET_MOBILE,
                right: INSET_MOBILE,
                height: sheetHeight,
                maxHeight: `calc(100vh - ${MOBILE_NAV_HEIGHT} - ${INSET_MOBILE} * 2)`,
                borderRadius: 'var(--border-radius-l)',
              }
            : {
                /* Floating side drawer — inset from edges */
                top: INSET,
                right: INSET,
                bottom: INSET,
                width: '33.333%',
                minWidth: '380px',
                borderRadius: 'var(--border-radius-l)',
              }),
        }}
      >
        {/* Drag handle (mobile only) */}
        {isMobile && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: 'var(--space-s) 0 0 0',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '36px',
                height: '4px',
                borderRadius: 'var(--border-radius-pill)',
                background: 'var(--color-border-default)',
              }}
            />
          </div>
        )}

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? 'var(--space-s) var(--space-l) var(--space-m)' : 'var(--space-m) var(--space-l)',
            borderBottom: 'var(--border-width-s) solid var(--color-border-subtle)',
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
              fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)',
              lineHeight: 'var(--typography-desktop-text-m-semi-bold-line-height)',
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--border-radius-m)',
              border: 'none',
              background: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: `background ${DURATION}ms ease-in-out, color ${DURATION}ms ease-in-out`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-background-hover)'
              e.currentTarget.style.color = 'var(--color-text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none'
              e.currentTarget.style.color = 'var(--color-text-secondary)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: 'var(--space-l)',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 'var(--space-m)',
              borderTop: 'var(--border-width-s) solid var(--color-border-subtle)',
              padding: 'var(--space-m) var(--space-l)',
              flexShrink: 0,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
