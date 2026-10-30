import type { CSSProperties } from "react";
import { ButtonLink } from "../ui/Button";
import { ArrowRight, Sparkle } from "../ui/icons";
import { Reveal } from "./Reveal";

const palette = [
  "from-cobalt to-[#7b8bff]",
  "from-ember to-[#ffb38a]",
  "from-rose to-[#ffb3d1]",
  "from-[#1a1a1d] to-[#4a4a50]",
  "from-mint to-[#b9f5da]",
  "from-[#c6dd3f] to-lime",
];
const initials = ["MK", "DA", "LS", "OR", "JT", "AN", "PV", "SB", "KE", "RH", "YT", "CN", "IW", "FG", "HL", "EZ", "BM", "TQ"];

// Two gently drifting arcs of teammates, like the reference's avatar crowd.
function AvatarArc({ flip }: { flip?: boolean }) {
  return (
    <div className={`relative h-28 sm:h-36 ${flip ? "rotate-180" : ""}`} aria-hidden="true">
      {initials.slice(flip ? 9 : 0, flip ? 18 : 9).map((name, i, arr) => {
        const t = i / (arr.length - 1);
        const x = 4 + t * 92;
        const y = Math.sin(t * Math.PI) * 52;
        const size = 44 + ((i * 7) % 3) * 10;
        return (
          <span
            key={name}
            className="absolute -translate-x-1/2"
            style={{ left: `${x}%`, bottom: `${y}%` } as CSSProperties}
          >
            <span
              className={`grid animate-float place-items-center rounded-[30%] bg-gradient-to-br text-[13px] font-medium text-white shadow-card ${palette[i % palette.length]} ${flip ? "rotate-180" : ""}`}
              style={{ width: size, height: size, animationDelay: `${i * 0.45}s`, animationDuration: `${5 + (i % 3)}s` }}
            >
              {name}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function FinalCta() {
  return (
    <section className="overflow-x-clip px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <AvatarArc flip />
        <Reveal className="py-10 text-center">
          <Sparkle className="mx-auto size-5 text-ink" />
          <h2 className="display mx-auto mt-6 max-w-3xl text-[clamp(2.5rem,6vw,5rem)]">
            Join the teams that
            <br />
            <span className="text-muted">ship without fear.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lg text-ink-soft">
            Set up your first flag in under five minutes. Free forever for small teams.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/register" size="lg">
              Create free account <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink to="/login" size="lg" variant="secondary">
              Sign in
            </ButtonLink>
          </div>
        </Reveal>
        <AvatarArc />
      </div>
    </section>
  );
}
