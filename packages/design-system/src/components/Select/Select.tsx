import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styles from './Select.module.css';

/** Shape extracted from each <option> child. */
interface OptionItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  /** Controlled value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Optional label rendered above the select */
  label?: string;
  /** Placeholder shown when no value selected */
  placeholder?: string;
  /** Error state — shows red border and optional message */
  error?: boolean | string;
  /** Additional CSS class on the outermost wrapper */
  wrapperClassName?: string;
  /** Additional CSS class on the trigger button */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** <option> elements used as data source */
  children?: React.ReactNode;
  /**
   * Called when the selected value changes.
   * Receives a synthetic event-like object with `target.value`
   * so existing handlers like `(e) => e.target.value` keep working.
   */
  onChange?: (e: { target: { value: string; name: string } }) => void;
  /** Name attribute passed through on the hidden select */
  name?: string;
}

/* ── helpers ── */

/** Flatten a React children tree into a plain string. */
function childrenToString(node: unknown): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(childrenToString).join('');
  if (typeof node === 'object' && node !== null && 'props' in (node as Record<string, unknown>)) {
    return childrenToString((node as { props: { children?: unknown } }).props.children);
  }
  return '';
}

/** Walk <option> children and extract value / label pairs. */
function extractOptions(children: React.ReactNode): OptionItem[] {
  const items: OptionItem[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const props = child.props as Record<string, unknown>;
    const label = childrenToString(props.children) || String(props.value ?? '');
    items.push({
      value: String(props.value ?? ''),
      label,
      disabled: !!props.disabled,
    });
  });
  return items;
}

/**
 * Custom Select (dropdown) component from Jasmine Design System.
 *
 * Renders a fully‑styled dropdown panel instead of the native OS picker
 * so the options list matches the minimal design of other DS components.
 *
 * Keeps a compatible API: pass `<option>` children, `value`, `onChange`.
 */
export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      placeholder,
      error,
      wrapperClassName = '',
      className = '',
      disabled = false,
      children,
      value: controlledValue,
      defaultValue,
      onChange,
      name = '',
      ...rest
    },
    ref,
  ) => {
    /* ── state ── */
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue ?? '');
    const currentValue = isControlled ? controlledValue : internalValue;

    const [open, setOpen] = useState(false);
    const [focusIndex, setFocusIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const options = useMemo(() => extractOptions(children), [children]);

    const selectedOption = options.find((o) => o.value === currentValue);
    const displayLabel =
      selectedOption?.label ??
      placeholder ??
      (options.length > 0 && options[0].value === '' ? options[0].label : 'Select…');
    const hasValue = !!selectedOption && selectedOption.value !== '';

    const hasError = !!error;

    /* ── select a value ── */
    const selectValue = useCallback(
      (val: string) => {
        if (!isControlled) setInternalValue(val);
        onChange?.({ target: { value: val, name } });
        setOpen(false);
      },
      [isControlled, onChange, name],
    );

    /* ── close on outside click ── */
    useEffect(() => {
      if (!open) return;
      const handleClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    /* ── close on Escape ── */
    useEffect(() => {
      if (!open) return;
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }, [open]);

    /* ── scroll focused item into view ── */
    useEffect(() => {
      if (!open || focusIndex < 0) return;
      const list = listRef.current;
      if (!list) return;
      const item = list.children[focusIndex] as HTMLElement | undefined;
      item?.scrollIntoView({ block: 'nearest' });
    }, [focusIndex, open]);

    /* ── keyboard nav on trigger ── */
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (!open) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
          e.preventDefault();
          setOpen(true);
          const idx = options.findIndex((o) => o.value === currentValue);
          setFocusIndex(idx >= 0 ? idx : 0);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusIndex((i) => {
            let next = i + 1;
            while (next < options.length && options[next].disabled) next++;
            return next < options.length ? next : i;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusIndex((i) => {
            let prev = i - 1;
            while (prev >= 0 && options[prev].disabled) prev--;
            return prev >= 0 ? prev : i;
          });
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusIndex >= 0 && focusIndex < options.length && !options[focusIndex].disabled) {
            selectValue(options[focusIndex].value);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          break;
        default:
          break;
      }
    };

    /* ── classes ── */
    const fieldClasses = [styles.field, hasError && styles.error, wrapperClassName]
      .filter(Boolean)
      .join(' ');

    const triggerClasses = [
      styles.trigger,
      open && styles.triggerOpen,
      !hasValue && styles.placeholder,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={fieldClasses} ref={containerRef}>
        {label && <label className={styles.label}>{label}</label>}

        <button
          ref={ref}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-disabled={disabled}
          disabled={disabled}
          className={triggerClasses}
          onClick={() => !disabled && setOpen((v) => !v)}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          <span className={styles.triggerText}>{displayLabel}</span>
          <svg
            className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            style={{ strokeWidth: 'var(--border-width-l)' }}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <ul
            ref={listRef}
            role="listbox"
            className={styles.dropdown}
            aria-label={label ?? 'Options'}
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === currentValue;
              const isFocused = idx === focusIndex;

              const itemClasses = [
                styles.option,
                isSelected && styles.optionSelected,
                isFocused && styles.optionFocused,
                opt.disabled && styles.optionDisabled,
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <li
                  key={`${opt.value}-${idx}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled}
                  className={itemClasses}
                  onMouseEnter={() => !opt.disabled && setFocusIndex(idx)}
                  onMouseDown={(e) => {
                    e.preventDefault(); // keep focus on trigger
                    if (!opt.disabled) selectValue(opt.value);
                  }}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        )}

        {typeof error === 'string' && error && (
          <p className={styles.errorMessage}>{error}</p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
