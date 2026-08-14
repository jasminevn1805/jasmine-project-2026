'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react'
import { Check, AlertCircle, X } from 'react-feather'

// ── Types ────────────────────────────────────────────────────
type ToastVariant = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  show: (message: string, variant?: ToastVariant) => void
}

// ── Context ──────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

// ── Individual toast pill ────────────────────────────────────
const VARIANT_STYLES: Record<ToastVariant, { bg: string; color: string; icon: React.ReactNode }> = {
  success: {
    bg: 'var(--color-background-inverse)',
    color: 'var(--color-text-primary-inverse)',
    icon: <Check size={14} />,
  },
  error: {
    bg: '#c0392b',
    color: '#fff',
    icon: <AlertCircle size={14} />,
  },
  info: {
    bg: 'var(--color-background-inverse)',
    color: 'var(--color-text-primary-inverse)',
    icon: null,
  },
}

function ToastPill({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const { bg, color, icon } = VARIANT_STYLES[toast.variant]
  const [visible, setVisible] = useState(false)

  // Fade in
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-s)',
        background: bg,
        color,
        borderRadius: 'var(--radius-pill)',
        padding: 'var(--space-s) var(--space-l)',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
        fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
        boxShadow: 'var(--shadow-modal)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        pointerEvents: 'auto',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center', opacity: 0.8 }}>{icon}</span>}
      <span>{toast.message}</span>
      <button
        onClick={onDismiss}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color,
          opacity: 0.5,
          padding: 0,
          marginLeft: 'var(--space-xs)',
        }}
      >
        <X size={12} />
      </button>
    </div>
  )
}

// ── Provider + Toaster ───────────────────────────────────────
let nextId = 1
const DURATION = 2800

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) { clearTimeout(timer); timers.current.delete(id) }
  }, [])

  const show = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = nextId++
    setToasts(prev => [...prev, { id, message, variant }])
    const timer = setTimeout(() => dismiss(id), DURATION)
    timers.current.set(id, timer)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      {/* Toaster — fixed bottom-center, above mobile nav */}
      <div
        style={{
          position: 'fixed',
          bottom: 'var(--space-3xl)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-s)',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        {toasts.map(t => (
          <ToastPill key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
