'use client'
// Definition zone organisms. Every section uses the same SpecSection shell —
// Advanced included, since it is a peer of the other four in the IA.
import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from '@jasmine/design-system'
import { Calendar as CalendarIcon, ChevronDown, ChevronRight, CircleCheck, FileText, Globe, Pencil, Play, TriangleAlert, Check, X } from 'lucide-react'
import { Badge, DisclosureRow, Icon, Popover } from '@/components/ui'
import { actions, advanced, agent, handbook, knowledge, usage } from '@/lib/agent/fixtures'
import type { Calendar, SectionId, SpecFocus } from '@/lib/agent/model'
import { splitSentences, type PromptBlock } from '@/lib/agent/sampleCalendar'
import s from './spec.module.css'

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

/* ── Shell ─────────────────────────────────────────────── */
export function SpecSection({
  id,
  title,
  changed,
  lit,
  pulse,
  headerEnd,
  children,
}: {
  id: SectionId
  title: string
  changed?: boolean
  lit?: boolean
  pulse?: boolean
  headerEnd?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={`section-${id}`} aria-labelledby={`h-${id}`} className={cx(s.card, lit && s.lit, pulse && s.pulse)}>
      <header className={s.head}>
        <h2 id={`h-${id}`}>{title}</h2>
        {changed && <Badge>Changed</Badge>}
        {headerEnd && <div className={s.headEnd}>{headerEnd}</div>}
      </header>
      {children}
    </section>
  )
}

type Shared = { changed: boolean; lit: boolean; pulse: boolean }

/* ── Summary ───────────────────────────────────────────── */
export function SummarySection({ usageStarts, onJump, ...shell }: Shared & { usageStarts: string; onJump: (id: SectionId) => void }) {
  const [playing, setPlaying] = useState(false)
  const play = () => {
    setPlaying(true)
    setTimeout(() => setPlaying(false), 3000)
  }
  return (
    <SpecSection
      id="summary"
      title="Summary"
      {...shell}
      headerEnd={
        <Popover
          variant="chip"
          className={s.usage}
          trigger={
            <>
              {/* Segments drop out as the card narrows (container queries in spec.module.css);
                  the popover always has the full breakdown. */}
              <span className={s.usageLabel}>Usage</span>
              <span>
                Est. {usage.perMinute}
                <span className={s.usageMore}>{` · ${usage.latency} · ${usage.tokens}`}</span>
              </span>
              {usageStarts !== 'now' && <span className={s.usageWhen}>starts with {usageStarts}</span>}
              <Icon icon={ChevronDown} size="s" caret />
            </>
          }
        >
          {(close) => (
            <>
              <p className={s.strong}>Usage estimate · per minute of call</p>
              <dl className={s.kv}>
                {usage.breakdown.map((u) => (
                  <Kv key={u.label} k={u.label} v={u.value} />
                ))}
                <dt className={s.total}>Total</dt>
                <dd className={s.total}>{usage.perMinute}</dd>
                <Kv k="Starts with" v={usageStarts === 'now' ? 'This version' : usageStarts} />
                <Kv k="Latency · first reply" v={usage.latency} />
              </dl>
              <p className={s.small}>
                Voice in Summary · Model in{' '}
                <button
                  type="button"
                  className={s.link}
                  onClick={() => {
                    close()
                    onJump('advanced')
                  }}
                >
                  Advanced
                </button>
                . Estimates: each test result shows what that call actually cost.
              </p>
            </>
          )}
        </Popover>
      }
    >
      <dl className={s.rows}>
        <dt>Name</dt>
        <dd>{agent.name}</dd>
        <dt>Voice</dt>
        <dd>
          <span>{agent.voice}</span>
          <Button type="Outline" size="S" className={s.iconButtonS} onClick={play} ariaLabel={playing ? 'Playing voice sample' : 'Play voice sample'}>
            <Icon icon={Play} size="s" />
            {playing ? 'Playing' : 'Sample'}
          </Button>
          <span className={s.pair}>
            <span className={s.muted}>Language</span>
            <span>{agent.language}</span>
          </span>
        </dd>
        <dt>Welcome</dt>
        <dd>{agent.welcome}</dd>
        <dt>Model</dt>
        <dd>
          <span>{agent.model} · picked by Conductor</span>
          <button type="button" className={`${s.link} ${s.linkPrompt}`} onClick={() => onJump('advanced')}>
            Change in Advanced
            <Icon icon={ChevronRight} size="s" />
          </button>
        </dd>
      </dl>
    </SpecSection>
  )
}

function Kv({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt>{k}</dt>
      <dd>{v}</dd>
    </>
  )
}

/* ── Behavior ──────────────────────────────────────────── */
/** Renders a paragraph with one exact sentence marked (the cause / "why" target). */
function withMark(text: string, mark: string | null) {
  if (!mark) return text
  const i = text.indexOf(mark)
  if (i < 0) return text
  return (
    <>
      {text.slice(0, i)}
      <mark className={s.causeMark}>{mark}</mark>
      {text.slice(i + mark.length)}
    </>
  )
}

