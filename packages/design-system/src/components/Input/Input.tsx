import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Optional label rendered above the input */
  label?: string;
  /** Error state — shows red border and optional message */
  error?: boolean | string;
  /** Additional CSS class on the outermost wrapper */
  wrapperClassName?: string;
}

/**
 * Input component from Jasmine Design System.
 *
 * A single-line text input that uses semantic design tokens for consistent
 * styling across all projects in the monorepo.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, wrapperClassName = '', className = '', ...rest }, ref) => {
    const hasError = !!error;

    const fieldClasses = [styles.field, hasError && styles.error, wrapperClassName]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [styles.input, className].filter(Boolean).join(' ');

    return (
      <div className={fieldClasses}>
        {label && <label className={styles.label}>{label}</label>}
        <input ref={ref} className={inputClasses} {...rest} />
        {typeof error === 'string' && error && (
          <p className={styles.errorMessage}>{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
