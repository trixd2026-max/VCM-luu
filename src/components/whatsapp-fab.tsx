import { SHOP } from "@/lib/shop";

export function WhatsappFab() {
  return (
    <a
      href={SHOP.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Nhắn đặt hàng"
      className="fixed right-4 bottom-20 z-30 hidden size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(28,38,31,0.2)] md:bottom-6 md:flex"
    >
      <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
        <path d="M12.04 2c-5.46 0-9.91 4.4-9.91 9.83 0 1.73.46 3.43 1.33 4.92L2 22l5.42-1.42A10.05 10.05 0 0 0 12.04 22c5.46 0 9.91-4.4 9.91-9.83S17.5 2 12.04 2Zm5.72 14.07c-.24.67-1.4 1.24-1.93 1.32-.49.07-1.1.1-1.77-.11-.41-.13-.93-.3-1.6-.59-2.81-1.22-4.64-4.05-4.78-4.24-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09.99-2.38.26-.29.57-.36.76-.36h.55c.17 0 .41-.07.64.49.24.58.8 2 .87 2.14.07.14.12.31.02.5-.1.19-.14.31-.28.48-.14.17-.3.38-.42.51-.14.14-.29.29-.12.56.16.26.73 1.2 1.56 1.94 1.08.96 1.98 1.26 2.26 1.4.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.19-.28.38-.23.64-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.67-.17 1.34Z" />
      </svg>
    </a>
  );
}
