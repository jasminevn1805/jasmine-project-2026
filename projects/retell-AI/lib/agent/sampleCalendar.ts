// Sample calendar + scripted test call for branch 3b (wireframes g, w).
// Pure data and functions — no React. The week is "next week" relative to the
// walkthrough (caller asks for "a cleaning next week").
import type { SectionId } from './model'

export interface Booking {
  day: number // 0 = Mon … 4 = Fri
  start: number // decimal hours, e.g. 14.5 = 2:30 pm
  end: number
  label?: string
}

export const sampleWeek = {
  label: 'Nov 30 – Dec 4',
  days: [
    { short: 'Mon', long: 'Monday', date: 'November 30' },
    { short: 'Tue', long: 'Tuesday', date: 'December 1' },
    { short: 'Wed', long: 'Wednesday', date: 'December 2' },
    { short: 'Thu', long: 'Thursday', date: 'December 3' },
    { short: 'Fri', long: 'Friday', date: 'December 4' },
  ],
  /** Clinic hours from the prompt: 7:30 am – 5 pm. Grid shows 7 am – 5 pm. */
  open: 7,
  close: 17,
}

/** Grey: bookings already on the sample calendar ("some slots already booked"). */
export const sampleBookings: Booking[] = [
  { day: 0, start: 9, end: 10 },
  { day: 0, start: 13, end: 14 },
  { day: 1, start: 10, end: 11 },
  { day: 1, start: 15, end: 16 },
  { day: 2, start: 9, end: 10.5 },
  { day: 2, start: 11, end: 12 },
  { day: 3, start: 13, end: 14.5 },
  { day: 4, start: 8, end: 9 },
  { day: 4, start: 10, end: 12 },
]

/** Clinic hours (Knowledge + prompt agree): Mon–Fri 7:30 am – 5 pm. These are trusted facts, never the failure. */
export const CLINIC_OPEN = 7.5
export const CLINIC_CLOSE = 17

/** Slots Check availability offers, in order: earliest first (Tuesday at opening time). */
const candidates = (offerFrom: number): { day: number; start: number }[] => [
  { day: 1, start: offerFrom },
  { day: 2, start: 14 },
  { day: 3, start: 9 },
  { day: 3, start: 10 },
  { day: 4, start: 14 },
  { day: 4, start: 15 },
]

const CLEANING_HOURS = 1

export const formatTime = (h: number) => {
  const hour = Math.floor(h)
  const min = Math.round((h - hour) * 60)
  const h12 = ((hour + 11) % 12) + 1
  return `${h12}${min ? `:${String(min).padStart(2, '0')}` : ''} ${hour < 12 ? 'am' : 'pm'}`
}

const overlaps = (a: Booking, b: Booking) => a.day === b.day && a.start < b.end && b.start < a.end

export function freeSlots(taken: Booking[], offerFrom: number = CLINIC_OPEN): Booking[] {
  return candidates(offerFrom)
    .map((c) => ({ ...c, end: c.start + CLEANING_HOURS }))
    .filter((slot) => ![...sampleBookings, ...taken].some((b) => overlaps(slot, b)))
}

export interface ScriptLine {
  /** `skip` = a product marker in the transcript, not speech (flow 14). */
  who: 'agent' | 'caller' | 'skip'
  text: string
  /** Agent replies link back to the part of the spec that produced them;
   *  `focus` = the exact prompt sentence to highlight (flow 7). */
  why?: { section: SectionId; label: string; focus?: string }
  /** Reaching this line means the booking was made. */
  books?: boolean
  /** The line where booking was refused (the failure's key moment). */
  fails?: boolean
  /** Seconds from the start of the test (text chats use real time). */
  at?: number
}

/** Seconds between transcript lines in the simulated call (matches the player). */
export const LINE_SECONDS = 1.6

