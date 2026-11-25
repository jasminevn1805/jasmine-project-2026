// Real content from the case study (walkthrough 2026-11-16, wireframe c).
// Kept out of components so every screen state (a–w) can reuse it.
import type { PendingChange, SectionId } from './model'
import type { PromptBlock } from './sampleCalendar'

export const agent = {
  name: 'Maple Grove Dental · Booking',
  voice: 'Cimo',
  language: 'English (US)',
  welcome: '“Hi, this is Maple Grove Dental. Can I have your name first?”',
  model: 'GPT-4.1',
}

export const usage = {
  perMinute: '$0.13/min',
  latency: '800–1,000 ms',
  tokens: '1.3k tokens',
  breakdown: [
    { label: 'Voice · Cimo', value: '$0.07' },
    { label: 'LLM · 1.3k tokens per turn', value: '$0.05' },
    { label: 'Telephony · Retell number', value: '$0.01' },
  ],
}

/** Long-content case: the first paragraph is from the research; the rest extends it. */
export const prompt: PromptBlock[] = [
  {
    text: 'You are the booking assistant for Maple Grove Dental in Calgary. Greet the caller, then ask for their full name. Offer a cleaning, a check-up or an emergency visit. Cleanings take 60 minutes. Offer times from 7:30 am to 5 pm. Check availability first, and offer at most 3 slots. Never give medical advice. If the caller is in pain, transfer to the front desk.',
  },
  {
    heading: 'Who you are talking to',
    text: 'Most callers are existing patients booking their six-month cleaning. Some are new patients who found the clinic online. A few are calling about pain, a broken tooth or swelling. Speak warmly and simply. Many callers are busy parents calling between other tasks, so keep each reply short and get to the booking quickly.',
  },
  {
    heading: 'Booking a cleaning or check-up',
    text: 'Ask whether they are a new or existing patient. For existing patients, confirm their date of birth to find their file. For new patients, also ask for an email address so the front desk can send the intake form. Ask which days suit them, then use Check availability for those days. Offer no more than 3 slots, earliest first. When the caller picks one, use Book appointment, then read the date, time and dentist back to them and confirm.',
  },
  {
    text: 'If no slot suits them in the next two weeks, offer to add them to the cancellation list and tell them the front desk will call if a slot opens up. Do not promise a specific dentist unless the caller asks and that dentist has availability.',
  },
  {
    heading: 'Emergencies and pain',
    text: 'If the caller mentions pain, swelling, bleeding that will not stop, or a knocked-out tooth, do not try to book a regular slot. Tell them you are connecting them to the front desk now, and use Transfer to front desk. Outside opening hours, tell them to go to the nearest emergency room if the pain is severe or they have trouble breathing or swallowing.',
  },
  {
    heading: 'Questions about the clinic',
    text: 'Answer questions about services, prices, insurance and directions only from the clinic FAQ and the website. If the answer is not there, say you are not sure and offer to have the front desk call back. Never guess prices or what insurance will cover.',
  },
  {
    heading: 'Rules',
    text: "Never give medical advice or a diagnosis. Never share another patient's details. Say times and phone numbers the way people say them out loud. If the caller wants to cancel or move an appointment, collect their name and date of birth, then transfer to the front desk. End the call politely once the booking is confirmed and the caller has no other questions.",
  },
]

export const promptWordCount = prompt
  .map((p) => `${p.heading ?? ''} ${p.text}`)
  .join(' ')
  .trim()
  .split(/\s+/).length

/** 4th rule is assumed — the board only shows "+1". */
export const handbook = ['Confirm details back', 'Say numbers naturally', 'Stay on topic', 'Keep replies short']

export const knowledge = [
  { kind: 'file' as const, name: 'clinic-faq.pdf', meta: '6 pages' },
  { kind: 'site' as const, name: 'maplegrovedental.com', meta: '14 pages' },
]

export const actions = [
  { id: 'check', name: 'Check availability', needsCalendar: true },
  { id: 'book', name: 'Book appointment', needsCalendar: true },
  { id: 'transfer', name: 'Transfer to front desk', needsCalendar: false },
  { id: 'end', name: 'End call', needsCalendar: false },
]

export const advanced = [
  { name: 'Voice & speech', value: 'Defaults on' },
  { name: 'Call handling', value: 'Defaults on' },
  { name: 'After the call', value: 'Defaults on' },
  { name: 'Integrations · MCPs, calendar connections', value: 'None yet' },
  { name: 'Model', value: 'GPT-4.1' },
]

export const buildRequest =
  'A booking assistant for Maple Grove Dental in Calgary. It books cleanings and check-ups, and transfers emergencies to the front desk.'

export const buildOutput: { section: string; detail: string }[] = [
  { section: 'Summary', detail: 'name, voice Cimo, English (US), welcome' },
  { section: 'Behavior', detail: `prompt, ${promptWordCount.toLocaleString('en-US')} words · 4 handbook rules on` },
  { section: 'Knowledge', detail: 'clinic-faq.pdf, maplegrovedental.com' },
  { section: 'Actions', detail: '4 added: check, book, transfer, end call' },
  { section: 'Model', detail: 'GPT-4.1' },
]

export const initialPending: PendingChange[] = [
  { id: 'p-summary', target: 'summary', title: 'Summary', detail: 'new' },
  { id: 'p-behavior', target: 'behavior', title: 'Behavior', detail: 'new prompt and handbook' },
  { id: 'p-knowledge', target: 'knowledge', title: 'Knowledge', detail: '2 sources added' },
  { id: 'p-actions', target: 'actions', title: 'Actions', detail: '4 added, 2 need a connection' },
]

export const sectionOrder: SectionId[] = ['summary', 'behavior', 'knowledge', 'actions', 'advanced']

/** D1 · Connect calendar — from the case-study board. */
export const calendarOptions = [
  { id: 'Cal.com', title: 'Cal.com', detail: 'Sign in, then pick an event type' },
  { id: 'Calendly', title: 'Calendly', detail: 'Sign in, then pick an event type' },
  { id: 'practice', title: 'Practice software (e.g. Dentrix, Jane App)', detail: 'Connects through Integrations. Needs a developer or partner.' },
] as const

export const eventTypes = ['Cleaning · 60 min', 'Check-up · 30 min', 'Emergency visit · 30 min']

/** Fictional account shown after the simulated sign-in. */
export const providerAccount = 'front@maplegrovedental.com'

/** Workspace phone numbers (fictional, 555 range). Numbers choose which version they run. */
export const workspaceNumbers = [
  { number: '+1 403 555 0100', label: 'Front desk', detail: 'Not used by an agent' },
  { number: '+1 403 555 0199', label: 'After hours', detail: 'Not used by an agent' },
]
