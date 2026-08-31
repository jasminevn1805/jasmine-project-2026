'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { List, FileText } from 'react-feather'
import { LuLightbulb } from 'react-icons/lu'
import { useRecipeStore } from '@/store/useRecipeStore'
import { useToast } from '@/components/shared/Toast'

const SECTION_ICONS: Record<SectionKey, React.ElementType> = {
  ingredients: List,
  instructions: FileText,
  notes: LuLightbulb,
}

// ── Types ────────────────────────────────────────────────────
type SectionKey = 'ingredients' | 'instructions' | 'notes'

const SECTIONS: { key: SectionKey; label: string; placeholder: string; emptyLabel: string }[] = [
  {
    key: 'ingredients',
    label: 'Ingredients',
    emptyLabel: 'Tap to add ingredients…',
    placeholder: 'For the sauce:\nSoy sauce\nGarlic\n\nFor the topping:\nSesame seeds\nGreen onion',
  },
  {
    key: 'instructions',
    label: 'Instructions',
    emptyLabel: 'Tap to add instructions…',
    placeholder: 'Prep:\nDice the vegetables\nMince the garlic\n\nCook:\nHeat oil in a pan\nAdd garlic and stir',
  },
  {
    key: 'notes',
    label: 'Notes',
    emptyLabel: 'Tap to add notes…',
    placeholder: 'Can sub honey for maple syrup\nKeeps in fridge 3-4 days',
  },
]

// ── Parse / serialise ────────────────────────────────────────
function parseNotes(raw: string | null): Record<SectionKey, string[]> {
  const empty: Record<SectionKey, string[]> = { ingredients: [], instructions: [], notes: [] }
  if (!raw?.trim()) return empty

  if (raw.includes('###')) {
    const parts = raw.split(/###(\w+)\n?/)
    for (let i = 1; i < parts.length; i += 2) {
      const key = parts[i] as SectionKey
      if (key in empty) {
        // Preserve blank lines as empty strings, trim non-empty lines
        const lines = parts[i + 1]?.split('\n').map(l => l.trim()) ?? []
        // Strip trailing empty lines only
        while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop()
        empty[key] = lines
      }
    }
    return empty
  }

  empty.notes = raw.split('\n').map(l => l.trim()).filter(Boolean)
  return empty
}

function serialise(data: Record<SectionKey, string[]>): string | null {
  const parts = SECTIONS
    .filter(({ key }) => data[key].some(l => l.trim() !== ''))
    .map(({ key }) => `###${key}\n${data[key].join('\n')}`)
  return parts.length ? parts.join('\n') : null
}

/**
 * Clean pasted text: strip common list prefixes (bullets, numbers, checkboxes)
 * but preserve each line as a separate item.
 */
function cleanPastedText(raw: string): string {
  const bulletRe = /^[\s]*(?:[•▢◻☐●○■–—\-\*·]\s*)/
  const numberRe = /^[\s]*(?:\d+[\.\)\:][\s]*)/i
  const stepRe   = /^[\s]*(?:step\s*\d+[\.\:\)]\s*)/i

  return raw
    .split(/\r?\n/)
    .map(line => {
      let l = line.trimEnd()
      l = l.replace(stepRe, '')
      l = l.replace(numberRe, '')
      l = l.replace(bulletRe, '')
      return l.trim()
    })
    .filter(Boolean)
    .join('\n')
}

/** Convert string[] ↔ textarea text */
function linesToText(lines: string[]): string {
  return lines.join('\n')
}

function textToLines(text: string): string[] {
  // Preserve blank lines (they become visual spacers) but trim each line
  const lines = text.split('\n').map(l => l.trim())
  // Strip trailing empty lines
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop()
  return lines
}

/** A line ending with ":" is a group header (e.g. "For the dough:") */
function isGroupHeader(line: string): boolean {
  return line.length > 1 && line.endsWith(':')
}

// ── Section textarea ─────────────────────────────────────────
interface SectionTextareaProps {
  value: string
  placeholder: string
  onBlur: (value: string) => void
  autoFocus?: boolean
}

function SectionTextarea({ value, placeholder, onBlur, autoFocus }: SectionTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useState(value)

  useEffect(() => { setText(value) }, [value])

  // Auto-resize
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = ref.current.scrollHeight + 'px'
    }
  }, [text])

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus()
      const len = ref.current.value.length
      ref.current.setSelectionRange(len, len)
    }
  }, [autoFocus])

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const raw = e.clipboardData.getData('text/plain')
    if (!raw.includes('\n')) return // single line — let default handle

    e.preventDefault()
    const cleaned = cleanPastedText(raw)
    const ta = ref.current!
    const before = text.slice(0, ta.selectionStart)
    const after = text.slice(ta.selectionEnd)
    const next = before + cleaned + (after.trim() ? '\n' + after.trim() : '')
    setText(next)
  }

  return (
    <textarea
      ref={ref}
      value={text}
      placeholder={placeholder}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => onBlur(text)}
      onPaste={handlePaste}
      rows={1}
      style={{
        width: '100%',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--typography-desktop-text-m-regular-size)',
        fontWeight: 'var(--typography-desktop-text-m-regular-weight)',
        lineHeight: '1.6',
        color: 'var(--color-text-primary)',
        resize: 'none',
        overflow: 'hidden',
        padding: 0,
      }}
    />
  )
}

