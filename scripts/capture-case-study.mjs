// Capture screenshots for the design system case study.
// Outputs to projects/portfolio-site/public/case-study/design-system/

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'projects/portfolio-site/public/case-study/design-system');

await mkdir(OUT, { recursive: true });

const SB = 'http://localhost:6006';
const PORTFOLIO = 'http://localhost:3000';
const MEALPREP = 'http://localhost:3001';

// Storybook iframe URL helper. viewMode=story hides the UI chrome.
const story = (id) => `${SB}/iframe.html?id=${id}&viewMode=story`;

const shots = [
  // Component showcases (Storybook)
  { url: story('components-button--all-types'),       file: 'ds-components-button.png',   w: 1200, h: 900,  selector: '#storybook-root' },
  { url: story('components-checkbox--all-states'),    file: 'ds-components-checkbox.png', w: 1200, h: 700,  selector: '#storybook-root' },
  { url: story('components-form-fields--full-form'),  file: 'ds-components-forms.png',    w: 1200, h: 1400, selector: '#storybook-root' },
  { url: story('components-accordion--faq'),          file: 'ds-components-accordion.png',w: 1100, h: 900,  selector: '#storybook-root' },
  { url: story('components-button--icon-gallery'),    file: 'ds-components-icons.png',    w: 1200, h: 900,  selector: '#storybook-root' },

  // Storybook manager itself (sidebar visible) — shows the component library structure
  { url: `${SB}/?path=/story/components-button--all-types`, file: 'ds-storybook-overview.png', w: 1440, h: 900, fullPage: false },

  // App proof — design system consumed in real products
  { url: `${PORTFOLIO}/`, file: 'ds-adoption-portfolio.png', w: 1440, h: 900, fullPage: false },
  { url: `${MEALPREP}/`,  file: 'ds-adoption-mealprep.png',  w: 1440, h: 900, fullPage: false },
];

// --- Code screenshots (render syntax-highlighted code) ---
const codeFiles = [
  {
    file: 'ds-code-tokens-primitives.png',
    title: 'packages/design-system/src/tokens/primitives/colors.ts',
    path: 'packages/design-system/src/tokens/primitives/colors.ts',
    lines: [1, 60],
  },
  {
    file: 'ds-code-tokens-semantic.png',
    title: 'packages/design-system/src/tokens/semantic/colors.ts',
    path: 'packages/design-system/src/tokens/semantic/colors.ts',
    lines: [1, 60],
  },
  {
    file: 'ds-code-tokens-css.png',
    title: 'packages/design-system/src/styles/tokens.css',
    path: 'packages/design-system/src/styles/tokens.css',
    lines: [1, 70],
  },
  {
    file: 'ds-code-component.png',
    title: 'packages/design-system/src/components/Button/Button.tsx',
    path: 'packages/design-system/src/components/Button/Button.tsx',
    lines: [1, 70],
  },
  {
    file: 'ds-code-component-css.png',
    title: 'packages/design-system/src/components/Button/Button.module.css',
    path: 'packages/design-system/src/components/Button/Button.module.css',
    lines: [1, 80],
  },
  {
    file: 'ds-code-test.png',
    title: 'packages/design-system/src/components/Button/Button.test.tsx',
    path: 'packages/design-system/src/components/Button/Button.test.tsx',
    lines: [1, 60],
  },
];

function buildRepoTreeHtml() {
  const tree = `Portfolio2026/
├── packages/
│   ├── design-system/        ← tokens, components, themes
│   │   ├── src/
│   │   │   ├── tokens/
│   │   │   │   ├── primitives/   ← raw values (colors, spacing, type)
│   │   │   │   └── semantic/     ← intent-based defaults
│   │   │   ├── components/   ← Button, Modal, Input, …
│   │   │   ├── styles/       ← tokens.css, global.css
│   │   │   └── themes/       ← per-product overrides
│   │   └── package.json
│   └── storybook/            ← live component documentation
│       └── stories/
└── projects/
    ├── portfolio-site/       ← consumes @jasmine/design-system
    └── meal-prep/            ← consumes @jasmine/design-system`;
  return tree;
}

function buildArchitectureHtml() {
  return `Primitives          Global Semantics       Theme (per product)        Components
────────────        ──────────────────     ──────────────────────     ──────────────
color-blue-500  →   color-action-primary   color-action-primary   →   <Button />
color-gray-900  →   color-text-default     color-text-default     →   <Input />
space-4         →   space-md               space-md               →   <Card />
font-sans       →   font-body              font-body              →   <Text />

   raw values         decisions, defaults     overrides only           consume semantic`;
}

