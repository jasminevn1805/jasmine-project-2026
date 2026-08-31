# Theming Contract — `data-theme` × `data-mode`

**Status:** binding contract. Phase 1+ of the Brand/Theme/Mode migration
(see [token-architecture-brand-theme-mode-proposal.md](../../../../bmad_output/planning-artifacts/token-architecture-brand-theme-mode-proposal.md))
implements against this document. If a later phase needs to deviate from
something decided here, update this file first, then implement — don't let
code and contract drift apart.

**Not covered here:** which specific Themes exist beyond `cookstash`
(portfolio-site's fate is an open, deliberately deferred product decision —
see the proposal doc, Phase 4). This contract defines the *mechanism*; it
does not enumerate every product that will ever use it.

---

## 1. The two attributes

Two independent HTML attributes carry two independent axes. Both live on
`<html>`. Neither implies the other, and a product may set one without the
other.

| Attribute | Axis | Values | Meaning | Default when unset |
|---|---|---|---|---|
| `data-theme` | **which product's brand** | lowercase-kebab, matches the project's folder name under `projects/` (e.g. `cookstash`) | selects which primitive palette backs the semantic *brand* tokens (`--color-background-brand`, `--color-text-brand`, etc.) | the DS's own default palette ("Brand") — no override layer applies |
| `data-mode` | **light or dark** | `"light"` \| `"dark"` | selects which semantic mapping is active for *all* tokens, not just brand ones | `"light"` |

```html
<!-- default brand, light mode (no attributes needed) -->
<html>

<!-- cookstash, dark mode -->
<html data-theme="cookstash" data-mode="dark">

<!-- default brand, dark mode (e.g. Storybook toggled to dark, no theme picked) -->
<html data-mode="dark">
```

### Casing decision: `data-mode` values are lowercase, not `"Light"`/`"Dark"`

Figma's exported mode names are `Light` and `Dark` (capitalized — confirmed
directly in `figma-export.json`'s `Semantic: Color` collection). The
generator (Phase 1) **must lowercase the mode name** when emitting the
attribute selector, so the contract is `[data-mode="light"]` /
`[data-mode="dark"]`, not the capitalized Figma spelling.

Reasons this is a decision worth writing down, not an accident to fix later:
- `data-theme="cookstash"` is already lowercase — a capitalized `data-mode`
  right next to it would be an inconsistent, easy-to-typo contract.
- `prefers-color-scheme` (the media feature the mode helper reads to set
  the initial value) reports lowercase `light`/`dark` natively — matching
  casing means no string transform at the point of use, only once, in the
  generator.

---

## 2. Cascade layer order (authoritative)

```css
@layer primitives, brand-light, brand-dark, theme, theme-mode;
```

This exact statement is emitted once, at the top of the DS's generated
`variables.css` (Phase 1). Precedence comes from **layer declaration order**,
not from `@import` order in a consuming project's `globals.css` — that is
the whole point of using `@layer` here: a project's `theme.css` /
`theme.dark.css` can be `@import`ed in any order relative to the DS styles
and still resolve correctly, because the layer, not the import position,
decides who wins.

| Layer | Populated by | Selector shape |
|---|---|---|
| `primitives` | DS package, generated | `:root { --primitive-*: ...; }` |
| `brand-light` | DS package, generated | `:root, [data-mode="light"] { --color-*: ...; }` |
| `brand-dark` | DS package, generated | `[data-mode="dark"] { --color-*: ...; }` |
| `theme` | project's `theme.css` | `@layer theme { [data-theme="x"] { --color-*: var(--primitive-*); } }` |
| `theme-mode` | project's `theme.dark.css` (optional) | `@layer theme-mode { [data-theme="x"][data-mode="dark"] { --color-*: var(--primitive-*); } }` |

**Correction (found during Phase 2 implementation):** an earlier version of this
document claimed a project theme file "never declares its own `@layer`" and
"lands in the right place automatically." That's wrong about CSS `@layer`
semantics, worth spelling out since it's easy to get backwards: unlayered
rules always beat *every* layered rule, regardless of source order or how
many `@layer name, other-name;` order statements exist elsewhere in the
cascade. Simply declaring the layer order in `variables.css` does not pull
some other, unrelated, unwrapped stylesheet into a named layer.

What a project theme file actually needs to do — and does need one small
addition for, not zero — is wrap its own rules in `@layer theme { ... }`
(reusing the name the DS already declared; it does **not** need to repeat the
whole `@layer primitives, brand-light, ...;` order statement, only opt its own
rules into the `theme` name). `cookstash/app/theme.css` predates this contract
and is not yet wrapped this way — it happens to still resolve correctly
*today* only because unlayered rules outrank layered ones unconditionally, not
because it's correctly participating in the layer system. Tracked as a
required (not optional) part of Phase 3's "no structural change needed"
claim — it needs this one wrapper added.

---

## 3. Rules (apply at every layer above `primitives`)

1. **Only override what differs from the layer above.** A theme file that
   redefines a token to the same value it would already inherit is a bug,
   not a safety net — it's a future drift risk masquerading as explicitness.
2. **Never hardcode a raw hex/px value outside `packages/design-system`.**
   Every override in `theme.css` / `theme.dark.css` must reference a
   `--primitive-*` variable. This is enforced by convention today; Phase 5
   adds a CI check for it.
