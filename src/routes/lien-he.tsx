import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHOP } from "@/lib/shop";
import { ZaloMark } from "@/components/zalo-icon";

export const Route = createFileRoute("/lien-he")({ component: ContactPage });

function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Ghé vườn</p>
      <h1 className="font-display mt-1 text-4xl">Liên hệ</h1>
      <p className="mt-3 text-muted-foreground">
        {SHOP.owner} nhận đặt giỏ, hộp quà, tráp cưới hỏi và hoa viếng. Nhắn Zalo
        hoặc gọi trước khi ghé lấy hàng.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl">
        <img src="/products/harvest.jpg" alt="Trái cây tại vườn" className="aspect-video w-full object-cover" />
      </div>

      <ul className="mt-8 flex flex-col gap-5">
        <li className="flex gap-3">
          <ZaloMark className="mt-0.5 size-8" />
          <div>
            <p className="font-medium">Zalo {SHOP.owner}</p>
            <a
              href={SHOP.zalo}
              target="_blank"
              rel="noreferrer"
              className="text-sm tabular-nums"
            >
              {SHOP.phoneDisplay}
            </a>
          </div>
        </li>
        <li className="flex gap-3">
          <Phone className="mt-0.5 size-5 text-primary" />
          <div>
            <p className="font-medium">Điện thoại</p>
            <a href={`tel:${SHOP.phone}`} className="text-sm tabular-nums">
              {SHOP.phoneDisplay}
            </a>
            <a href={`tel:${SHOP.phone2}`} className="mt-1 block text-sm tabular-nums">
              {SHOP.phone2Display}
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
        <li className="flex gap-3">
          <span className="mt-0.5 grid size-5 place-items-center text-sm font-bold text-primary">f</span>
          <div>
            <p className="font-medium">Facebook</p>
            <a href={SHOP.facebook} target="_blank" rel="noreferrer" className="text-sm">
              Vườn Của Mít
            </a>
          </div>
        </li>
      </ul>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <a href={SHOP.zalo} target="_blank" rel="noreferrer">
            Nhắn Zalo
          </a>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={`tel:${SHOP.phone}`}>Gọi điện</a>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <a href={SHOP.facebook} target="_blank" rel="noreferrer">
            Xem Facebook
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
