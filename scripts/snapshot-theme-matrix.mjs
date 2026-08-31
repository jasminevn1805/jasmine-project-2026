// Visual regression guardrail across the data-theme x data-mode matrix.
//
// Captures a screenshot for each real combination that exists today, and
// compares its SHA256 hash against a committed baseline manifest. A hash
// mismatch means some pixel changed since the baseline was recorded - go
// look at the new screenshot (saved alongside) before deciding if that
// change was intended.
//
// This is a coarse changed/unchanged signal, not full pixel-diffing (no
// diff percentage, no diff image, no ignoring of e.g. anti-aliasing noise).
// Upgrading to pixelmatch+pngjs for an actual visual diff is a reasonable
// next step - not done here, to avoid a new dependency for a first pass.
//
// Requires the relevant servers already running:
//   cookstash       -> http://localhost:3000
//   portfolio-site -> http://localhost:3001
//   storybook      -> http://localhost:6006
//
// Prefer `next start` (production build) over `next dev` for the Next.js
// apps when recording a real baseline - dev mode's HMR overlay ("Compiling
// ...", the corner build-activity badge) introduces non-deterministic pixels
// between otherwise-identical runs, which reads as a false-positive diff.
// Dev servers are fine for a quick manual check, just expect occasional
// noise from that chrome, not from an actual token change.
//
// Usage:
//   node scripts/snapshot-theme-matrix.mjs           # compare against baseline, exit 1 on any diff
//   node scripts/snapshot-theme-matrix.mjs --update  # (re)record the baseline from current output

import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASELINE_DIR = path.join(ROOT, 'scripts/visual-baselines');
const MANIFEST_PATH = path.join(BASELINE_DIR, 'manifest.json');

const UPDATE = process.argv.includes('--update');

// Overridable via env - point these at `next start` (production) ports when
// recording a real baseline; dev-server ports are a fine default for a
// quick manual look, but expect dev-mode overlay noise to occasionally
// register as a false-positive diff (see header comment).
const COOKSTASH = process.env.COOKSTASH_URL ?? 'http://localhost:3000';
const PORTFOLIO = process.env.PORTFOLIO_URL ?? 'http://localhost:3001';
const STORYBOOK = process.env.STORYBOOK_URL ?? 'http://localhost:6006';

// Every combination that actually exists today - not every theoretical
// combination of every theme x every mode. cookstash has both modes;
// portfolio is light-only by explicit decision (see THEMING-CONTRACT.md §6);
// Storybook renders the DS's own Brand default in both modes.
const COMBOS = [
  {
    name: 'cookstash--light',
    url: `${COOKSTASH}/login`,
    colorScheme: 'light',
  },
  {
    name: 'cookstash--dark',
    url: `${COOKSTASH}/login`,
    colorScheme: 'dark',
  },
  {
    name: 'portfolio--light',
    url: `${PORTFOLIO}/`,
    colorScheme: 'light',
  },
  {
    name: 'storybook-brand--light',
    url: `${STORYBOOK}/iframe.html?id=components-button--all-types&viewMode=story&globals=mode:light`,
    colorScheme: 'light',
  },
  {
    name: 'storybook-brand--dark',
    url: `${STORYBOOK}/iframe.html?id=components-button--all-types&viewMode=story&globals=mode:dark`,
    colorScheme: 'dark',
  },
];

function hash(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function main() {
  await mkdir(BASELINE_DIR, { recursive: true });

  let manifest = {};
  if (existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  }

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const results = [];

  for (const combo of COMBOS) {
    const context = await browser.newContext({
      colorScheme: combo.colorScheme,
      viewport: { width: 1280, height: 800 },
      // portfolio-site's entrance/scroll animations (framer-motion) settle
      // at a different progress on every capture otherwise, registering as
      // a false-positive diff even with nothing actually changed - confirmed
      // by two consecutive captures differing from each other, not just
      // from the baseline. Reduced-motion is respected by framer-motion and
      // most animation libraries, and is the standard fix for this class of
      // visual-regression flakiness.
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();

    try {
      // domcontentloaded, not networkidle: Next.js dev servers keep an HMR
      // websocket open indefinitely, so networkidle never resolves and just
      // times out - confirmed by an actual failed run against portfolio-site.
      await page.goto(combo.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      // Long wait, not a short one: portfolio-site's framer-motion entrance
      // animations use spring physics that approach their rest position
      // asymptotically rather than stopping cleanly, and don't automatically
      // respect the context's reducedMotion setting unless the component
      // code explicitly checks for it (confirmed - two consecutive captures
      // differed by an amount invisible to the eye, consistent with a
      // long-tail spring settle, not an actual visual change). A short wait
      // reliably catches it mid-settle.
      await page.waitForTimeout(4000);
      const buffer = await page.screenshot({ fullPage: false });
      const newHash = hash(buffer);
      const screenshotPath = path.join(BASELINE_DIR, `${combo.name}.png`);

      if (UPDATE) {
        await writeFile(screenshotPath, buffer);
        manifest[combo.name] = newHash;
        results.push({ name: combo.name, status: 'recorded', hash: newHash });
      } else {
        const baselineHash = manifest[combo.name];
        if (!baselineHash) {
          // No baseline yet for this combo - save the screenshot so there's
          // something to look at, but don't fail the run for it; run with
          // --update once you've confirmed it looks right.
          await writeFile(screenshotPath.replace('.png', '.new.png'), buffer);
          results.push({ name: combo.name, status: 'no-baseline' });
        } else if (baselineHash === newHash) {
          // Clean up a stale .new.png from a previous failing run, if any -
          // otherwise it lingers indefinitely once things match again and
          // reads as an unresolved diff to the next person looking.
          await rm(screenshotPath.replace('.png', '.new.png'), { force: true });
          results.push({ name: combo.name, status: 'match' });
        } else {
          await writeFile(screenshotPath.replace('.png', '.new.png'), buffer);
          results.push({ name: combo.name, status: 'diff' });
        }
      }
    } catch (error) {
      results.push({ name: combo.name, status: 'error', message: error.message });
    } finally {
      await context.close();
    }
  }

  await browser.close();

  if (UPDATE) {
    await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`✅ Baseline recorded for ${results.length} combination(s) in ${path.relative(ROOT, BASELINE_DIR)}/`);
    return;
  }

  console.log('\nTheme x Mode matrix snapshot results:\n');
  let hasFailure = false;
  for (const r of results) {
    if (r.status === 'match') {
      console.log(`  ✅ ${r.name}`);
    } else if (r.status === 'diff') {
      console.log(`  ❌ ${r.name} — pixels changed since baseline. See ${r.name}.new.png next to the baseline.`);
      hasFailure = true;
    } else if (r.status === 'no-baseline') {
      console.log(`  ⚪ ${r.name} — no baseline recorded yet. Review ${r.name}.new.png, then run with --update.`);
    } else if (r.status === 'error') {
      console.log(`  ⚠️  ${r.name} — could not capture: ${r.message}`);
      hasFailure = true;
    }
  }

  if (hasFailure) {
    console.log('\nSome combinations changed or failed to capture - see above.');
    process.exit(1);
  }
  console.log('\nAll combinations match their recorded baseline.');
}

main();
