import React, { useRef, useEffect, useCallback } from 'react';
import styles from './ScrollTabBar.module.css';

// ── Types ───────────────────────────────────────────────────

export interface ScrollTabItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
}

export type ScrollTabBarVariant = 'brand' | 'inverse' | 'neutral';

export interface ScrollTabBarProps {
  /** The list of tabs to render */
  items: ScrollTabItem[];
  /** Currently selected tab id */
  activeId: string | null;
  /** Called when a tab is clicked */
  onSelect: (id: string) => void;
  /**
   * Optional id of a tab to highlight with a dot indicator
   * (e.g. current month, today). The dot only shows when the
   * highlighted tab is *not* the active tab.
   */
  highlightId?: string | null;
  /**
   * Visual variant for the active tab.
   * - `brand`   – brand background, inverse text (default)
   * - `inverse` – dark/inverse background, inverse text
   * - `neutral` – neutral background, primary text
   */
  variant?: ScrollTabBarVariant;
  /** Extra CSS class on the outer container */
  className?: string;
  /** Inline styles on the outer container */
  style?: React.CSSProperties;
  /** Gap between tabs — CSS value (default: '4px') */
  gap?: string;
  /** Tab size preset */
  size?: 'sm' | 'md';
}

// ── Component ───────────────────────────────────────────────

/**
 * A simple, horizontally-scrolling tab bar for selecting between items.
 *
 * This is a **select-only** component — no rename, delete, duplicate, or
 * create actions. It is designed to be reusable across projects and lives
 * in the Jasmine Design System.
 *
 * All colours reference CSS custom-property design tokens so themes are
 * picked up automatically.
 */
export const ScrollTabBar: React.FC<ScrollTabBarProps> = ({
  items,
  activeId,
  onSelect,
  highlightId = null,
  variant = 'brand',
  className,
  style,
  gap = '4px',
  size = 'sm',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll the active tab into view when it changes
  useEffect(() => {
    if (!activeId || !scrollRef.current) return;
    const container = scrollRef.current;
    const activeEl = container.querySelector<HTMLElement>(
      `[data-tab-id="${activeId}"]`,
    );
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    }
  }, [activeId]);

  const handleSelect = useCallback(
    (id: string) => () => onSelect(id),
    [onSelect],
  );

  const containerClasses = [styles.container, className].filter(Boolean).join(' ');

  return (
    <div
      ref={scrollRef}
      className={containerClasses}
      style={{ gap, ...style }}
      role="tablist"
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        const isHighlighted = highlightId === item.id;

        const tabClasses = [
          styles.tab,
          styles[size],
          isActive && styles[`active_${variant}`],
          !isActive && isHighlighted && styles.highlighted,
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={item.id}
            data-tab-id={item.id}
            role="tab"
            aria-selected={isActive}
            className={tabClasses}
            onClick={handleSelect(item.id)}
          >
            {item.label}

            {/* Highlight dot (only when not the active tab) */}
            {isHighlighted && !isActive && (
              <span className={styles.dot} aria-hidden="true" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ScrollTabBar;
