'use client'
// Retell's atoms and molecules. Each is a [DS-NEW] candidate: generic, no
// agent knowledge, tokens only. Organisms live in components/agent.
import { useCallback, useEffect, useId, useRef, useState, type ReactNode, type KeyboardEvent, type PointerEvent } from 'react'
import { ChevronRight } from 'lucide-react'
import { Icon } from './Icon'
import s from './ui.module.css'

export { Icon }

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

/* ── Badge ─────────────────────────────────────────────── */
export function Badge({ children, tone = 'brand' }: { children: ReactNode; tone?: 'brand' | 'neutral' }) {
  return <span className={cx(s.badge, tone === 'neutral' && s.badgeNeutral)}>{children}</span>
}

/* ── Dialog ────────────────────────────────────────────────
   Native <dialog> + showModal(): the browser traps focus, makes the page
   inert, closes on Esc and returns focus to the trigger. Desktop: centred.
   Mobile: bottom sheet. [DS-NEW] candidate — the DS Modal isn't exported. */
export function Dialog({
  open,
  onClose,
  labelledBy,
  describedBy,
  children,
}: {
  open: boolean
  onClose: () => void
  labelledBy: string
  describedBy?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      className={s.dialog}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      // A click that lands on the <dialog> itself (not its content) is on the backdrop.
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      {open && <div className={s.dialogBody}>{children}</div>}
    </dialog>
  )
}

/* ── StatusChip ────────────────────────────────────────── */
export function StatusChip({ label, tone }: { label: string; tone: 'brand' | 'positive' }) {
  return (
    <span role="status" className={cx(s.chip, tone === 'brand' ? s.chipBrand : s.chipPositive)}>
      {label}
    </span>
  )
}

/* ── Note ──────────────────────────────────────────────── */
const noteTone = { warning: s.noteWarning, info: s.noteInfo, positive: s.notePositive }
export function Note({ tone, icon, children, className }: { tone: keyof typeof noteTone; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cx(s.note, noteTone[tone], className)}>
      {icon}
      <div>{children}</div>
    </div>
  )
}

/* ── Popover ───────────────────────────────────────────── */
type TriggerVariant = 'outline' | 'quiet' | 'icon' | 'chip' | 'primary'
const triggerClass: Record<TriggerVariant, string> = {
  outline: s.triggerOutline,
  quiet: s.triggerQuiet,
  icon: s.triggerIcon,
  chip: s.triggerChip,
  primary: s.triggerPrimary,
}

export function Popover({
  trigger,
  variant = 'outline',
  ariaLabel,
  className,
  children,
}: {
  trigger: ReactNode
  variant?: TriggerVariant
  ariaLabel?: string
  className?: string
  children: ReactNode | ((close: () => void) => ReactNode)
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const anchor = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => !anchor.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={anchor} className={cx(s.popAnchor, className)}>
      <button
        ref={button}
        type="button"
        className={cx(s.trigger, triggerClass[variant])}
        aria-expanded={open}
        aria-controls={id}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
      >
        {trigger}
      </button>
      {open && (
        <div id={id} className={s.popover}>
          {typeof children === 'function' ? children(close) : children}
        </div>
      )}
    </div>
  )
}

/* ── TriggerButton ─────────────────────────────────────────
   Same look as the Popover triggers, for buttons that open a dialog instead. */
export function TriggerButton({
  variant = 'outline',
  onClick,
  children,
  className,
}: {
  variant?: TriggerVariant
  onClick: () => void
  children: ReactNode
  className?: string
}) {
  return (
    <button type="button" className={cx(s.trigger, triggerClass[variant], className)} onClick={onClick}>
      {children}
    </button>
  )
}

/* ── SegmentedTabs ─────────────────────────────────────── */
export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
  idPrefix,
  label,
}: {
  tabs: { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
  idPrefix: string
  label: string
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    const next = (i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length
    refs.current[next]?.focus()
    onChange(tabs[next].id)
  }
  return (
    <div role="tablist" aria-label={label} className={s.tabs}>
      {tabs.map((t, i) => (
        <button
          key={t.id}
          ref={(el) => {
            refs.current[i] = el
          }}
          role="tab"
          type="button"
          id={`${idPrefix}-tab-${t.id}`}
          aria-selected={value === t.id}
          aria-controls={`${idPrefix}-panel-${t.id}`}
          tabIndex={value === t.id ? 0 : -1}
          className={s.tab}
          onClick={() => onChange(t.id)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* ── DisclosureRow ─────────────────────────────────────── */
export function DisclosureRow({
  label,
  summary,
  expanded,
  onToggle,
  controls,
  className,
}: {
  label?: string
  summary: ReactNode
  expanded: boolean
  onToggle: () => void
  controls: string
  className?: string
}) {
  return (
    <button type="button" className={cx(s.row, className)} aria-expanded={expanded} aria-controls={controls} onClick={onToggle}>
      {label && <span className={s.rowLabel}>{label}</span>}
      <span className={s.rowSummary}>{summary}</span>
      <Icon icon={ChevronRight} className={s.rowChevron} />
    </button>
  )
}

/* ── Toast ─────────────────────────────────────────────── */
export interface ToastData {
  id: number
  message: string
  actionLabel?: string
  onAction?: () => void
}
export function Toast({ toast, onDismiss }: { toast: ToastData | null; onDismiss: () => void }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onDismiss, toast.actionLabel ? 6000 : 3500)
    return () => clearTimeout(t)
  }, [toast, onDismiss])
  if (!toast) return null
  return (
    <div className={s.toast} role="status" aria-live="polite">
      <span>{toast.message}</span>
      {toast.actionLabel && (
        <button
          type="button"
          className={s.toastAction}
          onClick={() => {
            onDismiss()
            toast.onAction?.()
          }}
        >
          {toast.actionLabel}
        </button>
      )}
    </div>
  )
}

/* ── ResizeHandle (vertical separator) ─────────────────── */
export function ResizeHandle({
  value,
  min,
  max,
  onChange,
  onReset,
  label,
  controls,
  className,
}: {
  value: number
  min: number
  max: number
  onChange: (next: number) => void
  onReset: () => void
  label: string
  controls: string
  className?: string
}) {
  const [dragging, setDragging] = useState(false)
  const start = useRef({ x: 0, value: 0 })
  const clamp = (n: number) => Math.round(Math.min(max, Math.max(min, n)))

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = { x: e.clientX, value }
    setDragging(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    // Handle sits on the panel's left edge: dragging left widens the panel.
    if (dragging) onChange(clamp(start.current.value + (start.current.x - e.clientX)))
  }
  const endDrag = () => {
    setDragging(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 64 : 16
    const map: Record<string, number> = { ArrowLeft: value + step, ArrowRight: value - step, Home: min, End: max }
    if (e.key in map) {
      e.preventDefault()
      onChange(clamp(map[e.key]))
    } else if (e.key === 'Enter') onReset()
  }

  return (
    <div
      role="separator"
      tabIndex={0}
      aria-orientation="vertical"
      aria-label={label}
      aria-controls={controls}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      title="Drag to resize · double-click to reset"
      data-dragging={dragging}
      className={cx(s.resize, className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={onReset}
      onKeyDown={onKeyDown}
    />
  )
}
