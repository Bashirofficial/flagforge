import type { CSSProperties } from "react";
import { Sparkle } from "../ui/icons";

const phrases = [
  { text: "Ship on Fridays", chip: "bg-ink" },
  { text: "Roll back in seconds", chip: "bg-cobalt" },
  { text: "Test in production", chip: "bg-ember" },
  { text: "Sleep at night", chip: "bg-rose" },
];

function Row() {
  return (
    <>
      {phrases.map((p) => (
        <span key={p.text} className="flex shrink-0 items-center gap-[0.35em] pr-[0.35em]">
          {p.text}
          <span className={`inline-flex h-[0.62em] w-[1.15em] items-center rounded-full p-[0.07em] ${p.chip}`}>
            <span className="ml-auto aspect-square h-full rounded-full bg-lime" />
          </span>
          <Sparkle className="size-[0.45em] text-ink/80" />
        </span>
      ))}
    </>
  );
}

export function MarqueeBand() {
  return (
    <section aria-label="FlagForge in one line" className="px-3 py-6 sm:px-5">
      <div className="relative overflow-hidden rounded-[28px] bg-lime py-10 sm:py-16">
        <div
          className="display flex w-max animate-marquee text-[clamp(3rem,9vw,8.5rem)] leading-none"
          style={{ "--marquee-duration": "32s" } as CSSProperties}
        >
          <Row />
          <span aria-hidden="true" className="flex">
            <Row />
          </span>
        </div>
      </div>
    </section>
  );
}
