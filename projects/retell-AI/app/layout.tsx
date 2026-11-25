import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Agent builder · Retell AI case study',
  description: 'Concept prototype for a UX case study: build, test and publish a voice agent. Not affiliated with Retell AI.',
  // A case-study prototype, shared by link only: keep it out of search results.
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-mode pinned to light until theme.dark.css exists (see ../ds-migration.md).
    <html lang="en" data-theme="retell-ai" data-mode="light">
      <body>{children}</body>
    </html>
  )
}
