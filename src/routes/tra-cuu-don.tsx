import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSheetConfig } from "@/lib/sheet-config";
import { lookupOrders } from "@/lib/sheet";
import { formatOrderTotal, type ShopOrder } from "@/lib/orders";
import { SHOP } from "@/lib/shop";

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
      else if (res.orders.length === 0) setWarning("Không tìm thấy đơn với số này.");
    } catch {
      setOrders([]);
      setWarning("Không tra cứu được — thử lại sau hoặc nhắn Zalo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Hỗ trợ</p>
      <h1 className="font-display mt-1 text-4xl">Tra cứu đơn</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Nhập SĐT đã dùng khi đặt hàng để xem các đơn gần đây. Cần hỗ trợ thêm: Zalo{" "}
        {SHOP.owner} {SHOP.phoneDisplay}.
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
          {orders.map((o) => (
            <li
              key={`${o.orderId}-${o.time}`}
              className="rounded-xl border border-border bg-card p-4 text-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-foreground">{o.orderId || "Đơn"}</span>
                <span className="tabular-nums text-muted-foreground">
                  {formatOrderTotal(o.total)}
                </span>
              </div>
              {o.time ? (
                <p className="mt-1 text-xs text-muted-foreground">{o.time}</p>
              ) : null}
              {o.items ? <p className="mt-2 text-muted-foreground">{o.items}</p> : null}
              {o.address ? (
                <p className="mt-1 text-xs text-muted-foreground">Giao: {o.address}</p>
              ) : null}
              {o.note ? (
                <p className="mt-1 text-xs text-muted-foreground whitespace-pre-wrap">{o.note}</p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-10 text-center text-sm">
        <Link to="/cua-hang" className="text-primary underline-offset-2 hover:underline">
          Về cửa hàng
        </Link>
        {" · "}
        <a href={SHOP.zalo} className="text-primary underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
          Nhắn Zalo
        </a>
      </p>
    </main>
  );
}
