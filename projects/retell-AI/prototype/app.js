// Agent builder prototype · state c "Built, changes pending" (with Apply → d and Undo back to c)
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const isMobile = () => matchMedia("(max-width: 1023px)").matches;
const icon = (id, cls = "ic ic--s") => `<svg class="${cls}"><use href="#${id}"/></svg>`;

const BASE_ITEMS = [
  { target: "summary", html: "<b>Summary</b> · new" },
  { target: "behavior", html: "<b>Behavior</b> · new prompt and handbook" },
  { target: "knowledge", html: "<b>Knowledge</b> · 2 sources added" },
  { target: "actions", html: "<b>Actions</b> · 4 added, 2 need a connection" },
];

const state = { items: [...BASE_ITEMS], version: 0 };
const app = $(".app");
const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

/* ---------- Word count: real count of the long prompt ---------- */
const words = $("#prompt").textContent.trim().split(/\s+/).length.toLocaleString("en-US");
$("#wordCount").textContent = words;
$$(".wc").forEach((el) => (el.textContent = words));

/* ---------- Render everything that depends on state ---------- */
function render() {
  const n = state.items.length;
  const pending = n > 0;
  const v = state.version;
  app.dataset.state = pending ? "pending" : "applied";

  $("#statusText").textContent = pending ? "Changes pending" : `Ready to test · v${v}`;

  const changed = new Set(state.items.map((i) => i.target));
  $$(".card[data-section]").forEach((card) => card.classList.toggle("is-changed", changed.has(card.dataset.section)));

  // Pending changes card
  $("#pendingCard").hidden = !pending;
  $("#pendingCount").textContent = n;
  $("#pendingTitle").lastChild.textContent = n === 1 ? " pending change" : " pending changes";
  $("#pendingList").innerHTML = state.items
    .map((i) => `<li><button class="trail-link" data-target="${i.target}"><span>${i.html}</span>${icon("i-right")}</button></li>`)
    .join("");
  $("#confirmDiscardBtn").textContent = `Discard ${plural(n, "change")}`;
  $("#discardConfirm p").textContent =
    v === 0
      ? `Discard all ${plural(n, "change")}? This removes everything Conductor built. There is no earlier version to go back to.`
      : `Discard ${plural(n, "change")}? The agent goes back to v${v}.`;

  // Applied confirmation in the chat
  let ok = $("#appliedNote");
  if (!pending && v > 0) {
    if (!ok) {
      ok = document.createElement("div");
      ok.id = "appliedNote";
      ok.className = "note note--ok is-new";
      $("#chatExtra").after(ok);
    }
    ok.innerHTML = `${icon("i-check", "ic")}<p><b>Applied as v${v}.</b> Your agent is ready to test. Next: connect a calendar so booking works, or test the conversation now.</p>`;
  } else if (ok) ok.remove();

  // Next-step wording follows the state
  $("#needsYouStep").textContent = pending ? "Apply first, then" : "Next:";

  // Exactly one primary action on screen: Apply while pending, Connect calendar after
  const connect = $("#connectBtn");
  connect.classList.toggle("btn--primary", !pending);
  connect.classList.toggle("btn--secondary", pending);

  const mCta = $("#mApplyBtn");
  mCta.innerHTML = pending ? `Apply ${plural(n, "change")}` : `${icon("i-cal")}Connect calendar`;
  $("#sheetTitle").textContent = pending ? `${plural(n, "pending change")}` : `Ready to test · v${v}`;
  $("#sheetTitle").textContent = pending ? (n === 1 ? "1 pending change" : `${n} pending changes`) : `Ready to test · v${v}`;

  // Test mode never fails silently
  $("#testNote").className = pending ? "note note--info" : "note note--warn";
  $("#testNote").innerHTML = pending
    ? `<p><b>Nothing to test yet.</b> Tests run on a version, and your ${plural(n, "change")} ${n === 1 ? "isn't" : "aren't"} applied. Apply to create v${v + 1}, then run a test.</p>`
    : `${icon("i-alert", "ic warn")}<p>Booking needs a calendar before a full test. You can still test the conversation on v${v}.</p>`;
  $("#testApplyBtn").textContent = pending ? `Apply ${plural(n, "change")}` : "Run test";

  // Top bar popovers
  $('[data-todo="apply"]').classList.toggle("is-done", !pending);
  $('[data-todo="apply"]').lastChild.textContent = pending ? `Apply ${plural(n, "pending change")}` : "Changes applied";
  $('[data-todo="apply"] .ic use').setAttribute("href", pending ? "#i-alert" : "#i-check");
  $("#versionsPop").innerHTML =
    v === 0
      ? `<p class="t-strong">No versions yet</p><p class="t-body muted">Apply turns the ${plural(n, "pending change")} into v1. Tests and calls always run on a version.</p>`
      : `<p class="t-strong">v${v} · applied just now</p><p class="t-body muted">${pending ? `${plural(n, "change")} pending on top of v${v}.` : "Not live yet. Publish makes a version live."}</p>`;

  const when = pending ? `starts with v${v + 1}, after Apply` : `v${v}`;
  $("#usageWhen").textContent = when;
  $("#usageStarts").textContent = pending ? `v${v + 1}, after Apply` : `v${v}, now`;
}

