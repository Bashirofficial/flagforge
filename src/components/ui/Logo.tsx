export function LogoMark({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-ink" />
      <path d="M11 8v16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M11 9h10.5l-2.5 4 2.5 4H11z" className="fill-lime" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[17px] font-semibold tracking-[-0.03em] ${className}`}>
      <LogoMark />
      FlagForge
    </span>
  );
}
