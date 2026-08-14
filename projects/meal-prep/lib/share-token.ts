import type { GroceryList, SharePayload } from '@/types'

// ─── UTF-8 ⇄ base64 helpers ────────────────────────────────────────────────
// Using TextEncoder/TextDecoder + btoa/atob works identically in browsers and
// Node 18+ server runtime (no Buffer, no deprecated escape/unescape).

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

function base64ToUtf8(b64: string): string {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

/**
 * Generate a URL-safe share token from a payload.
 * - base64url alphabet: A-Z a-z 0-9 - _
 * - no `=` padding
 * The full list snapshot is embedded so recipients can view without
 * needing the sharer's localStorage.
 */
export function generateShareToken(payload: SharePayload): string {
  return utf8ToBase64(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Convenience: build a grocery-list token with the full snapshot embedded.
 */
export function generateGroceryShareToken(list: GroceryList): string {
  const payload: SharePayload = { type: 'grocery-list', id: list.id, snapshot: list }
  return generateShareToken(payload)
}

/**
 * Decode a share token back to a payload.
 * Accepts:
 *  - new URL-safe tokens (- _ no padding)
 *  - legacy tokens with raw `+` `/` `=`
 *  - legacy tokens where the browser percent-encoded `=` as `%3D`, etc.
 */
export function decodeShareToken(token: string): SharePayload | null {
  try {
    // 1. Undo any percent-encoding (e.g. `%3D` → `=`)
    const urlDecoded = decodeURIComponent(token)
    // 2. Convert URL-safe base64 → standard base64
    const standard = urlDecoded.replace(/-/g, '+').replace(/_/g, '/')
    // 3. Re-add `=` padding if stripped
    const padded = standard + '='.repeat((4 - (standard.length % 4)) % 4)
    return JSON.parse(base64ToUtf8(padded)) as SharePayload
  } catch {
    return null
  }
}

/**
 * Build the full shareable URL for copying.
 */
export function buildShareUrl(token: string): string {
  const base =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? ''
  return `${base}/share/${token}`
}