/* ---------- Apply / Undo ---------- */
let undoSnapshot = null;
function apply() {
  undoSnapshot = { items: [...state.items], version: state.version };
  // Change trail settles one section at a time, top to bottom
  $$(".card.is-changed").forEach((c, i) => (c.style.transitionDelay = `${i * 70}ms`));
  state.items = [];
  state.version += 1;
  render();
  setTimeout(() => $$(".card").forEach((c) => (c.style.transitionDelay = "")), 800);
  if (isMobile()) setSheet("peek");
  toast(`Applied as v${state.version}`, "Undo", () => {
    Object.assign(state, undoSnapshot);
    render();
    toast("Changes are pending again");
  });
}
["#applyBtn", "#mApplyBtn", "#testApplyBtn"].forEach((s) =>
  $(s).addEventListener("click", () => {
    if (state.items.length) return apply();
    if (s === "#testApplyBtn") return toast("Test running is the next screen (g), not in this prototype yet.");
    connectCalendar();
  })
);

/* ---------- Discard (two-step, explains what happens) ---------- */
$("#discardBtn").addEventListener("click", () => {
  $("#discardConfirm").hidden = false;
  $(".pending__actions").hidden = true;
  $("#keepBtn").focus();
});
$("#keepBtn").addEventListener("click", closeDiscard);
$("#confirmDiscardBtn").addEventListener("click", () => {
  closeDiscard();
  toast(state.version === 0 ? "Discarding goes back to the new-agent screen (a), not in this prototype yet." : `Back to v${state.version}.`);
  if (state.version > 0) { state.items = []; render(); }
});
function closeDiscard() {
  $("#discardConfirm").hidden = true;
  $(".pending__actions").hidden = false;
  $("#discardBtn").focus();
}

/* ---------- Connect calendar ---------- */
function connectCalendar() {
  if (state.items.length) {
    toast("Apply first, so the calendar connects to the version you test.", "Apply", apply);
  } else {
    toast("Connect calendar (D1) opens here, not in this prototype yet.");
  }
}
$("#connectBtn").addEventListener("click", connectCalendar);

/* ---------- Signature: change trail. Point at a change, its section lights up ---------- */
const light = (target, on) => {
  const card = $(`.card[data-section="${target}"]`);
  if (card) card.classList.toggle("is-lit", on);
};
const pulse = (target) => {
  const card = $(`.card[data-section="${target}"]`);
  if (!card) return;
  card.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  card.classList.remove("is-pulse");
  void card.offsetWidth;
  card.classList.add("is-pulse");
};
const list = $("#pendingList");
list.addEventListener("pointerover", (e) => { const b = e.target.closest(".trail-link"); if (b) light(b.dataset.target, true); });
list.addEventListener("pointerout", (e) => { const b = e.target.closest(".trail-link"); if (b) light(b.dataset.target, false); });
list.addEventListener("focusin", (e) => { const b = e.target.closest(".trail-link"); if (b) light(b.dataset.target, true); });
list.addEventListener("focusout", (e) => { const b = e.target.closest(".trail-link"); if (b) light(b.dataset.target, false); });
list.addEventListener("click", (e) => {
  const b = e.target.closest(".trail-link");
  if (!b) return;
  if (isMobile()) setSheet("peek");
  pulse(b.dataset.target);
});