/**
 * Behavior. Flows 6/7/9:
 *  - focus: a sentence to highlight, with where it was linked from (result card or a transcript reply)
 *  - edit mode (screen m): one paragraph in a textarea; Save makes a pending change
 */
export function BehaviorSection({
  prompt,
  focus,
  editing,
  onEdit,
  onCancelEdit,
  onSave,
  onClearFocus,
  ...shell
}: Shared & {
  prompt: PromptBlock[]
  focus: SpecFocus | null
  /** Index of the paragraph in edit mode, or null. */
  editing: number | null
  onEdit: (block: number) => void
  onCancelEdit: () => void
  onSave: (block: number, text: string) => void
  onClearFocus: () => void
}) {
  const [open, setOpen] = useState(false)
  const [rules, setRules] = useState(false)
  const [draft, setDraft] = useState('')
  const area = useRef<HTMLTextAreaElement>(null)
  const focusBlock = focus ? prompt.findIndex((b) => b.text.includes(focus.text)) : -1
  const focusLine = focusBlock >= 0 ? splitSentences(prompt[focusBlock].text).findIndex((x) => x === focus!.text) + 1 : 0
  const words = prompt.map((p) => `${p.heading ?? ''} ${p.text}`).join(' ').trim().split(/\s+/).length

  // Entering edit mode: load the paragraph, then (once it's in the textarea) put the caret
  // where the fix goes — just before the linked sentence's final full stop.
  const caretAt = useRef<number | null>(null)
  useEffect(() => {
    if (editing == null) return
    const text = prompt[editing].text
    const target = focus?.text ? text.indexOf(focus.text) : -1
    caretAt.current = target >= 0 ? target + focus!.text.replace(/[.!?]\s*$/, '').length : text.length
    setDraft(text)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing])
  useLayoutEffect(() => {
    const el = area.current
    if (editing == null || caretAt.current == null || !el || el.value !== prompt[editing].text) return
    el.focus()
    el.setSelectionRange(caretAt.current, caretAt.current)
    caretAt.current = null
  }, [draft, editing, prompt])

  // Show the paragraph holding the focus even when the prompt is collapsed.
  const visible = open ? prompt.map((p, i) => ({ p, i })) : prompt.slice(0, 1).map((p, i) => ({ p, i }))
  if (!open && focusBlock > 0) visible.push({ p: prompt[focusBlock], i: focusBlock })

  return (
    <SpecSection id="behavior" title="Behavior" {...shell}>
      {/* l · Cause opened in the spec: where we came from + what to do */}
      {focus && focusBlock >= 0 && editing == null && (
        <div className={s.linkBanner} role="status">
          <span>
            <b>Linked to {focus.from}</b> · Prompt line {focusLine}
            {focus.changed && ' · edited since that test'}
          </span>
          <span className={s.linkBannerActions}>
            <Button type="Primary" size="S" className={s.smallBtn} onClick={() => onEdit(focusBlock)}>
              <Icon icon={Pencil} size="s" />
              Edit this line
            </Button>
            <button type="button" className={s.iconClose} aria-label="Clear highlight" onClick={onClearFocus}>
              <Icon icon={X} size="s" />
            </button>
          </span>
        </div>
      )}

      <div className={s.labelRow}>
        <p className={s.label}>Prompt</p>
        {editing == null && (
          <Button type="Text" size="S" className={`${s.textAction} ${s.editLink}`} onClick={() => onEdit(focusBlock >= 0 ? focusBlock : 0)}>
            <Icon icon={Pencil} size="s" />
            Edit
          </Button>
        )}
      </div>

      {editing != null ? (
        // m · Section in edit mode
        <div className={s.editor}>
          {focus && focusBlock === editing && (
            <p className={s.editorHint}>
              <b>Linked to {focus.from}:</b> “{focus.text}”
            </p>
          )}
          {prompt[editing].heading && <p className={s.editorHeading}>{prompt[editing].heading}</p>}
          <label className="sr-only" htmlFor="prompt-editor">
            Edit prompt paragraph
          </label>
          <textarea
            id="prompt-editor"
            ref={area}
            className={s.textarea}
            rows={6}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className={s.editorActions}>
            <Button type="Outline" size="S" className={s.smallBtn} onClick={onCancelEdit}>
              Cancel
            </Button>
            <Button
              type="Primary"
              size="S"
              className={s.smallBtn}
              onClick={() => onSave(editing, draft.trim())}
              disabled={!draft.trim() || draft.trim() === prompt[editing].text}
            >
              Save change
            </Button>
          </div>
        </div>
      ) : (
        <div id="prompt" className={cx(s.prompt, !open && focusBlock < 0 && s.clamped)}>
          {visible.map(({ p, i }) => (
            <Fragment key={i}>
              {p.heading && <h3>{p.heading}</h3>}
              <p>{withMark(p.text, i === focusBlock ? focus!.text : null)}</p>
            </Fragment>
          ))}
        </div>
      )}
      {editing == null && (
        <div>
          <button type="button" className={`${s.link} ${s.linkPrompt}`} aria-expanded={open} aria-controls="prompt" onClick={() => setOpen((o) => !o)}>
            {open ? 'Show less' : 'Show full prompt'} · {words.toLocaleString('en-US')} words
          </button>
        </div>
      )}
      <hr className={s.divider} />
      <DisclosureRow
        label="Handbook"
        summary={`${handbook.length} rules on · ${handbook.slice(0, 3).join(', ')}, +${handbook.length - 3}`}
        expanded={rules}
        onToggle={() => setRules((r) => !r)}
        controls="handbook-list"
      />
      {rules && (
        <ul id="handbook-list" className={s.sublist}>
          {handbook.map((r) => (
            <li key={r}>
              <Icon icon={Check} size="s" className={s.ok} />
              {r}
            </li>
          ))}
        </ul>
      )}
    </SpecSection>
  )
}