async function takeCodeShot(page, item) {
  const fullPath = path.join(ROOT, item.path);
  if (!existsSync(fullPath)) {
    console.log(`  ⚠ missing: ${item.path}`);
    return;
  }
  const src = readFileSync(fullPath, 'utf8').split('\n').slice(item.lines[0] - 1, item.lines[1]).join('\n');
  await page.setContent(buildCodeHtml(item.title, src, item.lines[0]));
  await page.waitForLoadState('networkidle');
  const el = await page.$('.shot');
  await el.screenshot({ path: path.join(OUT, item.file) });
  console.log(`  ✓ ${item.file}`);
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildCodeHtml(title, code, startLine) {
  const lines = code.split('\n');
  const numbered = lines.map((l, i) => {
    const n = String(startLine + i).padStart(3, ' ');
    return `<span class="ln">${n}</span>  ${escapeHtml(l) || ' '}`;
  }).join('\n');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0e0e10;padding:48px;font-family:-apple-system,BlinkMacSystemFont,sans-serif}
    .shot{background:#1a1a1d;border-radius:12px;overflow:hidden;width:1100px;box-shadow:0 24px 60px rgba(0,0,0,.4)}
    .bar{display:flex;align-items:center;gap:8px;padding:14px 18px;background:#252528;border-bottom:1px solid #2f2f33}
    .bar .dot{width:12px;height:12px;border-radius:50%}
    .d1{background:#ff5f57}.d2{background:#febc2e}.d3{background:#28c840}
    .title{margin-left:14px;color:#a8a8b3;font-family:'SF Mono',Menlo,monospace;font-size:13px}
    pre{margin:0;padding:22px 26px;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:13.5px;line-height:1.65;color:#e8e8ec;white-space:pre;overflow:hidden}
    .ln{color:#56565e;user-select:none;margin-right:4px}
  </style></head><body>
    <div class="shot">
      <div class="bar"><div class="dot d1"></div><div class="dot d2"></div><div class="dot d3"></div><div class="title">${title}</div></div>
      <pre>${numbered}</pre>
    </div>
  </body></html>`;
}

function buildPlainHtml(title, content) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0e0e10;padding:48px;font-family:-apple-system,BlinkMacSystemFont,sans-serif}
    .shot{background:#1a1a1d;border-radius:12px;overflow:hidden;width:1100px;box-shadow:0 24px 60px rgba(0,0,0,.4)}
    .bar{display:flex;align-items:center;gap:8px;padding:14px 18px;background:#252528;border-bottom:1px solid #2f2f33}
    .bar .dot{width:12px;height:12px;border-radius:50%}
    .d1{background:#ff5f57}.d2{background:#febc2e}.d3{background:#28c840}
    .title{margin-left:14px;color:#a8a8b3;font-family:'SF Mono',Menlo,monospace;font-size:13px}
    pre{margin:0;padding:28px 32px;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:14px;line-height:1.7;color:#e8e8ec;white-space:pre}
  </style></head><body>
    <div class="shot">
      <div class="bar"><div class="dot d1"></div><div class="dot d2"></div><div class="dot d3"></div><div class="title">${title}</div></div>
      <pre>${escapeHtml(content)}</pre>
    </div>
  </body></html>`;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

console.log('▸ Storybook + app screenshots');
for (const s of shots) {
  try {
    await page.setViewportSize({ width: s.w || 1440, height: s.h || 900 });
    await page.goto(s.url, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(800);
    if (s.selector) {
      const el = await page.$(s.selector);
      if (el) {
        await el.screenshot({ path: path.join(OUT, s.file) });
      } else {
        await page.screenshot({ path: path.join(OUT, s.file), fullPage: !!s.fullPage });
      }
    } else {
      await page.screenshot({ path: path.join(OUT, s.file), fullPage: !!s.fullPage });
    }
    console.log(`  ✓ ${s.file}`);
  } catch (e) {
    console.log(`  ✗ ${s.file} — ${e.message}`);
  }
}

console.log('▸ Code screenshots');
for (const c of codeFiles) {
  try { await takeCodeShot(page, c); } catch (e) { console.log(`  ✗ ${c.file} — ${e.message}`); }
}

console.log('▸ Diagram screenshots');
await page.setViewportSize({ width: 1300, height: 900 });
await page.setContent(buildPlainHtml('Repository structure', buildRepoTreeHtml()));
await page.waitForLoadState('networkidle');
let el = await page.$('.shot');
await el.screenshot({ path: path.join(OUT, 'ds-repo-tree.png') });
console.log('  ✓ ds-repo-tree.png');

await page.setContent(buildPlainHtml('Token flow: primitives → semantics → theme → components', buildArchitectureHtml()));
await page.waitForLoadState('networkidle');
el = await page.$('.shot');
await el.screenshot({ path: path.join(OUT, 'ds-token-flow.png') });
console.log('  ✓ ds-token-flow.png');

await browser.close();
console.log('\nDone. Files in:', OUT);
