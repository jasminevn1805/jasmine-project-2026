---
inputDocuments:
  - "Discovery" FigJam board › "Retell agent builder · case study" section (node 141:15893)
  - Hands-on walkthrough as the persona, 2026-11-16 (dental booking agent, ~23 min)
  - G2 reviews of Retell AI, Retell docs
date: 2026-11-20
author: Phuong Hoang
project: retell-AI
status: Chapters 1–7 done (frame → wireframes). Next: validate with 5 clinic managers.
---

# Product Brief: Retell Agent Builder (case study)

---

## Executive Summary

**Retell AI** lets businesses build voice agents that answer calls and take actions, such as booking appointments. This case study redesigns the **agent page**, where an agent is built, tested and published. The goal is for a non-technical builder to go from "describe your agent" to a working agent, **tested end to end, in under 10 minutes**.

When I tried it as the persona, I still had no working agent after **23+ minutes**. Two problems stood out:

- **P1 · The calendar step ends the trial.** Booking needs a developer-style calendar connection, so the builder never gets to a full test call where the agent actually books.
- **P2 · Status and test feedback are hard to act on.** The builder can't tell what state the agent is in, or why a test failed and where to fix it.

**The answer:** one agent page with three zones (**State · Spec · Workbench**) in a **split-pane layout**. Setup asks "Where do you book appointments?", so practice-software clinics can test on a **sample calendar** right away. Every test ends with a **result card** that names the cause and has a **Fix this** link.

**Scope:** a 3-day case study, one persona, one agent page, from the first build to the first publish. The wireframes cover the core flow only: build the agent, then fix issues until it works.

---

## Framing

| | |
|---|---|
| **Business goal** | Retell earns money when agents go live and stay live. |
| **Persona** | A non-technical clinic manager who is keen to use technology and AI-assisted tools to run the business more productively. |
| **Scenario** | Build an agent for a dental clinic that books cleaning appointments for patients. Wider need: *"Create an agent that helps my dental clinic receive calls, schedule appointments and answer questions about our services."* |
| **What "good" looks like** | A working booking agent in under 10 minutes, without help. |
| **The lens** | Usability · Clarity · Trust in AI · Confidence to go live |
| **Real-world constraint** | Clinics already book in their own practice software (e.g. Dentrix, Jane App). The agent must book into that system, which usually needs a custom API connection built by a developer or partner. Cal.com / Calendly only fit clinics without such software. |

**Decision:** judge every idea by time to a first working agent and confidence to go live.

---

## Evidence

### Baseline (walkthrough, 2026-11-16)

| Metric | Result |
|---|---|
| Time to first working agent | **Not reached.** Stopped after ~23 min, blocked at connecting the calendar. |
| Steps | 11 logged |
| Errors | Run Test gave no response · Booking failed: the agent could not check availability (tools pointed to placeholder URLs) · Call insight said "unsuccessful" with no reason |
| Moments of confusion | **9:** too much info in 4 columns · unnamed settings group · no clear next step · "Review changes" / Accept / Submit · "Version 0" and "real calls" · calendar endpoint · timeout / max retries · finding the transcript · workflow canvas |

### Key findings

1. **Core task dead end:** the test booking failed because no calendar was connected, and connecting one needs an API endpoint the persona can't set up.
2. **Unclear system status and next step:** Run Test stays silent, changes sit pending in "Review changes", and "Submit", "Version 0" and "real calls" are unclear.
3. **Broken test → fix loop:** the transcript is ~6 clicks away, there is no failure reason, and nothing links to where to fix it.
4. **Technical jargon** with no plain-language help (endpoint, timeout, retries).
5. **Information overload:** 4 dense columns, unnamed settings groups, and a workflow canvas with no explanation and no zoom.

**What works:** relevant template content, "Generate from prompt", a natural-sounding conversation and a clear live transcript.

### Supporting evidence

- **G2 (80 reviews):** steep learning curve; "initial navigation and understanding of features quite challenging"; debugging backend-connected agents "can be harder than it should be".
- **Counter-evidence:** "Ease of Use" is the top G2 pro (494 reviews). The product is easy to start and hard to take further.
- **Retell docs:** booking works through Cal.com or Calendly. Google Calendar is not native. Even the Cal.com path takes 6 technical steps (API key, event type ID, 2 tools).
- **Template mismatch:** my Conductor-generated agent used custom tools with placeholder URLs, not the integration tools. Retell deprecated the built-in Cal.com tools on Oct 31, 2026, which may explain this *(to verify)*.

---

## Problems

Score = how often × how bad × business impact (max 27).

### P1 · The calendar step ends the trial (scores 27, 18, 18)

