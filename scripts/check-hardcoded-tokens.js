#!/usr/bin/env node

/**
 * Guardrail: fail if a project-level CSS file hardcodes a value for a
 * --color-*, --primitive-*, --space-*, or --radius-* custom property instead
 * of referencing a DS primitive via var(--primitive-*) (directly, or
 * indirectly through another already-DS-sourced variable, e.g. inside
 * color-mix()).
 *
 * This is what actually enforces THEMING-CONTRACT.md Rule 2 ("never
 * hardcode a raw hex/px value outside packages/design-system") after the
 * brand/theme/mode migration - before this script existed, that rule was
 * convention-only (a comment saying so), not tooled.
 *
 * Scope: projects/** only. packages/design-system is exempt on purpose -
 * primitives are SUPPOSED to hold literal values; that's their entire job.
 *
 * Detection is deliberately broader than the literal "hex/px" wording: any
 * declared value for a matched property that contains zero var(...)
 * references anywhere is flagged, which also catches rgb()/hsl()/bare
 * numbers - anything hardcoded, not just hex/px specifically.
 *
 * Exemption: a comment containing `tokens-guardrail-ignore: <reason>` on the
 * line immediately above a declaration skips it. Use sparingly, and only for
 * already-tracked, deliberate gaps - not as a quick way to silence this.
 *
 * Known limitation: line-based regex, not a real CSS parser - a declaration
 * (color, primitive, space, or radius) whose value spans multiple lines
 * won't be seen. None currently do; if one ever needs to, extend this
 * rather than silently trusting it.
 *
 * Usage: node scripts/check-hardcoded-tokens.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PROJECTS_DIR = path.join(ROOT, 'projects');
const TARGET_PREFIXES = ['--color-', '--primitive-', '--space-', '--radius-'];
const IGNORE_DIRS = new Set(['node_modules', '.next', '.git', 'dist', '.turbo', 'storybook-static']);

function findCssFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findCssFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.css')) {
      results.push(full);
    }
  }
  return results;
}

// Matches a single-line custom property declaration: `  --name: value;`
const DECLARATION_RE = /^\s*(--(?:color|primitive|space|radius)[a-zA-Z0-9-]*)\s*:\s*([^;]+);/;

function checkFile(filePath) {
  const violations = [];
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(DECLARATION_RE);
    if (!match) continue;

    const [, propName, rawValue] = match;
    const isTarget = TARGET_PREFIXES.some((prefix) => propName.startsWith(prefix));
    if (!isTarget) continue;

    // References at least one custom property somewhere -> wired to a
    // shared source, not hardcoded (covers direct var(--x), and indirect,
    // e.g. color-mix(in srgb, var(--x) 78%, transparent)).
    if (rawValue.includes('var(')) continue;

    const prevLine = i > 0 ? lines[i - 1].trim() : '';
    if (/tokens-guardrail-ignore/.test(prevLine)) continue;

    violations.push({
      file: path.relative(ROOT, filePath),
      line: i + 1,
      property: propName,
      value: rawValue.trim(),
    });
  }

  return violations;
}

function main() {
  if (!fs.existsSync(PROJECTS_DIR)) {
    console.log('No projects/ directory found - nothing to check.');
    return;
  }

  const cssFiles = findCssFiles(PROJECTS_DIR);
  const allViolations = cssFiles.flatMap(checkFile);

  if (allViolations.length === 0) {
    console.log(
      `✅ No hardcoded --color-*/--primitive-*/--space-*/--radius-* values found across ${cssFiles.length} project CSS file(s).`
    );
    return;
  }

  console.error(`❌ Found ${allViolations.length} hardcoded token value(s) outside packages/design-system:\n`);
  for (const v of allViolations) {
    console.error(`  ${v.file}:${v.line}  ${v.property}: ${v.value}`);
  }
  console.error(
    '\nEvery override of these token families must reference a DS primitive via var(--primitive-*),'
  );
  console.error(
    "not a hardcoded literal - see packages/design-system/docs/architecture/THEMING-CONTRACT.md, Rule 2."
  );
  console.error('If this is a deliberate, already-tracked exception, add a comment on the line above it:');
  console.error('  /* tokens-guardrail-ignore: <reason + where it is tracked> */');
  process.exit(1);
}

main();