// ── Main component ───────────────────────────────────────────
interface RecipeNotesProps {
  recipeId: string
  initialNotes: string | null
  className?: string
}

export function RecipeNotes({ recipeId, initialNotes, className }: RecipeNotesProps) {
  const updateRecipe = useRecipeStore((s) => s.updateRecipe)
  const { show: showToast } = useToast()
  const [data, setData] = useState<Record<SectionKey, string[]>>(() => parseNotes(initialNotes))
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const save = useCallback((next: Record<SectionKey, string[]>) => {
    updateRecipe(recipeId, { notes: serialise(next) })
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      showToast('Saved')
      saveTimer.current = null
    }, 400)
  }, [recipeId, updateRecipe, showToast])

  function handleBlur(section: SectionKey, rawText: string) {
    const lines = textToLines(rawText)
    const next = { ...data, [section]: lines }
    setData(next)
    save(next)
    setActiveSection(null)
  }

  return (
    <div className={`flex flex-col ${className ?? ''}`} style={{
      borderRadius: 'var(--radius-md)',
      background: 'var(--color-background-secondary)',
      padding: 'var(--space-l)',
      minHeight: 0,
    }}>

      {/* Card header — pinned */}
      <div
        className="flex items-center justify-between shrink-0"
        style={{ marginBottom: 'var(--space-m)' }}
      >
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--typography-desktop-heading-xs-semi-bold-size)',
          fontWeight: 'var(--typography-desktop-heading-xs-semi-bold-weight)',
          lineHeight: 'var(--typography-desktop-heading-xs-semi-bold-line-height)',
          color: 'var(--color-text-primary)',
        }}>
          Recipe guide
        </h2>
      </div>

      {/* Sections — scrollable */}
      <div
        className="flex-1 min-h-0 overflow-y-auto hide-scrollbar"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-xl)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        } as React.CSSProperties}
      >
        {SECTIONS.map(({ key, label, placeholder, emptyLabel }, sectionIdx) => {
          const lines = data[key]
          const isActive = activeSection === key
          const hasContent = lines.some(l => l.trim() !== '')

          return (
            <div key={key}>

              {/* Divider between sections */}
              {sectionIdx > 0 && (
                <div style={{
                  height: '1px',
                  background: 'var(--color-border-default)',
                  opacity: 0.4,
                  marginBottom: 'var(--space-l)',
                }} />
              )}

              {/* Section heading — pill badge style */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-xs)',
                paddingLeft: 'var(--space-s)',
                paddingRight: 'var(--space-s)',
                paddingTop: '2px',
                paddingBottom: '2px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--color-background-primary)',
                marginBottom: 'var(--space-s)',
              }}>
                {(() => {
                  const SectionIcon = SECTION_ICONS[key]
                  return <SectionIcon size={11} />
                })()}
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--typography-desktop-text-s-semi-bold-size)',
                  fontWeight: 'var(--typography-desktop-text-s-semi-bold-weight)',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  {label}
                </span>
              </div>

              {/* Content */}
              {isActive ? (
                /* ── Editing: single textarea ── */
                <SectionTextarea
                  value={linesToText(lines)}
                  placeholder={placeholder}
                  onBlur={(text) => handleBlur(key, text)}
                  autoFocus
                />
              ) : hasContent ? (
                /* ── Read-only: structured list ── */
                <div
                  onClick={() => setActiveSection(key)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'text',
                  }}
                >
                  {lines.map((line, i) => {
                    // Blank line → spacer
                    if (line === '') {
                      return <div key={i} style={{ height: 'var(--space-s)' }} />
                    }

                    // Group header (e.g. "For the dough:")
                    if (isGroupHeader(line)) {
                      return (
                        <div
                          key={i}
                          style={{
                            padding: '2px 0',
                            marginTop: i > 0 ? 'var(--space-s)' : 0,
                          }}
                        >
                          <span style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'var(--typography-desktop-text-m-semi-bold-size)',
                            fontWeight: 'var(--typography-desktop-text-m-semi-bold-weight)',
                            lineHeight: '1.6',
                            color: 'var(--color-text-primary)',
                          }}>
                            {line}
                          </span>
                        </div>
                      )
                    }

                    // Regular item
                    return (
                      <div
                        key={i}
                        className="flex items-start"
                        style={{
                          gap: 'var(--space-s)',
                          padding: '1px 0',
                        }}
                      >
                        <span style={{
                          color: 'var(--color-text-tertiary)',
                          fontSize: '4px',
                          flexShrink: 0,
                          userSelect: 'none',
                          marginTop: '9px',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: 'var(--color-text-tertiary)',
                        }} />
                        <span style={{
                          flex: 1,
                          fontFamily: 'var(--font-body)',
                          fontSize: 'var(--typography-desktop-text-m-regular-size)',
                          fontWeight: 'var(--typography-desktop-text-m-regular-weight)',
                          lineHeight: '1.6',
                          color: 'var(--color-text-primary)',
                        }}>
                          {line}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                /* ── Empty state ── */
                <div
                  onClick={() => setActiveSection(key)}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--typography-desktop-text-m-regular-size)',
                    color: 'var(--color-text-tertiary)',
                    fontStyle: 'italic',
                    lineHeight: '1.6',
                    cursor: 'text',
                    padding: '2px 0',
                  }}
                >
                  {emptyLabel}
                </div>
              )}

            </div>
          )
        })}
      </div>

    </div>
  )
}
