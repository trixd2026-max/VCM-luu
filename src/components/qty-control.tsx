import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QtyControl({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-11 items-center rounded-md bg-card shadow-[0_0_0_1px_rgba(28,38,31,0.12)]",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Giảm"
        className="grid size-11 place-items-center text-foreground"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-8 text-center text-sm tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Tăng"
        className="grid size-11 place-items-center text-foreground"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
