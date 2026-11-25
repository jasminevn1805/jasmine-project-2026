'use client'
// Test mode organisms (flows 4–6; branch 3b on the sample calendar).
//   idle    → note + Run
//   running → wireframe g: call timer, transcript line by line, "why ›" links, End call
//   result  → wireframe w: result card + sample calendar week view + Run / Re-run / Reset
import { useCallback, useEffect, useRef, useState, type FormEvent, type Ref } from 'react'
import { Button } from '@jasmine/design-system'
import { AudioLines, CircleCheck, CircleX, Pencil, ChevronLeft, ChevronRight, MessageSquare, Mic, PhoneOff, RotateCcw, Send, TriangleAlert } from 'lucide-react'
import { Badge, Icon, Note } from '@/components/ui'
import {
  buildConversationScript,
  buildScript,
  createTextAgent,
  readPromptRules,
  formatClock,
  formatTime,
  keyLineIndex,
  LINE_SECONDS,
  sampleBookings,
  sampleWeek,
  type Booking,
  type FailCause,
  type ScriptLine,
  type TestMode,
  type TextAgent,
} from '@/lib/agent/sampleCalendar'
import { isPending, lastTest, nextStepOf, plural, testByNumber, type AgentState, type SectionId, type SpecFocus, type TestRun } from '@/lib/agent/model'
import s from './test.module.css'

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')
const LINE_MS = LINE_SECONDS * 1000

/* ── Test session (UI state; the finished result goes to the reducer) ──
   Audio: a spoken call — the builder talks, speech is transcribed line by line
          (simulated playback), with Listening / Agent speaking turn cues.
   Text:  a typed chat — the builder types as the caller and the agent answers
          what was actually typed (createTextAgent). */
export interface TestCall {
  status: 'idle' | 'running' | 'done'
  /** Selected before starting; locked while running. */
  mode: TestMode
  setMode: (m: TestMode) => void
  lines: ScriptLine[]
  shown: number
  seconds: number
  /** Text mode: agent is composing a reply. */
  typing: boolean
  suggestion: string | null
  send: (text: string) => void
  start: (as?: TestMode) => void
  end: () => void
}

