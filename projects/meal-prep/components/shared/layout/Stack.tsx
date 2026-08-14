import type { CSSProperties, ReactNode } from 'react'

/**
 * Stack — vertical (or horizontal) rhythm primitive.
 *
 * Gap tokens map to the layout scale defined in theme.css:
 *  - tight   → --layout-stack-tight
 *  - default → --layout-stack-default
 *  - loose   → --layout-stack-loose
 *  - section → --layout-section-y   (between major page sections)
 *
 * Use this instead of ad-hoc margin-bottom or gap utility classes when
 * composing pages so spacing stays in sync with theme tokens.
 */

type StackGap = 'tight' | 'default' | 'loose' | 'section'
type StackDirection = 'vertical' | 'horizontal'

interface StackProps {
  children: ReactNode
  gap?: StackGap
  direction?: StackDirection
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
  className?: string
  style?: CSSProperties
  as?: 'div' | 'section' | 'article' | 'ul' | 'ol' | 'nav' | 'header' | 'footer'
}

const GAP_TOKEN: Record<StackGap, string> = {
  tight: 'var(--layout-stack-tight)',
  default: 'var(--layout-stack-default)',
  loose: 'var(--layout-stack-loose)',
  section: 'var(--layout-section-y)',
}

export function Stack({
  children,
  gap = 'default',
  direction = 'vertical',
  align,
  justify,
  className,
  style,
  as: Tag = 'div',
}: StackProps) {
  return (
    <Tag
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: GAP_TOKEN[gap],
        alignItems: align,
        justifyContent: justify,
        ...style,
      }}
    >
      {children}
    </Tag>
  )
}
