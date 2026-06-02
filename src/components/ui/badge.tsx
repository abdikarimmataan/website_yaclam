import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  tone = "gold",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "gold" | "success" | "muted";
}) {
  const tones = {
    gold: "bg-gold text-navy",
    success: "bg-success text-white",
    muted: "bg-surface-2 text-royal",
  };
  return (
    <span className={cn("inline-flex items-center rounded-md px-2.5 py-1 text-[11.5px] font-bold uppercase tracking-wide", tones[tone], className)}>
      {children}
    </span>
  );
}
