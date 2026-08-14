import React, { useId } from 'react';
import styles from './Radio.module.css';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text shown beside the radio */
  label?: string;
  /** Error / negative state — shows red border and optional message below */
  error?: boolean | string;
  /** Additional CSS class on the outer wrapper */
  wrapperClassName?: string;
}

/**
 * Radio component — Jasmine Design System
 *
 * A fully accessible radio input that matches all six Figma states:
 * Default · Focus · Selected · Disabled · Selected + Disabled · Error (Negative)
 *
 * Usage:
 * ```tsx
 * <Radio label="Option A" name="choice" value="a" checked={val === 'a'} onChange={…} />
 * ```
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
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

    const wrapperClasses = [
      styles.wrapper,
      disabled && styles.disabled,
      wrapperClassName,
    ]
      .filter(Boolean)
      .join(' ');

    const indicatorClasses = [
      styles.indicator,
      checked && styles.indicatorChecked,
      hasError && styles.indicatorError,
      disabled && checked && styles.indicatorCheckedDisabled,
      disabled && !checked && styles.indicatorDisabled,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        <label className={styles.label} htmlFor={id}>
          {/* Hidden native input — keeps all keyboard / screen-reader behaviour */}
          <input
            ref={ref}
            id={id}
            type="radio"
            className={styles.nativeInput}
            checked={checked}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            {...rest}
          />

          {/* Custom visual radio circle */}
          <span className={indicatorClasses} aria-hidden="true">
            {checked && <span className={styles.dot} />}
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

Radio.displayName = 'Radio';
