'use client'

import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Share2, Copy, Check } from 'react-feather'
import { Button } from '@jasmine/design-system'
import type { GroceryList } from '@/types'
import { useGroceryStore } from '@/store/useGroceryStore'
import { generateGroceryShareToken, buildShareUrl } from '@/lib/share-token'

interface ShareListButtonProps {
  list: GroceryList
}

export function ShareListButton({ list }: ShareListButtonProps) {
  const setShareToken = useGroceryStore(
    (s: { setShareToken: (listId: string, token: string) => void }) => s.setShareToken
  )

  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [open, setOpen]         = useState(false)
  const [copied, setCopied]     = useState(false)
  const [pos, setPos]           = useState<{ top: number; left: number } | null>(null)
  const [measured, setMeasured] = useState(false)

  // ── Token helpers ────────────────────────────────────────────
  function getShareUrl(): string {
    // Always regenerate: ensures the snapshot reflects the current list state
    // and that old snapshot-less tokens (pre-fix) are replaced.
    const t = generateGroceryShareToken(list)
    setShareToken(list.id, t)
    return buildShareUrl(t)
  }

  // ── Actions ──────────────────────────────────────────────────
  async function handleCopyLink() {
    await navigator.clipboard.writeText(getShareUrl())
    setCopied(true)
    setTimeout(() => { setCopied(false); setOpen(false) }, 1400)
  }

  // ── Positioning (same flip logic as CopyWeekPopover) ─────────
  useEffect(() => {
    if (!open) { setMeasured(false); return }

    let raf: number

    function updatePosition() {
      const anchor  = triggerRef.current
      const popover = popoverRef.current
      if (!anchor || !popover) return

      const rect = anchor.getBoundingClientRect()
      const popH = popover.offsetHeight
      const popW = popover.offsetWidth
      const gap  = 6

      // Right-align to trigger's right edge
      let left = rect.right - popW
      if (left < 8) left = 8
      if (left + popW > window.innerWidth - 8) left = window.innerWidth - popW - 8

      // Flip: show below if room, else above
      const spaceBelow = window.innerHeight - rect.bottom - gap
      const top = spaceBelow >= popH
        ? rect.bottom + gap
        : Math.max(8, rect.top - popH - gap)

      setPos({ top, left })
      setMeasured(true)
    }

    raf = requestAnimationFrame(updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open])

  // ── Outside click (delayed to skip trigger click) ─────────────
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const timer = setTimeout(() => document.addEventListener('mousedown', handleClick), 0)
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handleClick) }
  }, [open])

  // ── Escape ────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      <div ref={triggerRef} style={{ display: 'inline-flex' }}>
        <Button onClick={() => setOpen((v) => !v)} type="Outline" size="S">
          <Share2 size={14} />
          Share list
        </Button>
      </div>

      {open && createPortal(
        <div
          ref={popoverRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top:  pos ? pos.top  : -9999,
            left: pos ? pos.left : -9999,
            opacity: measured ? 1 : 0,
            pointerEvents: measured ? 'auto' : 'none',
            zIndex: 9999,
            minWidth: '260px',
            background:   'var(--color-background-primary)',
            border:       'var(--border-width-s) solid var(--color-border-subtle)',
            borderRadius: 'var(--border-radius-m)',
            boxShadow:    'var(--shadow-hover)',
            padding:      'var(--space-l)',
          }}
        >
          {/* Header */}
          <p style={{
            fontFamily:  'var(--font-body)',
            fontSize:    'var(--typography-desktop-text-s-semi-bold-size)',
            fontWeight:  'var(--typography-desktop-text-s-semi-bold-weight)',
            lineHeight:  'var(--typography-desktop-text-s-semi-bold-line-height)',
            color:       'var(--color-text-primary)',
            marginBottom: 'var(--space-xs)',
          }}>
            Share list
          </p>
          <p style={{
            fontFamily:   'var(--font-body)',
            fontSize:     'var(--typography-desktop-text-xs-regular-size)',
            color:        'var(--color-text-tertiary)',
            marginBottom: 'var(--space-m)',
            whiteSpace:   'nowrap',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            maxWidth:     '220px',
          }}>
            {list.name}
          </p>

          {/* Copy link row */}
          <div
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          'var(--space-s)',
              background:   'var(--color-background-secondary)',
              borderRadius: 'var(--border-radius-s)',
              padding:      'var(--space-s) var(--space-s) var(--space-s) var(--space-m)',
            }}
          >
            {/* Truncated URL */}
            <span
              style={{
                flex:         1,
                minWidth:     0,
                fontFamily:   'var(--font-body)',
                fontSize:     'var(--typography-desktop-text-xs-regular-size)',
                color:        'var(--color-text-tertiary)',
                overflow:     'hidden',
                whiteSpace:   'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {typeof window !== 'undefined'
                ? `${window.location.host}/share/…`
                : 'prep-kit/share/…'}
            </span>

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopyLink}
              style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          'var(--space-xs)',
                flexShrink:   0,
                padding:      'var(--space-xs) var(--space-m)',
                borderRadius: 'var(--border-radius-s)',
                border:       'none',
                cursor:       'pointer',
                fontFamily:   'var(--font-body)',
                fontSize:     'var(--typography-desktop-text-xs-semi-bold-size, var(--typography-desktop-text-xs-regular-size))',
                fontWeight:   600,
                transition:   'background 150ms ease, color 150ms ease',
                background:   copied ? 'var(--color-background-positive)' : 'var(--color-background-brand)',
                color:        'var(--color-text-primary-inverse)',
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <p style={{
            marginTop:   'var(--space-m)',
            fontFamily:  'var(--font-body)',
            fontSize:    'var(--typography-desktop-text-xs-regular-size)',
            color:       'var(--color-text-tertiary)',
            textAlign:   'center',
          }}>
            View-only for recipients
          </p>
        </div>,
        document.body,
      )}
    </>
  )
}

// ─── Brand icons ──────────────────────────────────────────────────────────────
