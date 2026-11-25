'use client'
// Workbench zone organisms: Conductor thread, pending changes, test, ask.
// Owns no agent data — it reads state and calls back into the page.
import { Fragment, useEffect, useRef, useState, type FormEvent } from 'react'
import { Button, Input } from '@jasmine/design-system'
import { ArrowUp, Calendar, Check, CircleCheck, ChevronRight, PhoneOff, Sparkles, TriangleAlert } from 'lucide-react'
import { Icon, SegmentedTabs } from '@/components/ui'
import { buildOutput, buildRequest } from '@/lib/agent/fixtures'
import type { Booking, FailCause, ScriptLine, TestMode } from '@/lib/agent/sampleCalendar'
import { isPending, nextStepOf, plural, type AgentState, type SectionId, type SpecFocus } from '@/lib/agent/model'
import { TestPanel, useTestCall } from './TestPanel'
import s from './workbench.module.css'

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

export type BenchTab = 'build' | 'test'

export interface WorkbenchProps {
  state: AgentState
  tab: BenchTab
  onTab: (t: BenchTab) => void
  sheetOpen: boolean
  onSheet: (open: boolean) => void
  onApply: () => void
  onConfirmDiscard: () => void
  onConnect: () => void
  onPublish: () => void
  onTestFinished: (
    booking: Booking | null,
    skipped: boolean,
    lines: ScriptLine[],
    duration: number,
    mode: TestMode,
    cause: FailCause | null
  ) => void
  onResetSample: () => void
  onAsk: (text: string) => void
  onJump: (id: SectionId, focus?: SpecFocus) => void
  onLight: (id: SectionId | null) => void
}

