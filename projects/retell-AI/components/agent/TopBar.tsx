'use client'
// State zone: where the agent is in its life, plus Versions and Publish.
// Publish freezes a version; numbers choose what they run (R-05). "Live" only
// appears once a number points at a published version.
import { ChevronDown, ChevronLeft, CircleCheck, Ellipsis, TriangleAlert } from 'lucide-react'
import { Icon, Popover, StatusChip, TriggerButton } from '@/components/ui'
import { agent } from '@/lib/agent/fixtures'
import {
  isPending,
  isPublished,
  latestPublished,
  nextStepOf,
  plural,
  publishChecks,
  statusOf,
  targetLabel,
  versionForNumber,
  type AgentState,
} from '@/lib/agent/model'
import s from './topbar.module.css'

export function TopBar({
  state,
  onPublish,
  onPublishBlocked,
}: {
  state: AgentState
  /** Opens D2 · Publish (it names a failing test itself). */
  onPublish: () => void
  /** Opens D2.1 · Publish blocked (sample calendar). */
  onPublishBlocked: () => void
}) {
  const status = statusOf(state)
  const pending = isPending(state)
  const n = state.pending.length
  const c = publishChecks(state)
  const pub = latestPublished(state)
  const published = isPublished(state)
  // Hard blocks open a checklist; the sample calendar opens D2.1; otherwise D2.
  const route: 'checklist' | 'blocked' | 'dialog' | 'done' = published
    ? 'done'
    : pending || !state.calendar
      ? 'checklist'
      : c.sample
        ? 'blocked'
        : 'dialog'
  const primary = nextStepOf(state) === 'publish'

  const versions =
    state.version === 0 ? (
      <>
        <p className={s.strong}>No versions yet</p>
        <p className={s.muted}>Apply turns the {plural(n, 'pending change')} into v1. Tests and calls always run on a version.</p>
      </>
    ) : (
      <>
        <ul className={s.versions}>
          {Array.from({ length: state.version }, (_, i) => state.version - i).map((v) => {
            const p = state.published.find((x) => x.version === v)
            const isProd = pub?.version === v
            const users = state.numbers.filter((x) => versionForNumber(state, x.target) === v)
            return (
              <li key={v}>
                <span className={s.strong}>
                  {p ? p.name : `v${v}`}
                  {isProd && <span className={s.tag}>prod</span>}
                </span>
                <span className={s.muted}>
                  {p
                    ? users.length
                      ? users.map((x) => `${x.number} · ${targetLabel(x.target)}`).join(', ')
                      : 'Published · not used by a number yet'
                    : v === state.version
                      ? pending
                        ? `Latest · ${plural(n, 'change')} pending on top`
                        : 'Latest · not published'
                      : 'Not published'}
                </span>
              </li>
            )
          })}
        </ul>
        <p className={s.muted}>Publish freezes a version. Phone numbers choose which one they run.</p>
      </>
    )

  const checklist = (
    <>
      <p className={s.strong}>Not ready to publish yet</p>
      <ul className={s.checklist}>
        <li className={pending ? undefined : s.done}>
          <Icon icon={pending ? TriangleAlert : CircleCheck} size="s" />
          {pending ? `Apply ${plural(n, 'pending change')}` : 'Changes applied'}
        </li>
        <li className={c.realCalendar ? s.done : undefined}>
          <Icon icon={c.realCalendar ? CircleCheck : TriangleAlert} size="s" />
          {c.realCalendar ? 'Calendar connected' : c.sample ? 'Sample calendar is test only: connect a real calendar' : 'Connect a calendar for booking'}
        </li>
        <li className={c.testOk && !pending ? s.done : undefined}>
          <Icon icon={c.testOk && !pending ? CircleCheck : TriangleAlert} size="s" />
          {c.testOk && !pending ? 'Test passed on this version' : 'Pass a test that books'}
        </li>
      </ul>
    </>
  )

  const done = (
    <>
      <p className={s.strong}>v{state.version} is published</p>
      <p className={s.muted}>Nothing new to publish. Edits go into a new draft, and the published version keeps running.</p>
    </>
  )

  const open = route === 'blocked' ? onPublishBlocked : onPublish
  const desk =
    route === 'checklist' || route === 'done' ? (
      <Popover variant="outline" className={s.desk} trigger="Publish">
        {route === 'done' ? done : checklist}
      </Popover>
    ) : (
      <TriggerButton variant={primary ? 'primary' : 'outline'} className={s.desk} onClick={open}>
        Publish{primary ? ` v${state.version}` : ''}
      </TriggerButton>
    )

  return (
    <header className={s.bar}>
      <a className={s.back} href="#">
        <Icon icon={ChevronLeft} />
        Agents
      </a>
      <div className={s.title}>
        <a className={s.crumb} href="#">
          Agents
        </a>
        <span className={s.sep} aria-hidden="true">
          /
        </span>
        <h1>{agent.name}</h1>
        <StatusChip label={status.label} tone={status.tone} />
      </div>
      <div className={s.actions}>
        <Popover variant="quiet" className={s.desk} trigger={<>Versions<Icon icon={ChevronDown} size="s" caret /></>}>
          {versions}
        </Popover>
        {desk}
        <Popover variant="icon" className={s.mobile} ariaLabel="More: versions and publish" trigger={<Icon icon={Ellipsis} />}>
          {(close) => (
            <>
              {versions}
              <hr className={s.rule} />
              {route === 'checklist' ? (
                checklist
              ) : route === 'done' ? (
                done
              ) : (
                <TriggerButton
                  variant="outline"
                  onClick={() => {
                    close()
                    open()
                  }}
                >
                  Publish v{state.version}
                </TriggerButton>
              )}
            </>
          )}
        </Popover>
      </div>
    </header>
  )
}
