import { useState } from "react";
import { Switch } from "../ui/Switch";
import { Eyebrow, Reveal } from "./Reveal";

type FlagKey = "holiday-banner" | "new-checkout" | "reviews-widget" | "dark-mode";

const flagMeta: Record<FlagKey, string> = {
  "holiday-banner": "Seasonal promo strip",
  "new-checkout": "One-tap checkout",
  "reviews-widget": "Social proof",
  "dark-mode": "Theme experiment",
};

const ENVS = ["dev", "staging", "prod"] as const;

interface LogEntry {
  id: number;
  text: string;
}

export function LiveDemo() {
  const [flags, setFlags] = useState<Record<FlagKey, boolean>>({
    "holiday-banner": true,
    "new-checkout": false,
    "reviews-widget": true,
    "dark-mode": false,
  });
  const [env, setEnv] = useState<(typeof ENVS)[number]>("prod");
  const [log, setLog] = useState<LogEntry[]>([{ id: 0, text: "holiday-banner enabled" }]);

  const toggle = (key: FlagKey, value: boolean) => {
    setFlags((f) => ({ ...f, [key]: value }));
    setLog((l) => [{ id: Date.now(), text: `${key} ${value ? "enabled" : "disabled"}` }, ...l].slice(0, 3));
  };

  const dark = flags["dark-mode"];

  return (
    <section id="demo" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-8 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <Eyebrow accent="demo">Interactive</Eyebrow>
            <h2 className="display mt-4 text-[clamp(2.25rem,5vw,4.25rem)]">
              Release without
              <br />
              <span className="text-muted">redeploying.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="max-w-md md:justify-self-end">
            <p className="text-lg leading-relaxed text-ink-soft">
              Every switch on the right is a real feature flag. Flip one and the storefront updates instantly — the
              same way your users see it in production.
            </p>
          </Reveal>
        </div>

        <Reveal delay={150} className="mt-12">
          <div className="relative overflow-hidden rounded-[28px] bg-ember p-3 sm:p-6 lg:p-10">
            {/* decorative rings */}
            <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 size-[520px] rounded-full border-[60px] border-white/10" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-24 size-[420px] rounded-full bg-black/10 blur-2xl" />

            <div className="relative grid gap-4 lg:grid-cols-[1fr_340px] lg:gap-8">
              {/* Storefront */}
              <div
                className={`overflow-hidden rounded-2xl shadow-lift transition-colors duration-500 ${
                  dark ? "bg-[#111113] text-white" : "bg-surface text-ink"
                }`}
              >
                <div className={`flex items-center gap-2 border-b px-4 py-3 ${dark ? "border-white/10" : "border-line"}`}>
                  <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-2.5 rounded-full bg-[#febc2e]" />
                  <span className="size-2.5 rounded-full bg-[#28c840]" />
                  <span className={`ml-3 truncate rounded-full px-3 py-1 font-mono text-[11px] ${dark ? "bg-white/5 text-white/50" : "bg-canvas text-muted"}`}>
                    shop.acme.dev/field-jacket
                  </span>
                </div>

                <div
                  className={`grid overflow-hidden bg-lime text-ink transition-[grid-template-rows] duration-500 ${
                    flags["holiday-banner"] ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <p className="min-h-0 text-center text-[13px] font-medium">
                    <span className="block py-2">Winter sale — 20% off everything until Jan 2</span>
                  </p>
                </div>

                <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-8">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_30%_25%,#ffd0b8,#ff5b23_45%,#b3214d_100%)]">
                    {/* stylised jacket: sleeves, body, collar, zip */}
                    <div className="absolute left-[16%] top-[24%] h-[52%] w-[16%] origin-top rotate-[14deg] rounded-full bg-[#1d1d20]" />
                    <div className="absolute right-[16%] top-[24%] h-[52%] w-[16%] origin-top -rotate-[14deg] rounded-full bg-[#1d1d20]" />
                    <div className="absolute inset-x-[28%] top-[20%] bottom-[14%] rounded-t-[28%] rounded-b-xl bg-[#26262a] shadow-2xl" />
                    <div className="absolute left-1/2 top-[17%] h-[10%] w-[22%] -translate-x-1/2 rounded-b-full bg-[#3a3a40]" />
                    <div className="absolute left-1/2 top-[26%] h-[58%] w-0.5 -translate-x-1/2 bg-lime/70" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2 py-0.5 font-mono text-[10px] text-ink">FW-26</span>
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className={`text-xs ${dark ? "text-white/50" : "text-muted"}`}>Outerwear</p>
                    <h3 className="display mt-1 text-3xl">Field Jacket</h3>

                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ${
                        flags["reviews-widget"] ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <p className="mt-2 flex items-center gap-1.5 text-sm">
                          <span className="tracking-[0.15em] text-[#f5a524]">★★★★★</span>
                          <span className={dark ? "text-white/60" : "text-muted"}>4.9 · 2,184 reviews</span>
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 flex items-baseline gap-2 text-2xl font-medium tracking-tight">
                      {flags["holiday-banner"] ? (
                        <>
                          $151 <span className={`text-base line-through ${dark ? "text-white/40" : "text-muted"}`}>$189</span>
                        </>
                      ) : (
                        "$189"
                      )}
                    </p>

                    <div className="mt-6 space-y-2">
                      {flags["new-checkout"] ? (
                        <>
                          <button
                            type="button"
                            className={`h-12 w-full rounded-full text-[15px] font-medium transition-all ${
                              dark ? "bg-lime text-ink" : "bg-ink text-white"
                            }`}
                          >
                            Buy now — 1 tap
                          </button>
                          <p className={`text-center text-xs ${dark ? "text-white/50" : "text-muted"}`}>
                            Saved card ···· 4242 · Free returns
                          </p>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className={`h-12 w-full rounded-lg border text-[15px] ${dark ? "border-white/20" : "border-line"}`}
                          >
                            Add to cart
                          </button>
                          <p className={`text-center text-xs ${dark ? "text-white/50" : "text-muted"}`}>
                            Checkout in 4 steps
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Control panel */}
              <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-lift sm:p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium tracking-tight">Flags</p>
                  <div className="flex rounded-full bg-canvas p-0.5" role="radiogroup" aria-label="Environment">
                    {ENVS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        role="radio"
                        aria-checked={env === e}
                        onClick={() => setEnv(e)}
                        className={`rounded-full px-2.5 py-1 font-mono text-[11px] transition ${
                          env === e ? "bg-surface text-ink shadow-card" : "text-muted hover:text-ink"
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <ul className="divide-y divide-line">
                  {(Object.keys(flagMeta) as FlagKey[]).map((key) => (
                    <li key={key} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate font-mono text-[13px]">{key}</p>
                        <p className="text-xs text-muted">{flagMeta[key]}</p>
                      </div>
                      <Switch checked={flags[key]} onChange={(v) => toggle(key, v)} label={`Toggle ${key}`} tone="mint" />
                    </li>
                  ))}
                </ul>

                <div className="mt-auto rounded-xl bg-canvas p-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Audit log · {env}</p>
                  <ul className="mt-2 space-y-1.5" aria-live="polite">
                    {log.map((entry, i) => (
                      <li
                        key={entry.id}
                        className={`flex items-center gap-2 font-mono text-[11.5px] ${i === 0 ? "animate-fade-up text-ink" : "text-muted"}`}
                      >
                        <span className={`size-1.5 rounded-full ${i === 0 ? "bg-mint" : "bg-faint"}`} />
                        <span className="truncate">{entry.text}</span>
                        <span className="ml-auto shrink-0 text-faint">{i === 0 ? "now" : `${i * 2}m`}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
