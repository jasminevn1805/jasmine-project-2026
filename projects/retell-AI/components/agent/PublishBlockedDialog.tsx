"use client";
// D2.1 · Dialog · Publish blocked (sample calendar) — flow 16, end of branch 3b.
// Names the one blocker in plain words and swaps the primary to Connect real
// calendar. Nothing built or tested is lost. Solves P1 · D, P2 · B (never blocked silently).
import { Button } from "@jasmine/design-system";
import { CircleCheck, TriangleAlert, X } from "lucide-react";
import { Dialog, Icon, Note } from "@/components/ui";
import { agent } from "@/lib/agent/fixtures";
import { isPending, lastTest, type AgentState } from "@/lib/agent/model";
import s from "./dialog.module.css";

export function PublishBlockedDialog({
  open,
  state,
  onClose,
  onConnectReal,
}: {
  open: boolean;
  state: AgentState;
  onClose: () => void;
  onConnectReal: () => void;
}) {
  const last = lastTest(state);
  const passed = last?.outcome === "passed";
  const pending = isPending(state);

  const checks = [
    {
      ok: passed,
      label: "Last test",
      value: last
        ? `${passed ? "Passed" : "Ended early"} · Test ${last.n}`
        : "Not run yet",
    },
    { ok: false, label: "Actions", value: "Using the sample calendar" },
    {
      ok: !pending,
      label: "Pending changes",
      value: pending ? `${state.pending.length} not applied` : "None",
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      labelledBy="d21-title"
      describedBy="d21-desc"
    >
      <header className={s.head}>
        <div>
          <p className={s.step}>{agent.name}</p>
          <h2 id="d21-title" className={s.title}>
            Publish v{state.version}
          </h2>
        </div>
        <button
          type="button"
          className={s.close}
          aria-label="Close"
          onClick={onClose}
        >
          <Icon icon={X} />
        </button>
      </header>

      <div className={`${s.body} ${s.parts}`}>
        <div className={s.group}>
          <div className={s.groupHead}>
            <p className={s.groupTitle}>Before you publish</p>
            <span className={`${s.groupMeta} ${checks.every((k) => k.ok) ? s.groupMetaOk : s.groupMetaWarn}`}>
              {checks.filter((k) => k.ok).length} of {checks.length} ready
            </span>
          </div>
          <ul className={s.checks}>
            {checks.map((c) => (
              <li key={c.label} className={c.ok ? s.checkOk : s.checkWarn}>
                <Icon icon={c.ok ? CircleCheck : TriangleAlert} size="s" />
                <span className={s.checkLabel}>{c.label}</span>
                <span className={s.checkValue}>{c.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div id="d21-desc">
          <Note tone="warning" icon={<Icon icon={TriangleAlert} />}>
            <b>Callers would book into a calendar your clinic can't see.</b>{" "}
            Connect your real calendar to publish. Using practice software? Pick
            it in Connect calendar to go through Integrations.
          </Note>
        </div>

        <p className={s.footnote}>
          Your tests and the sample calendar stay as they are.
        </p>
      </div>

      <footer className={s.foot}>
        <span />
        <div className={s.footActions}>
          <Button type="Outline" size="M" onClick={onClose}>
            Cancel
          </Button>
          <Button type="Primary" size="M" onClick={onConnectReal}>
            Connect real calendar
          </Button>
        </div>
      </footer>
    </Dialog>
  );
}
