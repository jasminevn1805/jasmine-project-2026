# Walkthrough panel · build plan

Status: steps 1–2 built on 2026-11-25 (save points, scenarios, panel with Spec + Test modes, deep links, auto-advance). Next: Guided highlights, off-path recovery, headless regression run.

## Goal
Show test cases and walkthrough steps inside the prototype itself. The same scenarios serve three audiences:
- audiences and portfolio viewers walk the flows;
- engineers get test cases attached to the prototype;
- usability sessions (Ch 8 study) use the same tasks.

## Approach (decided)
- **One prototype, one codebase.** There are no per-flow copies.
- **Choosing a scenario loads a save point.** The agent state resets to that scenario's start state, and the panel shows its steps. The whole UI stays live, so viewers are never locked into a flow.
- **Off the path:** if the expected result for the current step doesn't appear, the panel offers "Back to step N" or "Restart scenario".
- **Full journey is the default and is listed first.** It starts from a blank agent and is grouped into chapters. Every chapter is also a save point.
- **Branches are separate scenarios.** Each starts at its own save point and says where it branches off.

## Scenarios

### Full journey (chapters = save points)
| # | Chapter | Start state | Ends when |
|---|---|---|---|
| 1 | Build | blank agent (screen a) | changes applied → v1, Ready to test |
| 2 | Connect calendar | v1 applied, no calendar | Cal.com connected (D1) |
| 3 | Test (fails) | calendar connected | Test 1 failed, cause names prompt line 2 |
| 4 | Fix and re-test | Test 1 failed | Test 2 passed on v3 |
| 5 | Publish | Test 2 passed on v3 | D2 → Published · v3, prod tag |
| 6 | Connect a number | Published · v3, D5 open | +1 403 555 0100 follows prod |
| 7 | Live | Live · v3 | Versions menu shows v3 · prod · number |

### Branches
| ID | Name | Branches from | Start state | Expected |
|---|---|---|---|---|
| TC-02 | Practice software | Connect calendar | v1, no calendar | sample calendar → test → Publish → D2.1 blocks publishing |
| TC-04 | Audio vs Text | Test | calendar connected | Text is a real chat; results per test type |
| TC-07 | Publish before the test passes | Test | Test 1 failed | D2.2 warning: Run test first (primary) / Publish anyway |
| TC-08 | Skip the number | Publish | Test 2 passed on v3 | D5 Skip → Published · v3, no warning |

**Not in this prototype** (shown in the panel as greyed out, so engineers see the full scope): Fix with Conductor (flow 8), publish again with numbers connected (flow 19), roll back with "Point prod here" (flow 17).

### Each step holds
- the action ("Click Publish v3");
- the expected result ("D2 opens · 3 of 3 ready");
- a `check(state)` function for auto-advance;
- the screen IDs (D2, j…);
- the rule, when there is one (for example "Publish never needs a number").

## Panel UI (simple first, detail on demand)
- **Collapsed:** a small pill in the bottom-left: "Full journey · Step 9 of 18 · Publish". Give it a neutral style outside the Retell theme so it doesn't read as product UI. On mobile it sits above the bottom sheet.
- **Expanded:**
  - the Full journey with its chapter chips;
  - the Branches list;
  - the current step's action and expected result;
  - Back, Next and Restart.
- **Details toggle (Spec mode):** state IDs, the rule, edge cases, and "Copy as checklist" (Markdown).
- **Deep links:** `?scenario=journey&chapter=5` and `?scenario=TC-07&step=2`.
- **Hide it completely:** `?walkthrough=off`, for clean recordings.

## Modes
| Mode | For | Shows |
|---|---|---|
| Spec (default) | engineers | steps, expected results, checks, rules, IDs, copy |
| Test | usability sessions | only the chapter goal ("Make the agent available to callers"); no steps, no highlights |
| Guided | demos | steps plus a highlight on the next button; everything else dimmed but still clickable |

## Code plan
- `lib/walkthrough/scenarios.ts`: scenario data.
- `lib/walkthrough/savepoints.ts`: functions that build each start state. Build them by running the real reducer actions from the fixture state, not hand-written state objects, so they can't drift from the app.
- `components/walkthrough/WalkthroughPanel.tsx` + `walkthrough.module.css`.
- `AgentPage.tsx`:
  - accept a `loadState` from the panel (this needs one reducer action, `{type:'load', state}`);
  - pass the current state to the panel;
  - reset local UI state (open dialogs, tab, focus) on load.
- Checks use the existing selectors: `statusOf`, `nextStepOf`, `publishChecks`, `isPublished`, `latestPublished`.
- Timing: test runs are scripted at about 18–21 s. Save points should skip past them. Steps that run a test wait for the result before checking.

## Build order
1. Scenario data and save points. Verify that each save point loads correctly.
2. The panel: collapsed and expanded, Spec mode, auto-advance, off-path recovery, deep links.
3. Test mode, needed before the Ch 8 sessions.
4. Guided highlights (polish).
5. Optional: run every scenario headless with the Chrome DevTools Protocol (the click-script approach used for the Ch 12 screenshots) as a regression check, and refresh the board screenshots at the same time.
6. Optional: export the scenarios as a FigJam table next to Ch 12.

## Also pending before deploy (from the readiness check)
- **Commit the work.** `projects/retell-AI/` and the Retell design-system primitive changes (`packages/design-system`) are uncommitted, and so is the root `package.json` change that adds `build:retell`. Commit only those, not the unrelated files.
- **Hosting:**
  - root directory `projects/retell-AI`;
  - install from the repo root;
  - build command `npm run build:retell`.
- **Viewers:** add a "Concept prototype · not affiliated with Retell AI" note and `robots: noindex`.
- **Dead links:** `href="#"` on Agents (back and breadcrumb) and on the rail items. Either remove the link styling or show a "Not part of this prototype" toast.
- **Mobile:** do a 390 check of D5 and the Versions menu.
- **Embedding:** `X-Frame-Options: DENY` blocks embedding the prototype in other pages. Allow your portfolio domain if you need to embed it.
- **After deploy:** add the link and a recording to Part 2 · Read me first on the board.