/* ── Knowledge ─────────────────────────────────────────── */
export function KnowledgeSection(shell: Shared) {
  const [open, setOpen] = useState(false) // mobile only: collapsed to one row
  return (
    <SpecSection
      id="knowledge"
      title="Knowledge"
      {...shell}
      headerEnd={
        <button type="button" className={s.knowledgeToggle} aria-expanded={open} aria-controls="sources" onClick={() => setOpen((o) => !o)}>
          {knowledge.length} sources
          <Icon icon={ChevronRight} size="s" />
        </button>
      }
    >
      <ul id="sources" className={cx(s.sources, !open && s.sourcesCollapsed)}>
        {knowledge.map((k) => (
          <li key={k.name}>
            <Icon icon={k.kind === 'file' ? FileText : Globe} />
            <span>{k.name}</span>
            <span className={s.muted}>{k.meta}</span>
          </li>
        ))}
      </ul>
    </SpecSection>
  )
}

/* ── Actions ───────────────────────────────────────────── */
export function ActionsSection({
  calendar,
  connectIsPrimary,
  onConnect,
  ...shell
}: Shared & { calendar: Calendar | null; connectIsPrimary: boolean; onConnect: () => void }) {
  const missing = actions.filter((a) => a.needsCalendar).length
  const sample = calendar?.kind === 'sample'
  const calendarStatus = !calendar ? 'Not connected' : calendar.kind === 'sample' ? 'Sample calendar' : `${calendar.provider} · ${calendar.eventType}`

  // Header: what's missing → test-only reminder + the one place to switch (sample) → all ready (real).
  const headerEnd = !calendar ? (
    <span className={s.metaWarning}>{missing} need a connection</span>
  ) : sample ? (
    <span className={s.headerTools}>
      <Badge tone="neutral">Test only</Badge>
      <Button type="Text" size="S" className={`${s.actionCta} ${s.textAction}`} onClick={onConnect}>
        Switch to real calendar
      </Button>
    </span>
  ) : (
    <span className={s.meta}>All ready</span>
  )

  return (
    <SpecSection id="actions" title="Actions" {...shell} headerEnd={headerEnd}>
      <ul className={cx(s.actions, !!calendar && s.actionsConnected)}>
        {actions.map((a, i) => {
          const blocked = a.needsCalendar && !calendar
          return (
          <li key={a.id}>
            <Icon icon={blocked ? TriangleAlert : CircleCheck} size="s" className={blocked ? s.iconWarn : s.iconOk} />
            <span className={s.actionName}>{a.name}</span>
            <span className={blocked ? s.statusWarn : s.statusOk}>{a.needsCalendar ? calendarStatus : 'Ready'}</span>
            {i === 0 && !calendar && (
              // Quiet text action while Apply is the next step; becomes the one
              // filled Primary once it is (state d). One filled button per state.
              <Button
                type={connectIsPrimary ? 'Primary' : 'Text'}
                size="S"
                className={connectIsPrimary ? s.actionCta : `${s.actionCta} ${s.textAction}`}
                onClick={onConnect}
              >
                <Icon icon={CalendarIcon} size="s" />
                Connect calendar
              </Button>
            )}
          </li>
          )
        })}
      </ul>
    </SpecSection>
  )
}

/* ── Advanced ──────────────────────────────────────────── */
export function AdvancedSection({ open, onToggle, pulse }: { open: boolean; onToggle: () => void; pulse: boolean }) {
  return (
    <SpecSection id="advanced" title="Advanced" pulse={pulse} headerEnd={<span className={s.meta}>Defaults on</span>}>
      <DisclosureRow
        summary={advanced.map((a) => a.name.split(' · ')[0]).join(', ')}
        expanded={open}
        onToggle={onToggle}
        controls="advanced-list"
      />
      {open && (
        <ul id="advanced-list" className={s.advancedList}>
          {advanced.map((a) => (
            <li key={a.name}>
              <span>{a.name}</span>
              <span className={s.muted}>{a.value}</span>
            </li>
          ))}
        </ul>
      )}
    </SpecSection>
  )
}
