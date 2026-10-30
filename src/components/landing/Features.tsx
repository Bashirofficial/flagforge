import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useInView } from "../../hooks/useInView";
import { Switch } from "../ui/Switch";
import { Bolt, Clock, Layers, Target } from "../ui/icons";
import { Eyebrow, Reveal, SoonBadge } from "./Reveal";

function Card({ className = "", children, delay = 0 }: { className?: string; children: ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay} className={`relative overflow-hidden rounded-[var(--radius-card)] p-6 sm:p-7 ${className}`}>
      {children}
    </Reveal>
  );
}

function CardTitle({ icon, title, body, light, soon }: { icon: ReactNode; title: string; body: string; light?: boolean; soon?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className={`grid size-9 place-items-center rounded-full ${light ? "bg-white/10" : "bg-canvas"}`}>{icon}</span>
        {soon && <SoonBadge />}
      </div>
      <h3 className="mt-5 text-xl font-medium tracking-[-0.03em]">{title}</h3>
      <p className={`mt-1.5 max-w-sm text-[15px] leading-relaxed ${light ? "text-white/65" : "text-ink-soft"}`}>{body}</p>
    </div>
  );
}

/* ---------- Rollout slider ---------- */
const DOTS = 120;

function RolloutCard() {
  const [pct, setPct] = useState(20);
  // Stable pseudo-random order so dots light up scattered, like real hashed bucketing
  const order = useMemo(() => {
    const idx = Array.from({ length: DOTS }, (_, i) => i);
    let seed = 7;
    for (let i = idx.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.floor((seed / 233280) * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    const rank = new Array<number>(DOTS);
    idx.forEach((dot, r) => (rank[dot] = r));
    return rank;
  }, []);
  const lit = Math.round((pct / 100) * DOTS);

  return (
    <Card className="bg-surface shadow-card ring-1 ring-line md:col-span-4">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <CardTitle
            soon
            icon={<Layers className="size-4.5" />}
            title="Percentage rollouts"
            body="Release to 1%, watch your metrics, then dial it up — with users bucketed consistently. Drag the slider for a preview of how it will work."
          />
          <div className="mt-6">
            <div className="flex items-baseline justify-between">
              <label htmlFor="rollout" className="text-sm text-muted">
                Rolling out to
              </label>
              <p className="display text-4xl tabular-nums">{pct}%</p>
            </div>
            <input
              id="rollout"
              type="range"
              min={0}
              max={100}
              value={pct}
              onChange={(e) => setPct(Number(e.target.value))}
              className="mt-3 w-full cursor-pointer accent-ink"
            />
            <div className="mt-3 flex gap-1.5">
              {[1, 10, 50, 100].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPct(p)}
                  className={`rounded-full px-3 py-1 font-mono text-xs transition ${
                    pct === p ? "bg-ink text-white" : "bg-canvas text-ink-soft hover:bg-line"
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-canvas p-4 sm:p-5">
          <div className="grid grid-cols-12 gap-1.5 sm:gap-2" aria-hidden="true">
            {order.map((rank, i) => (
              <span
                key={i}
                className={`aspect-square rounded-full transition-all duration-500 ${
                  rank < lit ? "scale-100 bg-ink" : "scale-75 bg-faint/60"
                }`}
                style={{ transitionDelay: `${(rank % 20) * 12}ms` }}
              />
            ))}
          </div>
          <p className="mt-4 flex justify-between font-mono text-[11px] text-muted">
            <span>{(lit * 83).toLocaleString()} users on new-checkout</span>
            <span>of 10k</span>
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ---------- Kill switch ---------- */
function KillSwitchCard() {
  const [live, setLive] = useState(true);
  return (
    <Card delay={80} className="flex flex-col justify-between bg-ink text-white md:col-span-2">
      <CardTitle
        light
        icon={<Bolt className="size-4.5 text-lime" />}
        title="Instant kill switch"
        body="Something on fire? Turn it off everywhere in one click. No deploy, no rollback PR."
      />
      <div className="mt-10 flex items-center justify-between rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <div>
          <p className="font-mono text-xs text-white/60">payments-v2</p>
          <p className="mt-1 flex items-center gap-2 text-sm">
            <span className={`relative flex size-2`}>
              <span className={`absolute inset-0 animate-ping rounded-full ${live ? "bg-mint" : "bg-ember"} opacity-60`} />
              <span className={`relative size-2 rounded-full ${live ? "bg-mint" : "bg-ember"}`} />
            </span>
            {live ? "Serving traffic" : "Disabled everywhere"}
          </p>
        </div>
        <Switch checked={live} onChange={setLive} label="Toggle payments-v2" tone="lime" />
      </div>
    </Card>
  );
}

/* ---------- Targeting ---------- */
function TargetingCard() {
  const rules = [
    ["country", "is one of", "DE, FR, NL"],
    ["plan", "equals", "pro"],
    ["app_version", "≥", "4.2.0"],
  ];
  return (
    <Card delay={0} className="bg-cobalt text-white md:col-span-2">
      <CardTitle
        light
        soon
        icon={<Target className="size-4.5" />}
        title="Targeting rules"
        body="Ship to the users who should see it — by plan, region, version or any attribute you send."
      />
      <ul className="mt-6 space-y-2">
        {rules.map(([attr, op, val], i) => (
          <li key={attr} className="flex flex-wrap items-center gap-1.5 font-mono text-[11.5px]">
            <span className="text-white/50">{i === 0 ? "if" : "and"}</span>
            <span className="rounded-md bg-white/15 px-1.5 py-0.5">{attr}</span>
            <span className="text-white/60">{op}</span>
            <span className="rounded-md bg-lime px-1.5 py-0.5 text-ink">{val}</span>
          </li>
        ))}
        <li className="pt-1 font-mono text-[11.5px] text-white/60">
          → serve <span className="text-lime">true</span>
        </li>
      </ul>
    </Card>
  );
}

/* ---------- Environments ---------- */
function EnvironmentsCard() {
  const [vals, setVals] = useState({ development: true, staging: true, production: false });
  return (
    <Card delay={80} className="bg-surface shadow-card ring-1 ring-line md:col-span-2">
      <CardTitle
        icon={<Layers className="size-4.5" />}
        title="Every environment"
        body="One flag, independent values per environment. Promote with confidence."
      />
      <ul className="mt-6 space-y-2">
        {(Object.keys(vals) as (keyof typeof vals)[]).map((env) => (
          <li key={env} className="flex items-center justify-between rounded-xl bg-canvas px-3 py-2.5">
            <span className="flex items-center gap-2 text-sm">
              <span
                className={`size-2 rounded-full ${
                  env === "development" ? "bg-cobalt" : env === "staging" ? "bg-rose" : "bg-ember"
                }`}
              />
              {env}
            </span>
            <Switch size="sm" checked={vals[env]} onChange={(v) => setVals((s) => ({ ...s, [env]: v }))} label={`Toggle ${env}`} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ---------- Audit log ---------- */
// Only actions the product actually records (flags, values, API keys).
const events = [
  ["maya", "enabled", "ai-search", "staging"],
  ["devon", "changed value of", "rate-limit-rpm", "prod"],
  ["omar", "disabled", "payments-v2", "prod"],
  ["lena", "created", "site-theme", "dev"],
  ["devon", "updated", "reco-config", "prod"],
  ["maya", "revoked key", "ff_prod_c3d4", "prod"],
];

function AuditCard() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [head, setHead] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setHead((h) => (h + 1) % events.length), 2400);
    return () => clearInterval(t);
  }, [inView]);

  const visible = [0, 1, 2, 3].map((i) => events[(head + i) % events.length]);

  return (
    <Card delay={160} className="bg-lime md:col-span-2">
      <div ref={ref}>
        <CardTitle
          icon={<Clock className="size-4.5" />}
          title="Audit everything"
          body="Who changed what, where and when. Every flip is attributed and searchable."
        />
        <ul className="mt-6 space-y-1.5">
          {visible.map(([who, verb, what, env], i) => (
            <li
              key={`${head}-${i}`}
              className={`flex items-center gap-2 rounded-lg bg-white/60 px-2.5 py-2 text-[12.5px] ${i === 0 ? "animate-fade-up" : ""}`}
              style={{ opacity: 1 - i * 0.2 }}
            >
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ink text-[10px] font-medium uppercase text-lime">
                {who[0]}
              </span>
              <span className="truncate">
                <b className="font-medium">{who}</b> {verb} <span className="font-mono">{what}</span>
              </span>
              <span className="ml-auto shrink-0 font-mono text-[10px] text-ink/50">{env}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

export function Features() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Eyebrow accent="platform">The</Eyebrow>
          <h2 className="display mt-4 text-[clamp(2.25rem,5vw,4.25rem)]">
            Everything a release needs.
            <br />
            <span className="text-muted">Nothing it doesn’t.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          <RolloutCard />
          <KillSwitchCard />
          <TargetingCard />
          <EnvironmentsCard />
          <AuditCard />
        </div>
      </div>
    </section>
  );
}
