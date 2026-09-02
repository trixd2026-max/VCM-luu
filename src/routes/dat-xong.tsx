import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Copy, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/format";
import { loadLastOrder, type LastOrder } from "@/lib/last-order";
import { copyZaloMessage, openZalo } from "@/lib/zalo";
import { SHOP } from "@/lib/shop";

export const Route = createFileRoute("/dat-xong")({
  component: OrderDonePage,
});

function OrderDonePage() {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    setOrder(loadLastOrder());
  }, []);

  async function handleCopy() {
    if (!order) return;
    const ok = await copyZaloMessage(order.message);
    if (ok) toast.success("Đã copy tin nhắn đơn");
    else toast.error("Không copy được — hãy chọn & copy thủ công bên dưới");
  }

  async function handleCopyAndZalo() {
    if (!order) return;
    const ok = await copyZaloMessage(order.message);
    openZalo();
    if (ok) toast.success("Đã copy — dán vào Zalo gửi chị Hằng");
    else toast.message("Mở Zalo — copy tin bên dưới rồi dán");
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Chưa có đơn vừa đặt</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Đặt hàng xong sẽ thấy mã đơn và nút gửi Zalo tại đây.
        </p>
        <Button asChild className="mt-6">
          <Link to="/cua-hang">Vào cửa hàng</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <div className="flex flex-col items-center text-center">
        <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="font-display mt-4 text-3xl">Đã nhận yêu cầu đặt</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Gửi tin Zalo cho {SHOP.owner} để xác nhận nhanh (mã đơn, SĐT, tổng đã sẵn).
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Mã đơn</p>
            <p className="font-display text-xl tracking-tight">{order.orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Tổng</p>
            <p className="font-semibold tabular-nums text-lg">
              {formatVnd(order.grandTotal)}
            </p>
          </div>
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">SĐT</dt>
            <dd className="font-medium tabular-nums">{order.phone}</dd>
          </div>
          {order.name ? (
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Tên</dt>
              <dd>{order.name}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground shrink-0">Địa chỉ</dt>
            <dd className="text-right">{order.address || "—"}</dd>
          </div>
          {order.shippingLabel ? (
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Ship</dt>
              <dd className="text-right">{order.shippingLabel}</dd>
            </div>
          ) : null}
          {(order.deliveryDay || order.deliverySlot) && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Nhận</dt>
              <dd className="text-right">
                {[order.deliveryDay, order.deliverySlot].filter(Boolean).join(" · ")}
              </dd>
            </div>
          )}
        </dl>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {order.itemsText}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <Button type="button" size="lg" className="w-full gap-2" onClick={() => void handleCopyAndZalo()}>
          <MessageCircle className="size-4" />
          Copy tin & mở Zalo
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="w-full gap-2"
          onClick={() => void handleCopy()}
        >
          <Copy className="size-4" />
          Chỉ copy tin nhắn
        </Button>
        <Button asChild size="lg" variant="outline" className="w-full gap-2">
          <a href={`tel:${SHOP.phone}`}>
            <Phone className="size-4" />
            Gọi {SHOP.phoneDisplay}
          </a>
        </Button>
      </div>

      <details className="mt-6 rounded-xl border border-border bg-muted/40 px-3 py-2">
        <summary className="cursor-pointer text-sm font-medium">Xem tin nhắn sẽ gửi</summary>
        <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap text-xs text-muted-foreground">
          {order.message}
        </pre>
      </details>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        <Link to="/tra-cuu-don" className="underline-offset-2 hover:underline">
          Tra cứu đơn bằng SĐT
        </Link>
        {" · "}
        <Link to="/cua-hang" className="underline-offset-2 hover:underline">
          Tiếp tục mua
        </Link>
      </p>
    </main>
  );
}
