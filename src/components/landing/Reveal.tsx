import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "../../hooks/useInView";

interface RevealProps {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
}

export function Reveal({ as: Tag = "div", delay = 0, className = "", children }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <Tag
      ref={ref}
      data-inview={inView}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Marks roadmap features so the page never promises what isn't shipped. */
export function SoonBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-current/20 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] opacity-80 ${className}`}
    >
      <span className="size-1 rounded-full bg-current" />
      Coming soon
    </span>
  );
}

export function Eyebrow({ children, accent }: { children: ReactNode; accent?: string }) {
  return (
    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
      {children} {accent && <span className="text-ember">{accent}</span>}
    </p>
  );
}
