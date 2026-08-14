import React, { useCallback, useEffect, useRef } from 'react';
import { X as CloseX, ArrowLeft } from 'react-feather';
import { Button } from '../Button';
import styles from './Modal.module.css';

/* ─── Re-exported helper icon (back-compat with old Modal story) ─────────── */
export const ArrowLeftIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <ArrowLeft size={size} />
);

/* ─── Types ──────────────────────────────────────────────────────────────── */

/**
 * Device variant. Determines:
 * - panel width (Desktop: 608, Mobile: 370)
 * - panel padding (Desktop: Space/2XL=32, Mobile: Space/L=16)
 * - heading typography (Desktop: Heading/M, Mobile: Heading/S)
 * - actions direction (Desktop: row, Mobile: column with Primary on top)
 */
export type ModalDevice = 'Desktop' | 'Mobile';

/**
 * Visual / structural variants.
 * - `default`: Single padded container with explicit `slot`
 * + Actions row (Button Primary / Secondary) + optional Text button.
 * - `form`: Legacy split layout (Header / Body / Footer) — kept for
 * longer scrollable forms with pinned header & footer.
 */
export type ModalVariant = 'default' | 'form';

/** Panel max-width preset (form variant only — default variant uses `device`). */
export type ModalSize = 'S' | 'M' | 'L' | 'XL';

/** Action descriptor — wired into the project's <Button /> component. */
export interface ModalAction {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface ModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Called when the modal should close */
  onClose: () => void;
  /** Heading text shown in the Content row */
  title: string;
  /** Subtitle below the title (form variant only) */
  subtitle?: string;
  /** Device variant. Default: 'Desktop' */
  device?: ModalDevice;
  /** Visual layout variant. Default: 'default' */
  variant?: ModalVariant;
  /** Panel max-width preset (form variant only) */
  size?: ModalSize;

  /**
 * Default-variant slot content. Replace with any content
 * (text, list, form, etc.). When `undefined`, a dashed placeholder
 * a dashed placeholder is rendered.
 */
  slot?: React.ReactNode;

  /**
 * Form-variant body content. Equivalent to `<Modal.Body>{children}</Modal.Body>`.
 * Also accepted in `default` variant as an alias for `slot` if `slot` is unset.
 */
  children?: React.ReactNode;

  /* ── Default-variant action slots ── */
  /** Filled brand action button */
  primaryAction?: ModalAction;
  /** Filled neutral secondary button */
  secondaryAction?: ModalAction;
  /** Centered text-link button below the actions row */
  textAction?: ModalAction;
  /** Hide the entire Actions row */
  hideActions?: boolean;

  /* ── Form-variant slots ── */
  /** Footer slot (form variant) — typically `<Modal.Actions />` */
  footer?: React.ReactNode;
  /** Slot to the left of the title (e.g. back button) */
  headerLeft?: React.ReactNode;
  /** Slot between header and body (e.g. step indicator) */
  headerExtra?: React.ReactNode;

  /** Hide the X close button */
  hideCloseButton?: boolean;
  /** Extra className on the panel */
  className?: string;
}

/* ─── Header (Content row) ───────────────────────────────────────────────── */

export interface ModalHeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  left?: React.ReactNode;
  extra?: React.ReactNode;
  hideCloseButton?: boolean;
  /** Use the smaller Heading/S (mobile / default-variant on mobile) */
  compact?: boolean;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  title, subtitle, onClose, left, extra, hideCloseButton = false, compact = false,
}) => (
  <>
    <div className={styles.header}>
      <div className={styles.headerTitleRow}>
        {left}
        <div className={styles.headerTitleGroup}>
          <h2 className={`${styles.title} ${compact ? styles.titleCompact : ''}`}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      {!hideCloseButton && onClose && (
        <button className={styles.closeButton} onClick={onClose} aria-label="Close" type="button">
          <CloseX size={24} />
        </button>
      )}
    </div>
    {extra}
  </>
);

/* ─── Slot (with dashed placeholder when empty) ───────────────────── */

const SlotPlaceholder: React.FC = () => (
  <div className={styles.slotPlaceholder} aria-hidden="true">
    <span className={styles.slotPlaceholderLabel}>Slot</span>
  </div>
);

const ModalSlot: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className={styles.slot}>{children ?? <SlotPlaceholder />}</div>
);

/* ─── Form-variant compound API (back-compat) ────────────────────────────── */

export interface ModalBodyProps { children: React.ReactNode; className?: string; }
const ModalBody: React.FC<ModalBodyProps> = ({ children, className }) => (
  <div className={`${styles.body}${className ? ` ${className}` : ''}`}>{children}</div>
);

