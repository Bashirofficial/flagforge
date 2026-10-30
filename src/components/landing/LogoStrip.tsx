// Placeholder customer wordmarks (fictional). Replace with real customers once you have permission.
const logos = [
  { name: "Northwind", className: "font-semibold tracking-tight" },
  { name: "lumen", className: "font-light lowercase tracking-[0.08em]" },
  { name: "PARCEL&CO", className: "font-mono text-[15px] font-medium" },
  { name: "Helix", className: "font-semibold italic tracking-tight" },
  { name: "quanta", className: "font-medium lowercase tracking-[-0.05em]" },
  { name: "Orbital", className: "font-normal tracking-[0.12em] uppercase text-[14px]" },
  { name: "Fieldnote", className: "font-semibold tracking-[-0.04em]" },
  { name: "Kiln", className: "font-bold tracking-tight" },
];

export function LogoStrip() {
  return (
    <section aria-label="Teams using FlagForge" className="py-10">
      <p className="text-center text-sm tracking-tight text-ink">
        Trusted by teams <span className="text-muted">that ship every single day</span>
      </p>
      <div className="mask-fade-x mt-8 overflow-hidden">
        <ul className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
          {[...logos, ...logos].map((l, i) => (
            <li
              key={i}
              aria-hidden={i >= logos.length}
              className={`px-8 text-lg text-ink/45 transition-colors duration-300 hover:text-ink sm:px-12 ${l.className}`}
            >
              {l.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
