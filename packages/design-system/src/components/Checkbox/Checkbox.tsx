import React, { useId } from 'react';
import styles from './Checkbox.module.css';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text rendered beside the checkbox */
  label?: string;
  /**
   * Indeterminate state — visually shows a dash (–).
   * Used for "select all" patterns where only some children are checked.
   * This is a visual-only override; the underlying `checked` prop controls
   * the actual form value.
   */
  indeterminate?: boolean;
  /** Error / negative state — 2px red border + optional message below */
  error?: boolean | string;
  /** Additional CSS class on the outer wrapper */
  wrapperClassName?: string;
}

/**
 * Checkbox component — Jasmine Design System
 *
 * Matches all seven Figma states:
 * Default · Focus · Selected · Indeterminate · Selected+Disabled · Error · Disabled
 *
 * Usage:
 * ```tsx
 * <Checkbox label="Accept terms" checked={val} onChange={…} />
 * <Checkbox label="Select all" indeterminate checked={val} onChange={…} />
 * ```
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      indeterminate = false,
      error,
      disabled,
      checked,
      wrapperClassName = '',
      className = '',
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const id = idProp ?? autoId;
    const hasError = !!error;

    // Apply indeterminate imperatively via ref callback
    const setRef = React.useCallback(
      (el: HTMLInputElement | null) => {
        if (el) {
          el.indeterminate = indeterminate;
        }
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
      },
      [indeterminate, ref],
    );

    const wrapperClasses = [
      styles.wrapper,
      disabled && styles.disabled,
      wrapperClassName,
    ]
      .filter(Boolean)
      .join(' ');

    const indicatorClasses = [
      styles.indicator,
      checked && !indeterminate && styles.indicatorChecked,
      indeterminate && styles.indicatorIndeterminate,
      hasError && styles.indicatorError,
      disabled && checked && !indeterminate && styles.indicatorCheckedDisabled,
      disabled && indeterminate && styles.indicatorIndeterminateDisabled,
      disabled && !checked && !indeterminate && styles.indicatorDisabled,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        <label className={styles.label} htmlFor={id}>
          {/* Hidden native input — keeps all keyboard / screen-reader behaviour */}
          <input
            ref={setRef}
            id={id}
            type="checkbox"
            className={styles.nativeInput}
            checked={checked}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            {...rest}
          />

          {/* Custom visual checkbox box */}
          <span className={indicatorClasses} aria-hidden="true">
            {/* Checkmark — shown when selected (not indeterminate) */}
            {(checked && !indeterminate) && (
              <svg
                className={styles.iconCheck}
                viewBox="0 0 12 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M1 4L4.5 7.5L11 1"
                  stroke="currentColor"
                  style={{ strokeWidth: 'var(--border-width-l)' }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}

            {/* Minus dash — shown in indeterminate state */}
            {indeterminate && (
              <svg
                className={styles.iconMinus}
                viewBox="0 0 10 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M1 1H9"
                  stroke="currentColor"
                  style={{ strokeWidth: 'var(--border-width-l)' }}
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>

          {/* Label text */}
          {label && <span className={styles.labelText}>{label}</span>}
        </label>

        {/* Inline error message */}
        {typeof error === 'string' && error && (
          <p className={styles.errorMessage} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