export interface ModalFooterProps { children: React.ReactNode; className?: string; }
const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => (
  <div className={`${styles.footer}${className ? ` ${className}` : ''}`}>{children}</div>
);

export interface ModalActionsProps {
  secondary?: string;
  primary?: string;
  onSecondary?: () => void;
  onPrimary?: () => void;
  disablePrimary?: boolean;
}

const ModalActions: React.FC<ModalActionsProps> = ({
  secondary = 'Cancel', primary = 'Confirm', onSecondary, onPrimary, disablePrimary = false,
}) => (
  <div className={styles.legacyActions}>
    {secondary && (
      <Button type="Outline" size="M" onClick={onSecondary}>{secondary}</Button>
    )}
    <Button type="Primary" size="M" onClick={onPrimary} disabled={disablePrimary}>{primary}</Button>
  </div>
);

/* ─── Actions row + Button Text (default variant) ──────────────────── */

interface ActionsRowProps {
  device: ModalDevice;
  primary?: ModalAction;
  secondary?: ModalAction;
  textAction?: ModalAction;
  hideActions?: boolean;
}

const ActionsRow: React.FC<ActionsRowProps> = ({
  device, primary, secondary, textAction, hideActions,
}) => {
  if (hideActions || (!primary && !secondary && !textAction)) return null;
  // On Mobile the Primary button visually appears ABOVE the Secondary
  const orderClass = device === 'Mobile' ? styles.actionsMobile : styles.actionsDesktop;
  return (
    <>
      {(primary || secondary) && (
        <div className={`${styles.actions} ${orderClass}`} data-name="Actions">
          {device === 'Mobile' && primary && (
            <Button type="Primary" size="M" onClick={primary.onClick} disabled={primary.disabled} loading={primary.loading} className={styles.actionBtn}>
              {primary.label}
            </Button>
          )}
          {secondary && (
            <Button type="Secondary" size="M" onClick={secondary.onClick} disabled={secondary.disabled} loading={secondary.loading} className={styles.actionBtn}>
              {secondary.label}
            </Button>
          )}
          {device === 'Desktop' && primary && (
            <Button type="Primary" size="M" onClick={primary.onClick} disabled={primary.disabled} loading={primary.loading} className={styles.actionBtn}>
              {primary.label}
            </Button>
          )}
        </div>
      )}
      {textAction && (
        <div className={styles.textActionWrap} data-name="Button Text">
          <Button type="Text" size="M" onClick={textAction.onClick} disabled={textAction.disabled} loading={textAction.loading}>
            {textAction.label}
          </Button>
        </div>
      )}
    </>
  );
};

/* ─── Size map (form variant width preset) ───────────────────────────────── */

const SIZE_CLASS: Record<ModalSize, string> = {
  S: styles.panelS, M: styles.panelM, L: styles.panelL, XL: styles.panelXL,
};

/* ─── Modal base ─────────────────────────────────────────────────────────── */

const ModalBase: React.FC<ModalProps> = ({
  open, onClose, title, subtitle,
  device = 'Desktop',
  variant = 'default',
  size = 'L',
  slot, children,
  primaryAction, secondaryAction, textAction, hideActions = false,
  footer, headerLeft, headerExtra,
  hideCloseButton = false, className,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  const isDefault = variant === 'default';

  const panelClasses = [
    styles.panel,
    isDefault ? styles.panelDefault : styles.panelForm,
    isDefault ? (device === 'Mobile' ? styles.panelMobile : styles.panelDesktop) : SIZE_CLASS[size],
    className,
  ].filter(Boolean).join(' ');

  // In default variant, accept `slot` first, fall back to `children`, then placeholder
  const slotContent = isDefault ? (slot !== undefined ? slot : children) : undefined;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div ref={panelRef} className={panelClasses} onClick={(e) => e.stopPropagation()} data-device={device}>
        <ModalHeader
          title={title}
          subtitle={!isDefault ? subtitle : undefined}
          onClose={onClose}
          left={headerLeft}
          extra={headerExtra}
          hideCloseButton={hideCloseButton}
          compact={isDefault && device === 'Mobile'}
        />

        {isDefault ? (
          <>
            <ModalSlot>{slotContent}</ModalSlot>
            <ActionsRow
              device={device}
              primary={primaryAction}
              secondary={secondaryAction}
              textAction={textAction}
              hideActions={hideActions}
            />
          </>
        ) : (
          <>
            <ModalBody>{children}</ModalBody>
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </>
        )}
      </div>
    </div>
  );
};

export const Modal = Object.assign(ModalBase, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  Actions: ModalActions,
});

export default Modal;
