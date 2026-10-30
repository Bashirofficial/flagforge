import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ButtonLink } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { ArrowRight, Close, Menu } from "../ui/icons";

const links = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#developers" },
];

export function Navbar() {
  const { token } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        aria-label="Main"
        className={`mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full pl-5 pr-2 transition-all duration-500 ${
          scrolled ? "bg-surface/75 shadow-card ring-1 ring-line/70 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <Link to="/" aria-label="FlagForge home">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3.5 py-2 text-sm text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-1 md:flex">
          {token ? (
            <ButtonLink to="/app" size="sm">
              Open dashboard <ArrowRight className="size-4" />
            </ButtonLink>
          ) : (
            <>
              <ButtonLink to="/login" variant="ghost" size="sm">
                Sign in
              </ButtonLink>
              <ButtonLink to="/register" size="sm">
                Get started
              </ButtonLink>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full hover:bg-ink/5 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <Close className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-x-3 top-[4.75rem] origin-top rounded-3xl bg-surface p-3 shadow-lift ring-1 ring-line transition-all duration-300 md:hidden ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <ul className="flex flex-col">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-lg tracking-tight hover:bg-canvas"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-2 grid grid-cols-2 gap-2 border-t border-line pt-3">
          {token ? (
            <ButtonLink to="/app" className="col-span-2">
              Open dashboard
            </ButtonLink>
          ) : (
            <>
              <ButtonLink to="/login" variant="secondary">
                Sign in
              </ButtonLink>
              <ButtonLink to="/register">Get started</ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
