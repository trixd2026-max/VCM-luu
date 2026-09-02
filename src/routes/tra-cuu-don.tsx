import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSheetConfig } from "@/lib/sheet-config";
import { lookupOrders } from "@/lib/sheet";
import {
  formatOrderTotal,
  normalizeOrderStatus,
  orderStatusTone,
  type ShopOrder,
} from "@/lib/orders";
import { SHOP } from "@/lib/shop";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tra-cuu-don")({ component: OrderLookupPage });

function OrderLookupPage() {
  const sheetId = useSheetConfig((s) => s.sheetId);
  const ordersSheetName = useSheetConfig((s) => s.ordersSheetName);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<ShopOrder[] | null>(null);
  const [warning, setWarning] = useState("");

  async function search(e?: FormEvent) {
    e?.preventDefault();
    if (phone.replace(/\D/g, "").length < 9) {
      toast.error("Nhập số điện thoại đã dùng khi đặt hàng");
      return;
    }
    setLoading(true);
    setWarning("");
    try {
      const res = await lookupOrders({
        data: {
          sheetId: sheetId.trim(),
          ordersSheetName: ordersSheetName?.trim() || "DonHang",
          phone: phone.trim(),
          limit: 15,
        },
      });
      setOrders(res.orders);
      if (res.warning) setWarning(res.warning);
      else if (res.orders.length === 0)
        setWarning("Không thấy đơn với số này. Kiểm tra lại SĐT hoặc nhắn Zalo shop.");
    } catch {
      setOrders([]);
      setWarning("Không tra cứu được. Thử lại sau hoặc liên hệ shop.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Hỗ trợ</p>
      <h1 className="font-display mt-1 text-3xl">Tra cứu đơn</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Nhập SĐT đã dùng khi đặt để xem đơn và trạng thái xử lý.
      </p>

      <form className="mt-8 flex flex-col gap-3" onSubmit={(e) => void search(e)}>
        <label className="flex flex-col gap-1.5">
          <Label>Số điện thoại</Label>
          <Input
            inputMode="tel"
            placeholder="09xx xxx xxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </label>
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Đang tìm…" : "Tra cứu"}
        </Button>
      </form>

      {warning && !orders?.length ? (
        <p className="mt-6 text-sm text-muted-foreground">{warning}</p>
      ) : null}

      {orders && orders.length > 0 ? (
        <ul className="mt-8 flex flex-col gap-3">
          {orders.map((o) => {
            const status = normalizeOrderStatus(o.status);
            return (
              <li
                key={`${o.orderId}-${o.time}`}
                className="rounded-xl border border-border bg-card p-4 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-foreground">
                      {o.orderId || "Đơn"}
                    </span>
                    {o.time ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">{o.time}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={status} />
                    <span className="tabular-nums text-muted-foreground">
                      {formatOrderTotal(o.total)}
                    </span>
                  </div>
                </div>
                {o.items ? (
                  <p className="mt-2 text-muted-foreground">{o.items}</p>
                ) : null}
                {o.address ? (
                  <p className="mt-1 text-xs text-muted-foreground">Giao: {o.address}</p>
                ) : null}
                {o.note ? (
                  <p className="mt-1 text-xs text-muted-foreground whitespace-pre-wrap">
                    {o.note}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      <p className="mt-10 text-center text-sm">
        <Link to="/cua-hang" className="text-primary underline-offset-2 hover:underline">
          Về cửa hàng
        </Link>
        {" · "}
        <a
          href={SHOP.zalo}
          className="text-primary underline-offset-2 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Nhắn Zalo
        </a>
      </p>
    </main>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = normalizeOrderStatus(status);
  const tone = orderStatusTone(s);
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
        tone === "default" && "bg-primary/10 text-primary",
        tone === "warn" && "bg-amber-100 text-amber-900",
        tone === "ok" && "bg-emerald-100 text-emerald-900",
        tone === "danger" && "bg-red-100 text-red-800",
        tone === "muted" && "bg-muted text-muted-foreground",
      )}
    >
      {s}
    </span>
  );
}