export const formatClock = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.round(sec) % 60).padStart(2, '0')}`

/**
 * The line that decides the outcome — shown as the "key moment" in Test history and
 * highlighted in the transcript: the booking, the skipped step, or the last line heard.
 */
export function keyLineIndex(lines: ScriptLine[]): number {
  const booked = lines.findIndex((l) => l.books)
  if (booked >= 0) return booked
  const failed = lines.findIndex((l) => l.fails)
  if (failed >= 0) return failed
  const skipped = lines.findIndex((l) => l.who === 'skip')
  if (skipped >= 0) return skipped
  return lines.length - 1
}

/* ── Prompt rules the test reads ─────────────────────────────── */
export interface PromptBlock {
  heading?: string
  text: string
}

/** A prompt sentence the test depends on, with where it is ("line 2"). */
export interface PromptLine {
  block: number
  sentence: string
  /** 1-based sentence number within its paragraph. */
  line: number
}

/**
 * The seeded failure (flows 6/7): Book appointment REQUIRES the caller's name and phone number —
 * that's defined by the booking system, so it's right. The prompt Conductor wrote says
 * "Greet the caller, then ask for their full name." — it never asks for the phone number.
 */
export interface PromptRules {
  /** The sentence that tells the agent what to collect from the caller. */
  collect: PromptLine
  asksPhone: boolean
}

export const splitSentences = (text: string) => text.match(/[^.!?]+[.!?]+/g)?.map((s) => s.trim()) ?? [text]

export function readPromptRules(prompt: PromptBlock[]): PromptRules {
  for (let b = 0; b < prompt.length; b++) {
    const sentences = splitSentences(prompt[b].text)
    const i = sentences.findIndex((s) => /ask for their/i.test(s))
    if (i >= 0) return { collect: { block: b, sentence: sentences[i], line: i + 1 }, asksPhone: /phone/i.test(sentences[i]) }
  }
  return { collect: { block: 0, sentence: '', line: 0 }, asksPhone: false }
}

/** After an edit, find the current version of a sentence by its opening words (e.g. "Greet the caller, …"). */
export function matchSentence(prompt: PromptBlock[], old: string): string | null {
  if (prompt.some((b) => b.text.includes(old))) return old
  const lead = old.split(/\s+/).slice(0, 3).join(' ').toLowerCase()
  return prompt.flatMap((b) => splitSentences(b.text)).find((x) => x.toLowerCase().startsWith(lead)) ?? null
}

/** Why a test failed, in plain words, pointing at the spec (wireframe i). */
export interface FailCause {
  section: SectionId
  /** Exact text to highlight in the spec. */
  focus: string
  /** "Behavior › Prompt · line 2 doesn't ask for a phone number" */
  where: string
  /** Plain-words reason shown on the result card. */
  reason: string
}

function missingPhoneCause(rules: PromptRules): FailCause {
  return {
    section: 'behavior',
    focus: rules.collect.sentence,
    where: `Behavior › Prompt · line ${rules.collect.line} doesn't ask for a phone number`,
    reason: "Book appointment needs the caller's phone number, but the agent never asked for it.",
  }
}

/** The reply where the agent should have asked for the number links to the collect line (flow 7). */
const collectWhy = (rules: PromptRules) => ({
  section: 'behavior' as const,
  label: `Prompt · line ${rules.collect.line}: "${rules.collect.sentence}"`,
  focus: rules.collect.sentence,
})

const refusedLine = (): ScriptLine => ({
  who: 'agent',
  text: "I'm sorry, I couldn't complete the booking. Could you call back a little later to finish it?",
  why: { section: 'actions', label: 'Book appointment · refused: missing phone number' },
  fails: true,
})

/**
 * Conversation-only test (no calendar yet, flow 14 / wireframe d "Booking steps are skipped
 * for now"). Same opening as the full test; at the booking step the agent can't check
 * availability — the board's own line — and takes a callback number instead.
 */
export function buildConversationScript(): { lines: ScriptLine[]; booking: null } {
  return {
    booking: null,
    lines: [
      { who: 'agent', text: 'Hi, this is Maple Grove Dental. Can I have your name first?', why: { section: 'summary', label: 'Welcome message' } },
      { who: 'caller', text: "Sure, it's Dana Lee. I'd like a cleaning next week." },
      { who: 'agent', text: 'Thanks, Dana. Are you an existing patient?', why: { section: 'behavior', label: 'Prompt · Booking a cleaning' } },
      { who: 'caller', text: "Yes, I've been in before." },
      { who: 'skip', text: "Booking step skipped · Check availability isn't connected" },
      {
        who: 'agent',
        text: "I can't check availability right now. Can I take your number so the front desk can call you back?",
        why: { section: 'actions', label: 'Check availability · not connected' },
      },
      { who: 'caller', text: "Okay, it's 403 555 0142." },
      {
        who: 'agent',
        text: "Thanks, Dana. The front desk will call you at 403 555 0142 to book your cleaning. Anything else?",
        why: { section: 'behavior', label: 'Prompt · Booking a cleaning' },
      },
      { who: 'caller', text: "No, that's all. Thanks!" },
      { who: 'agent', text: 'Thanks for calling Maple Grove Dental. Have a great day, Dana.', why: { section: 'actions', label: 'End call' } },
    ],
  }
}

/**
 * The test call from wireframe g: offers the first three free slots, the caller picks the first
 * ("Tuesday at 7:30 works."). If the prompt never asks for a phone number, Book appointment
 * refuses the booking and the test fails (flow 6/7 seed). Once the prompt asks, it passes.
 */
