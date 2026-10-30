import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "../ui/icons";
import { Eyebrow, Reveal, SoonBadge } from "./Reveal";

interface UseCase {
  title: string;
  body: string;
  art: ReactNode;
  soon?: boolean;
}

// Available today first; roadmap items are marked `soon`.
const useCases: UseCase[] = [
  {
    title: "Kill switches",
    body: "A big red button for every risky feature and dependency.",
    art: (
      <div className="grid h-full place-items-center bg-ember">
        <div className="flex h-24 w-44 items-center rounded-full bg-ink/90 p-2.5 shadow-2xl">
          <div className="size-[76px] rounded-full bg-white" />
        </div>
      </div>
    ),
  },
  {
    title: "Dark launches",
    body: "Merge and deploy unfinished work with the flag off. Turn it on when it’s ready.",
    art: (
      <div className="grid h-full place-items-center bg-ink">
        <div className="relative size-32">
          <span className="absolute inset-0 rounded-full bg-lime" />
          <span className="absolute -right-3 -top-3 size-28 rounded-full bg-ink" />
        </div>
      </div>
    ),
  },
  {
    title: "Remote config",
    body: "Change copy, limits or JSON settings per environment — no release needed.",
    art: (
      <div className="grid h-full place-items-center bg-cobalt font-mono text-[5.5rem] font-medium tracking-tighter text-lime">
        {"{ }"}
      </div>
    ),
  },
  {
    title: "Ops toggles",
    body: "Throttle, degrade gracefully, and tune limits at runtime.",
    art: (
      <div className="grid h-full place-items-center bg-mint">
        {[1, 0.75, 0.5, 0.25].map((s) => (
          <span
            key={s}
            className="col-start-1 row-start-1 rounded-full border-2 border-ink/80"
            style={{ width: `${s * 80}%`, aspectRatio: "1" }}
          />
        ))}
      </div>
    ),
  },
  {
    soon: true,
    title: "Canary releases",
    body: "Expose new code to a sliver of traffic before anyone else.",
    art: (
      <div className="relative h-full bg-ink">
        <div className="absolute inset-6 bg-[radial-gradient(circle,#ffffff_1.6px,transparent_2px)] bg-[length:22px_22px] opacity-80" />
        <div className="absolute left-[46%] top-[42%] size-4 rounded-full bg-lime shadow-[0_0_24px_6px_rgb(228_251_99/0.6)]" />
      </div>
    ),
  },
  {
    soon: true,
    title: "A/B experiments",
    body: "Serve variants, measure outcomes, keep the winner.",
    art: (
      <div className="grid h-full grid-cols-2">
        <div className="grid place-items-center bg-cobalt text-[6rem] font-medium tracking-tighter text-white">A</div>
        <div className="grid place-items-center bg-lime text-[6rem] font-medium tracking-tighter text-ink">B</div>
      </div>
    ),
  },
  {
    soon: true,
    title: "Beta programs",
    body: "Hand-pick accounts for early access and collect feedback.",
    art: (
      <div className="relative h-full overflow-hidden bg-surface">
        <div className="absolute -inset-10 bg-[conic-gradient(from_200deg,#2c46ff,#ff4f9a,#ff5b23,#e4fb63,#3ddc97,#2c46ff)] blur-2xl" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0_10px,rgb(255_255_255/0.25)_10px_12px)]" />
      </div>
    ),
  },
];

export function UseCases() {
  const track = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 300) + 16), behavior: "smooth" });
  };

  return (
    <section id="use-cases" className="py-20 sm:py-28">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-4 sm:px-6">
        <Reveal>
          <Eyebrow accent="closer">Look</Eyebrow>
          <h2 className="display mt-4 text-[clamp(2.25rem,5vw,4.25rem)]">
            Built for every
            <br />
            <span className="text-muted">kind of release.</span>
          </h2>
        </Reveal>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={progress <= 0.01}
            aria-label="Previous use cases"
            className="grid size-11 place-items-center rounded-full bg-surface shadow-card ring-1 ring-line transition hover:ring-faint disabled:opacity-40"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={progress >= 0.99}
            aria-label="Next use cases"
            className="grid size-11 place-items-center rounded-full bg-ink text-white transition hover:bg-ink-soft disabled:opacity-40"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:scroll-px-6 sm:px-6 xl:scroll-px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] xl:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
      >
        {useCases.map((u, i) => (
          <li key={u.title} className="w-[78vw] max-w-[340px] shrink-0 snap-start sm:w-[320px]">
            <Reveal delay={i * 70} className="group">
              <div className="relative aspect-[4/4.4] overflow-hidden rounded-[var(--radius-card)] shadow-card transition-transform duration-500 group-hover:-translate-y-1.5">
                <div className={`h-full transition-transform duration-700 group-hover:scale-[1.04] ${u.soon ? "opacity-60 grayscale-[0.4]" : ""}`}>
                  {u.art}
                </div>
                {u.soon && <SoonBadge className="absolute left-3 top-3 border-none bg-surface text-ink opacity-100 shadow-card" />}
              </div>
              <h3 className="mt-4 text-lg font-medium tracking-[-0.03em]">{u.title}</h3>
              <p className="mt-1 text-[15px] text-ink-soft">{u.body}</p>
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
        <div className="h-0.5 w-full max-w-xs rounded-full bg-line">
          <div
            className="h-full rounded-full bg-ink transition-[width] duration-200"
            style={{ width: `${Math.max(18, progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
