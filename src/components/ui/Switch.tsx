interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  size?: "sm" | "md";
  tone?: "ink" | "lime" | "mint";
  className?: string;
}

const tones = {
  ink: "bg-ink",
  lime: "bg-lime",
  mint: "bg-mint",
};

export function Switch({ checked, onChange, label, size = "md", tone = "ink", className = "" }: SwitchProps) {
  const dims = size === "sm" ? "h-5 w-9" : "h-6 w-11";
  const knob = size === "sm" ? "size-4 data-[on=true]:translate-x-4" : "size-5 data-[on=true]:translate-x-5";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 ${dims} ${
        checked ? tones[tone] : "bg-black/15"
      } ${className}`}
    >
      <span
        data-on={checked}
        className={`${knob} rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.25)] transition-transform duration-300 ease-[cubic-bezier(0.3,1.4,0.5,1)]`}
      />
    </button>
  );
}