3. **`theme-mode` overrides are the exception, not the default.** Most
   themes should need zero `theme.dark.css` entries — dark mode is inherited
   for free from `brand-dark` for every token the theme doesn't touch. Only
   add a `theme-mode` override when a specific brand-colored token has been
   *design-reviewed* and found to lack contrast in dark mode. Don't
   pre-emptively duplicate a theme's full token set into a dark variant.

---

## 4. Mode ownership

**Decision:** a single shared, framework-agnostic helper —
`packages/design-system/src/utils/mode.ts`, exported from the package root —
owns:
- reading `prefers-color-scheme` for the initial value,
- applying `data-mode` to `<html>`,
- persisting an explicit user override (`localStorage`).

No consuming project (`cookstash`, `portfolio-site`, future products,
Storybook) implements its own copy of this logic. Each project calls the
shared helper from its root layout / preview config.

**Status: implemented (Phase 2).** Shipped surface, importable as
`import { ... } from '@jasmine/design-system'` (or, within this monorepo
during active DS development, directly from source — see how
`packages/storybook/.storybook/preview.ts` does it):

```ts
export type Mode = 'light' | 'dark';

export function getSystemMode(): Mode;              // OS/browser preference, ignoring any override
export function getStoredModeOverride(): Mode | null; // explicit user choice, if any
export function getInitialMode(): Mode;              // stored override, else system preference
export function applyMode(mode: Mode): void;         // sets data-mode on <html>, doesn't persist
export function setModeOverride(mode: Mode): void;   // persists + applies
export function clearModeOverride(): void;           // reverts to following system preference
export function initMode(): Mode;                    // applies + returns the initial mode; call once on app start
export function watchSystemMode(cb: (mode: Mode) => void): () => void; // OS-preference changes, only while unoverridden
export function getNoFlashScript(): string;          // inline <head> script source - see below
```

All SSR-safe (every function checks for `window`/`document` before touching
them, so importing this module from server-rendered code doesn't throw - it
just no-ops until the client mounts).

**Import from `@jasmine/design-system/mode`, not the package root.** Found
while wiring cookstash (Phase 3): the package root (`@jasmine/design-system`)
bundles every component into one chunk, several of which use React hooks.
Next.js's Server/Client Component boundary analysis taints the *entire*
import based on the module graph of what you import from - so a Server
Component (a root `layout.tsx`, needed here for the pre-hydration script)
cannot import `getNoFlashScript` from the root at all, even though the
function itself has zero React dependency. `mode.ts` is built as its own
Vite entry (`dist/mode.es.js` / `dist/mode.cjs.js`, ~1.6kB) and exposed via
its own `package.json` `exports["./mode"]`, specifically so it stays
importable from server code. It's still also re-exported from the package
root for convenience in client components.

**`getNoFlashScript()`** exists because setting `data-mode` only after React
hydrates causes a visible flash on load (page renders light, then flips to the
stored/system dark preference). It returns the *source of a script* meant to
run in `<head>`, before hydration - each consuming framework has its own way to
inject a raw pre-hydration script (e.g. Next.js: a plain `<script>` tag in the
root layout, not a component), so this package can't do the injection itself.
What it *can* own is the check the script performs, so it's not
re-implemented slightly differently in every project's `<head>`.

---

## 5. Adding a new Theme (future products)

1. Pick a `data-theme` value: lowercase-kebab, matching the project's
   `projects/<name>` folder.
2. Create `projects/<name>/theme.css`, with its rules wrapped in
   `@layer theme { [data-theme="<name>"] { ... } }`, referencing only
   `--primitive-*` variables (see Rule 2). The `@layer theme` wrapper is
   required — see the correction in §2; don't copy the unwrapped pattern
   `cookstash/app/theme.css` currently uses until that file is fixed too.
3. Set `data-theme="<name>"` on `<html>` in that project's root layout.
4. Only add `projects/<name>/theme.dark.css` (wrapped in `@layer theme-mode`)
   after a design review identifies specific tokens that need dark-specific
   retuning (Rule 3).
5. Wire `data-mode` via the shared helper (§4) — don't hand-roll it.

---

## 6. Resolved: portfolio-site (2026-07-31)

Decided Option B (register as a Theme, retire its forked primitive values) —
implemented as a **third valid consumption pattern**, alongside "full" (Theme
+ DS components, cookstash) and the mechanism's core assumption ("Theme
overrides the DS's own semantic token names"). Worth naming explicitly since
neither of the other two quite describes it:

- `data-theme="portfolio"` is set, for identification consistency with
  cookstash — but the `theme` cascade layer stays **empty** for it. Portfolio
  doesn't use the DS's semantic token names (`--color-text-primary` etc.) at
  all; it has its own vocabulary (`--color-ink`, `--color-canvas`, ...) via
  Tailwind, and no DS component imports.
- What *is* shared: the **primitive** layer. Portfolio's distinct palette
  (`primitiveColors.warmGray`) lives in the DS's primitives, not a fork. Its
  own semantic vocabulary is sourced from those shared primitives via
  Tailwind v4 `@theme inline` (`--color-primary: var(--primitive-warm-gray-900)`),
  instead of duplicating hex values that drift.
- No `data-mode` — explicitly decided to stay light-only, since there's no
  dark design anywhere in the product to draw from (unlike cookstash, where
  the DS's own light→dark relationship gave a systematic basis to extend).

**Pattern name for future reference:** *primitives-shared, theme-layer-empty*.
A future product that wants its own complete semantic/component identity but
no duplicated raw values should follow this shape, not necessarily the full
cookstash shape.