export function useTestCall(
  state: AgentState,
  onFinish: (
    booking: Booking | null,
    skipped: boolean,
    lines: ScriptLine[],
    duration: number,
    mode: TestMode,
    cause: FailCause | null
  ) => void
): TestCall {
  const [status, setStatus] = useState<TestCall['status']>(state.tests.length ? 'done' : 'idle')
  const [mode, setMode] = useState<TestMode>('audio')
  const [lines, setLines] = useState<ScriptLine[]>([])
  const [shown, setShown] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [typing, setTyping] = useState(false)
  const booking = useRef<Booking | null>(null)
  const cause = useRef<FailCause | null>(null)
  const finished = useRef(false)
  const agent = useRef<TextAgent | null>(null)
  const linesRef = useRef<ScriptLine[]>([])
  const startedAt = useRef(0)
  const elapsed = () => (Date.now() - startedAt.current) / 1000

  const finish = useCallback(
    (heard: ScriptLine[], duration: number, m: TestMode, booked: Booking | null, failed: FailCause | null) => {
      if (finished.current) return
      finished.current = true
      setStatus('done')
      setTyping(false)
      onFinish(booked, heard.some((l) => l.who === 'skip'), heard, Math.max(1, Math.round(duration)), m, failed)
    },
    [onFinish]
  )

  /** `as` re-runs a test with a given type (Re-run this test keeps the failed run's type). */
  const start = (as?: TestMode) => {
    const m = as ?? mode
    if (m !== mode) setMode(m)
    const taken = state.calendar?.kind === 'sample' ? state.testBookings : []
    // Tests run on the applied version: what the agent collects comes from the LIVE prompt.
    const rule = readPromptRules(state.livePrompt)
    finished.current = false
    cause.current = null
    startedAt.current = Date.now()
    setSeconds(0)
    setTyping(false)
    if (m === 'text') {
      const a = createTextAgent(!!state.calendar, taken, rule)
      agent.current = a
      booking.current = null
      linesRef.current = [{ ...a.opening, at: 0 }]
      setLines(linesRef.current)
      setShown(1)
    } else {
      // No calendar yet → conversation-only call; booking steps are skipped (flow 14).
      const script = state.calendar ? buildScript(taken, rule) : { ...buildConversationScript(), cause: null }
      booking.current = script.booking
      cause.current = script.cause
      setLines(script.lines.map((l, i) => ({ ...l, at: i * LINE_SECONDS })))
      setShown(1)
    }
    setStatus('running')
  }

  /* Audio: play the transcript line by line; the agent ends the call after the last line. */
  useEffect(() => {
    if (status !== 'running' || mode !== 'audio') return
    if (shown >= lines.length) {
      const t = setTimeout(() => {
        const heard = lines
        finish(heard, (heard.length + 1) * LINE_SECONDS, 'audio', heard.some((l) => l.books) ? booking.current : null, heard.some((l) => l.fails) ? cause.current : null)
      }, LINE_MS)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setShown((n) => n + 1), LINE_MS)
    return () => clearTimeout(t)
  }, [status, mode, shown, lines, finish])

  useEffect(() => {
    if (status !== 'running') return
    const t = setInterval(() => setSeconds((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [status])

  /* Text: the caller's message goes in, the agent replies after a short "typing…" pause. */
  const put = (next: ScriptLine[]) => {
    linesRef.current = next
    setLines(next)
    setShown(next.length)
  }
  const send = (text: string) => {
    const a = agent.current
    if (status !== 'running' || mode !== 'text' || !a || typing || !text.trim()) return
    put([...linesRef.current, { who: 'caller', text: text.trim(), at: elapsed() }])
    setTyping(true)
    setTimeout(() => {
      if (finished.current) return
      setTyping(false)
      put([...linesRef.current, ...a.reply(text).map((l) => ({ ...l, at: elapsed() }))])
      if (a.done()) setTimeout(() => finish(linesRef.current, elapsed(), 'text', a.booking(), a.cause()), 1200)
    }, 900)
  }

  const end = () => {
    if (mode === 'text') finish(linesRef.current, elapsed(), 'text', agent.current?.booking() ?? null, agent.current?.cause() ?? null)
    else {
      const heard = lines.slice(0, shown)
      finish(heard, elapsed(), 'audio', heard.some((l) => l.books) ? booking.current : null, heard.some((l) => l.fails) ? cause.current : null)
    }
  }

  return {
    status,
    mode,
    setMode: (m) => status !== 'running' && setMode(m),
    lines,
    shown,
    seconds,
    typing,
    suggestion: mode === 'text' && status === 'running' && !typing ? agent.current?.suggestion() ?? null : null,
    send,
    start,
    end,
  }
}

/* ── Panel ─────────────────────────────────────────────── */
export function TestPanel({
  state,
  call,
  viewing,
  onView,
  onRerun,
  onApply,
  onJump,
  onReset,
}: {
  state: AgentState
  call: TestCall
  /** Test number open from history; null = latest. */
  viewing: number | null
  onView: (n: number | null) => void
  /** Re-run with the same type; applies a pending fix first. */
  onRerun: (as: TestMode) => void
  onApply: () => void
  onJump: (id: SectionId, focus?: SpecFocus) => void
  onReset: () => void
}) {
  const pending = isPending(state)
  const n = state.pending.length
  const sample = state.calendar?.kind === 'sample'
  const last = lastTest(state)
  // The result area follows the selected type: latest Audio result on Audio, latest Text result on Text.
  const lastOfMode = [...state.tests].reverse().find((r) => r.mode === call.mode) ?? null
  // Black bookings on the sample calendar: only those made by tests of the selected type (since the last reset).
  const modeBookings = state.testBookings.filter((b) =>
    state.tests.some((r) => r.mode === call.mode && r.booking && r.booking.day === b.day && r.booking.start === b.start)
  )
  // v · Test history: a session opened from history (any run, including the latest).
  const shownRun = testByNumber(state, viewing)
  const session = shownRun != null
  // Results layout: history + Run are pinned to the bottom; only the area above scrolls.
  const pinned = call.status === 'done' && !!last
  // When a call ends or another run opens, start the scroll area at the top.
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 0
  }, [call.status, state.tests.length, viewing])

  // While a fix is pending, the next step is Apply (tests run on applied versions).
  const runButton = pending ? (
    <Button type="Primary" size="M" className={cx(s.block, s.desktopPrimary)} onClick={onApply}>
      Apply {plural(n, 'change')} to test again
    </Button>
  ) : state.calendar ? (
    // After a passing test on this version, Publish (top bar) is the one primary.
    <Button type={nextStepOf(state) === 'publish' ? 'Outline' : 'Primary'} size="M" className={cx(s.block, s.desktopPrimary)} onClick={() => call.start()}>
      {lastOfMode ? 'Run another' : 'Run'} {call.mode} test
    </Button>
  ) : (
    // Secondary: Connect calendar (in Actions / the mobile footer) stays the one primary.
    <Button type="Outline" size="M" className={s.block} onClick={() => call.start()}>
      Test the conversation{lastOfMode ? ' again' : ''} · {call.mode === 'audio' ? 'Audio' : 'Text'}
    </Button>
  )

  // Shown when the selected type hasn't been run yet (no result card of that type).
  const readyNote = !state.calendar ? (
    <Note tone="warning" icon={<Icon icon={TriangleAlert} />}>
      Booking needs a calendar before a full test. You can test the conversation on v{state.version} now: booking steps are
      skipped.
    </Note>
  ) : (
    <Note tone="info">
      <b>Full test on v{state.version}.</b>{' '}
      {sample
        ? 'Test bookings go into the sample calendar, with your clinic hours and some slots already booked. No texts go to callers.'
        : `Bookings go into ${state.calendar.kind === 'provider' ? `${state.calendar.provider} · ${state.calendar.eventType}` : ''}.`}
    </Note>
  )

  const modes = call.status !== 'running' && (
    <div className={s.modeBlock}>
      <div className={s.modes} role="radiogroup" aria-label="Test type">
        {(['audio', 'text'] as const).map((m) => (
          <button key={m} type="button" role="radio" aria-checked={call.mode === m} className={s.mode} onClick={() => call.setMode(m)}>
            <Icon icon={m === 'audio' ? Mic : MessageSquare} size="s" />
            {m === 'audio' ? 'Audio' : 'Text'}
          </button>
        ))}
      </div>
      <p className={s.modeHint}>
        {call.mode === 'audio'
          ? 'Talk to the agent with your microphone. What you both say is transcribed as you go.'
          : 'Chat with the agent by typing. Its replies appear as messages.'}
      </p>
    </div>
  )

  if (pinned && last) {
    return (
      <div className={cx(s.panel, s.panelPinned)} id="bench-panel-test" role="tabpanel" aria-labelledby="bench-tab-test">
        {!session && modes}
        {session && shownRun ? (
          // Session view: only the back link is fixed; result + script scroll in one area,
          // so Test history below never moves or leaves the screen.
          <>
            <button type="button" className={s.back} onClick={() => onView(null)}>
              <Icon icon={ChevronLeft} size="s" />
              Back to latest result
            </button>
            <div ref={scroller} className={s.scrollArea} tabIndex={0} aria-label={`Test ${shownRun.n} result and transcript`}>
              <ResultCard run={shownRun} pending={pending} onRerun={onRerun} onJump={onJump} />
              <SessionTranscript key={shownRun.n} run={shownRun} onJump={onJump} />
              {shownRun.calendarLabel === 'sample calendar' && (
                <SampleCalendar testBookings={shownRun.booking ? [shownRun.booking] : []} caption={`Booking made by Test ${shownRun.n}`} />
              )}
            </div>
          </>
        ) : (
          // Latest result of the selected type only; nothing from the other type.
          <div ref={scroller} className={cx(s.scrollArea, s.scrollPlain)}>
            {lastOfMode ? (
              <>
                <ResultCard run={lastOfMode} pending={pending} onRerun={onRerun} onJump={onJump} />
                {sample && lastOfMode.calendarLabel === 'sample calendar' && (
                  <SampleCalendar testBookings={modeBookings} onReset={onReset} />
                )}
              </>
            ) : (
              readyNote
            )}
          </div>
        )}
        {/* Pinned: always on screen, same position in both views */}
        <div className={s.pinnedFoot}>
          <TestHistory
            runs={state.tests}
            current={session && shownRun ? shownRun.n : null}
            onOpen={(n) => {
              const run = testByNumber(state, n)
              if (run) call.setMode(run.mode)
              onView(n)
            }}
          />
          {runButton}
        </div>
      </div>
    )
  }

  return (
    <div className={s.panel} id="bench-panel-test" role="tabpanel" aria-labelledby="bench-tab-test">
      {modes}
      {pending ? (
        <>
          <Note tone="info">
            <b>Nothing to test yet.</b> Tests run on a version, and your {plural(n, 'change')} {n === 1 ? "isn't" : "aren't"} applied.
            Apply to create v{state.version + 1}, then run a test.
          </Note>
          <Button type="Primary" size="M" className={cx(s.block, s.desktopPrimary)} onClick={onApply}>
            Apply {plural(n, 'change')}
          </Button>
        </>
      ) : call.status === 'running' ? (
        <LiveCall call={call} onJump={onJump} />
      ) : (
        <>
          {readyNote}
          {runButton}
        </>
      )}
    </div>
  )
}

/* ── g · Live test: Audio call or Text chat ─────────────── */
function LiveCall({ call, onJump }: { call: TestCall; onJump: (id: SectionId, focus?: SpecFocus) => void }) {
  return call.mode === 'text' ? <TextChat call={call} onJump={onJump} /> : <AudioCall call={call} onJump={onJump} />
}

function useScrollToEnd(dep: unknown) {
  const end = useRef<HTMLDivElement>(null)
  // Braces matter: scrollIntoView returns a Promise in current Chrome.
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' })
  }, [dep])
  return end
}

