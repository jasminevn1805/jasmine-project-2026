/**
 * PageShell — page-level container.
 *
 * Constrains content to --layout-max-w and centers it horizontally.
 * Does NOT add horizontal gutters — leave that to PageHeader and
 * section bodies, which use --layout-page-x. This lets sticky headers
 * span edge-to-edge while body content stays gutter-aligned.
 *
 * Visual contract:
 *   <PageShell>
 *     <PageHeader … />
 *     <SectionHeader … />
 *     …
 *   </PageShell>
 */

import type { ReactNode, CSSProperties } from 'react'

interface PageShellProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function PageShell({ children, className, style }: PageShellProps) {
  return (
    <div
      className={['mx-auto w-full', className].filter(Boolean).join(' ')}
      style={{
        maxWidth: 'var(--layout-max-w)',
        overflowX: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
