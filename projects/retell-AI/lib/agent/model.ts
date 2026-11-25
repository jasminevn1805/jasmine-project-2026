// Agent page state: pure data + reducer + selectors. No React, no DOM —
// every screen state (a–w) is a value of AgentState, and the UI derives from it.
import type { Booking, FailCause, PromptBlock, ScriptLine, TestMode } from './sampleCalendar'

export type SectionId = 'summary' | 'behavior' | 'knowledge' | 'actions' | 'advanced'

/** Where a jump into the spec came from, and what to highlight there (flows 6/7). */
export interface SpecFocus {
  /** Exact text to highlight (e.g. a prompt sentence). */
  text: string
  /** "Test 3 result" or "Test 3 · Agent reply 0:06". */
  from: string
  /** Open the section in edit mode (Fix this). */
  edit?: boolean
  /** The linked line has been edited since that test ran (flow 7 from an older run). */
  changed?: boolean
}

export interface PendingChange {
  id: string
  target: SectionId
  title: string
  detail: string
  fromAsk?: boolean
}

export type CalendarProvider = 'Cal.com' | 'Calendly'

/** Where bookings go. `sample` is test-only: Publish stays blocked until a real one is connected. */
export type Calendar = { kind: 'provider'; provider: CalendarProvider; eventType: string } | { kind: 'sample' }

export type ChatItem =
  | { id: string; kind: 'you'; text: string }
  | { id: string; kind: 'conductor'; title: string; text: string; working?: boolean }
  /** Product events (state changes) — rendered as quiet lines, not chat turns. */
  | { id: string; kind: 'event'; text: string }

interface Snapshot {
  version: number
  pending: PendingChange[]
  calendar: Calendar | null
  chat: ChatItem[]
  /** Behavior prompt as shown in the spec (may hold an unapplied edit). */
  prompt: PromptBlock[]
  /** Prompt in the applied version — what tests run on. */
  livePrompt: PromptBlock[]
}

/** One finished test call. "sample calendar" is named on every result (sample calendar rules). */
export interface TestRun {
  n: number
  version: number
  calendarLabel: string
  /** skipped = conversation-only test: ran fine, booking steps skipped (no calendar).
   *  failed = the agent tried to book and was refused; `cause` names why (wireframe i). */
  outcome: 'passed' | 'ended' | 'skipped' | 'failed'
  cause: FailCause | null
  booking: Booking | null
  /** What was said, so any run in Test history can be reopened (wireframe v). */
  lines: ScriptLine[]
  /** Call length in seconds. */
  duration: number
  /** Audio = spoken call; Text = typed chat. */
  mode: TestMode
}

/** Where a phone number points (Retell: numbers choose what they run; Publish never does). */
export type NumberTarget = { kind: 'prod' } | { kind: 'latest' } | { kind: 'pinned'; version: number }

export interface PhoneNumber {
  number: string
  label: string
  target: NumberTarget
}

/** A frozen version. Publish freezes; it doesn't put anything on a phone line (R-05). */
export interface Published {
  version: number
  name: string
}

export interface AgentState extends Snapshot {
  /** 0 = nothing applied yet. Tests and calls run on a version. */
  version: number
  /** Snapshot for Undo after Apply or a calendar connection. */
  undo: Snapshot | null
  tests: TestRun[]
  /** Black bookings on the sample calendar, made by tests since the last reset. */
  testBookings: Booking[]
  /** Published versions, oldest first. The latest one carries the prod tag (Q-05: set automatically). */
  published: Published[]
  /** Workspace numbers that point at this agent. */
  numbers: PhoneNumber[]
}

export type AgentAction =
  | { type: 'apply' }
  | { type: 'undo' }
  | { type: 'discard' }
  | { type: 'connectCalendar'; calendar: Calendar }
  | { type: 'testFinished'; booking: Booking | null; skipped?: boolean; cause?: FailCause | null; lines: ScriptLine[]; duration: number; mode: TestMode }
  /** Flow 6/7/9: edit one prompt paragraph by hand → a pending change. */
  | { type: 'editPrompt'; block: number; text: string }
  | { type: 'resetSample' }
  | { type: 'publish'; name: string }
  | { type: 'connectNumber'; number: PhoneNumber }
  | { type: 'ask'; id: string; text: string }
  | { type: 'askResolved'; id: string; text: string }
  /** Walkthrough panel: jump to a save point (built by running these same actions). */
  | { type: 'load'; state: AgentState }

