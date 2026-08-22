import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-lg bg-card px-3 py-2.5 text-base text-foreground shadow-[0_0_0_1px_rgba(28,38,31,0.14)] outline-none transition-[box-shadow] duration-150 placeholder:text-muted-foreground focus-visible:shadow-[0_0_0_2px_rgba(44,83,64,0.45)] disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
