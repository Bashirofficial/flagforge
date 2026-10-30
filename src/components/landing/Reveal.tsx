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

export function Eyebrow({ children, accent }: { children: ReactNode; accent?: string }) {
  return (
    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
      {children} {accent && <span className="text-ember">{accent}</span>}
    </p>
  );
}
