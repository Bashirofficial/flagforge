import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

// Every fact here must be true of the shipped product (see src/services/api.ts).
// No customer logos or usage numbers until they're real.
interface Fact {
  value: ReactNode;
  label: string;
  detail: string;
}

const facts: Fact[] = [
  {
    value: "0",
    label: "redeploys to turn a feature off",
    detail: "Flip it in the dashboard. Your code already checks the flag.",
  },
  {
    value: "1",
    label: "click to kill a broken feature",
    detail: "Disable a flag and it’s off in every environment at once.",
  },
  {
    value: "4",
    label: "value types, not just on/off",
    detail: "Boolean, string, number and JSON — remote config included.",
  },
  {
    value: (
      <>
        1<span className="text-muted">:1</span>
      </>
    ),
    label: "API key per environment",
    detail: "Scoped, revocable keys, and every change lands in the audit log.",
  },
];

export function ValueProps() {
  return (
    <section aria-labelledby="value-heading" className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p id="value-heading" className="text-center text-sm tracking-tight text-ink">
          Built so a bad release is a non-event <span className="text-muted">— by design, on every plan</span>
        </p>
        <dl className="mt-8 grid overflow-hidden rounded-[var(--radius-card)] bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4 [&>*]:bg-surface gap-px">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={i * 80} className="group p-6 transition-colors hover:bg-canvas sm:p-7">
              <dt className="flex items-baseline gap-3">
                <span className="display text-5xl sm:text-6xl">{f.value}</span>
                <span className="text-[15px] font-medium leading-snug tracking-tight">{f.label}</span>
              </dt>
              <dd className="mt-3 text-sm leading-relaxed text-ink-soft">{f.detail}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