export function Workbench(p: WorkbenchProps) {
  const { state, tab, sheetOpen } = p
  const n = state.pending.length
  const pending = isPending(state)
  const next = nextStepOf(state)
  // The test call lives here (not in TestPanel) so the mobile footer can show End call.
  const rawCall = useTestCall(state, p.onTestFinished)
  // v · Test history: which run is open (null = latest). A new test always returns to latest.
  const [viewing, setViewing] = useState<number | null>(null)
  const call = {
    ...rawCall,
    start: (as?: TestMode) => {
      setViewing(null)
      rawCall.start(as)
    },
  }
  /* Re-run this test (flows 6–9): apply a pending fix first, then run the same type again
     on the new version. The run waits for the Apply to land in state. */
  const [rerunAs, setRerunAs] = useState<TestMode | null>(null)
  const rerun = (as: TestMode) => {
    if (pending) {
      p.onApply()
      setRerunAs(as)
    } else call.start(as)
  }
  useEffect(() => {
    if (rerunAs && !isPending(state)) {
      setRerunAs(null)
      setViewing(null)
      rawCall.start(rerunAs)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerunAs, state])
  const startTest = () => {
    p.onTab('test')
    p.onSheet(true)
    call.start()
  }
  const openRun = (n: number) => {
    const run = state.tests.find((r) => r.n === n)
    if (run) rawCall.setMode(run.mode)
    setViewing(n)
    p.onTab('test')
    p.onSheet(true)
  }
  const primary =
    call.status === 'running'
      ? call.mode === 'text'
        ? { label: 'End chat', onClick: call.end, icon: null }
        : { label: 'End call', onClick: call.end, icon: PhoneOff }
      : {
          apply: { label: `Apply ${plural(n, 'change')}`, onClick: p.onApply, icon: null },
          connect: { label: 'Connect calendar', onClick: p.onConnect, icon: Calendar },
          test: { label: call.status === 'done' ? 'Run another test' : 'Run test', onClick: startTest, icon: null },
          publish: { label: `Publish v${state.version}`, onClick: p.onPublish, icon: null },
        }[next]

  return (
    <div className={cx(s.bench, sheetOpen ? s.open : s.peek)}>
      <button
        type="button"
        className={s.handle}
        aria-expanded={sheetOpen}
        aria-controls="bench-body"
        aria-label={sheetOpen ? 'Collapse Conductor' : 'Expand Conductor'}
        onClick={() => p.onSheet(!sheetOpen)}
      >
        <span />
      </button>

      <div className={s.head}>
        <button type="button" className={s.sheetTitle} onClick={() => p.onSheet(true)}>
          {pending ? plural(n, 'pending change') : `Ready to test · v${state.version}`}
        </button>
        <SegmentedTabs
          label="Workbench mode"
          idPrefix="bench"
          value={tab}
          onChange={(t) => {
            p.onTab(t)
            p.onSheet(true)
          }}
          tabs={[
            { id: 'build', label: 'Build' },
            { id: 'test', label: 'Test' },
          ]}
        />
      </div>

      <div id="bench-body" className={s.body}>
        {tab === 'build' ? (
          <BuildPanel {...p} onOpenRun={openRun} />
        ) : (
          <TestPanel
            state={state}
            call={call}
            viewing={viewing}
            onView={setViewing}
            onRerun={rerun}
            onApply={p.onApply}
            onJump={p.onJump}
            onReset={p.onResetSample}
          />
        )}
        {/* During a Text test the panel has its own "Message the agent" field — don't show two inputs */}
        {!(tab === 'test' && call.status === 'running' && call.mode === 'text') && <AskConductor onAsk={p.onAsk} />}
      </div>

      {/* Mobile peek: the one primary action, pinned in the thumb zone */}
      <div className={s.sheetFooter}>
        <Button type="Primary" size="L" className={s.block} onClick={primary.onClick}>
          {primary.icon && <Icon icon={primary.icon} size="s" />}
          {primary.label}
        </Button>
      </div>
    </div>
  )
}

/* ── Build: Conductor thread + pending changes ─────────── */
function BuildPanel(p: WorkbenchProps & { onOpenRun: (n: number) => void }) {
  const { state } = p
  const scroller = useRef<HTMLDivElement>(null)
  const lastApplyId = [...state.chat].reverse().find((c) => c.id.startsWith("ev-apply-"))?.id
  // Chats anchor to the newest message: the blocker note and Apply are in view.
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [state.chat.length, state.pending.length, state.version])

  return (
    <div ref={scroller} className={s.scroll} id="bench-panel-build" role="tabpanel" aria-labelledby="bench-tab-build">
      <p className={s.you}>{buildRequest}</p>

      <div className={s.ai}>
        <p className={s.meta}>
          <Icon icon={Sparkles} size="s" />
          Conductor · built your agent in 38 s
        </p>
        <ul className={s.built}>
          {buildOutput.map((b) => (
            <li key={b.section}>
              <Icon icon={Check} size="s" />
              <span>
                <b>{b.section}</b> · {b.detail}
              </span>
            </li>
          ))}
        </ul>
        {/* Part of Conductor's reply, in its voice — not a system banner.
            Once a calendar is connected the item reads as resolved, so it never points at a done task. */}
        {!state.calendar ? (
          <p className={s.needs}>
            <Icon icon={TriangleAlert} size="s" />
            <span>
              <b>Needs you:</b> Check availability and Book appointment need a calendar.{' '}
              {isPending(state) ? 'Apply first, then' : 'Next:'}{' '}
              <button type="button" className={s.inlineLink} onClick={() => p.onJump('actions')}>
                connect calendar in Actions
              </button>
              .
            </span>
          </p>
        ) : (
          <p className={cx(s.needs, s.needsDone)}>
            <Icon icon={CircleCheck} size="s" />
            <span>
              <b>Done:</b> Check availability and Book appointment use{' '}
              {state.calendar.kind === 'sample'
                ? 'the sample calendar (test only). Connect a real one before you publish.'
                : `${state.calendar.provider} · ${state.calendar.eventType}.`}
            </span>
          </p>
        )}
      </div>

      {state.chat.map((c) =>
        c.kind === 'event' ? (
          // A product event (state change), not Conductor speaking: a quiet event line.
          <Fragment key={c.id}>
            {c.id.startsWith('ev-test-') ? (
              // Test events open that run in Test history
              <button type="button" className={cx(s.event, s.eventLink, s.fresh)} onClick={() => p.onOpenRun(Number(c.id.slice(8)))}>
                <Icon icon={CircleCheck} size="s" />
                <span>{c.text} · just now</span>
                <Icon icon={ChevronRight} size="s" caret />
              </button>
            ) : (
              <p className={cx(s.event, s.fresh)} role="status">
                <Icon icon={CircleCheck} size="s" />
                {c.text} · just now
              </p>
            )}
            {/* Wireframe d: right after the latest Apply, while no calendar is connected */}
            {c.id === lastApplyId && !state.calendar && <NextSteps onJump={p.onJump} onOpenTest={() => p.onTab('test')} version={state.version} />}
          </Fragment>
        ) : c.kind === 'you' ? (
          <p key={c.id} className={s.you}>
            {c.text}
          </p>
        ) : (
          <div key={c.id} className={s.ai}>
            <p className={s.meta}>
              <Icon icon={Sparkles} size="s" />
              {c.title}
            </p>
            {c.text && <p>{c.text}</p>}
          </div>
        )
      )}

      {isPending(state) && <PendingChangesCard {...p} />}
    </div>
  )
}

