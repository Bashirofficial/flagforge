import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";
import { ArrowUpRight } from "../ui/icons";
import { Reveal } from "./Reveal";

// Only link to things that exist. Add Privacy / Terms / Contact here once those pages are live
// (required before taking payments).
const columns = [
  { title: "Product", links: [["Features", "#features"], ["Pricing", "#pricing"], ["Use cases", "#use-cases"], ["Live demo", "#demo"]] },
  { title: "Developers", links: [["REST API", "#developers"], ["API keys", "#developers"]] },
  { title: "Account", links: [["Create account", "/register"], ["Sign in", "/login"]] },
];

export function Footer() {
  return (
    <footer className="px-3 pb-3 pt-10 sm:px-5 sm:pb-5">
      <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-2">
        <Reveal>
          <a
            href="#developers"
            className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[28px] bg-rose p-7 text-white sm:min-h-[360px] sm:p-9"
          >
            <div aria-hidden="true" className="absolute -right-16 -top-16 size-72 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffd1e4,#ff4f9a_55%,#c3125f)] transition-transform duration-700 group-hover:scale-110" />
            <div
              aria-hidden="true"
              className="absolute right-10 top-10 flex h-16 w-28 rotate-[-12deg] items-center rounded-full bg-ink p-2 shadow-2xl transition-transform duration-700 group-hover:rotate-0"
            >
              <span className="ml-auto size-12 rounded-full bg-lime transition-transform duration-500 group-hover:-translate-x-12" />
            </div>
            <p className="display relative text-4xl sm:text-5xl">
              Read flags
              <br />
              from your app
            </p>
            <p className="relative mt-3 max-w-xs text-white/80">One API key per environment and a single REST request.</p>
            <span className="relative mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink">
              See the API <ArrowUpRight className="size-4" />
            </span>
          </a>
        </Reveal>
        <Reveal delay={100}>
          <Link
            to="/register"
            className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[28px] bg-surface p-7 ring-1 ring-line sm:min-h-[360px] sm:p-9"
          >
            <div aria-hidden="true" className="absolute -right-10 top-6 grid grid-cols-4 gap-2 opacity-90 transition-transform duration-700 group-hover:rotate-6">
              {["bg-cobalt", "bg-lime", "bg-ember", "bg-ink", "bg-rose", "bg-mint", "bg-ink", "bg-cobalt"].map((c, i) => (
                <span key={i} className={`size-14 rounded-2xl ${c} ${i % 3 === 0 ? "rounded-full" : ""}`} />
              ))}
            </div>
            <p className="display relative text-4xl sm:text-5xl">
              Your first flag,
              <br />
              <span className="text-muted">five minutes away</span>
            </p>
            <span className="relative mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">
              Get started <ArrowUpRight className="size-4" />
            </span>
          </Link>
        </Reveal>
      </div>

      <div className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-[28px] bg-ink px-7 pt-12 text-white sm:px-10">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Logo className="[&_rect]:fill-white [&_path:first-of-type]:stroke-ink" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              Feature flags for teams that release daily and sleep at night.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-sm text-white/40">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith("/") ? (
                      <Link to={href} className="text-sm text-white/80 transition hover:text-lime">
                        {label}
                      </Link>
                    ) : (
                      <a href={href} className="text-sm text-white/80 transition hover:text-lime">
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-between gap-2 border-t border-white/10 py-5 text-xs text-white/40">
          <p>© {new Date().getFullYear()} FlagForge. All rights reserved.</p>
          <p>Made for people who ship.</p>
        </div>

        <p
          aria-hidden="true"
          className="display -mb-[0.2em] select-none text-center text-[clamp(4rem,18vw,16rem)] leading-[0.8] text-white/[0.06]"
        >
          FlagForge
        </p>
      </div>
    </footer>
  );
}
