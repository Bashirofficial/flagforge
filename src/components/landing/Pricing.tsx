import { useState } from "react";
import { ButtonLink } from "../ui/Button";
import { Check } from "../ui/icons";
import { Eyebrow, Reveal } from "./Reveal";

interface Plan {
  name: string;
  monthly: number;
  annual: number; // per month, billed yearly
  blurb: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const plans: Plan[] = [
  {
    name: "Starter",
    monthly: 0,
    annual: 0,
    blurb: "For side projects and trying things out.",
    features: ["Up to 10 flags", "2 environments", "1 seat", "7-day audit history"],
    cta: "Start free",
  },
  {
    name: "Team",
    monthly: 29,
    annual: 24,
    blurb: "For product teams shipping every week.",
    features: ["Unlimited flags", "10 seats", "90-day audit history", "Percentage rollouts (soon)", "Targeting rules (soon)"],
    cta: "Start 14-day trial",
    popular: true,
  },
  {
    name: "Scale",
    monthly: 99,
    annual: 79,
    blurb: "For orgs with many teams and strict reviews.",
    features: ["Everything in Team", "Unlimited seats", "Unlimited audit history", "SSO (soon)"],
    cta: "Talk to us",
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.5fr] lg:items-center">
        <Reveal>
          <Eyebrow accent="pricing">Simple</Eyebrow>
          <h2 className="display mt-4 text-[clamp(2.25rem,4.4vw,3.75rem)]">
            Pay for teams,
            <br />
            <span className="text-muted">not traffic.</span>
          </h2>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-ink-soft">
            Unlimited flag evaluations on every plan. Upgrade when your team grows, not when your users do.
          </p>

          <div className="mt-8 inline-flex items-center gap-1 rounded-full bg-surface p-1 shadow-card ring-1 ring-line" role="radiogroup" aria-label="Billing period">
            {[
              ["Monthly", false],
              ["Annual", true],
            ].map(([label, value]) => (
              <button
                key={String(label)}
                type="button"
                role="radio"
                aria-checked={annual === value}
                onClick={() => setAnnual(value as boolean)}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  annual === value ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
                }`}
              >
                {label as string}
                {value && <span className={`ml-1.5 text-xs ${annual ? "text-lime" : "text-ember"}`}>−20%</span>}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-3 md:gap-0">
          {plans.map((p, i) => {
            const price = annual ? p.annual : p.monthly;
            const tilt = ["md:-rotate-3 md:translate-y-6", "md:z-10 md:-translate-y-2 md:scale-[1.04]", "md:rotate-3 md:translate-y-6"][i];
            return (
              <Reveal key={p.name} delay={i * 100} className="group">
                <article
                  className={`flex h-full flex-col rounded-[var(--radius-card)] p-6 transition-all duration-500 md:group-hover:z-20 md:group-hover:-translate-y-4 md:group-hover:rotate-0 sm:p-7 ${tilt} ${
                    p.popular ? "bg-ember text-white shadow-lift" : "bg-surface shadow-card ring-1 ring-line md:group-hover:shadow-lift"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{p.name}</p>
                    {p.popular && (
                      <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-ember">Popular</span>
                    )}
                  </div>
                  <p className="mt-6 flex items-start">
                    <span className="mt-2 text-lg">$</span>
                    <span className="display text-6xl tabular-nums">{price}</span>
                    <span className={`ml-1 mt-auto mb-2 text-sm ${p.popular ? "text-white/70" : "text-muted"}`}>/mo</span>
                  </p>
                  <p className={`mt-3 text-sm ${p.popular ? "text-white/80" : "text-ink-soft"}`}>{p.blurb}</p>
                  <ul className="mt-6 space-y-2.5 text-sm">
                    {p.features.map((f) => {
                      const soon = f.endsWith(" (soon)");
                      return (
                        <li key={f} className={`flex items-center gap-2.5 ${soon ? "opacity-60" : ""}`}>
                          <Check className={`size-4 shrink-0 ${p.popular ? "text-lime" : "text-ink"} ${soon ? "opacity-0" : ""}`} />
                          {soon ? f.replace(" (soon)", "") : f}
                          {soon && <span className="font-mono text-[10px] uppercase tracking-[0.12em]">soon</span>}
                        </li>
                      );
                    })}
                  </ul>
                  <ButtonLink
                    to="/register"
                    variant={p.popular ? "lime" : "secondary"}
                    className="mt-8 w-full"
                  >
                    {p.cta}
                  </ButtonLink>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
