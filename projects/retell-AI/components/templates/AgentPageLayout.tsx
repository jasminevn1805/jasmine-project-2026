'use client'
// Template: the agent page's three zones (IA level 2) around the workspace rail.
//   State → top bar · Definition → centre spec · Workbench → right panel
// Desktop: split panes, the Workbench resizable from its left edge.
// Mobile (< 1024): spec on the page, Workbench as a bottom sheet.
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { BookOpen, Bot, Clock, Phone } from 'lucide-react'
import { Icon, ResizeHandle } from '@/components/ui'
import s from './layout.module.css'

const BENCH_MIN = 360
const SPEC_MIN = 480 // the spec never gets squeezed below a readable width
const RAIL_W = 80 // keep in sync with --rail-w in layout.module.css
const STORAGE_KEY = 'retell.benchWidth'

export function AgentPageLayout({ topBar, spec, bench }: { topBar: ReactNode; spec: ReactNode; bench: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number | null>(null) // null = CSS default
  const [max, setMax] = useState(800)

  const measure = useCallback(() => {
    const w = root.current?.clientWidth ?? 1440
    setMax(Math.max(BENCH_MIN, w - RAIL_W - SPEC_MIN))
  }, [])

  useEffect(() => {
    measure()
    try {
      const saved = Number(localStorage.getItem(STORAGE_KEY))
      if (saved) setWidth(saved)
    } catch {}
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  const change = (w: number) => {
    setWidth(w)
    try {
      localStorage.setItem(STORAGE_KEY, String(w))
    } catch {}
  }
  const reset = () => {
    setWidth(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const current = width === null ? null : Math.min(width, max)

  return (
    <div
      ref={root}
      className={s.app}
      style={current ? ({ '--bench-w': `${current}px` } as React.CSSProperties) : undefined}
    >
      <WorkspaceRail />
      <div className={s.top}>{topBar}</div>
      <main className={s.spec} aria-label="Agent spec">
        <div className={s.specInner}>{spec}</div>
      </main>
      <aside id="workbench" className={s.bench} aria-label="Workbench">
        <ResizeHandle
          className={s.handle}
          label="Resize Conductor panel"
          controls="workbench"
          value={current ?? 440}
          min={BENCH_MIN}
          max={max}
          onChange={change}
          onReset={reset}
        />
        {bench}
      </aside>
    </div>
  )
}

/** L0 · Workspace navigation */
function WorkspaceRail() {
  const items = [
    { label: 'Agents', icon: Bot, current: true },
    { label: 'Knowledge bases', icon: BookOpen },
    { label: 'Phone numbers', icon: Phone },
    { label: 'Call history', icon: Clock },
  ]
  return (
    <nav className={s.rail} aria-label="Workspace">
      {items.map((i) => (
        <a key={i.label} href="#" className={s.railItem} aria-current={i.current ? 'page' : undefined}>
          <Icon icon={i.icon} />
          <span>{i.label}</span>
        </a>
      ))}
    </nav>
  )
}
