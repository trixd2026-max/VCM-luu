import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SHOP } from "@/lib/shop";
import { ZaloMark } from "@/components/zalo-icon";
import { qrImageUrl } from "@/lib/zalo";

export const Route = createFileRoute("/lien-he")({ component: ContactPage });

function ContactPage() {
  const zaloQr = qrImageUrl(SHOP.zalo, 180);
  const phoneQr = qrImageUrl(`tel:${SHOP.phone}`, 180);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Liên hệ</p>
      <h1 className="font-display mt-1 text-4xl">{SHOP.name}</h1>
      <p className="mt-2 text-muted-foreground">{SHOP.tagline}</p>

      <div className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed">
        <p>
          <strong className="text-foreground">Chủ vườn:</strong> {SHOP.owner}
        </p>
        <p>
          <strong className="text-foreground">Điện thoại:</strong>{" "}
          <a className="text-primary underline-offset-2 hover:underline" href={`tel:${SHOP.phone}`}>
            {SHOP.phoneDisplay}
          </a>
          {SHOP.phone2 ? (
            <>
              {" · "}
              <a
                className="text-primary underline-offset-2 hover:underline"
                href={`tel:${SHOP.phone2}`}
              >
                {SHOP.phone2Display}
              </a>
            </>
          ) : null}
        </p>
        <p>
          <strong className="text-foreground">Địa chỉ:</strong> {SHOP.address}
        </p>
        <p>
          <strong className="text-foreground">Giờ mở cửa:</strong> {SHOP.hours}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center">
          <img
            src={zaloQr}
            alt="QR Zalo Vườn Của Mít"
            width={180}
            height={180}
            className="rounded-lg bg-white p-2"
          />
          <p className="mt-3 text-sm font-medium">Quét Zalo chị Hằng</p>
          <p className="mt-1 text-xs text-muted-foreground">Mở Zalo → quét mã → nhắn đặt hàng</p>
        </div>
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center">
          <img
            src={phoneQr}
            alt={`QR gọi ${SHOP.phoneDisplay}`}
            width={180}
            height={180}
            className="rounded-lg bg-white p-2"
          />
          <p className="mt-3 text-sm font-medium">Quét để gọi {SHOP.phoneDisplay}</p>
          <p className="mt-1 text-xs text-muted-foreground">Điện thoại hỗ trợ quét QR gọi nhanh</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <a href={SHOP.zalo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2">
            <ZaloMark className="size-4" />
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