/* ── d · Conductor next steps (after Apply, no calendar yet) ── */
function NextSteps({ version, onJump, onOpenTest }: { version: number; onJump: (id: SectionId) => void; onOpenTest: () => void }) {
  return (
    <div className={cx(s.ai, s.fresh)}>
      <p className={s.meta}>
        <Icon icon={Sparkles} size="s" />
        Conductor · next steps
      </p>
      <p>
        <b>Next: get v{version} ready for a full test</b>
      </p>
      <ol className={s.steps}>
        <li>
          <span className={s.stepTitle}>Connect a calendar</span>
          <span className={s.stepDetail}>For Check availability and Book appointment.</span>
          <button type="button" className={s.inlineLink} onClick={() => onJump('actions')}>
            Connect calendar in Actions
            <Icon icon={ChevronRight} size="s" caret />
          </button>
        </li>
        <li>
          <span className={s.stepTitle}>Or test the conversation now</span>
          <span className={s.stepDetail}>Booking steps are skipped for now.</span>
          <button type="button" className={s.inlineLink} onClick={onOpenTest}>
            Open Test
            <Icon icon={ChevronRight} size="s" caret />
          </button>
        </li>
      </ol>
    </div>
  )
}

function PendingChangesCard(p: WorkbenchProps) {
  const { state } = p
  const n = state.pending.length
  const [confirming, setConfirming] = useState(false)
  const keepRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (confirming) keepRef.current?.querySelector('button')?.focus()
  }, [confirming])

  return (
    <section className={s.pending} aria-labelledby="pending-title">
      <h2 id="pending-title">{plural(n, 'pending change')}</h2>
      <ul className={s.trail} onMouseLeave={() => p.onLight(null)}>
        {state.pending.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className={s.trailBtn}
              onMouseEnter={() => p.onLight(c.target)}
              onFocus={() => p.onLight(c.target)}
              onBlur={() => p.onLight(null)}
              onClick={() => p.onJump(c.target)}
            >
              <span>
                <b>{c.title}</b> · {c.detail}
              </span>
              <Icon icon={ChevronRight} size="s" />
            </button>
          </li>
        ))}
      </ul>

      {!confirming ? (
        <div className={s.cardActions}>
          <Button type="Outline" size="M" onClick={() => setConfirming(true)}>
            Discard
          </Button>
          <Button type="Primary" size="M" className={cx(s.grow, s.desktopPrimary)} onClick={p.onApply}>
            Apply
          </Button>
        </div>
      ) : (
        <div className={s.confirm}>
          <p>
            {state.version === 0
              ? `Discard all ${plural(n, 'change')}? This removes everything Conductor built. There is no earlier version to go back to.`
              : `Discard ${plural(n, 'change')}? The agent goes back to v${state.version}.`}
          </p>
          <div className={s.cardActions} ref={keepRef}>
            <Button type="Outline" size="M" onClick={() => setConfirming(false)}>
              Keep changes
            </Button>
            <Button
              type="Negative Primary"
              size="M"
              className={s.grow}
              onClick={() => {
                setConfirming(false)
                p.onConfirmDiscard()
              }}
            >
              Discard {plural(n, 'change')}
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

/* ── Ask Conductor ─────────────────────────────────────── */
function AskConductor({ onAsk }: { onAsk: (text: string) => void }) {
  const [text, setText] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    onAsk(t)
    setText('')
  }
  return (
    <form className={s.ask} onSubmit={submit} autoComplete="off">
      <Input
        aria-label="Ask Conductor"
        placeholder="Ask Conductor…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        wrapperClassName={s.askField}
        className={s.askInput}
      />
      <Button type="Outline" size="M" htmlType="submit" ariaLabel="Send to Conductor">
        <Icon icon={ArrowUp} />
      </Button>
    </form>
  )
}
