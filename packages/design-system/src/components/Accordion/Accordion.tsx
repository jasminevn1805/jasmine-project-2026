import React, { useId, useState } from 'react';
import { ChevronDown } from 'react-feather';
import styles from './Accordion.module.css';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AccordionItemData {
  /** Unique key for this item */
  id: string;
  /** Trigger heading text */
  heading: string;
  /** Expandable content (shown when open) */
  content?: React.ReactNode;
  /** Disable this individual item */
  disabled?: boolean;
}

export interface AccordionProps {
  /** List of accordion items */
  items: AccordionItemData[];
  /** Allow multiple items open simultaneously */
  multiple?: boolean;
  /** IDs of items open by default (uncontrolled) */
  defaultOpen?: string[];
  /** Controlled open state */
  openItems?: string[];
  /** Called when open state changes */
  onChange?: (openIds: string[]) => void;
  /** Additional CSS class */
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Accordion component — mapped 1:1 from Figma `Accordion` symbol.
 *
 * Figma structure:
 *   - Content row (heading + 24px chevron) with vertical Space/M (12px) padding
 *     and Space/S (8px) gap between heading and icon
 *   - Bottom Subtle divider (1px, --color-border-subtle)
 *   - Chevron rotates 180° when Open=True
 *
 * Typography tokens:
 *   - Heading: Heading/S/Semi Bold (20/28, -0.5)
 *   - Body:    Text/L/Regular     (16/24)
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  multiple = false,
  defaultOpen = [],
  openItems,
  onChange,
  className = '',
}) => {
  const uid = useId();
  const isControlled = openItems !== undefined;

  const [internalOpen, setInternalOpen] = useState<string[]>(defaultOpen);
  const activeItems = isControlled ? openItems! : internalOpen;

  const toggle = (id: string) => {
    let next: string[];

    if (multiple) {
      next = activeItems.includes(id)
        ? activeItems.filter((i) => i !== id)
        : [...activeItems, id];
    } else {
      next = activeItems.includes(id) ? [] : [id];
    }

    if (!isControlled) setInternalOpen(next);
    onChange?.(next);
  };

  const rootClasses = [styles.accordion, className].filter(Boolean).join(' ');

  return (
    <div className={rootClasses}>
      {items.map((item) => {
        const isOpen = activeItems.includes(item.id);
        const triggerId = `${uid}-trigger-${item.id}`;
        const panelId = `${uid}-panel-${item.id}`;

        const itemClasses = [
          styles.item,
          isOpen && styles.open,
          item.disabled && styles.disabled,
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div key={item.id} className={itemClasses}>
            <button
              id={triggerId}
              type="button"
              className={styles.trigger}
              aria-expanded={isOpen}
              aria-controls={panelId}
              disabled={item.disabled}
              onClick={() => toggle(item.id)}
            >
              <span className={styles.heading}>{item.heading}</span>
              <ChevronDown className={styles.icon} aria-hidden="true" />
            </button>

            {item.content !== undefined && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={styles.panel}
                hidden={!isOpen}
              >
                <div className={styles.panelInner}>{item.content}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
