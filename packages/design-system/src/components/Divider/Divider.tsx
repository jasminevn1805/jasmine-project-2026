import React from 'react';
import styles from './Divider.module.css';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type DividerType = 'Default' | 'Subtle';

export interface DividerProps {
  /** Line color weight — Default (border-primary) or Subtle (border-subtle) */
  type?: DividerType;
  /** Additional CSS class on the line element */
  className?: string;
}

/**
 * Divider component — Jasmine Design System
 *
 * A single 1px horizontal rule used to separate list rows and sections.
 *
 * Usage:
 * ```tsx
 * <Divider />
 * <Divider type="Subtle" />
 * ```
 */
export const Divider: React.FC<DividerProps> = ({ type = 'Default', className = '' }) => {
  const dividerClasses = [styles.divider, styles[type.toLowerCase()], className]
    .filter(Boolean)
    .join(' ');

  return <hr className={dividerClasses} />;
};

Divider.displayName = 'Divider';