Clinics book appointments in their own software, but setup never asks where bookings live. Conductor (Retell's AI build assistant) defaults to a developer-only connection: a custom API endpoint with placeholder URLs. So a clinic manager can test the conversation but never reaches a full test call where the agent books. They never see what Retell does best, and have no other way to keep exploring.

- Booking doesn't work out of the box: placeholder tools, so the first test fails **(27)**
- Setup never asks where appointments live; the blocker is buried in a long Conductor message **(18)**
- Function settings use jargon (endpoint, timeout, max retries) and the tooltips don't help **(18)**

### P2 · Unclear state and a broken test-to-fix loop (scores 18, 12, 12, 12, 8)

After Conductor builds the agent, the builder can't tell what state it is in, or why a test call failed and where to fix it. So the agent never reaches "ready to go live".

- Transcript ~6 clicks away; "unsuccessful" with no reason or link to the fix **(18)**
- Information overload: 4 dense columns, no next step **(12)**
- Unclear state and wording: Submit, Version 0, "real calls", gray UI switch **(12)**
- AI changes wait in "Review changes", and it isn't clear they must be accepted before testing **(12)**
- Run Test gave no response and no feedback on why **(8)**

> P2 rests on one walkthrough. It is the first thing to validate with users.

**Left out for now:** the checklist doesn't warn that booking isn't connected (6); the workflow canvas (1).

---

## Chosen directions

| Problem | Chosen | Why | Trade-off |
|---|---|---|---|
| **P1** | **E + D, with C** — ask "Where do you book appointments today?" and branch. Practice software → test on a **sample calendar**. Cal.com / Calendly → **sign in** instead of pasting API keys. | It starts from where the clinic really books. The first test booking works in minutes, so the trial keeps going. | A sample calendar isn't a live agent. Publishing stays blocked until a real calendar is connected, and Retell would have to host the sample calendar (Q-01). |
| **P2** | **A + B + C + D + F** (E later) — one status chip with the next step · Run never fails silently · result card with cause + Fix this · transcript replies linked to the spec · show one stage at a time | Together they close one loop: where you are → what's next → why it failed → where to fix it. | More states to design and keep accurate. The status chip must always be right, or it destroys trust. |

**Status:** Draft · Changes pending · Ready to test · Live. This replaces "Submit" and "Version 0".

---

## Structure (IA)

**Method:** before/after audit → an inventory of 28 elements → closed card sort by object (OOUX / ORCA) → impact × frequency matrix → object hierarchy.

**What the card sort found:** the 28 elements form 11 object groups. 8 of them describe the agent itself, yet today they are split across Details and Settings with no rule. The other 3 (state, build, test) are not part of the agent; they act on it.

### The new hierarchy

```
L0  Workspace      Agents · Knowledge bases · Phone numbers · Call history
L1  Agent          One agent page
L2  Zones          State (top bar) · Definition / Spec (centre) · Workbench (right panel: Build | Test)
L3  Sections       State: Status chip · Pending changes · Versions · Publish
                   Spec:  Summary · Behavior · Knowledge · Actions ✓/⚠ · Advanced
                   Workbench: Build mode (Conductor) · Test mode · Test history
L4  Details        Advanced, collapsed, defaults on: Voice & speech · Call handling ·
                   After the call · Integrations · Model
```

**Why it's shaped this way**
- **The Spec is the parent.** Everything that describes the agent sits in one place, at the centre of the screen.
- **The Workbench owns no data.** Build and Test only act on the Spec, so they share one panel, one mode at a time.
- **State sits in between.** Every edit becomes a pending change and every test runs on a version, so state lives in the top bar, visible from both modes.
- **Shared objects stay shared.** Knowledge bases, phone numbers and call history belong to the workspace; the agent only attaches them.

**Before → after:** 4 equal panels · 10 settings groups · 8 top-bar controls · 0 next-step cues → 3 zones · 5 always-visible groups · 2 groups with status · 1 Advanced row.

---

## Layout

**Question:** which layout lets first-time builders finish fastest and still works for return builders?

**Criteria (weight):** time to a first working agent (×5) · usability for return builders (×4) · clarity of next step (×3) · trust in AI (×2) · confidence to go live (×2) · fit and feasibility (×1).

| Option | Score (max 85) | Strongest at | Weakest for |
|---|---|---|---|
| **A · Split panes** ✅ | **69** | Edit and effect side by side; transcript beside its cause | First-timers on 1280 px laptops: two dense zones on the first view |
| B · List–detail | 66 | Return builders jump to any section; most reusable pattern | First-timers must choose where to go; Conductor's edits can land in a closed section |
| C · Guided column | 63 | Fastest first build (one open card, one action) | Return builders (2/5): one section at a time, the panel covers the column |

**Decision: Option A.** It was first decided on 2026-11-19 as C (when the question covered first-time builders only), then revised to A once return builders were added. **Worth testing:** A with C's collapsed, already-finished sections on the first build.

---

## Flows & screens (Option A)

**20 flows in 4 stages:**

- **Core path:** 1 First build with Conductor · 2 Review · 3 Connect actions · 3b Use the sample calendar · 4 Run a test · 5 Publish
- **Fix and re-test:** 6 Fix from the result card · 7 Fix from a transcript line · 8 Fix with Conductor · 9 Edit the spec by hand · 10 Fix a knowledge gap · 11 Tune Advanced · 12 Compare runs
- **Blocked and edge:** 13 Test with unapplied changes · 14 Test with a missing connection · 15 Discard changes · 16 Publish blocked · 17 Roll back · 18 Leave and resume
- **Return builders:** 19 Update a live agent · 20 Fix from a real call

**First pass:** flows 1–5, 3b, 6–9, 13, 14, 16. **Later:** 10–12, 15, 17–20.

### Key screens (wireframed, lo-fi, desktop + mobile)

| ID | Screen / state | Solves |
|---|---|---|
| a | New agent | P2 · F |
| c | Built, changes pending | P2 · A, F |
| d | Applied, ready to test | P1 · E, P2 · A |
| D1 | Dialog · Connect calendar | P1 · E, C, D |
| g | Test running | P2 · D |
| i | Result: failed | P2 · C, D |
| D2 | Dialog · Publish | P2 · A |
| w | Testing on the sample calendar | P1 · D |
| D2.1 + v | Publish blocked + Test history | P1 · D, P2 · B |

**Still to design:** m · Section in edit mode · D3 · Knowledge base picker · D4 · Apply first? · Versions menu.

### Sample calendar rules

- Offered at step 1 of Connect calendar, and as the primary action when practice software is picked.
- Always labelled "Sample calendar" with a **Test only** tag. Never hidden, never nagging.
- Realistic: uses the clinic's hours and already has some slots booked. No texts go to callers.
- Publishing needs a real calendar. The Publish dialog names the blocker; everything built so far is kept.
- Return builders: one Switch to real calendar control in Actions; test calls on live agents go to the sample calendar by default; Reset sample calendar gives repeatable tests.

---

## Decisions

| ID | Decision |
|---|---|
| D-01 | Focus on P1 and P2. Jargon and overload are handled by the new structure. |
| D-02 | One agent page, three zones: State · Spec · Workbench. |
| D-03 | Split panes (Option A): 69 vs 66 vs 63. |
| D-04 | Ask "Where do you book?"; practice software tests on a sample calendar; Publish needs a real calendar. |
| D-05 | Test feedback you can act on: status chip with next step, Apply first?, result card with cause and Fix this, transcript "why ›" links. |
| D-06 | Scope: first-pass flows only. |

**Revisions after review:** R-01 Usage chip ▾ replaces the cost line · R-02 voice, language and model moved into Summary · R-03 Conductor sends one build message, then what was built and what needs you · R-04 the failure cause matches the failed result (7:30 am) · R-05 Publish ≠ go-live (numbers bind to versions) · R-06 IDs aligned with the screen list.

---

## Open questions

- **Q-01 Sample calendar:** can Retell host it and apply clinic hours from Knowledge? *(engineering)*
- **Q-02 Cost figures:** real per-minute cost and latency, and how to estimate them before a call. *(engineering, data)*
- **Q-03 Practice software:** who connects Dentrix or Jane App: a partner, the clinic's developer, or Retell?
- **Q-04 Real calls:** should a failed real call link back to its cause (flow 20)?
- **Q-05 First publish:** should it point the prod tag at v1 automatically?
- **IA:** do first-time builders need Versions visible, or only Status? Should knowledge bases be editable inside the agent page?
- **To verify:** is the Cal.com deprecation the cause of the template mismatch?

---

## Validation plan (next step)

| | |
|---|---|
| **Who** | 5 clinic managers or front-desk leads, not technical |
| **What** | Clickable prototype of the key screens: flows 1–5 and 3b, then flow 6 with a seeded failure (the 7:30 am slot) |
| **Measure** | Time to first passing test booking · completion without help · moments of confusion · can they name the agent's status at each step · after a failed test, can they find why and where to fix it |
| **Baseline** | 23+ min, not reached · 9 moments of confusion |
| **Target** | **4 of 5** reach a passing test in **under 10 minutes**, with **≤ 2 moments of confusion** each |

**Layout check:** A vs C, order swapped between users. Switch to C if it is ≥ 20% faster for first-timers while return builders are no more than 10% slower.

---

## Next steps

1. Prototype the key screens for flows 1–5 and 3b.
2. Design the remaining key screens: m, D3, D4 and the Versions menu.
3. Run the moderated test with 5 clinic managers, then go to hi-fi.
4. Answer Q-01 and Q-03 with engineering.