const snapshot = (s: AgentState): Snapshot => ({
  version: s.version,
  pending: s.pending,
  calendar: s.calendar,
  chat: s.chat,
  prompt: s.prompt,
  livePrompt: s.livePrompt,
})

export function agentReducer(state: AgentState, action: AgentAction): AgentState {
  switch (action.type) {
    case 'load':
      return action.state
    case 'apply': {
      if (!state.pending.length) return state
      const v = state.version + 1
      return {
        ...state,
        version: v,
        pending: [],
        livePrompt: state.prompt,
        chat: [...state.chat, { id: `ev-apply-${v}`, kind: 'event', text: `Applied as v${v}` }],
        undo: snapshot(state),
      }
    }
    case 'undo':
      if (!state.undo) return state
      return { ...state, ...state.undo, undo: null }
    case 'discard':
      // With no applied version, discarding returns to screen a (not built yet).
      if (state.version === 0) return state
      return { ...state, pending: [], prompt: state.livePrompt, undo: null }
    case 'connectCalendar': {
      // Connecting changes the agent's definition, so it ships as a new version
      // (board: "calendar connected (v2)"). Only allowed with nothing pending.
      if (state.pending.length) return state
      const v = state.version + 1
      const text =
        action.calendar.kind === 'sample'
          ? `Sample calendar on · v${v} · test only`
          : `${action.calendar.provider} connected · v${v}`
      return {
        ...state,
        version: v,
        calendar: action.calendar,
        chat: [...state.chat, { id: `ev-cal-${v}`, kind: 'event', text }],
        undo: snapshot(state),
      }
    }
    case 'testFinished': {
      const n = state.tests.length + 1
      const sample = state.calendar?.kind === 'sample'
      const calendarLabel = !state.calendar ? 'no calendar' : sample ? 'sample calendar' : state.calendar.kind === 'provider' ? state.calendar.provider : ''
      const outcome: TestRun['outcome'] = action.booking ? 'passed' : action.cause ? 'failed' : action.skipped ? 'skipped' : 'ended'
      const run: TestRun = {
        n,
        version: state.version,
        calendarLabel,
        outcome,
        cause: action.cause ?? null,
        booking: action.booking,
        lines: action.lines,
        duration: action.duration,
        mode: action.mode,
      }
      const eventText =
        outcome === 'passed'
          ? `Test ${n} passed · ${action.mode} · v${state.version} · ${calendarLabel}`
          : outcome === 'failed'
            ? `Test ${n} failed · ${action.mode} · v${state.version} · booking refused`
          : outcome === 'skipped'
            ? `Test ${n} · ${action.mode} · conversation only · v${state.version} · booking skipped`
            : `Test ${n} ended early · ${action.mode} · v${state.version} · ${calendarLabel}`
      return {
        ...state,
        tests: [...state.tests, run],
        testBookings: action.booking && sample ? [...state.testBookings, action.booking] : state.testBookings,
        chat: [...state.chat, { id: `ev-test-${n}`, kind: 'event', text: eventText }],
      }
    }
    case 'editPrompt': {
      const prompt = state.prompt.map((b, i) => (i === action.block ? { ...b, text: action.text } : b))
      const edited = JSON.stringify(prompt) !== JSON.stringify(state.livePrompt)
      return {
        ...state,
        prompt,
        undo: null,
        // One hand-edit change for the prompt; it disappears if the text goes back to the live version.
        pending: [
          ...state.pending.filter((p) => p.id !== 'p-prompt-edit'),
          ...(edited ? [{ id: 'p-prompt-edit', target: 'behavior' as const, title: 'Behavior', detail: 'prompt edited by hand' }] : []),
        ],
      }
    }
    case 'resetSample':
      return { ...state, testBookings: [] }
    case 'publish': {
      // Freezes the current version and moves the prod tag to it. Not undoable from a toast:
      // numbers may already follow prod. Roll back lives in Versions (flow 17).
      if (state.pending.length || isPublished(state)) return state
      const first = state.published.length === 0
      return {
        ...state,
        undo: null,
        published: [...state.published, { version: state.version, name: action.name }],
        chat: [
          ...state.chat,
          { id: `ev-pub-${state.version}`, kind: 'event', text: `Published v${state.version}${first ? ' · tagged prod' : ' · prod moved to this version'}` },
        ],
      }
    }
    case 'connectNumber': {
      const v = versionForNumber(state, action.number.target)
      return {
        ...state,
        numbers: [...state.numbers.filter((n) => n.number !== action.number.number), action.number],
        chat: [
          ...state.chat,
          { id: `ev-num-${action.number.number}-${state.chat.length}`, kind: 'event', text: `${action.number.number} · ${targetLabel(action.number.target)} → answers with v${v}` },
        ],
      }
    }
    case 'ask':
      return {
        ...state,
        chat: [
          ...state.chat,
          { id: `${action.id}-you`, kind: 'you', text: action.text },
          { id: `${action.id}-ai`, kind: 'conductor', title: 'Conductor · working…', text: '', working: true },
        ],
      }
    case 'askResolved': {
      const short = action.text.length > 48 ? `${action.text.slice(0, 46).trimEnd()}…` : action.text
      return {
        ...state,
        undo: null,
        chat: state.chat.map((c) =>
          c.id === `${action.id}-ai`
            ? {
                id: c.id,
                kind: 'conductor',
                title: 'Conductor · updated Behavior',
                text: `I added this to the prompt: “${action.text}”. It's a pending change. Apply to include it in the version you test.`,
              }
            : c
        ),
        // One Ask-driven change at a time, replacing the previous one.
        pending: [
          ...state.pending.filter((p) => !p.fromAsk),
          { id: `p-${action.id}`, target: 'behavior', title: 'Behavior', detail: `“${short}”`, fromAsk: true },
        ],
      }
    }
  }
}