export function buildScript(
  taken: Booking[],
  rules: PromptRules
): { lines: ScriptLine[]; booking: Booking | null; cause: FailCause | null } {
  const offers = freeSlots(taken).slice(0, 3)
  const pick = offers[0] ?? null
  const say = (b: Booking) => `${sampleWeek.days[b.day].long} at ${formatTime(b.start)}`
  const list = offers.map(say)
  const offerText =
    list.length > 1 ? `${list.slice(0, -1).join(', ')}, or ${list[list.length - 1]}` : list[0] ?? 'no free slots this week'

  const lines: ScriptLine[] = [
    { who: 'agent', text: 'Hi, this is Maple Grove Dental. Can I have your name first?', why: { section: 'summary', label: 'Welcome message' } },
    { who: 'caller', text: "Sure, it's Dana Lee. I'd like a cleaning next week." },
    ...(rules.asksPhone
      ? ([
          { who: 'agent', text: "Thanks, Dana. What's the best phone number to reach you?", why: collectWhy(rules) },
          { who: 'caller', text: "It's 403 555 0142." },
          { who: 'agent', text: 'Got it. Are you an existing patient?', why: { section: 'behavior', label: 'Prompt · Booking a cleaning' } },
        ] as ScriptLine[])
      : ([
          // The moment it should have asked for the number — "why ›" points at the collect line.
          { who: 'agent', text: 'Thanks, Dana. Are you an existing patient?', why: collectWhy(rules) },
        ] as ScriptLine[])),
    { who: 'caller', text: "Yes, I've been in before." },
    { who: 'agent', text: `Great. I have ${offerText}. Which works best?`, why: { section: 'actions', label: 'Check availability · sample calendar' } },
  ]
  if (!pick) return { lines, booking: null, cause: null }
  lines.push({ who: 'caller', text: `${say(pick)} works.` })
  if (!rules.asksPhone) {
    lines.push(
      refusedLine(),
      { who: 'caller', text: "Oh, okay. I'll call back later." },
      { who: 'agent', text: 'Thanks for calling Maple Grove Dental. Have a great day, Dana.', why: { section: 'actions', label: 'End call' } }
    )
    return { lines, booking: null, cause: missingPhoneCause(rules) }
  }
  lines.push(
    {
      who: 'agent',
      text: `You're booked for a cleaning on ${sampleWeek.days[pick.day].long}, ${sampleWeek.days[pick.day].date} at ${formatTime(pick.start)}. Anything else I can help with?`,
      why: { section: 'actions', label: 'Book appointment · sample calendar' },
      books: true,
    },
    { who: 'caller', text: "No, that's all. Thanks!" },
    { who: 'agent', text: 'Thanks for calling Maple Grove Dental. Have a great day, Dana.', why: { section: 'actions', label: 'End call' } }
  )
  return { lines, booking: { ...pick, label: 'Dana Lee · test' }, cause: null }
}

/* ── Text chat agent (Text test mode) ──────────────────────────────────────
   The builder types as the caller; the agent answers what was actually typed:
   it picks up the caller's name, offers real free slots and books the one the
   caller names. Same steps and "why ›" sources as the audio script. */
export type TestMode = 'audio' | 'text'