/** Audio: the builder speaks; speech on both sides is transcribed line by line. */
function AudioCall({ call, onJump }: { call: TestCall; onJump: (id: SectionId, focus?: SpecFocus) => void }) {
  const end = useScrollToEnd(call.shown)
  const next = call.lines[call.shown]
  const listening = next?.who === 'caller'
  return (
    <section className={s.call} aria-label="Audio test call in progress">
      <p className={s.callHead} role="status">
        <span className={s.liveDot} aria-hidden="true" />
        Audio call · {formatClock(call.seconds)}
        <span className={s.micChip}>
          <Icon icon={Mic} size="s" />
          Mic on
        </span>
      </p>
      <ol className={s.transcript} aria-live="polite">
        {call.lines.slice(0, call.shown).map((l, i) => (
          <Line key={i} line={l} onJump={onJump} />
        ))}
      </ol>
      {/* Whose turn it is */}
      {next && (
        <p className={cx(s.turn, listening && s.turnYou)} role="status">
          <Icon icon={listening ? Mic : AudioLines} size="s" />
          {listening ? 'Listening… speak now' : 'Agent speaking…'}
        </p>
      )}
      <div ref={end} />
      <Button type="Primary" size="M" className={cx(s.block, s.desktopPrimary)} onClick={call.end}>
        <Icon icon={PhoneOff} size="s" />
        End call
      </Button>
    </section>
  )
}

