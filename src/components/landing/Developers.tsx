import { useState } from "react";
import { Check, Copy, Key, Shield } from "../ui/icons";
import { Eyebrow, Reveal, SoonBadge } from "./Reveal";

// TODO(backend): set these to the real public flag-read endpoint and auth header before launch.
// They are the only place the landing page describes the client API.
const API_URL = "https://api.flagforge.dev";
const FLAG_PATH = "/api/v1/client/flags/new-checkout";
const AUTH_HEADER = "Authorization: Bearer $FF_KEY";

const [authName, authValue] = AUTH_HEADER.split(": ");

const snippets = {
  cURL: `curl ${API_URL}${FLAG_PATH} \\
  -H "${AUTH_HEADER}"`,
  JavaScript: `const res = await fetch("${API_URL}${FLAG_PATH}", {
  headers: { "${authName}": \`${authValue.replace("$FF_KEY", "${process.env.FF_KEY}")}\` },
});
const { value } = await res.json();

if (value === true) renderNewCheckout();
else renderOldCheckout(); // always keep a fallback`,
  Python: `import os, requests

res = requests.get(
    "${API_URL}${FLAG_PATH}",
    headers={"${authName}": f"${authValue.replace("$FF_KEY", "{os.environ['FF_KEY']}")}"},
    timeout=2,
)
value = res.json().get("value", False)  # fallback if missing`,
};

type Lang = keyof typeof snippets;

// Tiny highlighter: strings, keywords, comments. Enough for marketing snippets.
function highlight(code: string) {
  // Comments only count after whitespace/line start, so "https://" isn't greyed out.
  const re = /("[^"]*"|'[^']*'|`[^`]*`)|\b(import|from|const|if|else|await|return|new)\b|((?<=^|\s)(?:\/\/|#).*$)/gm;
  const out: (string | { t: string; c: string })[] = [];
  let last = 0;
  for (const m of code.matchAll(re)) {
    if (m.index! > last) out.push(code.slice(last, m.index));
    out.push({ t: m[0], c: m[1] ? "text-lime" : m[2] ? "text-rose" : "text-white/35" });
    last = m.index! + m[0].length;
  }
  out.push(code.slice(last));
  return out.map((p, i) => (typeof p === "string" ? p : <span key={i} className={p.c}>{p.t}</span>));
}

const points = [
  { icon: <Key className="size-4" />, title: "Scoped API keys", body: "One key per environment, shown once, revocable in a click, and every change is audited." },
  { icon: <Shield className="size-4" />, title: "Plain HTTP, any language", body: "If it can make a request, it can read a flag. Keep a default in your code so a network blip never breaks your app." },
];

export function Developers() {
  const [lang, setLang] = useState<Lang>("cURL");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippets[lang]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section id="developers" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-center">
        <Reveal>
          <Eyebrow accent="developers">For</Eyebrow>
          <h2 className="display mt-4 text-[clamp(2.25rem,5vw,4.25rem)]">
            One request.
            <br />
            <span className="text-muted">Then forget it’s there.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Create an API key for an environment, read your flag over a simple REST API, and control it from the
            dashboard from then on.
          </p>
          <ul className="mt-8 space-y-5">
            {points.map((p) => (
              <li key={p.title} className="flex gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface shadow-card ring-1 ring-line">
                  {p.icon}
                </span>
                <div>
                  <p className="font-medium tracking-tight">{p.title}</p>
                  <p className="mt-0.5 text-[15px] text-ink-soft">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="overflow-hidden rounded-[var(--radius-card)] bg-[#111113] text-white shadow-lift ring-1 ring-black">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-2 py-2">
              <div className="no-scrollbar flex overflow-x-auto" role="tablist" aria-label="SDK language">
                {(Object.keys(snippets) as Lang[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    role="tab"
                    aria-selected={lang === l}
                    onClick={() => setLang(l)}
                    className={`rounded-full px-3.5 py-1.5 text-[13px] transition ${
                      lang === l ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={copy}
                className="mr-1 flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                {copied ? <Check className="size-3.5 text-lime" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-[1.75] sm:p-8 sm:text-[14px]" role="tabpanel">
              <code>{highlight(snippets[lang])}</code>
            </pre>
            <div className="flex flex-wrap items-center gap-2 border-t border-white/10 px-6 py-3 font-mono text-[11px] text-white/40">
              <span className="size-1.5 rounded-full bg-mint" /> REST API — available today
              <SoonBadge className="ml-auto text-white/60" />
              <span className="text-white/50">Official SDKs</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
