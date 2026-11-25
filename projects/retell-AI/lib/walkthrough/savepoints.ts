// Save points for the Walkthrough panel. Each one is built by running the real reducer
// from screen c, so a save point can never drift from what the prototype does.
import { initialPending, prompt, workspaceNumbers } from '@/lib/agent/fixtures'
import { agentReducer, type AgentAction, type AgentState } from '@/lib/agent/model'
import { buildScript, LINE_SECONDS, readPromptRules } from '@/lib/agent/sampleCalendar'

/** Screen c · Built, changes pending. The prototype's normal starting point. */
export const screenC: AgentState = {
  version: 0,
  pending: initialPending,
  calendar: null,
  chat: [],
  undo: null,
  tests: [],
  testBookings: [],
  published: [],
  numbers: [],
  prompt,
  livePrompt: prompt,
}

const run = (s: AgentState, ...actions: AgentAction[]) => actions.reduce(agentReducer, s)

/** An audio test on the applied version, scripted exactly like the Test panel's. */
function audioTest(s: AgentState): AgentAction {
  const taken = s.calendar?.kind === 'sample' ? s.testBookings : []
  const script = buildScript(taken, readPromptRules(s.livePrompt))
  return {
    type: 'testFinished',
    booking: script.booking,
    cause: script.cause,
    lines: script.lines,
    duration: (script.lines.length + 1) * LINE_SECONDS,
    mode: 'audio',
  }
}

/** The fix from flow 7: the collect line also asks for the phone number. */
function fixPrompt(s: AgentState): AgentAction {
  const sentence = readPromptRules(s.livePrompt).collect.sentence
  const block = s.prompt.findIndex((b) => b.text.includes(sentence))
  const fixed = sentence.replace(/\.$/, ' and phone number.')
  return { type: 'editPrompt', block, text: s.prompt[block].text.replace(sentence, fixed) }
}

const withTest = (s: AgentState) => run(s, audioTest(s))

export const savepoints = {
  /** c · 4 pending changes, nothing applied. */
  built: () => screenC,
  /** d · v1 applied, Actions need a calendar. */
  applied: () => run(screenC, { type: 'apply' }),
  /** Cal.com connected · v2, ready to test. */
  connected: () => run(savepoints.applied(), { type: 'connectCalendar', calendar: { kind: 'provider', provider: 'Cal.com', eventType: 'Cleaning · 60 min' } }),
  /** i · Test 1 failed on v2: the agent never asks for the phone number. */
  failed: () => withTest(savepoints.connected()),
  /** Test 2 passed on v3 after the fix. Publish v3 is the next step. */
  passed: () => {
    const fixed = run(savepoints.failed(), fixPrompt(savepoints.failed()), { type: 'apply' })
    return withTest(fixed)
  },
  /** j · Published · v3, no number yet. */
  published: () => run(savepoints.passed(), { type: 'publish', name: 'v3 · Asks for the phone number' }),
  /** Live · v3: the front desk number follows prod. */
  live: () => run(savepoints.published(), { type: 'connectNumber', number: { number: workspaceNumbers[0].number, label: workspaceNumbers[0].label, target: { kind: 'prod' } } }),
}

export type SavepointId = keyof typeof savepoints