/** Text: the builder types as the caller; the agent replies to what was typed. */
function TextChat({ call, onJump }: { call: TestCall; onJump: (id: SectionId, focus?: SpecFocus) => void }) {
  const [draft, setDraft] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const end = useScrollToEnd(`${call.shown}-${call.typing}`)
  useEffect(() => {
    if (!call.typing) input.current?.focus()
  }, [call.typing])
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.trim()) return
    call.send(draft)
    setDraft('')
  }
  return (
    <section className={s.call} aria-label="Text test chat in progress">
      <p className={s.callHead} role="status">
        <span className={s.liveDot} aria-hidden="true" />
        Text chat · {plural(call.shown, 'message')}
      </p>
      <ol className={s.transcript} aria-live="polite">
        {call.lines.slice(0, call.shown).map((l, i) => (
          <Line key={i} line={l} onJump={onJump} />
        ))}
        {call.typing && (
          <li className={cx(s.line, s.agent)}>
            <span className={s.who}>Agent</span>
            <p className={s.typingDots} aria-label="Agent is typing">
              <span />
              <span />
              <span />
            </p>
          </li>
        )}
      </ol>
      <div ref={end} />
      {call.suggestion && (
        <button type="button" className={s.suggestion} onClick={() => call.send(call.suggestion!)}>
          <span className={s.suggestionLabel}>Try</span>
          <span className={s.suggestionText}>{call.suggestion}</span>
        </button>
      )}
      <form className={s.chatForm} onSubmit={submit} autoComplete="off">
        <label className="sr-only" htmlFor="test-chat-input">
          Message the agent
        </label>
        <input
          ref={input}
          id="test-chat-input"
          className={s.chatInput}
          placeholder="Message the agent…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={call.typing}
        />
        <Button type="Primary" size="M" htmlType="submit" ariaLabel="Send to the agent" className={s.chatSend}>
          <Icon icon={Send} size="s" />
        </Button>
      </form>
      <Button type="Outline" size="M" className={cx(s.block, s.desktopPrimary)} onClick={call.end}>
        End chat
      </Button>
    </section>
  )
}

