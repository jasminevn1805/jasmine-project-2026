/**
 * Shared light/dark mode helper.
 *
 * Single, framework-agnostic implementation of the mode-ownership decision in
 * THEMING-CONTRACT.md §4: no consuming project (meal-prep, portfolio-site,
 * Storybook, future products) reads `prefers-color-scheme` or persists a
 * user's override on its own - they all call this.
 *
 * SSR-safe: every function checks for a browser environment first, so this
 * can be imported (though not usefully called before hydration) from
 * server-rendered code without throwing.
 */

export type Mode = 'light' | 'dark';

const STORAGE_KEY = 'jasmine-ds-mode';
const MODE_ATTRIBUTE = 'data-mode';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/** The OS/browser's current preference, ignoring any stored override. */
export function getSystemMode(): Mode {
  if (!isBrowser() || typeof window.matchMedia !== 'function') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** The user's explicit override, if they've ever set one. `null` if unset or unavailable. */
export function getStoredModeOverride(): Mode | null {
  if (!isBrowser()) return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    // localStorage can throw (private browsing, disabled storage, etc.) - treat as unset.
    return null;
  }
}

/** Stored override if present, otherwise system preference. What a page should render on load. */
export function getInitialMode(): Mode {
  return getStoredModeOverride() ?? getSystemMode();
}

/** Sets `data-mode` on `<html>`. Does not persist - see `setModeOverride` for that. */
export function applyMode(mode: Mode): void {
  if (!isBrowser()) return;
  document.documentElement.setAttribute(MODE_ATTRIBUTE, mode);
}

/** Persists an explicit user choice and applies it immediately. */
export function setModeOverride(mode: Mode): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Storage unavailable - mode still applies for this session, just won't persist.
  }
  applyMode(mode);
}

/** Clears any stored override, reverting future loads to following system preference. */
export function clearModeOverride(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable - nothing to clear.
  }
}

/**
 * Applies the correct initial mode and returns it. Call once on app start
 * (e.g. in a root layout's client-side effect).
 */
export function initMode(): Mode {
  const mode = getInitialMode();
  applyMode(mode);
  return mode;
}

/**
 * Subscribes to OS-level preference changes. Only invokes `callback` while
 * the user has no explicit stored override - once they've chosen a mode,
 * system changes shouldn't silently override that choice out from under them.
 * Returns an unsubscribe function.
 */
export function watchSystemMode(callback: (mode: Mode) => void): () => void {
  if (!isBrowser() || typeof window.matchMedia !== 'function') return () => {};

  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const listener = (event: MediaQueryListEvent) => {
    if (getStoredModeOverride() === null) {
      callback(event.matches ? 'dark' : 'light');
    }
  };

  mql.addEventListener('change', listener);
  return () => mql.removeEventListener('change', listener);
}

/**
 * Inline script source for a document `<head>`, to be executed before first
 * paint so the correct mode is set before React hydrates - without this,
 * a page defaulting to light and then flipping to dark post-hydration
 * produces a visible flash. Consuming apps inject this themselves (each
 * framework has its own way to inject a pre-hydration inline script; this
 * package can't do that injection on their behalf), but the *logic* - what
 * the script actually checks - is owned here so it's not reimplemented
 * slightly differently per project.
 *
 * Mirrors getInitialMode()/applyMode() exactly; kept as a plain string
 * because it must run standalone, before any JS bundle (including this
 * module) has loaded.
 */
export function getNoFlashScript(): string {
  return `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var m=(s==='light'||s==='dark')?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('${MODE_ATTRIBUTE}',m);}catch(e){}})();`;
}
