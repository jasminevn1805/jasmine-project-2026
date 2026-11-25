# Retell AI × Design System — migration log

Moving the agent-builder prototype (`prototype/`, static HTML) onto `@jasmine/design-system`
while keeping its look. Every change is tagged:

| Tag | Meaning |
|---|---|
| **[KEEP]** | Maps to the DS as-is |
| **[THEME]** | Retell-only override in `theme.css` (`[data-theme="retell"]`) |
| **[DS-UPDATE]** | Changes something shared — affects Cookstash and portfolio-site; checked before merging |
| **[DS-NEW]** | New shared token or component |
| **[PROJECT-NEW]** | New Retell-only component |
| **[VISUAL-CHANGE]** | Looks different from the prototype |

## Decisions (2026-11-20)

| # | Decision | Choice |
|---|---|---|
| 1 | Font | Instrument Sans as a DS primitive, used by the Retell theme only |
| 2 | Neutrals | Cool-grey primitive family, used by the Retell theme only |
| 3 | Accent | Existing `--primitive-purple-600` (hover `-700`, tint `-100`) |
| 4 | 44px targets | Invisible hit area on Button S/M in the DS |
| 5 | Border contrast | Fix `--color-border-primary` in the DS |
| 6 | Icons | Move the DS from `react-feather` to `lucide-react` |

Primitive naming follows the existing format: numbered steps per family (`'0'`, `'50'`, `'100'` … `'900'`) →
`--primitive-<family>-<step>`.

## Log

### 1 · Environment
- Node 16 → 20.20.2 via nvm (default). `npm install`, `build:ds`, `build:cookstash`, `build:portfolio` all pass.

### 2 · Primitives — [DS-NEW]
Added in `packages/design-system/scripts/convert-figma-tokens.js` under the "(2) permanent product fork"
groups, so they survive `npm run sync:figma`. Regenerated with `npm run sync:all`; the diff contained only these additions.

- `coolGray` 0–900 → `--primitive-cool-gray-*`. Prototype values kept exactly:

  | Step | Hex | Prototype role |
  |---|---|---|
  | 0 | #ffffff | surface |
  | 50 | #f5f6f8 | page background |
  | 100 | #eef0f3 | sunken fill |
  | 200 | #e2e5e9 | decorative border |
  | 300 | #c9cdd3 | *(interpolated)* |
  | 400 | #a3a9b1 | *(interpolated)* |
  | 500 | #7d848f | interactive border (3.8:1) |
  | 600 | #5c636d | tertiary text (6.1:1) |
  | 700 | #464d57 | secondary text (8.5:1) |
  | 800 | #2c3138 | *(interpolated)* |
  | 900 | #13161b | primary text (18.1:1) |

- `instrumentSans` → `--primitive-typography-family-instrument-sans`.

### 3 · Project setup — [PROJECT-NEW]
- `projects/retell-AI` is now a Next.js 16 workspace (`retell-ai`), mirroring cookstash: `@jasmine/design-system/styles`
  + `app/theme.css` in `@layer theme`, `data-theme="retell-ai"` (contract: folder name, lowercased).
- Root scripts: `dev:retell` (port 3002), `build:retell`.
- No Tailwind: styles are CSS modules on DS tokens.
- `prototype/` stays as the visual reference (excluded from tsconfig).

### 4 · Theme mapping — [THEME]
Prototype token → DS semantic token → primitive (all in `app/theme.css`):