const NAME_RE = /(?:it's|it is|i'm|i am|my name is|this is|name's)\s+([a-z][a-z'-]*(?:\s+[a-z][a-z'-]*)?)/i
const titleCase = (s: string) => s.replace(/\b[a-z]/g, (c) => c.toUpperCase())

export function extractName(text: string): string | null {
  const m = text.match(NAME_RE)
  if (m) return titleCase(m[1].replace(/\s+(and|i|i'd|id)\b.*$/i, '').trim())
  const words = text.trim().replace(/[.!?,]/g, '').split(/\s+/)
  if (words.length > 0 && words.length <= 2 && /^[a-z]/i.test(words[0])) return titleCase(words.join(' '))
  return null
}

const PHONE_RE = /(\+?\d[\d\s().-]{6,}\d)/

export interface TextAgent {
  /** Agent lines to show after the caller's message (may include a `skip` marker). */
  reply: (callerText: string) => ScriptLine[]
  opening: ScriptLine
  done: () => boolean
  booking: () => Booking | null
  /** Set when Book appointment refused the booking (flow 6/7 seed: no phone number). */
  cause: () => FailCause | null
  /** A suggested next message for the caller, to speed up testing. */
  suggestion: () => string | null
}

export function createTextAgent(hasCalendar: boolean, taken: Booking[], rules: PromptRules): TextAgent {
  let step = 0
  let name: string | null = null
  let finished = false
  let booked: Booking | null = null
  const offers = hasCalendar ? freeSlots(taken).slice(0, 3) : []
  let phone: string | null = null
  let askedPhone = false
  let cause: FailCause | null = null
  const say = (b: Booking) => `${sampleWeek.days[b.day].long} at ${formatTime(b.start)}`
  const list = offers.map(say)
  const offerText = list.length > 1 ? `${list.slice(0, -1).join(', ')}, or ${list[list.length - 1]}` : list[0] ?? ''
  const hi = () => (name ? `, ${name.split(' ')[0]}` : '')

  const close = (): ScriptLine => {
    finished = true
    return { who: 'agent', text: `Thanks for calling Maple Grove Dental. Have a great day${hi()}.`, why: { section: 'actions', label: 'End call' } }
  }

  const matchSlot = (text: string) => {
    const t = text.toLowerCase()
    const ordinal = ['first', 'second', 'third'].findIndex((w) => t.includes(w))
    if (ordinal >= 0 && offers[ordinal]) return offers[ordinal]
    return offers.find((b) => t.includes(sampleWeek.days[b.day].long.toLowerCase()) || t.includes(sampleWeek.days[b.day].short.toLowerCase())) ?? null
  }

  return {
    opening: { who: 'agent', text: 'Hi, this is Maple Grove Dental. Can I have your name first?', why: { section: 'summary', label: 'Welcome message' } },
    done: () => finished,
    booking: () => booked,
    cause: () => cause,
    suggestion: () =>
      finished
        ? null
        : askedPhone && !phone
          ? "It's 403 555 0142."
          : [
            "Sure, it's Dana Lee. I'd like a cleaning next week.",
            "Yes, I've been in before.",
            hasCalendar && offers[0] ? `${say(offers[0])} works.` : "Okay, it's 403 555 0142.",
            "No, that's all. Thanks!",
          ][step] ?? null,
    reply(text) {
      if (finished) return []
      if (/\b(bye|that's all|thats all|no thanks|nothing else)\b/i.test(text) && step >= 2) return [close()]
      // A number given at any point counts (the caller may volunteer it).
      phone = phone ?? text.match(PHONE_RE)?.[1]?.trim() ?? null
      if (askedPhone && step === 1 && !phone)
        return [{ who: 'agent', text: 'Sorry, what number can we reach you at?', why: collectWhy(rules) }]
      if (askedPhone && step === 1 && phone && !finished) {
        askedPhone = false
        return [{ who: 'agent', text: 'Got it. Are you an existing patient?', why: { section: 'behavior', label: 'Prompt · Booking a cleaning' } }]
      }
      switch (step) {
        case 0: {
          name = extractName(text)
          step = 1
          if (rules.asksPhone && !phone) {
            askedPhone = true
            return [{ who: 'agent', text: `Thanks${hi()}. What's the best phone number to reach you?`, why: collectWhy(rules) }]
          }
          // Prompt doesn't ask for a phone number — "why ›" here points at that line (flow 7).
          return [{ who: 'agent', text: `Thanks${hi()}. Are you an existing patient?`, why: collectWhy(rules) }]
        }
        case 1: {
          step = 2
          if (!hasCalendar)
            return [
              { who: 'skip', text: "Booking step skipped · Check availability isn't connected" },
              {
                who: 'agent',
                text: "I can't check availability right now. Can I take your number so the front desk can call you back?",
                why: { section: 'actions', label: 'Check availability · not connected' },
              },
            ]
          if (!offers.length) return [{ who: 'agent', text: "I don't see any free cleaning slots next week. Can I add you to the cancellation list?", why: { section: 'behavior', label: 'Prompt · Booking a cleaning' } }]
          return [{ who: 'agent', text: `Great. I have ${offerText}. Which works best?`, why: { section: 'actions', label: 'Check availability · sample calendar' } }]
        }
        case 2: {
          if (!hasCalendar) {
            step = 3
            return [
              {
                who: 'agent',
                text: `Thanks${hi()}. The front desk will call you${phone ? ` at ${phone}` : ''} to book your cleaning. Anything else?`,
                why: { section: 'behavior', label: 'Prompt · Booking a cleaning' },
              },
            ]
          }
          const pick = matchSlot(text)
          if (!pick)
            return [{ who: 'agent', text: `Sorry, which of these works for you: ${offerText}?`, why: { section: 'actions', label: 'Check availability · sample calendar' } }]
          if (!phone) {
            cause = missingPhoneCause(rules)
            step = 3
            return [refusedLine()]
          }
          booked = { ...pick, label: `${name ?? 'Caller'} · test` }
          step = 3
          return [
            {
              who: 'agent',
              text: `You're booked for a cleaning on ${sampleWeek.days[pick.day].long}, ${sampleWeek.days[pick.day].date} at ${formatTime(pick.start)}. Anything else I can help with?`,
              why: { section: 'actions', label: 'Book appointment · sample calendar' },
              books: true,
            },
          ]
        }
        default:
          return [close()]
      }
    },
  }
}
