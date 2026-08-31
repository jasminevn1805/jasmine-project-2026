import { useId } from 'react'
import { X, Check } from 'react-feather'
import type { GroceryItem as GroceryItemType } from '@/types'

interface GroceryItemProps {
  item: GroceryItemType
  onToggle: () => void
  onDelete: () => void
}

function titleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase())
}

export function GroceryItem({ item, onToggle, onDelete }: GroceryItemProps) {
  const id = useId()
  const checked = item.checked

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-s)',
        padding: 'var(--space-xs) 0',
        minHeight: 'var(--primitive-spacing-36)',
        breakInside: 'avoid',
        width: '100%',
      }}
    >
      {/* ── Self-contained checkbox — no conditional DOM, pure CSS state ── */}
      <label
        htmlFor={id}
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          userSelect: 'none',
          /* Fixed row height prevents any text-metric reflow */
          height: '20px',
        }}
      >
        {/* Hidden native input — all a11y for free */}
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        />

        {/*
         * Custom box — SVG is ALWAYS in the DOM (opacity toggle only).
         * No element is ever mounted/unmounted on click → zero reflow.
         */}
        <span
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '16px',
            height: '16px',
            borderRadius: '4px',
            boxSizing: 'border-box',
            border: checked
              ? '1.5px solid var(--color-background-brand)'
              : '1.5px solid var(--color-border-primary)',
            background: checked
              ? 'var(--color-background-brand)'
              : 'var(--color-background-primary)',
            transition: 'background 150ms ease, border-color 150ms ease',
          }}
          aria-hidden="true"
        >
          {/* Checkmark — always mounted, shown/hidden via opacity */}
          <Check
            size={10}
            strokeWidth={2.5}
            color="white"
            style={{
              opacity: checked ? 1 : 0,
              transition: 'opacity 150ms ease',
            }}
            aria-hidden="true"
          />
        </span>

        {/* Label text — fixed line-height, no descender jitter */}
        <span
          style={{
            fontFamily: 'var(--typography-desktop-family-main)',
            fontSize: 'var(--typography-desktop-text-s-regular-size)',
            fontWeight: 'var(--typography-desktop-text-s-regular-weight)',
            lineHeight: '16px',
            color: 'var(--color-text-primary)',
          }}
        >
          {titleCase(item.name)}
        </span>
      </label>

      {/* Quantity badge */}
      {item.quantity && (
        <span
          style={{
            flexShrink: 0,
            fontFamily: 'var(--typography-desktop-family-main)',
            fontSize: 'var(--typography-desktop-text-s-regular-size)',
            fontWeight: 'var(--typography-desktop-text-s-regular-weight)',
            lineHeight: '16px',
            color: 'var(--color-text-tertiary)',
          }}
        >
          {titleCase(item.quantity)}
        </span>
      )}

      {/* Delete button */}
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete item"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px',
          border: 'none',
          background: 'none',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          flexShrink: 0,
          padding: 0,
          borderRadius: 'var(--border-radius-pill)',
          transition: 'color 120ms ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--primitive-red-400)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--color-text-secondary)'
        }}
      >
        <X size={11} />
      </button>
    </li>
  )
}