function Line({
  line,
  onJump,
  ref,
  time,
  isKey = false,
  from = 'the live test',
}: {
  line: ScriptLine
  onJump: (id: SectionId, focus?: SpecFocus) => void
  /** Where this transcript lives, for the spec's "Linked to …" banner (flow 7). */
  from?: string
  ref?: Ref<HTMLLIElement>
  /** Timestamp (session transcript only). */
  time?: string
  /** The line that decided the outcome — highlighted. */
  isKey?: boolean
}) {
  const keyTag = isKey && <Badge tone="neutral">Key moment</Badge>
  if (line.who === 'skip')
    return (
      <li ref={ref} className={cx(s.skipRow, isKey && s.keySkip)}>
        {(time || isKey) && (
          <span className={s.who}>
            Booking step
            {time && <span className={s.time}>· {time}</span>}
            {keyTag}
          </span>
        )}
        <span className={s.skip}>
          <Icon icon={TriangleAlert} size="s" />
          {line.text}
        </span>
      </li>
    )
  return (
    <li
      ref={ref}
      className={cx(s.line, line.who === 'agent' ? s.agent : s.caller, isKey && s.key, isKey && line.books && s.keyBooked, isKey && line.fails && s.keyFailed)}
    >
      <span className={s.who}>
        {line.who === 'agent' ? 'Agent' : 'You'}
        {time && <span className={s.time}>· {time}</span>}
        {keyTag}
      </span>
      <p>{line.text}</p>
      {line.why && (
        <button type="button" className={s.why} onClick={() =>
            onJump(
              line.why!.section,
              line.why!.focus ? { text: line.why!.focus, from: `${from} · Agent reply${time ? ` ${time}` : ''}` } : undefined
            )
          }
          title={`From: ${line.why.label}`}
        >
          why
          <Icon icon={ChevronRight} size="s" caret />
          <span className="sr-only">: {line.why.label}</span>
        </button>
      )}
    </li>
  )
}

const modeWord = (run: TestRun) => (run.mode === 'text' ? 'Text' : 'Audio')
const bookedName = (b: Booking) => b.label?.replace(/ · test$/, '') ?? 'the caller'
/** Grid "Length": call time for Audio, message count for Text. */
const lengthWord = (run: TestRun) =>
  run.mode === 'text' ? `${run.lines.filter((l) => l.who !== 'skip').length} msg` : formatClock(run.duration)

/* ── Session transcript: timestamps, "why ›" links, key moment highlighted ── */
function SessionTranscript({ run, onJump }: { run: TestRun; onJump: (id: SectionId, focus?: SpecFocus) => void }) {
  const key = keyLineIndex(run.lines)
  const spoken = run.lines.filter((l) => l.who !== 'skip').length
  const text = run.mode === 'text'
  return (
    <section className={s.session} aria-labelledby={`transcript-${run.n}`}>
      <header className={s.sessionHead}>
        <h3 id={`transcript-${run.n}`} className={s.sessionTitle}>
          {text ? 'Chat transcript' : 'Call transcript'}
        </h3>
        <span className={s.sessionMeta}>
          <Icon icon={text ? MessageSquare : Mic} size="s" />
          {text ? `Text chat · ${plural(spoken, 'message')}` : `Audio call · ${plural(spoken, 'line')}`} · {formatClock(run.duration)}
        </span>
      </header>
      <ol className={s.transcript}>
        {run.lines.map((l, i) => (
          <Line key={i} line={l} onJump={onJump} time={formatClock(l.at ?? i * LINE_SECONDS)} isKey={i === key} from={`Test ${run.n}`} />
        ))}
      </ol>
    </section>
  )
}