document.addEventListener("click", (e) => {
  const j = e.target.closest("[data-jump]");
  if (!j) return;
  e.preventDefault();
  closePopovers();
  if (j.dataset.jump === "advanced") setExpanded($("#advancedBtn"), true);
  if (isMobile()) setSheet("peek");
  pulse(j.dataset.jump);
});

/* ---------- Disclosure: prompt, handbook, advanced, knowledge (mobile) ---------- */
function setExpanded(btn, open) {
  btn.setAttribute("aria-expanded", String(open));
  const target = document.getElementById(btn.getAttribute("aria-controls"));
  if (btn.id === "promptToggle") {
    target.classList.toggle("is-open", open);
    btn.firstChild.textContent = open ? "Show less · " : "Show full prompt · ";
  } else if (btn.id === "knowledgeToggle") {
    btn.closest(".card").classList.toggle("is-open", open);
  } else {
    target.hidden = !open;
  }
}
["#promptToggle", "#handbookBtn", "#advancedBtn", "#knowledgeToggle"].forEach((s) =>
  $(s).addEventListener("click", (e) => setExpanded(e.currentTarget, e.currentTarget.getAttribute("aria-expanded") !== "true"))
);

/* ---------- Voice sample ---------- */
$("#sampleBtn").addEventListener("click", (e) => {
  const b = e.currentTarget;
  const on = b.getAttribute("aria-pressed") !== "true";
  b.setAttribute("aria-pressed", String(on));
  b.querySelector("span").textContent = on ? "Playing" : "Sample";
  clearTimeout(b._t);
  if (on) b._t = setTimeout(() => { b.setAttribute("aria-pressed", "false"); b.querySelector("span").textContent = "Sample"; }, 3000);
});

/* ---------- Popovers ---------- */
function closePopovers(except) {
  $$("[aria-controls].is-pop-open").forEach((b) => {
    if (b === except) return;
    b.classList.remove("is-pop-open");
    b.setAttribute("aria-expanded", "false");
    document.getElementById(b.getAttribute("aria-controls")).hidden = true;
  });
}
["#versionsBtn", "#publishBtn", "#moreBtn", "#usageBtn"].forEach((s) =>
  $(s).addEventListener("click", (e) => {
    e.stopPropagation();
    const b = e.currentTarget;
    const pop = document.getElementById(b.getAttribute("aria-controls"));
    const open = pop.hidden;
    closePopovers(b);
    pop.hidden = !open;
    b.setAttribute("aria-expanded", String(open));
    b.classList.toggle("is-pop-open", open);
  })
);
document.addEventListener("click", (e) => { if (!e.target.closest(".popover")) closePopovers(); });
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const open = $("[aria-controls].is-pop-open");
  closePopovers();
  if (open) open.focus();
  else if (isMobile() && $("#bench").dataset.sheet === "open") setSheet("peek");
});

/* ---------- Build | Test tabs (arrow keys move between them) ---------- */
const tabs = $$('[role="tab"]');
function selectTab(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
  if (isMobile()) setSheet("open");
}
tabs.forEach((t) => {
  t.addEventListener("click", () => selectTab(t));
  t.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const next = tabs[(tabs.indexOf(t) + 1) % tabs.length];
    next.focus();
    selectTab(next);
  });
});
$$(".mode").forEach((m) =>
  m.addEventListener("click", () => $$(".mode").forEach((x) => { x.classList.toggle("is-on", x === m); x.setAttribute("aria-checked", String(x === m)); }))
);

/* ---------- Mobile sheet ---------- */
function setSheet(mode) {
  $("#bench").dataset.sheet = mode;
  $("#sheetHandle").setAttribute("aria-expanded", String(mode === "open"));
  $("#sheetHandle").setAttribute("aria-label", mode === "open" ? "Collapse Conductor" : "Expand Conductor");
}
$("#sheetHandle").addEventListener("click", () => setSheet($("#bench").dataset.sheet === "open" ? "peek" : "open"));
$("#sheetTitle").addEventListener("click", () => setSheet("open"));

