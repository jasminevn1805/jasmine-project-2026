import { NextRequest, NextResponse } from 'next/server'

const TIMEOUT_MS = 5000

// ── SSRF protection ──────────────────────────────────────────────────────────
// Known social / recipe platforms skip content validation.
// Unknown domains are allowed through but their HTML is checked for cooking signals.
const KNOWN_HOSTNAMES = [
  // Social
  'instagram.com',
  'www.instagram.com',
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'tiktok.com',
  'www.tiktok.com',
  'facebook.com',
  'www.facebook.com',
  'fb.watch',
  // Popular recipe sites
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

function isKnownHost(host: string): boolean {
  return KNOWN_HOSTNAMES.some((h) => host === h || host.endsWith(`.${h}`))
}

function validateUrl(raw: string): { ok: true; parsed: URL; isKnown: boolean } | { ok: false; error: string } {
  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return { ok: false, error: 'Malformed URL' }
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, error: 'Only http and https URLs are allowed' }
  }

  const host = parsed.hostname.toLowerCase()
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host.startsWith('192.168.') ||
    host.startsWith('10.') ||
    host.startsWith('172.') ||
    host === '169.254.169.254'
  ) {
    return { ok: false, error: 'Internal addresses are not allowed' }
  }

  return { ok: true, parsed, isKnown: isKnownHost(host) }
}

/**
 * Cooking content detection for unknown domains.
 *
 * Three tiers:
 *   1. Schema.org Recipe structured data → instant pass
 *   2. Strong cooking keywords in the first 10 000 chars → need 3+ unique hits
 *   3. Otherwise reject
 *
 * Keywords are intentionally specific to cooking — generic words like
 * "dinner" or "lunch" that appear on non-cooking sites are excluded.
 */
function looksLikeCookingContent(html: string): boolean {
  const lower = html.toLowerCase()

  // ── Tier 1: Schema.org Recipe (strongest signal) ──
  if (/"@type"\s*:\s*"recipe"/i.test(html)) return true
  if (lower.includes('itemtype') && lower.includes('schema.org/recipe')) return true

  // ── Tier 2: Cooking-specific keywords (need 3+ unique matches) ──
  const COOKING_KEYWORDS = [
    'ingredient',       // recipe content
    'ingredients',
    'cook time',
    'prep time',
    'total time',
    'servings',
    'tablespoon',
    'teaspoon',
    'preheat',
    'simmer',
    'sauté',
    'whisk',
    'marinate',
    'bake at',
    'degrees f',
    'degrees c',
    'nutrition facts',
    'calories per serving',
    'recipeingredient',  // JSON-LD / microdata fields
    'recipeinstructions',
    'recipeyield',
    'cooktimemin',
  ]

  // Scan a larger portion (first 10k chars covers <head> + start of body)
  const chunk = lower.slice(0, 10_000)
  let hits = 0
  for (const kw of COOKING_KEYWORDS) {
    if (chunk.includes(kw)) hits++
    if (hits >= 3) return true
  }

  return false
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  // Validate before fetching anything
  const validation = validateUrl(url)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    const res = await fetch(validation.parsed.toString(), {
      signal: controller.signal,
      headers: {
        // Mimic a browser to avoid bot-blocking
        'User-Agent':
          'Mozilla/5.0 (compatible; CookstashBot/1.0; +https://prepkit.app)',
        Accept: 'text/html',
      },
    })

    clearTimeout(timer)

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 502 })
    }

    const html = await res.text()

    // For unknown domains, verify the page has cooking content
    if (!validation.isKnown && !looksLikeCookingContent(html)) {
      return NextResponse.json(
        { error: 'This does not appear to be a recipe or cooking page. Try a link from Instagram, TikTok, YouTube, Facebook, or a cooking website.' },
        { status: 422 },
      )
    }

    // Extract OG tags with regex (no DOM parser needed server-side)
    const ogTitle =
      html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)?.[1] ??
      html.match(/<title>([^<]+)<\/title>/i)?.[1] ??
      null

    const ogImage =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1] ??
      null

    return NextResponse.json({
      title: ogTitle?.trim() ?? null,
      thumbnail: ogImage ?? null,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
