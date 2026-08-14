import React from 'react';
import { Button } from '../Button';
import { Divider } from '../Divider';
import styles from './Row.module.css';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type RowLeadingAccessory =
  | { kind: 'checkmark' }
  | { kind: 'checkbox' }
  | { kind: 'radio' }
  | { kind: 'icon'; icon: React.ReactNode }
  | { kind: 'avatar'; initials?: string }
  | { kind: 'image'; src: string; alt?: string };

export type RowTrailingAccessory =
  | { kind: 'toggle' }
  | { kind: 'button'; label: string; onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void }
  | { kind: 'icon'; icon: React.ReactNode }
  | { kind: 'checkmark' };

export interface RowProps {
  /** Primary row text */
  text: string;
  /** Secondary text rendered below the primary text */
  secondaryText?: string;
  /** Leading accessory — checkmark, checkbox, radio, icon, avatar, or image */
  leading?: RowLeadingAccessory;
  /** Trailing accessory — toggle, button, icon, or checkmark */
  trailing?: RowTrailingAccessory;
  /** Renders a subtle divider along the bottom edge */
  divider?: boolean;
  /** Additional CSS class on the outer wrapper */
  className?: string;
}

/* ─── Accessory renderers ────────────────────────────────────────────────── */

function renderLeading(accessory: RowLeadingAccessory): React.ReactNode {
  switch (accessory.kind) {
    case 'checkmark':
      return <span className={styles.checkmark} aria-hidden="true" />;
    case 'checkbox':
      return <span className={styles.checkbox} aria-hidden="true" />;
    case 'radio':
      return <span className={styles.radio} aria-hidden="true" />;
    case 'icon':
      return <span className={styles.icon}>{accessory.icon}</span>;
    case 'avatar':
      return (
        <span className={styles.avatar} aria-hidden="true">
          {accessory.initials && <span className={styles.avatarInitials}>{accessory.initials}</span>}
        </span>
      );
    case 'image':
      return <img className={styles.image} src={accessory.src} alt={accessory.alt ?? ''} />;
    default:
      return null;
  }
}

function renderTrailing(accessory: RowTrailingAccessory): React.ReactNode {
  switch (accessory.kind) {
    case 'toggle':
      return (
        <span className={styles.toggle} aria-hidden="true">
          <span className={styles.toggleKnob} />
        </span>
      );
    case 'button':
      return (
        <Button size="S" type="Primary" onClick={accessory.onClick}>
          {accessory.label}
        </Button>
      );
    case 'icon':
      return <span className={styles.icon}>{accessory.icon}</span>;
    case 'checkmark':
      return <span className={styles.checkmark} aria-hidden="true" />;
    default:
      return null;
  }
}

/**
 * Row component — Jasmine Design System
 *
 * A single list-item row: an optional leading accessory, primary/secondary
 * text, an optional trailing accessory, and an optional bottom divider.
 *
 * Usage:
 * ```tsx
 * <Row text="Notifications" trailing={{ kind: 'toggle' }} />
 * <Row text="Jane Doe" secondaryText="jane@example.com" leading={{ kind: 'avatar', initials: 'JD' }} />
 * ```
 */
export const Row: React.FC<RowProps> = ({
  text,
  secondaryText,
  leading,
  trailing,
  divider = true,
  className = '',
}) => {
  const wrapperClasses = [styles.row, className].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      <div className={styles.content}>
        {leading && renderLeading(leading)}
        <div className={styles.text}>
          <p className={styles.primaryText}>{text}</p>
          {secondaryText && <p className={styles.secondaryText}>{secondaryText}</p>}
        </div>
        {trailing && renderTrailing(trailing)}
      </div>
      {divider && <Divider type="Subtle" className={styles.divider} />}
    </div>
  );
};

Row.displayName = 'Row';