/* ── w · Result card ───────────────────────────────────── */
function ResultCard({
  run,
  pending,
  onRerun,
  onJump,
}: {
  run: NonNullable<ReturnType<typeof lastTest>>
  /** A fix is waiting to be applied: Re-run applies it first. */
  pending: boolean
  onRerun: (as: TestMode) => void
  onJump: (id: SectionId, focus?: SpecFocus) => void
}) {
  const passed = run.outcome === 'passed'
  const skipped = run.outcome === 'skipped'
  const failed = run.outcome === 'failed' && run.cause
  const b = run.booking
  const sample = run.calendarLabel === 'sample calendar'
  return (
    <section
      className={cx(s.result, passed ? s.passed : failed ? s.failed : skipped ? s.skipped : s.ended)}
      aria-label="Test result"
    >
      <p className={s.resultHead}>
        <Icon icon={passed ? CircleCheck : failed ? CircleX : TriangleAlert} size="s" />
        {passed
          ? `Passed · Test ${run.n} · v${run.version} · ${modeWord(run)} · ${run.calendarLabel}`
          : failed
            ? `Failed · Test ${run.n} · v${run.version} · ${modeWord(run)}`
            : skipped
              ? `Conversation passed · booking skipped · Test ${run.n} · v${run.version} · ${modeWord(run)}`
              : `Ended early · Test ${run.n} · v${run.version} · ${modeWord(run)} · ${run.calendarLabel}`}
      </p>
      <p className={s.resultBody}>
        {b
          ? `Booked ${bookedName(b)}, Cleaning, ${sampleWeek.days[b.day].short} ${formatTime(b.start)}.${sample ? ' No text sent.' : ''}`
          : failed
            ? `Booking failed. ${run.cause!.reason}`
            : skipped
              ? "The conversation worked. The agent couldn't check availability because no calendar is connected, so it took a callback number instead. Nothing was booked."
              : 'The call ended before a booking was made. Nothing was booked.'}
      </p>
      {/* i · Result: failed — the cause in plain words, linked straight to it */}
      {failed && (
        <>
          <p className={s.cause}>
            <span className={s.causeLabel}>Cause</span>
            {run.cause!.where}
          </p>
          <div className={s.resultActions}>
            {/* Flow 6: Fix this opens the cause, highlighted, in edit mode */}
            <Button
              type="Primary"
              size="S"
              className={s.fixBtn}
              onClick={() => onJump(run.cause!.section, { text: run.cause!.focus, from: `Test ${run.n} result`, edit: true })}
            >
              <Icon icon={Pencil} size="s" />
              Fix this
            </Button>
          </div>
        </>
      )}
      {/* q · Result: missing connection — name the cause and link straight to it */}
      {skipped && (
        <button type="button" className={s.rerun} onClick={() => onJump('actions')}>
          Fix this: connect a calendar in Actions
          <Icon icon={ChevronRight} size="s" caret />
        </button>
      )}
      <button type="button" className={s.rerun} onClick={() => onRerun(run.mode)}>
        <Icon icon={RotateCcw} size="s" />
        {pending ? 'Apply your fix and re-run this test' : 'Re-run this test'}
      </button>
    </section>
  )
}

/* ── w · Sample calendar week view ─────────────────────── */
const HOUR_PX = 24

