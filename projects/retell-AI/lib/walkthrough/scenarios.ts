// Walkthrough scenarios: test cases attached to the prototype.
// One prototype: choosing a scenario loads a save point; the UI stays fully live.
import { isPublished, lastTest, type AgentState } from '@/lib/agent/model'
import type { SavepointId } from './savepoints'

/** UI state the panel can see, beyond the agent itself. */
export interface WalkUi {
  tab: 'build' | 'test'
  calendarOpen: boolean
  d2Open: boolean
  blockedOpen: boolean
  numberOpen: boolean
  editing: number | null
}

export interface Step {
  /** What to do. */
  action: string
  /** What should happen. */
  expect: string
  /** Screen and dialog IDs from the board (Spec details). */
  screens: string
  /** Ticks the step on its own. No check = the viewer marks it done. */
  check?: (s: AgentState, ui: WalkUi) => boolean
}

export interface Chapter {
  id: string
  title: string
  /** Test mode shows only this: the task as a goal, no steps. */
  goal: string
  start: { savepoint: SavepointId; tab?: 'build' | 'test'; numberOpen?: boolean }
  steps: Step[]
  rule?: string
}

export interface Scenario {
  id: string
  title: string
  kind: 'journey' | 'branch'
  branchesFrom?: string
  flows: string
  chapters: Chapter[]
}

const passedNow = (s: AgentState) => lastTest(s)?.outcome === 'passed' && lastTest(s)?.version === s.version

export const journey: Scenario = {
  id: 'journey',
  title: 'Core flow',
  kind: 'journey',
  flows: 'Flows 1–5, 6–7',
  chapters: [
    {
      id: 'build',
      title: 'Build',
      goal: 'Keep what Conductor built for your clinic.',
      start: { savepoint: 'built' },
      steps: [
        {
          action: 'Review the 4 pending changes, then click Apply.',
          expect: 'The changes become v1. The status says Ready to test · v1, and Actions asks for a calendar.',
          screens: 'c → d',
          check: (s) => s.version >= 1 && s.pending.length === 0,
        },
      ],
      rule: 'Nothing Conductor builds is live until you apply it.',
    },
    {
      id: 'connect',
      title: 'Connect calendar',
      goal: 'Let the agent check availability and book appointments.',
      start: { savepoint: 'applied' },
      steps: [
        {
          action: 'In Actions, click Connect calendar.',
          expect: 'D1 opens and asks where you book appointments.',
          screens: 'd → D1',
          check: (s, ui) => ui.calendarOpen || !!s.calendar,
        },
        {
          action: 'Pick Cal.com → Continue → Sign in to Cal.com → choose Cleaning · 60 min → Connect.',
          expect: 'Cal.com is connected as v2, and the Test tab opens.',
          screens: 'D1 → e',
          check: (s) => s.calendar?.kind === 'provider',
        },
      ],
    },
    {
      id: 'test',
      title: 'Test',
      goal: 'Check that the agent can book a cleaning.',
      start: { savepoint: 'connected', tab: 'test' },
      steps: [
        {
          action: 'Run an audio test and listen to the call.',
          expect: 'The test fails. The result names the cause in plain words and links to the prompt line to fix.',
          screens: 'f → g → i',
          check: (s) => !!lastTest(s),
        },
      ],
      rule: 'Nothing fails silently: every failed result names its cause.',
    },
    {
      id: 'fix',
      title: 'Fix and re-test',
      goal: 'Fix what made the test fail, then test again.',
      start: { savepoint: 'failed', tab: 'test' },
      steps: [
        {
          action: 'On the failed result, click Fix this.',
          expect: 'The spec scrolls to the prompt line and opens it for editing.',
          screens: 'i → m',
          check: (s, ui) => ui.editing !== null || s.pending.some((p) => p.id === 'p-prompt-edit'),
        },
        {
          action: 'Make the line also ask for the phone number, then Save change.',
          expect: 'The edit is saved as a pending change.',
          screens: 'm → c',
          check: (s) => s.pending.some((p) => p.id === 'p-prompt-edit'),
        },
        {
          action: 'Click Apply your fix and re-run this test.',
          expect: 'The fix applies as v3 and the same test passes. History keeps both runs.',
          screens: 'c → g → h · v',
          check: (s) => passedNow(s),
        },
      ],
    },
    {
      id: 'publish',
      title: 'Publish',
      goal: 'Freeze this version so it can take calls.',
      start: { savepoint: 'passed', tab: 'test' },
      steps: [
        {
          action: 'Click Publish v3 in the top bar.',
          expect: 'D2 opens: version name, what’s in v3, 3 of 3 checks ready, and where calls will go.',
          screens: 'h → D2',
          check: (s, ui) => ui.d2Open || isPublished(s),
        },
        {
          action: 'Keep the name and “Then connect a phone number”, then Publish.',
          expect: 'v3 is published and tagged prod. D5 opens next, as an optional step.',
          screens: 'D2 → j',
          check: (s) => isPublished(s),
        },
      ],
      rule: 'Publish freezes a version. It never needs a phone number.',
    },
    {
      id: 'number',
      title: 'Connect a number',
      goal: 'Put the agent on the clinic’s front desk line.',
      start: { savepoint: 'published', tab: 'test', numberOpen: true },
      steps: [
        {
          action: 'Pick +1 403 555 0100 · Front desk, keep Follows prod, then Connect number.',
          expect: 'The status changes to Live · v3.',
          screens: 'D5 → u',
          check: (s) => s.numbers.length > 0,
        },
      ],
      rule: 'A number points to the prod tag, latest published, or one pinned version.',
    },
    {
      id: 'live',
      title: 'Live',
      goal: 'See which version answers calls.',
      start: { savepoint: 'live', tab: 'test' },
      steps: [
        {
          action: 'Open Versions in the top bar.',
          expect: 'v3 carries the prod tag and shows +1 403 555 0100 · follows prod. v1 and v2 say Not published.',
          screens: 'u · Versions menu',
        },
      ],
    },
  ],
}

