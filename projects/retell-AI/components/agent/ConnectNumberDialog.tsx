'use client'
// D5 · Connect a phone number — optional step after Publish (flow 5, last step).
// The number chooses what it runs: the prod tag, latest published, or one pinned version.
// Skipping is fine: the agent stays Published, with no warning.
import { useEffect, useState } from 'react'
import { Button } from '@jasmine/design-system'
import { X } from 'lucide-react'
import { Dialog, Icon } from '@/components/ui'
import { workspaceNumbers } from '@/lib/agent/fixtures'
import type { NumberTarget, PhoneNumber } from '@/lib/agent/model'
import s from './dialog.module.css'

type TargetKind = NumberTarget['kind']

export function ConnectNumberDialog({
  open,
  version,
  onClose,
  onConnect,
  onBuy,
}: {
  open: boolean
  version: number
  onClose: () => void
  onConnect: (n: PhoneNumber) => void
  onBuy: () => void
}) {
  const [picked, setPicked] = useState(workspaceNumbers[0].number)
  const [target, setTarget] = useState<TargetKind>('prod')
  useEffect(() => {
    if (open) {
      setPicked(workspaceNumbers[0].number)
      setTarget('prod')
    }
  }, [open])

  const targets: { id: TargetKind; title: string; detail: string }[] = [
    { id: 'prod', title: 'Follows prod', detail: `Answers with v${version} now, and moves when prod moves to a new version. Recommended.` },
    { id: 'latest', title: 'Latest published', detail: 'Moves to every version you publish, right away.' },
    { id: 'pinned', title: `Pinned to v${version}`, detail: `Stays on v${version} until you switch it.` },
  ]

  const connect = () => {
    const n = workspaceNumbers.find((x) => x.number === picked)!
    onConnect({
      number: n.number,
      label: n.label,
      target: target === 'pinned' ? { kind: 'pinned', version } : { kind: target },
    })
  }

  return (
    <Dialog open={open} onClose={onClose} labelledBy="d5-title" describedBy="d5-desc">
      <header className={s.head}>
        <div>
          <p className={s.step}>Optional · after publishing</p>
          <h2 id="d5-title" className={s.title}>
            Connect a phone number
          </h2>
        </div>
        <button type="button" className={s.close} aria-label="Close" onClick={onClose}>
          <Icon icon={X} />
        </button>
      </header>

      <div className={`${s.body} ${s.parts}`}>
        <p id="d5-desc" className={s.desc}>
          v{version} is published. Pick a number and choose which version it answers with. You can change this any time in Phone numbers.
        </p>

        <fieldset className={`${s.fieldset} ${s.group}`}>
          <legend className={s.groupTitle}>Number</legend>
          {workspaceNumbers.map((n) => (
            <label key={n.number} className={s.option}>
              <input type="radio" name="d5-number" value={n.number} checked={picked === n.number} onChange={() => setPicked(n.number)} />
              <span>
                <span className={s.optionTitle}>
                  {n.number} · {n.label}
                </span>
                <span className={s.optionDetail}>{n.detail}</span>
              </span>
            </label>
          ))}
          <Button type="Text" size="S" className={s.buy} onClick={onBuy}>
            Get a new number
          </Button>
        </fieldset>

        <fieldset className={`${s.fieldset} ${s.group}`}>
          <legend className={s.groupTitle}>Answers with</legend>
          {targets.map((t) => (
            <label key={t.id} className={s.option}>
              <input type="radio" name="d5-target" value={t.id} checked={target === t.id} onChange={() => setTarget(t.id)} />
              <span>
                <span className={s.optionTitle}>{t.title}</span>
                <span className={s.optionDetail}>{t.detail}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </div>

      <footer className={s.foot}>
        <span />
        <div className={s.footActions}>
          <Button type="Outline" size="M" onClick={onClose}>
            Skip for now
          </Button>
          <Button type="Primary" size="M" onClick={connect}>
            Connect number
          </Button>
        </div>
      </footer>
    </Dialog>
  )
}
