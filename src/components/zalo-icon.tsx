import { cn } from "@/lib/utils";

export function ZaloGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M6.2 5.6h11.6v2.2l-6.7 7.2h6.7V17.4H6.2v-2.3l6.7-7.1H6.2V5.6Z"
      />
    </svg>
  );
}

export function ZaloMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-7 place-items-center rounded-md bg-zalo text-zalo-foreground",
        className,
      )}
    >
      <ZaloGlyph className="size-4" />
    </span>
  );
}