| Prototype | DS semantic token | Primitive |
|---|---|---|
| `--bg` | `--color-background-subtle` | cool-gray-50 |
| `--surface` | `--color-background-primary` | *(DS default, white — [KEEP])* |
| `--surface-sunken` | `--color-background-neutral` / `-hover` | cool-gray-100 |
| `--border` | `--color-border-subtle` | cool-gray-200 |
| `--border-strong` | `--color-border-primary` | cool-gray-500 |
| `--text` / `-2` / `-3` | `--color-text-primary` / `-secondary` / `-tertiary` | cool-gray-900 / 700 / 600 |
| `--accent` / `-hover` | `--color-background-brand` / `-hover` | purple-600 / 700 **[VISUAL-CHANGE]** slightly deeper violet (white text 8.2:1) |
| `--accent-tint` | `--color-background-brand-subtle` | purple-100 **[VISUAL-CHANGE]** more saturated tint |
| `--accent-strong` | `--color-text-brand` | purple-700 (7.7:1 on purple-100) |
| links (neutral, underlined) | `--color-text-link` / `-hover` | cool-gray-700 / 900 |
| `--warn` icon | `--color-icon-warning` | orange-600 (3.97:1; DS default fails) |
| `--warn-text` / `--warn-tint` | `--color-text-warning` / `--color-background-warning-subtle` | *(DS default — [KEEP])* **[VISUAL-CHANGE]** tint more saturated (#fce1c7 vs #fdf1df); text 4.96:1 |
| `--ok` text | `--color-text-positive` | green-700 (5.99:1 on its tint; DS default 4.01:1 fails) |
| `--ok-tint` | `--color-background-positive-subtle` | *(DS default)* **[VISUAL-CHANGE]** more saturated |
| `--error` | `--color-background-negative` | *(DS default — [KEEP])* |
| radius 6 / 10 / 14 | `--radius-s` / `-m` / `-l` | radius-s 8 / m 12 / l 16 **[VISUAL-CHANGE]** slightly rounder |
| `--elev` | `--shadow-overlay` (project) | color-mix on cool-gray-900 |
| Instrument Sans | `--font-body` / `--font-display` | typography-family-instrument-sans |

### 5 · Screen c, component-based — [PROJECT-NEW]
Atomic structure (all tokens, no raw values):

| Level | Where | What |
|---|---|---|
| Data + logic | `lib/agent/fixtures.ts`, `lib/agent/model.ts` | Research content; reducer (apply, undo, discard, ask) and selectors (`statusOf`, `nextStepOf` = the one primary action, `changedSections`). No React. |
| Atoms / molecules — DS | `@jasmine/design-system` | **[KEEP]** Button (Primary, Outline, Negative Primary; S/M/L), Input |
| Atoms / molecules — Retell | `components/ui` | **[DS-NEW] candidates:** Icon (Lucide, 1.75 stroke, 16/20), Badge, StatusChip, Note, Popover, SegmentedTabs, DisclosureRow, Toast, ResizeHandle |
| Organisms | `components/agent` | TopBar, SpecSection (one shell for all 5 sections) + Summary/Behavior/Knowledge/Actions/Advanced, Workbench (BuildPanel, PendingChangesCard, TestPanel, AskConductor) |
| Template | `components/templates/AgentPageLayout` | Rail + 3 zones, resizable split (desktop), bottom sheet (mobile) |
| Page | `components/agent/AgentPage` → `app/page.tsx` | Wires reducer to UI; `initial` prop can seed any screen state (a–w) |

Type: 5 styles as `--type-title / heading / body / strong / small` in `theme.css`, composed from DS typography tokens.
**[VISUAL-CHANGE]** body 14/22 → DS text-m 14/20; strong and small weight 500 → 600 (DS has no 500 at these sizes).
Rail labels use the standard small style (12px, wraps to 2 lines) instead of the prototype's 11px.

### 6 · Conductor voice — [VISUAL-CHANGE] (code only; FigJam wireframe unchanged)
- "Needs you" moved from a separate warning box into Conductor's build message (plain text + warning icon, after
  the ✓ list). Why: AI output should read as the AI's turn, not a system banner (attribution → Trust in AI).
  The blocker's *status* stays in Actions ⚠, "2 need a connection" and the status chip.
- "Applied as v1" changed from a green note to a quiet centred event line ("✓ Applied as v1 · just now"):
  it's a product state change, not Conductor speaking. Next step is carried by the status chip and the primary button.
- Test-tab notes stay as Notes (product guidance about the panel, not chat).

### 7 · Icon ↔ text spacing rule
Applied everywhere; documented in `components/ui/Icon.tsx`.

| Pairing | Gap |
|---|---|
| 16px icon before text | 8px (`--space-8`) |
| 20px icon before text (list rows, notes) | 12px (`--space-12`) |
| Chevron / caret after text | 4px (`Icon caret` inside 8px-gap parents, or `--space-4`) |
| Icon stacked over a label (rail) | 4px |

Icons centre on the first line of text (16px icon on 20px line = 2px offset; 20px on 20px = 0).
**Optical exception:** the warning triangle fills its box edge-to-edge (other Lucide icons have side padding), so a 16px
triangle before text gets 12px — "Needs you" and the Publish checklist.

