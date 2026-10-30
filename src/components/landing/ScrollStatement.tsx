import { Fragment, type ReactNode } from "react";
import { useScrollProgress } from "../../hooks/useInView";
import { LogoMark } from "../ui/Logo";

type Token = string | { chip: ReactNode };

const MiniToggle = () => (
  <span className="inline-flex h-[0.8em] w-[1.45em] items-center rounded-full bg-mint p-[0.1em] align-middle">
    <span className="ml-auto aspect-square h-full rounded-full bg-white" />
  </span>
);

const chip = (children: ReactNode, className: string): Token => ({
  chip: (
    <span
      className={`mx-[0.12em] inline-flex -translate-y-[0.06em] items-center gap-[0.2em] rounded-full px-[0.4em] py-[0.08em] align-middle text-[0.55em] font-medium tracking-tight ${className}`}
    >
      {children}
    </span>
  ),
});

const tokens: Token[] = [
  "Whether", "you’re", chip(<MiniToggle />, "bg-surface shadow-card ring-1 ring-line"), "testing", "a", "risky", "refactor",
  "or", "keeping", "an", "unfinished", "pricing", "page", chip("off", "bg-lime text-ink"), "in", "production,",
  chip(<><LogoMark className="size-[1em]" /> FlagForge</>, "bg-surface text-ink shadow-card ring-1 ring-line"),
  "turns", "every", "release", "into", "a", "reversible", "decision", "—", "in", chip("dev", "bg-cobalt text-white"),
  chip("staging", "bg-rose text-white"), "and", chip("prod", "bg-ember text-white"), "alike.",
];

export function ScrollStatement() {
  const { ref, progress } = useScrollProgress<HTMLParagraphElement>();
  const lit = progress * tokens.length * 1.05;

  return (
    <section className="px-4 py-28 sm:px-6 sm:py-40">
      <p
        ref={ref}
        className="display mx-auto max-w-5xl text-center text-[clamp(1.85rem,4.4vw,3.6rem)] leading-[1.12]"
        aria-label="Whether you’re testing a risky refactor or keeping an unfinished pricing page off in production, FlagForge turns every release into a reversible decision — in dev, staging and prod alike."
      >
        {tokens.map((t, i) => {
          const on = i < lit;
          return (
            <Fragment key={i}>
              <span
                aria-hidden="true"
                className={`inline-block transition-[opacity,color,filter] duration-500 ${
                  on ? "text-ink opacity-100" : "text-faint opacity-70"
                } ${typeof t !== "string" && !on ? "grayscale" : ""}`}
              >
                {typeof t === "string" ? t : t.chip}
              </span>{" "}
            </Fragment>
          );
        })}
      </p>
    </section>
  );
}
