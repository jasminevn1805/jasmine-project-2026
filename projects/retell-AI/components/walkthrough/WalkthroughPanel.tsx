'use client'
// Walkthrough panel: test cases attached to the prototype (see walkthrough-plan.md).
// Choosing a scenario loads a save point; the whole UI stays live, nothing is locked.
// Steps tick themselves when their expected result appears in the real state.
import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronDown, Copy, Link2, ListChecks, RotateCcw, X } from 'lucide-react'
import { Icon } from '@/components/ui'
import type { AgentState } from '@/lib/agent/model'
import { branches, journey, notBuilt, scenarios, type Chapter, type Scenario, type WalkUi } from '@/lib/walkthrough/scenarios'
import s from './walkthrough.module.css'

type Mode = 'spec' | 'test'

export function WalkthroughPanel({
  state,
  ui,
  onLoad,
}: {
  state: AgentState
  ui: WalkUi
  /** Load a chapter's save point (agent state plus tab and dialogs). */
  onLoad: (start: Chapter['start']) => void
}) {
  const [hidden, setHidden] = useState(false)
  // Open with full details by default, so readers see the test cases first.
  const [open, setOpen] = useState(true)
  const [mode, setMode] = useState<Mode>('spec')
  const [details, setDetails] = useState(true)
  const [scenarioId, setScenarioId] = useState(journey.id)
  const [ci, setCi] = useState(0)
  const [si, setSi] = useState(0)
  const [complete, setComplete] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const scenario = useMemo(() => scenarios.find((x) => x.id === scenarioId) ?? journey, [scenarioId])
  const chapter = scenario.chapters[ci]
  const step = chapter.steps[si]
  const totalSteps = scenario.chapters.reduce((n, c) => n + c.steps.length, 0)
  const stepNo = scenario.chapters.slice(0, ci).reduce((n, c) => n + c.steps.length, 0) + si + 1

  const select = (sc: Scenario, chapterIdx = 0, stepIdx = 0, load = true) => {
    setScenarioId(sc.id)
    setCi(chapterIdx)
    setSi(stepIdx)
    setComplete(false)
    if (load) onLoad(sc.chapters[chapterIdx].start)
    const q = new URLSearchParams(window.location.search)
    q.set('scenario', sc.id)
    if (sc.kind === 'journey') q.set('chapter', String(chapterIdx + 1))
    else q.delete('chapter')
    window.history.replaceState(null, '', `?${q}`)
  }

  // Deep links: ?scenario=journey&chapter=5 · ?scenario=TC-07 · ?walkthrough=off
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get('walkthrough') === 'off') return setHidden(true)
    const sc = scenarios.find((x) => x.id === q.get('scenario'))
    if (!sc) return
    const chapterIdx = Math.min(Math.max(Number(q.get('chapter') ?? 1) - 1, 0), sc.chapters.length - 1)
    select(sc, chapterIdx)
    setOpen(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const advance = () => {
    if (si < chapter.steps.length - 1) setSi(si + 1)
    else if (ci < scenario.chapters.length - 1) {
      // The journey runs on: the next chapter starts from where this one ended.
      setCi(ci + 1)
      setSi(0)
    } else setComplete(true)
  }
  const back = () => {
    setComplete(false)
    if (si > 0) setSi(si - 1)
    else if (ci > 0) {
      setCi(ci - 1)
      setSi(scenario.chapters[ci - 1].steps.length - 1)
    }
  }

  // Auto-advance once the expected result shows up in the real state.
  const passed = !!step?.check?.(state, ui)
  useEffect(() => {
    if (complete || !passed) return
    const t = setTimeout(advance, 700)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passed, complete, ci, si, scenarioId])

  const copy = async (what: 'link' | 'checklist') => {
    const text =
      what === 'link'
        ? window.location.href
        : [`# ${scenario.id === 'journey' ? '' : `${scenario.id} · `}${scenario.title} (${scenario.flows})`, '']
            .concat(
              scenario.chapters.flatMap((c) => [
                `## ${c.title}`,
                `Goal: ${c.goal}`,
                ...c.steps.map((st) => `- [ ] ${st.action}\n  Expected: ${st.expect} (${st.screens})`),
                ...(c.rule ? [`Rule: ${c.rule}`] : []),
                '',
              ])
            )
            .join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(what)
      setTimeout(() => setCopied(null), 1600)
    } catch {
      /* clipboard blocked: nothing to do */
    }
  }

  if (hidden) return null

  const label = complete ? `${scenario.title} · done` : `${scenario.title} · ${mode === 'test' ? chapter.title : `Step ${stepNo} of ${totalSteps}`}`

  if (!open)
    return (
      <button type="button" className={s.pill} aria-expanded={false} onClick={() => setOpen(true)}>
        <Icon icon={ListChecks} size="s" />
        <span>Prototype guide</span>
        <span className={s.pillMeta}>{label}</span>
      </button>
    )

  return (
    <section className={s.panel} aria-label="Walkthrough">
      <header className={s.head}>
        <p className={s.title}>Prototype guide</p>
        <div className={s.modes} role="group" aria-label="Mode">
          {(['spec', 'test'] as Mode[]).map((m) => (
            <button key={m} type="button" className={s.mode} aria-pressed={mode === m} onClick={() => setMode(m)}>
              {m === 'spec' ? 'Spec' : 'Test'}
            </button>
          ))}
        </div>
        <button type="button" className={s.iconBtn} aria-label="Collapse walkthrough" onClick={() => setOpen(false)}>
          <Icon icon={ChevronDown} size="s" />
        </button>
        <button type="button" className={s.iconBtn} aria-label="Hide walkthrough" onClick={() => setHidden(true)}>
          <Icon icon={X} size="s" />
        </button>
      </header>

      {/* Context first: what this prototype is and who it's for */}
      <div className={s.intro}>
        <p className={s.introText}>
          A redesign of Retell’s agent builder for non-technical builders. Follow a clinic manager from Conductor’s first build to a booking agent on a
          real phone line. Pick a step to jump there; each one ticks as you go.
        </p>
        <a className={s.demoLink} href="/demo.mp4" target="_blank" rel="noopener">
          ▶ Watch the 2.5 min demo
        </a>
        <p className={s.muted}>Concept prototype for a UX case study · not affiliated with Retell AI</p>
      </div>

      {/* Full journey: chapters are save points */}
      <div className={s.group}>
        <p className={s.groupTitle}>
          Core flow: build to first call <span className={s.muted}>· {journey.flows}</span>
        </p>
        <ol className={s.chips}>
          {journey.chapters.map((c, i) => {
            const current = scenarioId === journey.id && ci === i
            const done = scenarioId === journey.id && (i < ci || (complete && i === ci))
            return (
              <li key={c.id}>
                <button type="button" className={s.chip} aria-current={current ? 'step' : undefined} data-done={done || undefined} onClick={() => select(journey, i)}>
                  {done ? <Icon icon={Check} size="s" /> : <span>{i + 1}</span>}
                  {c.title}
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <div className={s.group}>
        <p className={s.groupTitle}>Edge cases</p>
        <ul className={s.branches}>
          {branches.map((b) => (
            <li key={b.id}>
              <button type="button" className={s.branch} aria-current={scenarioId === b.id ? 'true' : undefined} onClick={() => select(b)}>
                <span className={s.branchId}>{b.id}</span>
                <span>{b.title}</span>
                <span className={s.muted}>from {b.branchesFrom}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* The current step (Spec) or the chapter's goal only (Test: no leading hints) */}
      <div className={s.current} aria-live="polite">
        <p className={s.where}>
          {scenario.kind === 'branch' ? `${scenario.id} · ` : ''}
          {chapter.title}
          {mode === 'spec' && !complete && ` · step ${si + 1} of ${chapter.steps.length}`}
        </p>
        {complete ? (
          <p className={s.action}>Scenario complete. Pick another one, or restart.</p>
        ) : mode === 'test' ? (
          <>
            <p className={s.label}>Task</p>
            <p className={s.action}>{chapter.goal}</p>
          </>
        ) : (
          <>
            <p className={s.label}>Do</p>
            <p className={s.action}>{step.action}</p>
            <p className={s.label}>Expect</p>
            <p className={s.expect}>
              {passed && <Icon icon={Check} size="s" />}
              {step.expect}
            </p>
          </>
        )}
      </div>

      {mode === 'spec' && details && !complete && (
        <dl className={s.details}>
          <dt>Screens</dt>
          <dd>{step.screens}</dd>
          <dt>Flows</dt>
          <dd>{scenario.flows}</dd>
          {chapter.rule && (
            <>
              <dt>Rule</dt>
              <dd>{chapter.rule}</dd>
            </>
          )}
          <dt>Not in this prototype</dt>
          <dd>{notBuilt.join(' · ')}</dd>
        </dl>
      )}

      <footer className={s.foot}>
        <button type="button" className={s.textBtn} onClick={() => select(scenario, scenario.kind === 'journey' ? ci : 0)}>
          <Icon icon={RotateCcw} size="s" />
          Restart
        </button>
        {mode === 'spec' && (
          <button type="button" className={s.textBtn} aria-expanded={details} onClick={() => setDetails((d) => !d)}>
            Details
          </button>
        )}
        {mode === 'spec' && details && (
          <>
            <button type="button" className={s.textBtn} onClick={() => copy('checklist')}>
              <Icon icon={Copy} size="s" />
              {copied === 'checklist' ? 'Copied' : 'Checklist'}
            </button>
            <button type="button" className={s.textBtn} onClick={() => copy('link')}>
              <Icon icon={Link2} size="s" />
              {copied === 'link' ? 'Copied' : 'Link'}
            </button>
          </>
        )}
        <div className={s.nav}>
        <button type="button" className={s.navBtn} onClick={back} disabled={ci === 0 && si === 0 && !complete}>
          Back
        </button>
        <button type="button" className={s.navBtn} data-primary onClick={() => (mode === 'test' && !complete ? (ci < scenario.chapters.length - 1 ? (setCi(ci + 1), setSi(0)) : setComplete(true)) : advance())} disabled={complete}>
          {step?.check && mode === 'spec' ? 'Skip' : 'Next'}
        </button>
        </div>
      </footer>
    </section>
  )
}