### 8 · Pending changes card
Tried a compact chip version (~200px, section names only); reverted to the list rows (title · detail · ›) at the
user's request — the detail per change is visible without hovering.

### 10 · Navigation rail
Labels → 6th type style `--type-caption` (DS text-s regular, 12/16, weight 400) in secondary grey; icons in subtle grey.
Current page stands out by weight (600) + sunken fill. **[VISUAL-CHANGE]** rail 72 → 80px so the 64px items sit with
an even 8px either side (at 72px they nearly touched the edges). Items min 64px tall,
8px icon ↔ label, 12px between items. Rail labels wrap to two lines ("Knowledge bases", "Phone numbers", "Call history").

### 11 · List density — [VISUAL-CHANGE]
Mouse/trackpad (`pointer: fine`): Actions rows 56 → 44px, pending-change rows 44 → 36px, Connect calendar text
button 32px tall — balances with the rest of the screen (Conductor's list runs ~24px per line).
Touch (`pointer: coarse`): rows and the text button stay at 44px targets. Desktop targets remain well above WCAG 2.2
AA's 24px minimum (2.5.8); the 44px bar is kept where fingers are used.

### 12 · Responsive Usage chip
Spec cards are CSS size containers (`container-type: inline-size`), so contents respond to the card's width — which
changes with the window *and* the resizable Conductor panel. Usage chip: full → drops "starts with…" (< 760px) →
drops latency/tokens (< 600px) → moves under the heading (< 440px). Popover always has the full breakdown.
**[VISUAL-CHANGE]** mobile now shows the compact chip ("Usage · Est. $0.13/min ▾") instead of hiding it.

### 13 · Summary rows at every size — [VISUAL-CHANGE]
Mobile used to swap the four rows for a two-line digest (voice · language, welcome), per the mobile wireframe — Name and
Model disappeared. Now all four rows always show; when the card is under 520px wide they stack (label above value).
Field labels (Name, Voice, Welcome, Model, Prompt) use one style everywhere: `--type-body` in tertiary grey — the
narrow layout no longer shrinks them, and "Prompt" no longer uses the small semibold style.

### 14 · Connect calendar size
DS Button **S** (32px) in every state — Text while changes are pending, Primary once it's the next step — on desktop
and mobile (no longer stretched full-width on mobile). Icon gap set to 8px; invisible 44px hit area.
The mobile sheet's pinned primary button (state d) stays L — it's the thumb-zone action, not the Actions row.

### 15 · D1 · Dialog · Connect calendar — [PROJECT-NEW]
Built from the approved key screen in the case-study frame (flow 3, reopened in flow 14; Solves P1 · E, C, D).
- **Step 1:** "Where do you book appointments today?" — Cal.com · Calendly · Practice software (e.g. Dentrix, Jane App);
  "Not ready to connect?" → Sample calendar · Test only shortcut. Continue with nothing chosen shows an inline message
  (never a silent disabled button).
- **Step 2 · Cal.com / Calendly:** sign in (simulated; a real build opens the provider's OAuth window) → "Which event
  type should bookings go into?" (Cleaning · 60 min / Check-up · 30 min / Emergency visit · 30 min, from the draft D1
  frame — the approved frame only shows the practice-software branch) → Connect.
- **Step 2 · Practice software:** needs a developer or partner; primary "Use sample calendar for now", secondary
  "Continue to Integrations" (not built — toast).
- **Outcome (model):** `connectCalendar` creates a new version (board: "Ready to test (v2)") with Undo. Actions turn ✓
  and show "Cal.com · Cleaning · 60 min" / "All ready", or "Sample calendar" with a Test only tag and the one
  "Switch to real calendar" control. Conductor's "Needs you" reads as "Done: …". Publish checklist, Test panel note and
  the next-step primary update (`nextStepOf` → `test`).
- **[DS-NEW] Dialog** on native `<dialog>` (focus trap, Esc, inert page, focus return). Desktop centred 600px; mobile
  bottom sheet. **[DS-UPDATE]** the DS has a `Modal` component but doesn't export it.
- No provider logos (generic names only) — avoids brand imitation in a prototype.

### 17 · Actions ↔ Advanced list consistency
Advanced list rows now share the Actions rhythm (44px, 48px on mobile, hairline dividers, no extra bottom padding).
Action names use `--type-body` (regular), the same style as Advanced items, instead of `--type-strong`.
Action status icons 20 → 16px, matching Conductor's task summary; icon column 20 → 16px. Gap stays 12px (warning
triangle optical rule), which also keeps ✓ and ⚠ rows aligned.

