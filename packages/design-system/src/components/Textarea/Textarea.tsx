import React from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Optional label rendered above the textarea */
  label?: string;
  /** Error state — shows red border and optional message */
  error?: boolean | string;
  /** Additional CSS class on the outermost wrapper */
  wrapperClassName?: string;
}

/**
 * Textarea component from Jasmine Design System.
 *
 * A multi-line text input that uses semantic design tokens for consistent
 * styling across all projects in the monorepo.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, wrapperClassName = '', className = '', ...rest }, ref) => {
    const hasError = !!error;

    const fieldClasses = [styles.field, hasError && styles.error, wrapperClassName]
      .filter(Boolean)
      .join(' ');

    const textareaClasses = [styles.textarea, className].filter(Boolean).join(' ');

    return (
      <div className={fieldClasses}>
        {label && <label className={styles.label}>{label}</label>}
        <textarea ref={ref} className={textareaClasses} {...rest} />
        {typeof error === 'string' && error && (
          <p className={styles.errorMessage}>{error}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
