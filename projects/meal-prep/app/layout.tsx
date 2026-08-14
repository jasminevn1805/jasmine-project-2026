import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
// Dedicated subpath, not the package root: the root bundle also contains
// components that use React hooks, and a Server Component (this file) can't
// import any export from a module whose bundle contains client-hook code -
// see vite.config.ts's `mode` entry for why this subpath exists.
import { getNoFlashScript } from '@jasmine/design-system/mode'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Meal Prep — Easy Kits for My Cooking',
  description: 'Save recipes from social media, plan your meals, and build your grocery list — all in one place.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning: the beforeInteractive script below sets
    // data-mode client-side (from localStorage or prefers-color-scheme)
    // before hydration, to avoid a light->dark flash on load - see
    // THEMING-CONTRACT.md §4. That means data-mode can legitimately differ
    // from whatever (nothing) the server rendered, on this one attribute.
    <html lang="en" data-theme="meal-prep" className={inter.variable} suppressHydrationWarning>
      <body>
        <Script
          id="mode-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: getNoFlashScript() }}
        />
        {children}
      </body>
    </html>
  )
}