### 18 · Prompt text — [VISUAL-CHANGE]
- Width: the 68ch line-length cap is removed; the prompt fills the Behavior card (user request). Trade-off: on wide
  screens lines exceed the brief's "under 75 characters" bar.
- Size: tried 12px, reverted to body 14/20 at the user's request; in-prompt headings 14px semibold.
- "Show full prompt · 435 words" and "Change in Advanced ›": 14px **regular** (were semibold), matching the content
  around them — one style for in-content links.
- **[THEME] [VISUAL-CHANGE] All links are mono/black.** `--color-text-link` → cool-gray-900 (18:1), hover/pressed
  → cool-gray-700 — same behaviour as DS "Text Mono". Set once in `theme.css`, so every link follows: Change in
  Advanced, Show full prompt, Conductor's "connect calendar in Actions", "Switch to real calendar", "Connect calendar"
  (text state) and the Usage popover's "Advanced". (Briefly tried violet; the user meant black.)

### 19 · One hover language
- **Hover = neutral grey fill** (`--color-background-hover`) on every clickable row/card: pending-change rows,
  calendar options (plus darker outline, since they're cards), Handbook and Advanced rows, rail items.
- **Violet = selected or linked:** the chosen calendar option (violet border + wash) and the spec section lit by the
  change trail. Previously a hovered pending row used the same violet wash that means "selected" in D1.

### 33 · Better seeded failure: the prompt never asks for a phone number (replaces §32's hours case)
Trusted sources stay right: clinic hours (Knowledge + prompt agree, 7:30 am – 5 pm) and the booking system's rule
that **Book appointment requires name + phone number**. The gap is in Conductor's prompt:
"Greet the caller, then ask for their full name." (fixture) — no phone number.
- **Failed result:** "Booking failed. Book appointment needs the caller's phone number, but the agent never asked for
  it. Cause: Behavior › Prompt · line 2 doesn't ask for a phone number." Key moment = the refused reply.
- **Flow 7:** "why ›" on "Thanks, Dana. Are you an existing patient?" (where it should have asked) → line 2.
- **Flow 6:** Fix this → edit mode with the caret placed right before the line's full stop, where
  " and phone number" goes.
- **After the fix:** the agent asks "What's the best phone number to reach you?" (audio and text), books Tue 7:30 am,
  test passes. Text chat re-asks if no number is given; a number volunteered earlier counts.
- `readPromptRules()` / `matchSentence()` replace `findOfferRule`; `CLINIC_OPEN` = 7.5.
- History Result keyword for a booking is now just the slot ("Tue 7:30 am"); the ✓ means booked.

### 32 · Fix and re-test loop — flows 6 & 7 (states i, l, m) — [PROJECT-NEW]
- **Seeded failure (board validation plan):** offer hours come from the LIVE prompt sentence "Offer times from 7:30 am
  to 5 pm" (`findOfferRule`); clinic hours come from Knowledge (8 am – 5 pm, `CLINIC_OPEN/CLOSE`). The caller picks the
  first slot ("Tuesday at 7:30 works."), Book appointment refuses it, the test **fails** (audio and text).
- **i · Result: failed:** red card "Failed · Test n · vX · Audio", reason in plain words, **Cause: Behavior › Prompt ·
  line 5 says 7:30 am**, **Fix this** (primary, S), Re-run this test. Grid row: red ✕ "Booking failed". Transcript key
  moment = the refused line (red fill). Board said "line 4"; our prompt's sentence count makes it line 5.
- **Flow 6 · Fix this →** Behavior opens in **edit mode (m)**: "Linked to Test n result: “…”", textarea with "7:30 am"
  pre-selected, Cancel / Save change. Save = pending change "Behavior · prompt edited by hand" (`editPrompt`), sentence
  stays highlighted, toast with Apply.
- **Flow 7 · transcript "why ›"** on the reply that offered 7:30 → Behavior with the exact sentence highlighted and a
  banner "Linked to Test n · Agent reply 0:06 · Prompt line 5" + **Edit this line**. From an older run after a fix:
  links to the current version of the line and says "edited since that test".
- **Re-run:** "Apply your fix and re-run this test" applies (new version) then re-runs the same type on it; footer
  button becomes "Apply 1 change to test again" while a fix is pending. After the fix: Passed · Booked Tue 8 am · v3.
- Model: `prompt` (draft) vs `livePrompt` (applied; tests run on it); Apply/Discard/Undo carry both; `TestRun.cause`,
  outcome `failed`; `SpecFocus`. Theme: `--color-text-negative` → red-700 (DS red-600 is 4.47:1 on its fill).
- Not built yet: Fix with Conductor (flow 8).

### 31 · Results follow the selected test type
- The latest-result area shows the latest run of the **selected** type only (Audio card on Audio, Text card on Text);
  if that type hasn't been run, it shows the ready note instead — never the other type's card.
- The sample calendar under the card shows only bookings made by tests of that type.
- Run button says "Run another …" only if that type has a run.
- Test history stays shared (all types); opening a session from history or from a Conductor event line switches the
  toggle to that run's type, so "Back to latest result" lands on the same type.

### 30 · Audio vs Text tests behave differently
- **Choose the type first:** Audio | Text toggle (Mic / MessageSquare icons) with a one-line hint; locked while a test
  runs; Run button names it ("Run audio test", "Run another text test").
- **Audio:** spoken call. Header "Audio call · 0:06" + "Mic on"; both sides transcribed line by line (simulated
  playback); turn cue "Listening… speak now" / "Agent speaking…"; End call.
- **Text:** typed chat. Header "Text chat · n messages"; "Message the agent…" field + send (the filled primary while
  chatting); agent typing indicator; dashed "Try: …" suggested reply; End chat (outline). Ask Conductor is hidden during
  a text test so there's only one input. `createTextAgent()` answers what was typed: picks up the caller's name,
  offers real free slots, books the slot named ("Thursday", "the first one"), re-asks if unclear, takes a callback
  number when no calendar is connected.
- **Results:** `TestRun.mode`; result card "Passed · Test 2 · v2 · Text · sample calendar" with the real caller name;
  session transcript "Call transcript · Audio call · n lines" / "Chat transcript · Text chat · n messages" with real
  timestamps (`ScriptLine.at`); grid Length = call time (Audio) or message count (Text); Conductor event lines include
  the type. Caller lines are labelled "You".

### 29 · Grid fits the panel (12px text)
User switched `--type-grid` / `--type-grid-head` to DS text-s (12/16). Fixed the overflow that followed:
- Removed the grid's negative side margin: grid edges now match the "Test history" title, the Run button and the Ask
  field (measured 1025–1416px for all three at 1440px).
- Fixed CTA column width (was `auto`, sized per row, so header and rows didn't share columns).
- Columns 16 · 60 · 56 · Result · 44 · 56, gap 8px; "Transcript" without chevron (underline + whole-row hover).
- Measured: no cell truncates at the default 440px panel ("Calendar", "Length", "Booked Wed 2 pm" all fit).

### 28 · Pinned Test history + scrollable session area
- **Layout (results states):** Test history + Run/Test button are pinned to the bottom of the Test panel and keep the
  same position in the latest view and the session view. Only the area above scrolls.
- **Session view:** fixed "‹ Back to latest result", then one scroll area (subtle grey container) holding the result
  card, the transcript and that run's booking; it fills the space left above the history (min 140px).
  Audio/Text toggle hidden while reviewing a past session.
- **Many runs:** the grid scrolls inside itself (max ~5 rows) with a sticky header, so the footer never grows.
- **Key skipped step:** no orange outline anymore — same as a normal marker, identified by the "Key moment" tag.

### 27 · Data grid UI pattern (Test history) — [DS-NEW] candidate
| Rule | Spec |
|---|---|
| Columns | status icon 16 · Test 56 · Calendar 48 · Result 1fr · Length 40 · CTA auto |
| Spacing | 12px between columns, +4px before the CTA (16px), 8px row side padding |
| Type | cells `--type-grid` = DS text-xs 10/14 regular; header `--type-grid-head` = text-xs semibold |
| Text colour | all cells and header `--color-text-secondary` (cool-gray-700, 8.5:1) |
| Icons | status `--color-icon-positive` (3.75:1) / `--color-icon-warning` (orange-600, 3.97:1); chevron `--color-icon-subtle` |
| Dividers | hairline `--color-border-subtle` under the header, between rows and after the last row |
| Rows | 36px (44px on touch); hover grey fill; open session grey fill + 2px near-black outline; focus ring on the row |
| CTA | "Transcript ›" secondary, underlined; darkens on row hover; stretched — the whole row opens the session |
Status is carried by the icon (+ sr-only text); "Booking skipped" no longer uses warning text colour.
Two new type styles in the theme, grid only. Note: 10px is the DS floor; fine for a scannable data grid, not for reading.

### 26 · Test history as a compact grid (revised §25)
History rows are back to single-line, small text (DS text-s), keywords only, aligned like a table:
icon · **Test n · vX** · Calendar (Sample / None / Cal.com) · Result (Booked Thu 9 am / Booking skipped, in warning colour)
· Length (0:16) · Transcript ›. Fits one line in the default 440px panel at 1440px. Column header row in tertiary grey.
36px rows (44px on touch); whole row opens the session; open session = grey fill + near-black outline.
The key-moment quote moved out of the row; it's still highlighted inside the session transcript.

### 25 · Test history as session cards + session transcript
- The separate "Transcript" disclosure under the result is removed; transcripts live with their session.
- **History card (small data grid):** [icon] Test n · vX · calendar — Status / outcome · call length / **key moment**
  (quote of the deciding line: the booking, or the "booking skipped" step in warning colour) — **Transcript ›**.
  The action is stretched, so the whole card opens the session; grey hover, near-black outline for the open one.
- **Session view:** ‹ Back to latest result → result card → **Transcript** (header with call length · line count;
  every line timestamped; "why ›" links; the key moment tagged "Key moment" and highlighted — green fill for a booking,
  outlined warning marker for a skipped step) → its booking on the sample calendar → history (to switch sessions).
- Model: `TestRun.duration`; `keyLineIndex()` in `sampleCalendar.ts`.

### 24 · v · Test history — [PROJECT-NEW]
- Every run keeps its transcript (`TestRun.lines`); `testByNumber` selector.
- **Test tab:** "Test history · n runs" under the result, newest first: status icon, "Test n · vX · calendar", one-line
  outcome ("Booked Dana Lee, Wed 2 pm" / "Conversation only · booking skipped" / "Ended before booking"),
  Passed/Skipped/Ended. The run on screen is marked like a selection (grey fill + near-black outline).
- **Opening a past run:** "‹ Back to latest result", its result card, its own booking on the sample calendar
  ("Booking made by Test n"; no Reset there), transcript open with "why ›" links. Running a new test returns to latest.
- **Conductor thread:** test event lines are links ("Test 2 passed · v2 · sample calendar ›") that open that run.
- Not built: Compare runs (flow 12); "Book test calls into: Cal.com | Sample calendar" (live agents only).

### 23 · Test the conversation on v1 (no calendar) — flow 14, state q — [PROJECT-NEW]
- **Entry (wireframe d):** after Apply with no calendar, Conductor posts "Next: get v1 ready for a full test —
  1 Connect a calendar (Connect calendar in Actions ›) · 2 Or test the conversation now, booking steps are skipped
  (Open Test ›)", placed right after the "Applied as v1" event; it disappears once a calendar is connected.
- **Test tab:** note "Booking needs a calendar… you can test the conversation now: booking steps are skipped";
  **Test the conversation** is an Outline button (Connect calendar stays the one primary). Now also on mobile.
- **Call:** `buildConversationScript()` — same opening; a transcript marker "Booking step skipped · Check availability
  isn't connected"; the agent says the board's line "I can't check availability right now…" and takes a callback number.
- **Result (q · missing connection):** "Conversation passed · booking skipped · Test n · v1", cause in plain words,
  **Fix this: connect a calendar in Actions ›** (jumps + pulses Actions, where Connect calendar is the primary),
  Re-run, collapsed transcript, "Test the conversation again". Event line "Test n · conversation only · v1 · booking skipped".
- Model: `TestRun.outcome` gains `skipped`; `testFinished` carries `skipped`.

### 22 · Branch 3b · Test on the sample calendar — [PROJECT-NEW]
Flow: Actions ⚠ → Connect calendar → Practice software → Use sample calendar for now → Actions "Sample calendar ·
Test only" → **Run → result on the sample calendar** → **Publish blocked → Connect real calendar** (→ D1, then flow 5).
- **Data/logic:** `lib/agent/sampleCalendar.ts` (week, grey sample bookings, slot finder, scripted call — no React);
  model gains `tests`, `testBookings`, actions `testFinished`, `resetSample`, selector `lastTest`.
- **After connecting a calendar** the Workbench switches to Test (Run is the next step).
- **g · live call:** timer, transcript line by line (from wireframe g, adapted so the caller books), "why ›" on every
  agent reply → jumps to the spec section behind it; End call is the one primary (pinned on mobile).
- **w · result:** "Passed · Test n · v2 · sample calendar · Booked Dana Lee, Cleaning, Wed 2 pm. No text sent.",
  Re-run this test, week view (grey = sample bookings, black = your tests), Reset sample calendar, collapsed
  transcript, Run another test. A re-run without Reset finds the slot taken and books the next one — that's what Reset
  is for. Every test adds an event line to the Conductor thread.
- **D2.1 · Publish blocked:** Publish on the sample calendar opens it: ✓ Last test · ⚠ Actions: using the sample
  calendar · ✓ Pending changes; blocker in plain words; primary Connect real calendar → D1 (opened from the sample,
  D1 hides the sample shortcut and the practice path offers "Keep the sample calendar for now").
- **Deviations:** week is Nov 30 – Dec 4 (caller asks for "next week"; board used Nov 23–27). Mobile shows the
  calendar inline in the sheet rather than as a separate sheet from the result. Test history (v) not built.
- `.sr-only` utility added to `app/globals.css` (was missing in the Next app).

### 21 · D1 layout polish
- Header top padding 24 → 32px; body top padding 12 → 16px.
- Divider (subtle hairline) between the options and "Not ready to connect?".
- "Use sample calendar" now matches Connect calendar in Actions: DS Text S + calendar icon, underlined, mono,
  8px icon gap, 44px hit area (was Outline S). Left-aligned under the text on mobile. Kept as text, not filled, so
  Continue stays the dialog's one primary.

### 20 · Neutral selection progression
- Calendar options: rest (light outline) → hover (grey fill + darker outline) → **selected: white + 2px near-black
  outline** (`--color-border-mono` → cool-gray-900); the radio dot uses the same near-black (`accent-color`).
- Change trail: the lit spec section uses the same grey fill as the hovered pending row, plus a 2px near-black
  outline; the jump pulse is near-black too.
- `--color-background-brand-wash` removed from the theme (no longer used). Supersedes §9.
- Violet now only on: primary buttons, "Changed" badges, "Changes pending" chip.

### 16 · Body text size
Tried body at 12px (DS text-s 12/16); reverted to 14/20 (text-m) at the user's request.

### 9 · Hover wash — [THEME]
Change-trail hover (pending row) and the lit spec section now use a very light violet,
`--color-background-brand-wash` = `color-mix(purple-100 30%, neutral-0)` ≈ #f5f1ff, instead of purple-100 (#dcd0ff).
Resolves the "violet wash" open flag without touching Figma's purple scale; swap for `--primitive-purple-50` if Figma
adds it. Lit section keeps its purple-600 border so the highlight is still clear.
Fixed: Sample button 4 → 8px, "Change in Advanced ›" 2px (raw) → 4px, Versions ▾ / Usage ▾ 8 → 4px, Note icon offset 1 → 0.

## Open flags

- **[DS-UPDATE] Button S icon gap** is `--space-xs` (4px) — too tight for its 16px icon. Retell overrides on the Sample
  button; DS fix: S → `--space-s` (8px), matching M and L.

- **[VISUAL-CHANGE] DS Outline button** draws a heavy dark border (Discard, Sample, Send) — heavier than the prototype's
  1px grey-500 outline. Decide: accept, or add a lighter outline variant to the DS.
- **[DS-UPDATE] Button doesn't forward ref / `aria-*`.** Popover triggers need `aria-expanded`, so Versions, Publish,
  ⋯ and the Usage chip use a temporary project trigger styled like Outline/Tertiary. Fix: Button spreads rest props + forwardRef.
- **[DS-UPDATE] Divider and Row aren't exported** from `packages/design-system/src/components/index.ts`.
- **[DS-UPDATE] Accordion has one size** (20px heading) — too big for in-card rows; Handbook/Advanced use project
  `DisclosureRow`. Add a compact size.
- **[DS-UPDATE] Input label isn't associated** with its input (no `htmlFor`/`id`). Retell passes `aria-label` instead.
- **[DS-UPDATE] Input border** uses `--color-border-subtle` (decorative) — fails 1.4.11. Retell overrides locally.
- **[DS-UPDATE] Button M is 40px** — under the 44px target until the hit-area fix (decision 4).

- **[DS-UPDATE] Component fonts are not themable.** DS components hard-code `var(--font-family-inter)` (23 uses), so DS
  Buttons/Inputs render in Inter inside Retell. Fix in DS: components read `var(--font-body, var(--font-family-inter))`.
  Affects every product (Cookstash would switch to its own `--font-body`, Inter — no visible change expected).
- **[DS-UPDATE] Warning icon contrast.** `--color-icon-warning` (orange-500) is 2.69:1 on white — fails WCAG 1.4.11.
  Retell overrides it; the DS default should move to orange-600.
- **[DS-UPDATE] Positive text on subtle fill.** green-600 on green-100 is 4.01:1 — fails AA. Retell overrides; DS fix
  pending.
- **[DS-UPDATE] Border contrast (decision 5).** `--color-border-primary` #b3b3b3 is ~2.1:1. Retell overrides; DS fix pending.
- **[DS-NEW] Shadow tokens.** DS components reference `--shadow-s/-m/-l`, which aren't defined anywhere in the DS
  (those shadows silently render as none). Cookstash and Retell each define their own. Needs a DS elevation scale.
- **Dark mode.** Pinned to light. Needs `theme.dark.css` with cool-grey dark steps before enabling the mode script.

- **Violet wash** (prototype `#F6F5FE`, hover highlight for a lit section): the DS `purple` scale starts at 100 (#dcd0ff).
  Adding a `purple-50` step can't go through the local-additions merge — it replaces whole families, so it would wipe
  Figma's purple scale. Options: add `50` to the Purple collection in Figma (proper fix), or use `purple-100` / a cool-grey
  fill for the highlight **[VISUAL-CHANGE]**. Decide when building the change-trail highlight.
- **`figma-export.json`**: `coolGray` and `instrumentSans` are product forks, so they intentionally stay out of Figma's
  shared collections (same as portfolio's `warmGray`).

## 34 · Publish flow (flow 5 · D2 · D5)
- [PROJECT-NEW] `PublishDialog` (D2): version name, what's in vN, the three checks, where calls go (neutral info), optional "Then connect a phone number". A test that didn't pass only warns: primary becomes "Run test first", with a quiet "Publish anyway". Pending changes and no calendar block with the top-bar checklist; the sample calendar still opens D2.1.
- [PROJECT-NEW] `ConnectNumberDialog` (D5): pick a workspace number, then choose what it answers with: Follows prod (default), Latest published, or Pinned to vN. Skipping is fine.
- [DS-NEW] candidate: `TriggerButton` / `Popover` variant `primary` (brand fill), so Publish vN can be the one primary in the top bar.
- Model: `published[]` (the latest one gets the prod tag automatically, which answers Q-05), `numbers[]`, `publishChecks`, `nextStepOf → 'publish'`. Status: Published · vN → Live · vN only once a number points to it (R-05).
- [VISUAL-CHANGE] A passing test clears the stale "Linked to Test n result" banner, so its filled Edit button no longer competes with Publish.
- §34 revision · Publish dialogs (D2, D2.1, D5) now share one type and spacing system. Parts sit 24px apart and each label sits 8px above its content. Part labels use `--type-strong`. Lists (what's in vN, the checks) follow the Test history data-grid pattern: `--type-grid` 12/16, 36px rows, 1px dividers, 16px icons. Warnings are the platform `Note` (warning, 20px triangle, bold lead-in) and where calls go is `Note` info. The checkbox label is overridden to `--type-body` [DS-UPDATE: DS Checkbox label is 12px in the DS font].
- §34 revision 2 · D2/D2.1 lists sit in outlined panels (border-subtle, radius-m, 16px inner padding, 40px rows), so every part is a label on its own box, matching the Version name field. "Before you publish" has a right-aligned summary ("3 of 3 ready", positive or warning). The changes list gives the label column 16px before the value and stacks label over detail below 1024px. The checkbox sits 16px under the info note.
