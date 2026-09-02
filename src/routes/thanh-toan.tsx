import { useMemo, useState, type ReactNode } from "react";
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
import {
  SHOP,
  SHIPPING_OPTIONS,
  DELIVERY_SLOTS,
  DELIVERY_DAYS,
  type ShippingOptionId,
  type DeliverySlotId,
  type DeliveryDayId,
} from "@/lib/shop";
import { buildOrderMessage, copyZaloMessage } from "@/lib/zalo";
import { useCartReady } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/thanh-toan")({ component: CheckoutPage });

function CheckoutPage() {
  const lines = useCart((s) => s.lines);
  const ready = useCartReady();
  const clear = useCart((s) => s.clear);
  const subtotal = cartTotal(lines);
  const webhookUrl = useSheetConfig((s) => s.webhookUrl);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [shippingId, setShippingId] = useState<ShippingOptionId>("xa");
  const [dayId, setDayId] = useState<DeliveryDayId>("hom-nay");
  const [slotId, setSlotId] = useState<DeliverySlotId>("chieu");
  const [sending, setSending] = useState(false);

  const shipping = useMemo(
    () => SHIPPING_OPTIONS.find((o) => o.id === shippingId) ?? SHIPPING_OPTIONS[0],
    [shippingId],
  );
  const isPickup = shipping.id === "pickup";
  const shippingFee = shipping.fee;
  const grandTotal = subtotal + shippingFee;

  const dayLabel = DELIVERY_DAYS.find((d) => d.id === dayId)?.label ?? "";
  const slotLabel = DELIVERY_SLOTS.find((s) => s.id === slotId)?.label ?? "";

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
    if (!isPickup && !address.trim()) {
      toast.error("Nhập địa chỉ giao hàng (hoặc chọn tự đến lấy).");
      return;
    }
    setSending(true);
    const orderId = makeOrderId();
    const items = lines
      .map((l) => `${l.qty} ${l.unit} ${l.name}${l.note ? ` (${l.note})` : ""}`)
      .join("; ");

    const normalizedItems = lines.map((l) => {
      let productId = l.id;
      if (productId.includes("::")) productId = productId.split("::")[0];
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

    const shipNote = [
      `Ship: ${shipping.label}${shippingFee > 0 ? ` (${formatVnd(shippingFee)})` : shipping.id === "xa-hon" ? " (thỏa thuận)" : " (0đ)"}`,
      `Ngày nhận: ${dayLabel}`,
      `Giờ nhận: ${slotLabel}`,
    ].join(" · ");

    const fullNote = [shipNote, note.trim()].filter(Boolean).join("\n");

    const payload = {
      orderId,
      name: name.trim() || "Khách",
      phone: phone.trim(),
      address: isPickup ? `(Tự lấy) ${SHOP.address}` : address.trim(),
      note: fullNote,
      total: grandTotal,
      subtotal,
      shippingFee,
      shippingId: shipping.id,
      shippingLabel: shipping.label,
      deliveryDay: dayLabel,
      deliverySlot: slotLabel,
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
      else if (result.error)
        toast.message("Đơn vẫn gửi được qua điện thoại", { description: result.error });
    }

    const message = buildOrderMessage({
      orderId,
      name: payload.name,
      phone: payload.phone,
      address: isPickup ? "Tự đến lấy tại vườn" : payload.address,
      note: note.trim(),
      lines,
      shippingFee,
      shippingLabel: shipping.label,
      deliveryDay: dayLabel,
      deliverySlot: slotLabel,
      grandTotal,
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
          Gửi đơn qua Zalo cho {SHOP.owner}. Thanh toán khi nhận, hoặc chuyển khoản sau khi xác nhận.
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

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm font-medium text-foreground">Hình thức nhận hàng</legend>
            <div className="flex flex-col gap-2">
              {SHIPPING_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm transition-colors",
                    shippingId === opt.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-muted/40",
                  )}
                >
                  <input
                    type="radio"
                    name="shipping"
                    className="mt-1"
                    checked={shippingId === opt.id}
                    onChange={() => setShippingId(opt.id)}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-medium text-foreground">{opt.label}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {opt.id === "xa-hon"
                          ? "Thỏa thuận"
                          : opt.fee === 0
                            ? "Miễn phí"
                            : formatVnd(opt.fee)}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{opt.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {!isPickup ? (
            <Field label="Địa chỉ giao">
              <Input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Thôn, xã, huyện — ghi rõ để ship đúng"
              />
            </Field>
          ) : (
            <p className="rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              Địa chỉ lấy hàng: {SHOP.address}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-foreground">Ngày nhận</legend>
              <div className="flex flex-col gap-1.5">
                {DELIVERY_DAYS.map((d) => (
                  <label
                    key={d.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                      dayId === d.id ? "border-primary bg-primary/5" : "border-border",
                    )}
                  >
                    <input
                      type="radio"
                      name="day"
                      checked={dayId === d.id}
                      onChange={() => setDayId(d.id)}
                    />
                    {d.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-foreground">Khung giờ</legend>
              <div className="flex flex-col gap-1.5">
                {DELIVERY_SLOTS.map((s) => (
                  <label
                    key={s.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                      slotId === s.id ? "border-primary bg-primary/5" : "border-border",
                    )}
                  >
                    <input
                      type="radio"
                      name="slot"
                      checked={slotId === s.id}
                      onChange={() => setSlotId(s.id)}
                    />
                    {s.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <Field label="Ghi chú thêm">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Lời thiệp, dị ứng, hẹn ngày cụ thể…"
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
        <div className="mt-3 flex justify-between text-sm text-muted-foreground">
          <span>Tiền hàng</span>
          <span className="tabular-nums">{formatVnd(subtotal)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm text-muted-foreground">
          <span className="min-w-0 truncate pr-2">Ship · {shipping.label}</span>
          <span className="shrink-0 tabular-nums">
            {shipping.id === "xa-hon"
              ? "Thỏa thuận"
              : shippingFee === 0
                ? "0đ"
                : formatVnd(shippingFee)}
          </span>
        </div>
        <div className="mt-3 flex justify-between border-t border-border pt-3 font-medium">
          <span>Tổng</span>
          <span className="tabular-nums">{formatVnd(grandTotal)}</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {dayLabel} · {slotLabel}
        </p>
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