export const branches: Scenario[] = [
  {
    id: 'TC-02',
    title: 'Practice software',
    kind: 'branch',
    branchesFrom: 'Connect calendar',
    flows: 'Flows 3b, 16',
    chapters: [
      {
        id: 'sample',
        title: 'Practice software',
        goal: 'Test the agent even though your clinic books in practice software.',
        start: { savepoint: 'applied' },
        steps: [
          {
            action: 'Connect calendar → Practice software → Continue → Use sample calendar for now.',
            expect: 'The sample calendar is on as v2, test only. The trial doesn’t dead-end.',
            screens: 'D1 → w',
            check: (s) => s.calendar?.kind === 'sample',
          },
          {
            action: 'Run a test.',
            expect: 'The call books into the sample calendar, with your clinic hours.',
            screens: 'g → h',
            check: (s) => !!lastTest(s) && s.calendar?.kind === 'sample',
          },
          {
            action: 'Click Publish.',
            expect: 'D2.1 blocks publishing until a real calendar is connected, and says why.',
            screens: 'D2.1',
            check: (_, ui) => ui.blockedOpen,
          },
        ],
        rule: 'No real caller ever books into a sample calendar.',
      },
    ],
  },
  {
    id: 'TC-04',
    title: 'Audio vs Text',
    kind: 'branch',
    branchesFrom: 'Test',
    flows: 'Flow 4',
    chapters: [
      {
        id: 'modes',
        title: 'Audio vs Text',
        goal: 'Try the agent as a phone call and as a chat.',
        start: { savepoint: 'connected', tab: 'test' },
        steps: [
          {
            action: 'Run an Audio test.',
            expect: 'A spoken call: the transcript fills in as you go.',
            screens: 'g',
            check: (s) => s.tests.some((t) => t.mode === 'audio'),
          },
          {
            action: 'Switch to Text and type as the caller.',
            expect: 'A real chat: the agent answers what you write. History shows each test’s type.',
            screens: 'g (Text) · v',
            check: (s) => s.tests.some((t) => t.mode === 'text'),
          },
        ],
      },
    ],
  },
  {
    id: 'TC-07',
    title: 'Publish before the test passes',
    kind: 'branch',
    branchesFrom: 'Test',
    flows: 'Flow 16',
    chapters: [
      {
        id: 'warn',
        title: 'Publish before the test passes',
        goal: 'Try to publish a version whose last test failed.',
        start: { savepoint: 'failed', tab: 'test' },
        steps: [
          {
            action: 'Click Publish in the top bar.',
            expect: 'D2.2 warns that the last test on v2 didn’t pass. Run test first is the primary action; Publish anyway stays quiet.',
            screens: 'D2.2',
            check: (_, ui) => ui.d2Open,
          },
          {
            action: 'Choose Run test first.',
            expect: 'The dialog closes and the Test tab is ready to run.',
            screens: 'D2.2 → f',
            check: (_, ui) => !ui.d2Open && ui.tab === 'test',
          },
        ],
        rule: 'A failed test warns, it doesn’t block. Only a sample calendar blocks publishing.',
      },
    ],
  },
  {
    id: 'TC-08',
    title: 'Skip the number',
    kind: 'branch',
    branchesFrom: 'Publish',
    flows: 'Flow 5',
    chapters: [
      {
        id: 'skip',
        title: 'Skip the number',
        goal: 'Publish without putting the agent on a phone line yet.',
        start: { savepoint: 'passed', tab: 'test' },
        steps: [
          {
            action: 'Publish v3.',
            expect: 'v3 is published and D5 offers to connect a number.',
            screens: 'D2 → D5',
            check: (s) => isPublished(s),
          },
          {
            action: 'Click Skip for now.',
            expect: 'The status says Published · v3, with no warning. Web calls, chat and the API can use it.',
            screens: 'j',
            check: (s, ui) => isPublished(s) && !ui.numberOpen && s.numbers.length === 0,
          },
        ],
        rule: 'Publishing is complete on its own. A number is optional.',
      },
    ],
  },
]

export const scenarios: Scenario[] = [journey, ...branches]

/** Shown greyed out, so engineers see the full scope. */
export const notBuilt = ['Fix with Conductor (flow 8)', 'Publish again with numbers connected (flow 19)', 'Roll back: Point prod here (flow 17)']
