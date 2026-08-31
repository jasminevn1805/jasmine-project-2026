'use client'

import { useState, useEffect } from 'react'

/**
 * Returns true when the viewport matches the given media query string.
 * Falls back to `false` during SSR so the server render matches a
 * desktop-first layout.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    function onChange(e: MediaQueryListEvent) {
      setMatches(e.matches)
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Convenience: true when viewport width < 768px */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}
