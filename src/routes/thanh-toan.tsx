import { useState, type ReactNode } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart, cartTotal } from "@/lib/cart";
import { useSheetConfig } from "@/lib/sheet-config";
import { submitSheetOrder } from "@/lib/sheet";
import { formatVnd, makeOrderId } from "@/lib/format";
import { SHOP } from "@/lib/shop";
import { buildOrderMessage, copyZaloMessage } from "@/lib/zalo";
import { useCartReady } from "@/hooks/use-hydrated";

export const Route = createFileRoute("/thanh-toan")({ component: CheckoutPage });

function CheckoutPage() {
  const lines = useCart((s) => s.lines);
  const ready = useCartReady();
  const clear = useCart((s) => s.clear);
  const total = cartTotal(lines);
  const webhookUrl = useSheetConfig((s) => s.webhookUrl);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  if (!ready) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-display text-4xl">Đặt hàng</h1>
        <Skeleton className="mt-8 h-40 w-full" />
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl">Chưa có món để đặt</h1>
        <Button asChild className="mt-6">
          <Link to="/cua-hang">Về cửa hàng</Link>
        </Button>
      </main>
    );
  }

  async function placeOrder(via: "zalo" | "call") {
    if (!phone.trim()) {
      toast.error("Nhập số điện thoại để cửa hàng liên hệ.");
      return;
    }
    setSending(true);
    const orderId = makeOrderId();
    const items = lines
      .map((l) => `${l.qty} ${l.unit} ${l.name}${l.note ? ` (${l.note})` : ""}`)
      .join("; ");

    // productId = phần trước "::" nếu có note gắn id
    const itemsJson = JSON.stringify(
      lines.map((l) => ({
        productId: l.id.includes("::") ? l.id.split("::")[0] : l.id.replace(/^gio-/, "").replace(/-\d+$/, "") === l.id
          ? l.id
          : l.id.startsWith("gio-")
            ? l.id.replace(/^gio-/, "").replace(/-\d{13}$/, "").replace(/-\d+$/, "") || l.id
            : l.id,
        name: l.name,
        qty: l.qty,
        unit: l.unit,
        price: l.price,
      })),
    );

    // Chuẩn hóa productId cho trừ tồn: id gốc sản phẩm catalog
    const normalizedItems = lines.map((l) => {
      let productId = l.id;
      if (productId.includes("::")) productId = productId.split("::")[0];
      // giỏ custom: gio-{productId}-{timestamp} hoặc gio-custom-{tier}-{ts}
      const m = productId.match(/^gio-(.+?)-\d{10,}$/);
      if (m && m[1] !== "custom") productId = m[1];
      return {
        productId,
        name: l.name,
        qty: l.qty,
        unit: l.unit,
        price: l.price,
      };
    });

    const payload = {
      orderId,
      name: name.trim() || "Khách",
      phone: phone.trim(),
      address: address.trim(),
      note: note.trim(),
      total,
      items,
      itemsJson: JSON.stringify(normalizedItems),
      type: "don-hang",
      createdAt: new Date().toISOString(),
    };

    if (via === "zalo") {
      window.open(SHOP.zalo, "_blank", "noopener,noreferrer");
    }

    if (webhookUrl.trim()) {
      const result = await submitSheetOrder({
        data: { webhookUrl: webhookUrl.trim(), order: payload },
      });
      if (result.saved) toast.success("Đã ghi đơn & cập nhật tồn kho");
      else if (result.error) toast.message("Đơn vẫn gửi được qua điện thoại", { description: result.error });
    }

    const message = buildOrderMessage({
      orderId,
      name: payload.name,
      phone: payload.phone,
      address: payload.address,
      note: payload.note,
      lines,
    });
    clear();
    setSending(false);

    if (via === "call") {
      window.location.href = `tel:${SHOP.phone}`;
      void navigate({ to: "/" });
      return;
    }
    const copied = await copyZaloMessage(message);
    if (copied) toast.success("Đã copy đơn — dán vào Zalo gửi chị Hằng");
    else toast.message("Mở Zalo và gửi đơn cho chị Hằng");
    void navigate({ to: "/" });
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-10 px-4 py-10 lg:grid-cols-[1fr_20rem]">
      <div>
        <h1 className="font-display text-4xl">Đặt hàng</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Gửi đơn qua Zalo cho {SHOP.owner}. Thanh toán khi nhận, hoặc
          chuyển khoản sau khi xác nhận.
        </p>
        <form
          className="mt-8 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            void placeOrder("zalo");
          }}
        >
          <Field label="Họ tên">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên người nhận" />
          </Field>
          <Field label="Số điện thoại">
            <Input
              required
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09xx xxx xxx"
            />
          </Field>
          <Field label="Địa chỉ giao">
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Thôn, xã — để trống nếu tự lấy"
            />
          </Field>
          <Field label="Ghi chú">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Giờ giao, lời thiệp, dị ứng…"
            />
          </Field>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button type="submit" size="lg" className="flex-1" disabled={sending}>
              Nhắn Zalo đặt hàng
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="flex-1"
              disabled={sending}
              onClick={() => void placeOrder("call")}
            >
              Gọi {SHOP.phoneDisplay}
            </Button>
          </div>
        </form>
      </div>
      <aside className="h-fit rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]">
        <p className="text-sm font-medium">Đơn của bạn</p>
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {lines.map((l) => (
            <li key={l.id} className="flex justify-between gap-3">
              <span className="min-w-0 truncate">
                {l.qty}× {l.name}
              </span>
              <span className="tabular-nums">{formatVnd(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-3 font-medium">
          <span>Tổng</span>
          <span className="tabular-nums">{formatVnd(total)}</span>
        </div>
      </aside>
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