function SampleCalendar({ testBookings, onReset, caption }: { testBookings: Booking[]; onReset?: () => void; caption?: string }) {
  const hours = Array.from({ length: sampleWeek.close - sampleWeek.open }, (_, i) => sampleWeek.open + i)
  const block = (b: Booking) => ({ top: (b.start - sampleWeek.open) * HOUR_PX, height: (b.end - b.start) * HOUR_PX - 2 })
  return (
    <section className={s.calendar} aria-labelledby="sample-cal-title">
      <header className={s.calHead}>
        <p id="sample-cal-title" className={s.calTitle}>
          Sample calendar · {sampleWeek.label}
        </p>
        <Badge tone="neutral">Test only</Badge>
      </header>

      <div className={s.grid} aria-hidden="true">
        <div className={s.times}>
          {hours.map((h) =>
            h % 2 === 0 ? (
              <span key={h} style={{ top: (h - sampleWeek.open) * HOUR_PX }}>
                {formatTime(h).replace(' ', ' ')}
              </span>
            ) : null
          )}
        </div>
        {sampleWeek.days.map((d, i) => (
          <div key={d.short} className={s.day}>
            <span className={s.dayName}>{d.short}</span>
            <div className={s.dayBody} style={{ height: hours.length * HOUR_PX }}>
              {hours
                .filter((h) => h % 2 === 0)
                .map((h) => (
                  <span key={`l${h}`} className={s.hourLine} style={{ top: (h - sampleWeek.open) * HOUR_PX }} />
                ))}
              {sampleBookings
                .filter((b) => b.day === i)
                .map((b, j) => (
                  <span key={j} className={s.sampleBooking} style={block(b)} />
                ))}
              {testBookings
                .filter((b) => b.day === i)
                .map((b, j) => (
                  <span key={`t${j}`} className={s.testBooking} style={block(b)} title={b.label}>
                    {b.label}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Same information for screen readers */}
      <p className="sr-only">
        {testBookings.length
          ? `Booked by your tests: ${testBookings.map((b) => `${sampleWeek.days[b.day].long} ${formatTime(b.start)}`).join(', ')}.`
          : 'No test bookings yet.'}
      </p>

      <footer className={s.calFoot}>
        <p className={s.legend}>
          <span className={s.keyGrey} aria-hidden="true" /> Sample bookings
          <span className={s.keyBlack} aria-hidden="true" /> {caption ?? 'Booked by your test'}
        </p>
        {onReset && testBookings.length > 0 && (
          <Button type="Text" size="S" className={s.reset} onClick={onReset}>
            Reset sample calendar
          </Button>
        )}
      </footer>
    </section>
  )
}

/* ── v · Test history ──────────────────────────────────────
   Compact data grid: one row per session, keywords only, aligned columns so the
   list scans like a table. The whole row opens the session (result + transcript). */
function resultKeyword(run: TestRun) {
  if (run.outcome === 'passed' && run.booking)
    // ✓ icon already says "booked" — keep the slot short so it fits the column.
    return `${sampleWeek.days[run.booking.day].short} ${formatTime(run.booking.start)}`
  if (run.outcome === 'skipped') return 'Booking skipped'
  if (run.outcome === 'failed') return 'Booking failed'
  return 'Ended early'
}

function calendarKeyword(run: TestRun) {
  if (run.calendarLabel === 'sample calendar') return 'Sample'
  if (run.calendarLabel === 'no calendar') return 'None'
  return run.calendarLabel
}

function TestHistory({ runs, current, onOpen }: { runs: TestRun[]; current: number | null; onOpen: (n: number) => void }) {
  return (
    <section className={s.history} aria-labelledby="test-history-title">
      <h3 id="test-history-title" className={s.historyTitle}>
        Test history · {plural(runs.length, 'run')}
      </h3>
      <div className={s.grid2} role="table" aria-labelledby="test-history-title">
        <div className={cx(s.gridRow, s.gridHead)} role="row">
          <span role="columnheader" className={s.colIcon} />
          <span role="columnheader">Test</span>
          <span role="columnheader">Calendar</span>
          <span role="columnheader">Result</span>
          <span role="columnheader" className={s.colNum}>Length</span>
          <span role="columnheader" className="sr-only">Open</span>
        </div>
        {[...runs].reverse().map((r) => {
          const ok = r.outcome === 'passed'
          return (
            <div key={r.n} role="row" className={s.gridRow} aria-current={r.n === current ? 'true' : undefined}>
              <span role="cell" className={s.colIcon}>
                <Icon
                  icon={ok ? CircleCheck : r.outcome === 'failed' ? CircleX : TriangleAlert}
                  size="s"
                  className={ok ? s.gridIconOk : r.outcome === 'failed' ? s.gridIconFail : s.gridIconWarn}
                />
                <span className="sr-only">{ok ? 'Passed' : r.outcome === 'failed' ? 'Failed' : r.outcome === 'skipped' ? 'Skipped' : 'Ended'}</span>
              </span>
              <span role="cell" className={s.colTest}>
                Test {r.n} · v{r.version}
              </span>
              <span role="cell" className={s.colMuted}>{calendarKeyword(r)}</span>
              <span role="cell" className={s.colResult}>{resultKeyword(r)}</span>
              <span role="cell" className={cx(s.colMuted, s.colNum)}>{lengthWord(r)}</span>
              <span role="cell">
                {/* Stretched: the whole row opens the session */}
                <button type="button" className={s.rowAction} onClick={() => onOpen(r.n)} aria-label={`Open Test ${r.n} result and transcript`}>
                  Transcript
                </button>
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