/* ---------- Resizable Workbench (desktop) ---------- */
const handle = $("#benchResize");
const BENCH_MIN = 360;
const SPEC_MIN = 480; // the spec never gets squeezed below a readable width
const benchMax = () => Math.max(BENCH_MIN, app.clientWidth - $(".rail").offsetWidth - SPEC_MIN);
function setBenchWidth(w, save = true) {
  const clamped = Math.round(Math.min(benchMax(), Math.max(BENCH_MIN, w)));
  app.style.setProperty("--bench-w", `${clamped}px`);
  handle.setAttribute("aria-valuenow", clamped);
  handle.setAttribute("aria-valuemin", BENCH_MIN);
  handle.setAttribute("aria-valuemax", benchMax());
  if (save) try { localStorage.setItem("benchWidth", clamped); } catch {}
}
function resetBenchWidth() {
  app.style.removeProperty("--bench-w");
  handle.setAttribute("aria-valuenow", $("#bench").offsetWidth);
  try { localStorage.removeItem("benchWidth"); } catch {}
}
handle.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  handle.setPointerCapture(e.pointerId);
  document.body.classList.add("is-resizing");
  const right = app.getBoundingClientRect().right;
  const move = (ev) => setBenchWidth(right - ev.clientX);
  const up = () => {
    document.body.classList.remove("is-resizing");
    handle.removeEventListener("pointermove", move);
    handle.removeEventListener("pointerup", up);
    handle.removeEventListener("pointercancel", up);
  };
  handle.addEventListener("pointermove", move);
  handle.addEventListener("pointerup", up);
  handle.addEventListener("pointercancel", up);
});
handle.addEventListener("dblclick", resetBenchWidth);
handle.addEventListener("keydown", (e) => {
  const w = $("#bench").offsetWidth;
  const step = e.shiftKey ? 64 : 16;
  const map = { ArrowLeft: w + step, ArrowRight: w - step, Home: BENCH_MIN, End: benchMax() };
  if (e.key in map) { e.preventDefault(); setBenchWidth(map[e.key]); }
  if (e.key === "Enter") resetBenchWidth();
});
try { const saved = +localStorage.getItem("benchWidth"); if (saved) setBenchWidth(saved, false); } catch {}
if (!handle.hasAttribute("aria-valuenow")) handle.setAttribute("aria-valuenow", $("#bench").offsetWidth);
addEventListener("resize", () => { if (app.style.getPropertyValue("--bench-w")) setBenchWidth($("#bench").offsetWidth, false); });

/* ---------- Ask Conductor: every request becomes a visible pending change ---------- */
$("#askForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#askInput");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  const extra = $("#chatExtra");
  const you = document.createElement("div");
  you.className = "msg msg--you";
  you.textContent = text;
  extra.append(you);
  const working = document.createElement("div");
  working.className = "msg msg--ai is-new";
  working.innerHTML = `<p class="msg__meta">${icon("i-spark")}Conductor · working…</p>`;
  extra.append(working);
  scrollChat();
  setTimeout(() => {
    const short = text.length > 48 ? text.slice(0, 46).trimEnd() + "…" : text;
    working.innerHTML = `<p class="msg__meta">${icon("i-spark")}Conductor · updated Behavior</p><p>I added this to the prompt: “${escapeHtml(text)}”. It's a pending change. Apply to include it in the version you test.</p>`;
    state.items = state.items.filter((i) => !i.fromAsk).concat({ target: "behavior", html: `<b>Behavior</b> · “${escapeHtml(short)}”`, fromAsk: true });
    render();
    scrollChat();
  }, 900);
});
function scrollChat() { const s = $("#panel-build"); s.scrollTop = s.scrollHeight; }
function escapeHtml(s) { return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

/* ---------- Toast ---------- */
let toastTimer;
function toast(text, actionLabel, onAction) {
  const t = $("#toast");
  const a = $("#toastAction");
  $("#toastText").textContent = text;
  a.hidden = !actionLabel;
  a.textContent = actionLabel || "";
  a.onclick = () => { t.hidden = true; onAction && onAction(); };
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), actionLabel ? 6000 : 3500);
}

render();
// Chats anchor to the newest message: the "Needs you" note and Apply are in view on load.
scrollChat();
