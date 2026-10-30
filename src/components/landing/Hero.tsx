import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ButtonLink } from "../ui/Button";
import { Switch } from "../ui/Switch";
import { ArrowRight, Play } from "../ui/icons";

type Tone = "ink" | "cobalt" | "paper" | "lime" | "ember" | "rose";

const toneClass: Record<Tone, string> = {
  ink: "bg-ink text-white",
  cobalt: "bg-cobalt text-white",
  paper: "bg-surface text-ink ring-1 ring-line",
  lime: "bg-lime text-ink",
  ember: "bg-ember text-white",
  rose: "bg-rose text-white",
};

const switchTone: Record<Tone, "ink" | "lime" | "mint"> = {
  ink: "lime",
  cobalt: "lime",
  paper: "ink",
  lime: "ink",
  ember: "ink",
  rose: "ink",
};

interface CardSpec {
  flag: string;
  type: string;
  tone: Tone;
  on: boolean;
  tag?: { handle: string; className: string };
  body: (on: boolean) => ReactNode;
}

const cards: CardSpec[] = [
  {
    flag: "payments-v2",
    type: "Kill switch",
    tone: "ink",
    on: false,
    body: (on) => (
      <div>
        <p className="display text-[clamp(1.6rem,2.6vw,2.2rem)]">{on ? "Live" : "Off"}</p>
        <p className="mt-1 text-[11px] text-white/55">{on ? "Serving all environments" : "Killed — no redeploy"}</p>
      </div>
    ),
  },
  {
    flag: "ai-search",
    type: "Boolean",
    tone: "cobalt",
    on: true,
    tag: { handle: "@maya · PM", className: "bg-cobalt text-white" },
    body: (on) => (
      <ul className="space-y-1.5 text-[11px]">
        {[
          ["development", true],
          ["staging", on],
          ["production", false],
        ].map(([env, val]) => (
          <li key={String(env)} className="flex items-center justify-between">
            <span className="text-white/60">{env}</span>
            <span className={`rounded-full px-1.5 py-0.5 font-mono text-[9.5px] ${val ? "bg-lime text-ink" : "bg-white/15"}`}>
              {val ? "on" : "off"}
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    flag: "pricing-banner",
    type: "String",
    tone: "paper",
    on: true,
    body: (on) => (
      <div>
        <p className="text-[13px] leading-snug tracking-tight">
          “{on ? "Start your 14-day trial" : "Try it free"}”
        </p>
        <div className="mt-2 flex gap-1">
          {["dev", "stg", "prod"].map((e) => (
            <span key={e} className="rounded-full bg-canvas px-1.5 py-0.5 font-mono text-[9px] text-muted">
              {e}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    flag: "new-checkout",
    type: "Boolean",
    tone: "lime",
    on: true,
    tag: { handle: "@devon · eng", className: "bg-ink text-lime" },
    body: (on) => (
      <div>
        <p className="display text-[clamp(1.6rem,2.6vw,2.2rem)]">{on ? "Enabled" : "Disabled"}</p>
        <p className="mt-1 text-[11px] text-ink/55">{on ? "New flow for all users" : "Old flow restored"}</p>
      </div>
    ),
  },
  {
    flag: "site-theme",
    type: "String",
    tone: "ember",
    on: false,
    body: (on) => (
      <div>
        <p className="font-mono text-[11px] text-white/70">value</p>
        <p className="display mt-1 text-[clamp(1.4rem,2.2vw,1.9rem)]">“{on ? "winter" : "default"}”</p>
      </div>
    ),
  },
  {
    flag: "rate-limit-rpm",
    type: "Number",
    tone: "paper",
    on: true,
    tag: { handle: "@sre-oncall", className: "bg-ember text-white" },
    body: (on) => (
      <ul className="space-y-1 font-mono text-[11px]">
        {[
          ["dev", 1000],
          ["stg", 300],
          ["prod", on ? 120 : 60],
        ].map(([env, v]) => (
          <li key={env} className="flex justify-between border-b border-dashed border-line pb-1 last:border-0">
            <span className="text-muted">{env}</span>
            <span>{v}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    flag: "reco-config",
    type: "JSON",
    tone: "rose",
    on: true,
    body: (on) => (
      <pre className="font-mono text-[10.5px] leading-relaxed text-white/90">
        {`{\n  "model": "${on ? "v3" : "v2"}",\n  "limit": ${on ? 20 : 10}\n}`}
      </pre>
    ),
  },
];

function FlagCard({ spec, index, fanned, hovered, onHover }: {
  spec: CardSpec;
  index: number;
  fanned: boolean;
  hovered: number | null;
  onHover: (i: number | null) => void;
}) {
  const [on, setOn] = useState(spec.on);
  const k = index - Math.floor(cards.length / 2);
  const isHover = hovered === index;
  const transform = fanned
    ? `translateX(calc(-50% + ${k * 74}%)) translateY(${Math.abs(k) * 16 - (isHover ? 22 : 0)}px) rotate(${isHover ? 0 : k * 5.5}deg) scale(${isHover ? 1.04 : 1})`
    : `translateX(-50%) translateY(40px) rotate(0deg) scale(0.9)`;

  return (
    <div
      className="absolute left-1/2 top-0 w-[clamp(140px,15.5vw,212px)] transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
      style={{ transform, zIndex: isHover ? 30 : 10 - Math.abs(k), transitionDelay: fanned && hovered === null ? `${Math.abs(k) * 40}ms` : "0ms" }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      {spec.tag && (
        <span
          className={`absolute -top-4 left-3 z-10 animate-float rounded-full rounded-bl-sm px-2.5 py-1 text-[11px] font-medium shadow-card ${spec.tag.className}`}
          style={{ animationDelay: `${index * 0.6}s` } as CSSProperties}
        >
          {spec.tag.handle}
        </span>
      )}
      <article
        className={`flex aspect-[4/5] flex-col justify-between rounded-[22px] p-4 transition-shadow duration-300 ${toneClass[spec.tone]} ${
          isHover ? "shadow-lift" : "shadow-card"
        }`}
      >
        <header className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-mono text-[11px] font-medium">{spec.flag}</p>
            <p className="mt-0.5 text-[10px] opacity-55">{spec.type}</p>
          </div>
          <Switch size="sm" checked={on} onChange={setOn} label={`Example flag ${spec.flag}`} tone={switchTone[spec.tone]} />
        </header>
        {spec.body(on)}
      </article>
    </div>
  );
}

export function Hero() {
  const [fanned, setFanned] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setFanned(true), 350);
    return () => clearTimeout(t);
  }, []);

  const stagger = (i: number) => ({ animationDelay: `${i * 90}ms` });

  return (
    <section id="product" className="relative overflow-x-clip pt-32 pb-20 sm:pt-36">
      {/* soft light wash, like the reference */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] bg-[radial-gradient(60%_50%_at_50%_0%,#ffffff_0%,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <a
          href="#features"
          className="group inline-flex animate-fade-up items-center gap-2 rounded-full bg-surface py-1 pl-1 pr-3 text-[13px] text-ink-soft shadow-card ring-1 ring-line transition hover:ring-faint"
          style={stagger(0)}
        >
          <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-medium text-ink">Included</span>
          Kill switch, remote config &amp; audit log
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h1 className="display mt-7 animate-fade-up text-[clamp(2.75rem,7.2vw,6rem)]" style={stagger(1)}>
          Ship every feature
          <br />
          <span className="text-muted">behind a switch.</span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-xl animate-fade-up text-[clamp(1rem,1.4vw,1.125rem)] leading-relaxed text-ink-soft"
          style={stagger(2)}
        >
          FlagForge lets you turn features on, off, or reconfigure them per environment — from a dashboard, without
          a redeploy.
        </p>

        <div className="mt-9 flex animate-fade-up flex-wrap items-center justify-center gap-3" style={stagger(3)}>
          <ButtonLink to="/register" size="lg">
            Start for free <ArrowRight className="size-4" />
          </ButtonLink>
          <a
            href="#demo"
            className="inline-flex h-13 items-center gap-2.5 rounded-full pl-2 pr-5 text-base font-medium tracking-tight transition hover:bg-ink/5"
          >
            <span className="grid size-9 place-items-center rounded-full bg-surface shadow-card ring-1 ring-line">
              <Play className="size-3.5" />
            </span>
            See it live
          </a>
        </div>
      </div>

      <div
        className="relative mx-auto mt-16 h-[clamp(230px,24vw,330px)] max-w-7xl"
        role="group"
        aria-label="Example feature flags — toggle them"
      >
        {cards.map((spec, i) => (
          <FlagCard key={spec.flag} spec={spec} index={i} fanned={fanned} hovered={hovered} onHover={setHovered} />
        ))}
      </div>

      <p className="mt-14 text-center text-[13px] text-muted">
        Go on — flip a switch. <span className="text-faint">That’s the whole product.</span>
      </p>
    </section>
  );
}
