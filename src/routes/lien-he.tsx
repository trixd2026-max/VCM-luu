import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHOP } from "@/lib/shop";

export const Route = createFileRoute("/lien-he")({ component: ContactPage });

function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Ghé vườn</p>
      <h1 className="font-display mt-1 text-4xl">Liên hệ</h1>
      <p className="mt-3 text-muted-foreground">
        {SHOP.owner} nhận đặt giỏ, hộp quà và tráp cưới hỏi. Gọi hoặc nhắn trước khi
        ghé lấy hàng.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl">
        <img src="/products/cho.jpg" alt="Trái cây tại vườn" className="aspect-video w-full object-cover" />
      </div>

      <ul className="mt-8 flex flex-col gap-5">
        <li className="flex gap-3">
          <Phone className="mt-0.5 size-5 text-primary" />
          <div>
            <p className="font-medium">{SHOP.owner}</p>
            <a href={`tel:${SHOP.phone}`} className="text-sm tabular-nums">
              {SHOP.phoneDisplay}
            </a>
          </div>
        </li>
        <li className="flex gap-3">
          <MapPin className="mt-0.5 size-5 text-primary" />
          <div>
            <p className="font-medium">Địa chỉ</p>
            <p className="text-sm text-muted-foreground">{SHOP.address}</p>
          </div>
        </li>
        <li className="flex gap-3">
          <Clock className="mt-0.5 size-5 text-primary" />
          <div>
            <p className="font-medium">Giờ mở</p>
            <p className="text-sm text-muted-foreground">{SHOP.hours}</p>
          </div>
        </li>
      </ul>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <a href={`tel:${SHOP.phone}`}>Gọi ngay</a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={SHOP.whatsapp} target="_blank" rel="noreferrer">
            Nhắn WhatsApp
          </a>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <a href={SHOP.mapsUrl} target="_blank" rel="noreferrer">
            Mở bản đồ
          </a>
        </Button>
      </div>
    </main>
  );
}