/* ── Selectors ─────────────────────────────────────────────────── */

export const isPending = (s: AgentState) => s.pending.length > 0

export const latestPublished = (s: AgentState) => s.published[s.published.length - 1] ?? null
/** The current version is the published one. */
export const isPublished = (s: AgentState) => latestPublished(s)?.version === s.version

/** prod and "latest published" both resolve to the newest published version until roll back exists. */
export function versionForNumber(s: AgentState, t: NumberTarget) {
  return t.kind === 'pinned' ? t.version : latestPublished(s)?.version ?? s.version
}
export const targetLabel = (t: NumberTarget) =>
  t.kind === 'prod' ? 'follows prod' : t.kind === 'latest' ? 'follows latest published' : `pinned to v${t.version}`

/** "Live" only once a number points at a published version (R-05: Publish is not go-live). */
export const liveNumbers = (s: AgentState) => s.numbers

export function statusOf(s: AgentState): { label: string; tone: 'brand' | 'positive' } {
  const pub = latestPublished(s)
  if (isPending(s)) return { label: pub ? `Published v${pub.version} · changes pending` : 'Changes pending', tone: 'brand' }
  if (pub && pub.version === s.version)
    return s.numbers.length ? { label: `Live · v${s.version}`, tone: 'positive' } : { label: `Published · v${s.version}`, tone: 'positive' }
  return { label: `Ready to test · v${s.version}`, tone: 'positive' }
}

/** Before you publish (D2): the three checks. Pending and the sample calendar block; the test only warns. */
export function publishChecks(s: AgentState) {
  const last = lastTest(s)
  const passedHere = [...s.tests].reverse().find((t) => t.version === s.version && t.outcome === 'passed') ?? null
  return {
    pending: isPending(s),
    realCalendar: hasRealCalendar(s),
    sample: s.calendar?.kind === 'sample',
    passedHere,
    last,
    /** Last run on this version didn't pass, or none ran. */
    testOk: !!passedHere && last?.n === passedHere.n,
  }
}

/** The one primary action for this state — the "one filled button" rule lives here. */
export function nextStepOf(s: AgentState): 'apply' | 'connect' | 'test' | 'publish' {
  if (isPending(s)) return 'apply'
  if (!s.calendar) return 'connect'
  if (hasRealCalendar(s) && !isPublished(s) && publishChecks(s).testOk) return 'publish'
  return 'test'
}

export const hasRealCalendar = (s: AgentState) => s.calendar?.kind === 'provider'
export const lastTest = (s: AgentState) => s.tests[s.tests.length - 1] ?? null
export const testByNumber = (s: AgentState, n: number | null) => (n == null ? null : s.tests.find((t) => t.n === n) ?? null)

export const changedSections = (s: AgentState) => new Set(s.pending.map((p) => p.target))

export const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`
