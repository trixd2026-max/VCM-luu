import { cn } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      loading="lazy"
    />
  );
}
