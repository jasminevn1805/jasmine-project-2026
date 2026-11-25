'use client'
// D2 · Dialog · Publish — flow 5 (first publish).
// Publish freezes a version; it never chooses a phone number (R-05). A number points
// to a version, a tag (prod) or "latest published", so the dialog names the version,
// shows what's in it, runs the three checks, then says where calls will go.
import { useEffect, useId, useState } from 'react'
import { Button, Checkbox, Input } from '@jasmine/design-system'
import { CircleCheck, TriangleAlert, X } from 'lucide-react'
import { Dialog, Icon, Note } from '@/components/ui'
import { agent, prompt as firstPrompt } from '@/lib/agent/fixtures'
import { latestPublished, publishChecks, type AgentState } from '@/lib/agent/model'
import { splitSentences } from '@/lib/agent/sampleCalendar'
import s from './dialog.module.css'

/** Sentences in the tested prompt that weren't in the first build. */
function addedSentences(state: AgentState) {
  const before = new Set(firstPrompt.flatMap((b) => splitSentences(b.text)))
  return state.livePrompt.flatMap((b) => splitSentences(b.text)).filter((x) => !before.has(x))
}

function suggestName(added: string[]) {
  if (added.some((x) => /phone number/i.test(x))) return 'Asks for the phone number'
  if (added.length) return 'Prompt update'
  return 'First release'
}

export function PublishDialog({
  open,
  state,
  onClose,
  onPublish,
  onRunTest,
}: {
  open: boolean
  state: AgentState
  onClose: () => void
  onPublish: (name: string, thenConnectNumber: boolean) => void
  onRunTest: () => void
}) {
  const v = state.version
  const added = addedSentences(state)
  const [name, setName] = useState('')
  const [connectNext, setConnectNext] = useState(true)
  const nameId = useId()
  useEffect(() => {
    if (open) {
      setName(`v${v} · ${suggestName(added)}`)
      setConnectNext(state.numbers.length === 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const c = publishChecks(state)
  const first = !latestPublished(state)
  const cal = state.calendar?.kind === 'provider' ? state.calendar : null
  const last = c.last

  const testValue = c.testOk
    ? `Passed · Test ${c.passedHere!.n}`
    : last?.version === v
      ? `${last.outcome === 'failed' ? 'Failed' : last.outcome === 'ended' ? 'Ended early' : 'Not passed'} · Test ${last.n}`
      : `Not run on v${v} yet`

  const checks = [
    { ok: c.testOk, label: 'Last test', value: testValue },
    { ok: c.realCalendar, label: 'Actions', value: cal ? `All connected · ${cal.provider}` : 'Calendar not connected' },
    { ok: !c.pending, label: 'Pending changes', value: c.pending ? `${state.pending.length} not applied` : 'None' },
  ]

  return (
    <Dialog open={open} onClose={onClose} labelledBy="d2-title" describedBy="d2-after">
      <header className={s.head}>
        <div>
          <p className={s.step}>{agent.name}</p>
          <h2 id="d2-title" className={s.title}>
            Publish v{v}
          </h2>
        </div>
        <button type="button" className={s.close} aria-label="Close" onClick={onClose}>
          <Icon icon={X} />
        </button>
      </header>

      <div className={`${s.body} ${s.parts}`}>
        {/* Version: name it, see what's in it */}
        <div className={s.group}>
          <label htmlFor={nameId} className={s.groupTitle}>
            Version name
          </label>
          <Input id={nameId} value={name} onChange={(e) => setName(e.target.value)} wrapperClassName={s.nameField} className={s.nameInput} />
        </div>

        <div className={s.group}>
          <p className={s.groupTitle}>{first ? `What's in v${v}` : `What changed since v${latestPublished(state)!.version}`}</p>
          <ul className={s.changes}>
            {added.map((x) => (
              <li key={x}>
                <span className={s.changeArea}>Behavior</span>
                <span>Prompt now says “{x}”</span>
              </li>
            ))}
            {cal && (
              <li>
                <span className={s.changeArea}>Actions</span>
                <span>
                  Books into {cal.provider} · {cal.eventType}
                </span>
              </li>
            )}
            {first && (
              <li>
                <span className={s.changeArea}>Everything else</span>
                <span>As Conductor built it: Summary, Knowledge, 4 actions</span>
              </li>
            )}
          </ul>
        </div>

        {/* Before you publish: the three checks */}
        <div className={s.group}>
          <div className={s.groupHead}>
            <p className={s.groupTitle}>Before you publish</p>
            <span className={`${s.groupMeta} ${checks.every((k) => k.ok) ? s.groupMetaOk : s.groupMetaWarn}`}>
              {checks.filter((k) => k.ok).length} of {checks.length} ready
            </span>
          </div>
          <ul className={s.checks}>
            {checks.map((k) => (
              <li key={k.label} className={k.ok ? s.checkOk : s.checkWarn}>
                <Icon icon={k.ok ? CircleCheck : TriangleAlert} size="s" />
                <span className={s.checkLabel}>{k.label}</span>
                <span className={s.checkValue}>{k.value}</span>
              </li>
            ))}
          </ul>
          {!c.testOk && (
            <Note tone="warning" icon={<Icon icon={TriangleAlert} />}>
              <b>Test v{v} before you publish.</b>{' '}
              {last && last.version !== v
                ? `Your last test ran on v${last.version}. A passing test on v${v} shows the version you publish books correctly.`
                : `The last test on v${v} didn't pass. Run one that books, so you know this version works.`}
            </Note>
          )}
        </div>

        {/* After publishing: where calls go. Information, never a requirement. */}
        <div className={s.group}>
          <p className={s.groupTitle}>After publishing</p>
          <div id="d2-after">
            <Note tone="info">
              {state.numbers.length === 0 ? (
                <>
                  <b>No phone number uses this agent yet.</b> {first && `v${v} gets the prod tag. `}Callers reach it once a number points to it.
                  Web calls, chat and the API can use it right away.
                </>
              ) : (
                state.numbers.map((n) => (
                  <span key={n.number} className={s.noteLine}>
                    <b>{n.number} · {n.label}</b>{' '}
                    {n.target.kind === 'pinned' ? `Pinned to v${n.target.version} · stays there` : `Follows ${n.target.kind === 'prod' ? 'prod' : 'latest published'} → answers with v${v}`}
                  </span>
                ))
              )}
            </Note>
          </div>
          {state.numbers.length === 0 && (
            <Checkbox label="Then connect a phone number" checked={connectNext} onChange={(e) => setConnectNext(e.target.checked)} wrapperClassName={s.thenCheck} />
          )}
        </div>
      </div>

      <footer className={s.foot}>
        {c.testOk ? (
          <span />
        ) : (
          <Button type="Text" size="M" onClick={() => onPublish(name.trim() || `v${v}`, connectNext)}>
            Publish anyway
          </Button>
        )}
        <div className={s.footActions}>
          <Button type="Outline" size="M" onClick={onClose}>
            Cancel
          </Button>
          {c.testOk ? (
            <Button type="Primary" size="M" onClick={() => onPublish(name.trim() || `v${v}`, connectNext)}>
              Publish
            </Button>
          ) : (
            <Button type="Primary" size="M" onClick={onRunTest}>
              Run test first
            </Button>
          )}
        </div>
      </footer>
    </Dialog>
  )
}
