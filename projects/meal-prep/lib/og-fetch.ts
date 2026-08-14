import type { Platform } from '@/types'

// ── Known social / recipe platforms (client-side allowlist) ──
const SOCIAL_DOMAINS = [
  'instagram.com',
  'facebook.com',
  'fb.watch',
  'youtube.com',
  'youtu.be',
  'tiktok.com',
]

// Popular recipe / cooking websites — extend as needed
const COOKING_DOMAINS = [
  'allrecipes.com',
  'foodnetwork.com',
  'epicurious.com',
  'bonappetit.com',
  'seriouseats.com',
  'simplyrecipes.com',
  'delish.com',
  'tasty.co',
  'food52.com',
  'cookieandkate.com',
  'minimalistbaker.com',
  'budgetbytes.com',
  'halfbakedharvest.com',
  'pinchofyum.com',
  'thekitchn.com',
  'skinnytaste.com',
  'loveandlemons.com',
  'damndelicious.net',
  'cafedelites.com',
  'recipetineats.com',
  'justonecookbook.com',
  'maangchi.com',
  'woksoflife.com',
  'kingarthurbaking.com',
  'sallysbakingaddiction.com',
]

const ALLOWED_DOMAINS = [...SOCIAL_DOMAINS, ...COOKING_DOMAINS]

/**
 * Validate a URL for the recipe saver.
 *
 * Returns `{ ok: true }` for:
 *  - Known social platforms (Instagram, TikTok, YouTube, Facebook)
 *  - Known cooking websites (allrecipes, epicurious, etc.)
 *  - Any other https:// URL (will be validated server-side for cooking content)
 *
 * Returns `{ ok: false, error }` for:
 *  - Missing / malformed URLs
 *  - Non-http(s) protocols
 *  - Localhost / private IPs
 */
export function validateRecipeUrl(raw: string): { ok: true; isKnownDomain: boolean } | { ok: false; error: string } {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: false, error: 'Please enter a URL' }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return { ok: false, error: 'That does not look like a valid URL' }
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, error: 'Only http and https links are supported' }
  }

  const host = parsed.hostname.toLowerCase()
  if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host.startsWith('192.168.') || host.startsWith('10.')) {
    return { ok: false, error: 'Local addresses are not allowed' }
  }

  const isKnownDomain = ALLOWED_DOMAINS.some((d) => host === d || host === `www.${d}` || host.endsWith(`.${d}`))

  return { ok: true, isKnownDomain }
}

/**
 * Detect platform from URL
 */
export function detectPlatform(url: string): Platform {
  if (url.includes('instagram.com')) return 'instagram'
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('tiktok.com')) return 'tiktok'
  return 'other'
}

/**
 * Fetch OG metadata from /api/og server route.
 * Avoids CORS issues by going through Next.js API.
 * Throws with a user-friendly message if the server rejects the URL.
 */
export async function fetchOGMetadata(url: string): Promise<{
  title: string | null
  thumbnail: string | null
  platform: Platform
}> {
  const platform = detectPlatform(url)

  const res = await fetch(
    `/api/og?url=${encodeURIComponent(url)}`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error ?? 'Could not fetch recipe info')
  }

  const data = await res.json()
  return { title: data.title ?? null, thumbnail: data.thumbnail ?? null, platform }
}
