import { SHOP } from "@/lib/shop";
import { ZaloGlyph } from "@/components/zalo-icon";

export function ZaloFab() {
  return (
    <a
      href={SHOP.zalo}
      target="_blank"
      rel="noreferrer"
      aria-label={`Nhắn Zalo ${SHOP.owner} ${SHOP.phoneDisplay}`}
      className="fixed right-4 bottom-20 z-30 grid size-14 place-items-center rounded-full bg-zalo text-zalo-foreground shadow-lg md:bottom-6"
    >
      <ZaloGlyph className="size-7" />
    </a>
  );
}
