import { useState, type ReactNode, useEffect, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSheetConfig } from "@/lib/sheet-config";
import { useCatalog } from "@/lib/catalog-store";
import { LOCAL_PRODUCTS, productsToCsv } from "@/lib/catalog";
import {
  isAdminUnlocked,
  unlockAdmin,
  lockAdmin,
  setStoredPin,
} from "@/lib/admin-gate";
import { lookupOrders, updateOrderStatus } from "@/lib/sheet";
import {
  formatOrderTotal,
  maskWebhookUrl,
  normalizeOrderStatus,
  ORDER_STATUSES,
  type ShopOrder,
} from "@/lib/orders";
import { printDeliverySlip } from "@/lib/order-print";
import { customerTelUrl, customerZaloUrl } from "@/lib/zalo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quan-ly")({ component: AdminPage });

const SCRIPT_URL = "/apps-script.gs";

function AdminPage() {
  const [unlocked, setUnlocked] = useState(() =>
    typeof window !== "undefined" ? isAdminUnlocked() : false,
  );
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [newPin, setNewPin] = useState("");
  const [showPinChange, setShowPinChange] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);

  const cfg = useSheetConfig();
  const reload = useCatalog((s) => s.reload);
  const source = useCatalog((s) => s.source);
  const warning = useCatalog((s) => s.warning);
  const loading = useCatalog((s) => s.loading);
  const products = useCatalog((s) => s.products);
  const [sheetId, setSheetId] = useState(cfg.sheetId);
  const [csvUrl, setCsvUrl] = useState(cfg.csvUrl);
  const [sheetName, setSheetName] = useState(cfg.sheetName);
  const [gid, setGid] = useState(cfg.gid);
  const [webhookUrl, setWebhookUrl] = useState(cfg.webhookUrl);
  const [ordersSheetName, setOrdersSheetName] = useState(
    cfg.ordersSheetName || "DonHang",
  );
  const [script, setScript] = useState("");
  const [scriptLoading, setScriptLoading] = useState(true);

  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersWarning, setOrdersWarning] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(SCRIPT_URL);
        const text = await res.text();
        if (!cancelled) setScript(text);
      } catch {
        if (!cancelled) setScript("// Khong tai duoc /apps-script.gs");
      } finally {
        if (!cancelled) setScriptLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersWarning("");
    try {
      const res = await lookupOrders({
        data: {
          sheetId: sheetId.trim() || cfg.sheetId,
          ordersSheetName: ordersSheetName.trim() || "DonHang",
          limit: 25,
        },
      });
      setOrders(res.orders);
      if (res.warning) setOrdersWarning(res.warning);
      else if (res.orders.length === 0)
        setOrdersWarning("Chưa có đơn trên tab DonHang (hoặc chưa đọc được Sheet).");
    } catch {
      setOrders([]);
      setOrdersWarning("Không tải được log đơn.");
    } finally {
      setOrdersLoading(false);
    }
  }, [sheetId, ordersSheetName, cfg.sheetId]);

  useEffect(() => {
    if (unlocked) void loadOrders();
  }, [unlocked, loadOrders]);

  async function save() {
    cfg.setConfig({
      sheetId: sheetId.trim(),
      csvUrl: csvUrl.includes("/edit") ? "" : csvUrl.trim(),
      sheetName: sheetName.trim(),
      gid: gid.trim(),
      webhookUrl: webhookUrl.trim(),
      ordersSheetName: ordersSheetName.trim() || "DonHang",
    });
    await reload();
    const st = useCatalog.getState();
    if (st.source === "sheet") {
      toast.success(`Đã đồng bộ Sheet · ${st.products.length} sản phẩm`);
    } else {
      toast.error(st.warning || "Chưa đọc được Sheet — kiểm tra chia sẻ & tên tab");
    }
    void loadOrders();
  }

  function downloadCsv() {
    const blob = new Blob([productsToCsv(LOCAL_PRODUCTS)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "san-pham-vuon-cua-mit.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const tracked = products.filter((p) => typeof p.stock === "number").length;
  const low = products.filter(
    (p) => typeof p.stock === "number" && p.stock > 0 && p.stock <= 3,
  ).length;
  const out = products.filter(
    (p) => !p.inStock || (typeof p.stock === "number" && p.stock <= 0),
  ).length;

  if (!unlocked) {
    return (
      <main className="mx-auto flex max-w-sm flex-col px-4 py-16">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          Chủ cửa hàng
        </p>
        <h1 className="font-display mt-1 text-3xl">Nhập mã PIN</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Trang quản lý được bảo vệ. PIN mặc định là{" "}
          <code className="text-foreground">662166</code> (6 số cuối SĐT shop) —
          nên đổi sau khi vào.
        </p>
        <form
          className="mt-8 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (unlockAdmin(pinInput)) {
              setUnlocked(true);
              setPinError("");
              setPinInput("");
              toast.success("Đã mở khóa quản lý");
            } else {
              setPinError("PIN không đúng");
            }
          }}
        >
          <Input
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            placeholder="Mã PIN"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="text-center text-lg tracking-widest"
          />
          {pinError ? <p className="text-sm text-destructive">{pinError}</p> : null}
          <Button type="submit" size="lg">
            Vào quản lý
          </Button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">
        Chủ cửa hàng
      </p>
      <h1 className="font-display mt-1 text-4xl">Google Sheet & tồn kho</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            lockAdmin();
            setUnlocked(false);
            toast.message("Đã khóa trang quản lý");
          }}
        >
          Khóa trang
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowPinChange((v) => !v)}
        >
          Đổi PIN
        </Button>
        <Button type="button" variant="ghost" size="sm" asChild>
          <Link to="/tra-cuu-don">Tra cứu đơn (SĐT)</Link>
        </Button>
      </div>
      {showPinChange ? (
        <form
          className="mt-3 flex flex-col gap-2 rounded-xl border border-border p-4 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            if (newPin.trim().length < 4) {
              toast.error("PIN mới ít nhất 4 ký tự");
              return;
            }
            setStoredPin(newPin.trim());
            setNewPin("");
            setShowPinChange(false);
            toast.success("Đã đổi PIN (lưu trên trình duyệt này)");
          }}
        >
          <Field label="PIN mới">
            <Input
              type="password"
              inputMode="numeric"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Ít nhất 4 số"
            />
          </Field>
          <Button type="submit">Lưu PIN</Button>
        </form>
      ) : null}

      <p className="mt-3 text-sm text-muted-foreground">
        Sửa giá / tồn trên Sheet → web cập nhật. Khi khách đặt hàng, Apps Script
        trừ <code>ton_kho</code>, gửi email đơn mới và cảnh báo tồn kho.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Nguồn:{" "}
        {source === "sheet"
          ? `Google Sheet · ${products.length} SP · theo dõi tồn: ${tracked} · sắp hết: ${low} · hết: ${out}`
          : "bảng mẫu"}
        {warning ? ` · ${warning}` : ""}
      </p>

      <h2 className="font-display mt-10 text-xl">Đơn gần đây</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tab <code>{ordersSheetName || "DonHang"}</code>. Cột <code>TrangThai</code>: Mới →
        Đã xác nhận → Đang giao → Xong / Hủy. Đổi trạng thái bằng dropdown bên dưới.
      </p>
      <div className="mt-3 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={ordersLoading}
          onClick={() => void loadOrders()}
        >
          {ordersLoading ? "Đang tải…" : "Làm mới log"}
        </Button>
      </div>
      {ordersWarning && orders.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">{ordersWarning}</p>
      ) : null}
      {orders.length > 0 ? (
        <ul className="mt-4 max-h-96 space-y-2 overflow-y-auto">
          {orders.map((o) => (
            <li
              key={`${o.orderId}-${o.time}-${o.phone}`}
              className="rounded-xl border border-border bg-card/60 px-3 py-2.5 text-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium">
                  {o.orderId || "—"} · {o.phone || "?"}
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      normalizeOrderStatus(o.status) === "Xong" &&
                        "bg-emerald-100 text-emerald-900",
                      normalizeOrderStatus(o.status) === "Hủy" &&
                        "bg-red-100 text-red-800",
                      (normalizeOrderStatus(o.status) === "Đang giao" ||
                        normalizeOrderStatus(o.status) === "Đã xác nhận") &&
                        "bg-amber-100 text-amber-900",
                      normalizeOrderStatus(o.status) === "Mới" &&
                        "bg-primary/10 text-primary",
                    )}
                  >
                    {normalizeOrderStatus(o.status)}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatOrderTotal(o.total)}
                  </span>
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {o.time}
                {o.name ? ` · ${o.name}` : ""}
              </p>
              {o.items ? (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {o.items}
                </p>
              ) : null}
              {o.address ? (
                <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                  {o.address}
                </p>
              ) : null}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <select
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  value={normalizeOrderStatus(o.status)}
                  onChange={(e) => {
                    const status = e.target.value;
                    void (async () => {
                      if (!webhookUrl.trim()) {
                        toast.error("Chưa cấu hình webhook — không ghi được Sheet");
                        return;
                      }
                      const res = await updateOrderStatus({
                        data: {
                          webhookUrl: webhookUrl.trim(),
                          orderId: o.orderId,
                          status,
                        },
                      });
                      if (res.ok) {
                        setOrders((prev) =>
                          prev.map((x) =>
                            x.orderId === o.orderId && x.time === o.time
                              ? { ...x, status }
                              : x,
                          ),
                        );
                        toast.success(`Đã cập nhật: ${status}`);
                      } else toast.error(res.error || "Không cập nhật được");
                    })();
                  }}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <Button type="button" size="sm" variant="outline" className="h-8 text-xs" asChild>
                  <a href={customerTelUrl(o.phone)}>Gọi</a>
                </Button>
                <Button type="button" size="sm" variant="outline" className="h-8 text-xs" asChild>
                  <a href={customerZaloUrl(o.phone)} target="_blank" rel="noreferrer">
                    Zalo
                  </a>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={() => {
                    const res = printDeliverySlip({
                      orderId: o.orderId,
                      time: o.time,
                      name: o.name || "Khách",
                      phone: o.phone,
                      address: o.address,
                      items: o.items,
                      total: formatOrderTotal(o.total),
                      note: o.note,
                    });
                    if (!res.ok) toast.error(res.error);
                    else toast.message("Mở hộp thoại in phiếu giao");
                  }}
                >
                  In phiếu giao
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <h2 className="font-display mt-10 text-xl">Sheet nhanh</h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
        <li>
          <strong className="text-foreground">Hôm nay ngon:</strong> cột sản phẩm{" "}
          <code>noi_bat</code> = <code>1</code>
        </li>
        <li>
          <strong className="text-foreground">Trạng thái đơn:</strong> cột{" "}
          <code>TrangThai</code> trên DonHang — hoặc dùng dropdown ở log đơn
        </li>
      </ul>

      <h2 className="font-display mt-10 text-xl">Thông báo đơn (email)</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          Email tới <code className="text-foreground">trixd2026@gmail.com</code>
        </li>
        <li>
          Cảnh báo tồn + đơn mới qua Apps Script. Deploy Version:{" "}
          <strong>New</strong>.
        </li>
      </ol>

      <h2 className="font-display mt-10 text-xl">Cấu hình Sheet</h2>
      <div className="mt-4 flex flex-col gap-4">
        <Field label="Mã bảng (Sheet ID)">
          <Input
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
            placeholder="1jsAZvVDgr-ju-WPi6izYcslKQA2DCvKLMnwMS14eam4"
          />
        </Field>
        <Field label="URL CSV xuất bản (để trống nếu dùng Sheet ID)">
          <Input
            value={csvUrl}
            onChange={(e) => setCsvUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/1jsAZvVDgr-ju-WPi6izYcslKQA2DCvKLMnwMS14eam4/edit?gid=1069887904#gid=1069887904"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tên tab sản phẩm">
            <Input
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
            />
          </Field>
          <Field label="gid tab SP">
            <Input value={gid} onChange={(e) => setGid(e.target.value)} />
          </Field>
        </div>
        <Field label="Tên tab đơn hàng">
          <Input
            value={ordersSheetName}
            onChange={(e) => setOrdersSheetName(e.target.value)}
            placeholder="DonHang"
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <Label>Webhook đơn hàng (Apps Script)</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2"
              onClick={() => setShowWebhook((v) => !v)}
            >
              {showWebhook ? (
                <>
                  <EyeOff className="size-3.5" /> Ẩn
                </>
              ) : (
                <>
                  <Eye className="size-3.5" /> Hiện
                </>
              )}
            </Button>
          </div>
          {showWebhook ? (
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycbymBoq8HL50DTL1M231tGbhpacywp023OpJ3LiINjsw0rf9oxH8Ed5C918WEZ6IexZ_/exec"
              autoComplete="off"
            />
          ) : (
            <div className="flex h-10 items-center rounded-md border border-input bg-muted/40 px-3 font-mono text-xs text-muted-foreground">
              {webhookUrl.trim()
                ? maskWebhookUrl(webhookUrl)
                : "Chưa cấu hình webhook"}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            URL webhook bị ẩn mặc định — chỉ hiện khi bấm Hiện. Không chia sẻ
            công khai.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button size="lg" onClick={() => void save()} disabled={loading}>
            {loading ? "Đang đọc bảng…" : "Lưu và đồng bộ"}
          </Button>
          <Button size="lg" variant="outline" onClick={downloadCsv}>
            Tải CSV mẫu
          </Button>
        </div>
      </div>

      <h2 className="font-display mt-12 text-xl">
        Apps Script (đơn + trừ tồn + email + trạng thái)
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Copy mã → dán Apps Script → Lưu → Deploy Version New.
      </p>
      <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-foreground p-4 text-xs leading-relaxed text-background">
        {scriptLoading ? "Đang tải mã…" : script}
      </pre>
      <Button
        variant="ghost"
        className="mt-2"
        disabled={!script || scriptLoading}
        onClick={async () => {
          await navigator.clipboard.writeText(script);
          toast.success("Đã copy mã");
        }}
      >
        Copy mã
      </Button>
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
