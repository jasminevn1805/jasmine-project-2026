'use client'
// Page: wires the agent model to the template and organisms.
// All agent logic lives in lib/agent/model.ts; this file only owns UI state
// (tab, sheet, highlight, toast) and side effects (scrolling, timers).
import { useCallback, useReducer, useRef, useState } from 'react'
import { Toast, type ToastData } from '@/components/ui'
import { AgentPageLayout } from '@/components/templates/AgentPageLayout'
import { agentReducer, changedSections, isPending, nextStepOf, targetLabel, type AgentState, type Calendar, type PhoneNumber, type SectionId, type SpecFocus } from '@/lib/agent/model'
import { savepoints, screenC } from '@/lib/walkthrough/savepoints'
import type { Chapter } from '@/lib/walkthrough/scenarios'
import { WalkthroughPanel } from '@/components/walkthrough/WalkthroughPanel'
import { matchSentence, type Booking, type FailCause, type ScriptLine, type TestMode } from '@/lib/agent/sampleCalendar'
import { ConnectCalendarDialog } from './ConnectCalendarDialog'
import { ConnectNumberDialog } from './ConnectNumberDialog'
import { PublishBlockedDialog } from './PublishBlockedDialog'
import { PublishDialog } from './PublishDialog'
import { ActionsSection, AdvancedSection, BehaviorSection, KnowledgeSection, SummarySection } from './SpecSections'
import { TopBar } from './TopBar'
import { Workbench, type BenchTab } from './Workbench'

const isMobile = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches

