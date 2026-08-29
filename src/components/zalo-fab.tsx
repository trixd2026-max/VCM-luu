import { SHOP } from "@/lib/shop";
import { ZaloGlyph } from "@/components/zalo-icon";

export function ZaloFab() {
  return (
    <div className="fixed right-4 bottom-20 z-30 flex flex-col gap-3 md:bottom-6">
      <a
        href={SHOP.facebookMessenger}
        target="_blank"
        rel="noreferrer"
        aria-label="Nhắn Facebook Messenger"
        className="grid size-14 place-items-center rounded-full bg-[#1877F2] text-white shadow-lg"
      >
        <FacebookGlyph className="size-7" />
      </a>
      <a
        href={SHOP.zalo}
        target="_blank"
        rel="noreferrer"
        aria-label={`Nhắn Zalo ${SHOP.owner} ${SHOP.phoneDisplay}`}
        className="grid size-14 place-items-center rounded-full bg-zalo text-zalo-foreground shadow-lg"
      >
        <ZaloGlyph className="size-7" />
      </a>
    </div>
  );
}

function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34v7c4.78-.75 8.44-4.9 8.44-9.9 0-5.53-4.5-10.02-10-10.02Z" />
    </svg>
  );
}
