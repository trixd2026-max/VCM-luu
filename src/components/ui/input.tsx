import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md bg-card px-3 text-base text-foreground shadow-[0_0_0_1px_rgba(28,38,31,0.14)] outline-none transition-[box-shadow] duration-150 placeholder:text-muted-foreground focus-visible:shadow-[0_0_0_2px_rgba(44,83,64,0.45)] disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