export function AgentPage({ initial = screenC }: { initial?: AgentState }) {
  const [state, dispatch] = useReducer(agentReducer, initial)
  const [tab, setTab] = useState<BenchTab>('build')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [lit, setLit] = useState<SectionId | null>(null)
  const [pulse, setPulse] = useState<SectionId | null>(null)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [toast, setToast] = useState<ToastData | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false) // D2.1 · blocked
  const [d2Open, setD2Open] = useState(false) // D2 · Publish
  const [numberOpen, setNumberOpen] = useState(false) // D5 · Connect a phone number
  /* Flows 6/7: the spec text a jump points at, and the prompt paragraph in edit mode (m). */
  const [focus, setFocus] = useState<SpecFocus | null>(null)
  const [editing, setEditing] = useState<number | null>(null)
  const toastId = useRef(0)
  const [loadKey, setLoadKey] = useState(0)

  const notify = useCallback((message: string, actionLabel?: string, onAction?: () => void) => {
    setToast({ id: ++toastId.current, message, actionLabel, onAction })
  }, [])
  const dismiss = useCallback(() => setToast(null), [])

  const jump = (id: SectionId, target?: SpecFocus) => {
    if (id === 'advanced') setAdvancedOpen(true)
    if (target && id === 'behavior') {
      // If the exact sentence was edited since that test, link to its current version
      // (same opening words, e.g. "Offer times from …") and say it changed.
      let focusTarget = target
      const now = matchSentence(state.prompt, target.text)
      if (now && now !== target.text) focusTarget = { ...target, text: now, changed: true }
      setFocus(focusTarget)
      const block = state.prompt.findIndex((b) => b.text.includes(focusTarget.text))
      setEditing(target.edit && block >= 0 ? block : null)
    }
    if (isMobile()) setSheetOpen(false)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    setPulse(null)
    requestAnimationFrame(() => setPulse(id))
    setTimeout(() => setPulse((p) => (p === id ? null : p)), 1300)
  }

  const apply = () => {
    if (!isPending(state)) return
    const v = state.version + 1
    dispatch({ type: 'apply' })
    if (isMobile()) setSheetOpen(false)
    notify(`Applied as v${v}`, 'Undo', () => {
      dispatch({ type: 'undo' })
      notify('Changes are pending again')
    })
  }

  // Toast actions fire after later renders: always call the latest apply.
  const applyRef = useRef(apply)
  applyRef.current = apply

  const connect = () => {
    if (isPending(state)) notify('Apply first, so the calendar connects to the version you test.', 'Apply', apply)
    else {
      if (isMobile()) setSheetOpen(false)
      setCalendarOpen(true)
    }
  }

  const connectCalendar = (calendar: Calendar) => {
    const v = state.version + 1
    setCalendarOpen(false)
    dispatch({ type: 'connectCalendar', calendar })
    setTab('test') // Run is the next step (flows 3 → 4 and 3b)
    notify(
      calendar.kind === 'sample'
        ? `Sample calendar on. v${v} is ready to test.`
        : `${calendar.provider} connected. v${v} is ready to test.`,
      'Undo',
      () => {
        dispatch({ type: 'undo' })
        notify('Calendar disconnected')
      }
    )
  }

  const confirmDiscard = () => {
    if (state.version === 0) notify('Discarding goes back to the new-agent screen (a), not in this prototype yet.')
    else {
      dispatch({ type: 'discard' })
      notify(`Back to v${state.version}.`)
    }
  }

  const ask = (text: string) => {
    const id = `ask-${Date.now()}`
    dispatch({ type: 'ask', id, text })
    setTimeout(() => dispatch({ type: 'askResolved', id, text }), 900)
  }

  const testFinished = useCallback(
    (booking: Booking | null, skipped: boolean, lines: ScriptLine[], duration: number, mode: TestMode, cause: FailCause | null) =>
    {
      dispatch({ type: 'testFinished', booking, skipped, lines, duration, mode, cause })
      // A passing test resolves the failure the spec was linked to: drop the stale link.
      if (booking) setFocus(null)
    },
    []
  )

  const resetSample = () => {
    dispatch({ type: 'resetSample' })
    notify('Sample calendar reset. Your test bookings are cleared.')
  }

  const openPublish = () => {
    if (isMobile()) setSheetOpen(false)
    setD2Open(true)
  }

  const publish = (name: string, thenConnectNumber: boolean) => {
    dispatch({ type: 'publish', name })
    setD2Open(false)
    notify(`Published ${name}. It's tagged prod.`)
    if (thenConnectNumber) setNumberOpen(true)
  }

  const connectNumber = (n: PhoneNumber) => {
    dispatch({ type: 'connectNumber', number: n })
    setNumberOpen(false)
    notify(`${n.number} ${targetLabel(n.target)}. It answers with v${state.version} now.`)
  }

  /** Walkthrough: load a save point and reset the UI around it. */
  const loadSavepoint = (start: Chapter['start']) => {
    dispatch({ type: 'load', state: savepoints[start.savepoint]() })
    setLoadKey((k) => k + 1) // remount the workbench so the Test panel shows the loaded result
    setTab(start.tab ?? 'build')
    setSheetOpen(false)
    setCalendarOpen(false)
    setPublishOpen(false)
    setD2Open(false)
    setNumberOpen(start.numberOpen ?? false)
    setFocus(null)
    setEditing(null)
    setLit(null)
    setToast(null)
    window.scrollTo({ top: 0 })
  }

  const changed = changedSections(state)
  const shell = (id: SectionId) => ({ changed: changed.has(id), lit: lit === id, pulse: pulse === id })

  return (
    <>
      <AgentPageLayout
        topBar={<TopBar state={state} onPublish={openPublish} onPublishBlocked={() => setPublishOpen(true)} />}
        spec={
          <>
            <SummarySection {...shell('summary')} usageStarts={isPending(state) ? `v${state.version + 1}, after Apply` : 'now'} onJump={jump} />
            <BehaviorSection
              {...shell('behavior')}
              prompt={state.prompt}
              focus={focus}
              editing={editing}
              onEdit={setEditing}
              onCancelEdit={() => setEditing(null)}
              onClearFocus={() => setFocus(null)}
              onSave={(block, text) => {
                dispatch({ type: 'editPrompt', block, text })
                setEditing(null)
                // Keep pointing at the edited sentence so the builder sees the change in place.
                setFocus((f) => (f ? { ...f, text: matchSentence([{ text }], f.text) ?? f.text, edit: false } : f))
                notify('Saved as a pending change. Apply it, then re-run the test.', 'Apply', () => applyRef.current())
              }}
            />
            <KnowledgeSection {...shell('knowledge')} />
            <ActionsSection
              {...shell('actions')}
              calendar={state.calendar}
              connectIsPrimary={nextStepOf(state) === 'connect'}
              onConnect={connect}
            />
            <AdvancedSection open={advancedOpen} onToggle={() => setAdvancedOpen((o) => !o)} pulse={pulse === 'advanced'} />
          </>
        }
        bench={
          <Workbench
            key={loadKey}
            state={state}
            tab={tab}
            onTab={setTab}
            sheetOpen={sheetOpen}
            onSheet={setSheetOpen}
            onApply={apply}
            onConfirmDiscard={confirmDiscard}
            onConnect={connect}
            onPublish={openPublish}
            onTestFinished={testFinished}
            onResetSample={resetSample}
            onAsk={ask}
            onJump={jump}
            onLight={setLit}
          />
        }
      />
      <PublishBlockedDialog
        open={publishOpen}
        state={state}
        onClose={() => setPublishOpen(false)}
        onConnectReal={() => {
          setPublishOpen(false)
          setCalendarOpen(true)
        }}
      />
      <PublishDialog
        open={d2Open}
        state={state}
        onClose={() => setD2Open(false)}
        onPublish={publish}
        onRunTest={() => {
          setD2Open(false)
          setTab('test')
          if (isMobile()) setSheetOpen(true)
        }}
      />
      <ConnectNumberDialog
        open={numberOpen}
        version={state.version}
        onClose={() => setNumberOpen(false)}
        onConnect={connectNumber}
        onBuy={() => notify('Getting a new number opens in Phone numbers, not in this prototype yet.')}
      />
      <ConnectCalendarDialog
        open={calendarOpen}
        onSample={state.calendar?.kind === 'sample'}
        onClose={() => setCalendarOpen(false)}
        onConnect={connectCalendar}
        onIntegrations={() => {
          setCalendarOpen(false)
          notify('Integrations opens here, not in this prototype yet.')
        }}
      />
      <Toast toast={toast} onDismiss={dismiss} />
      <WalkthroughPanel
        state={state}
        ui={{ tab, calendarOpen, d2Open, blockedOpen: publishOpen, numberOpen, editing }}
        onLoad={loadSavepoint}
      />
    </>
  )
}
