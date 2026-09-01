import { useState, type ReactNode, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
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
  getStoredPin,
  setStoredPin,
} from "@/lib/admin-gate";

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
  const [script, setScript] = useState("");
  const [scriptLoading, setScriptLoading] = useState(true);

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

  async function save() {
    cfg.setConfig({
      sheetId: sheetId.trim(),
      csvUrl: csvUrl.includes("/edit") ? "" : csvUrl.trim(),
      sheetName: sheetName.trim(),
      gid: gid.trim(),
      webhookUrl: webhookUrl.trim(),
    });
    await reload();
    const st = useCatalog.getState();
    if (st.source === "sheet") {
      toast.success(`Đã đồng bộ Sheet · ${st.products.length} sản phẩm`);
    } else {
      toast.error(st.warning || "Chưa đọc được Sheet — kiểm tra chia sẻ & tên tab");
    }
  }

  function downloadCsv() {
    const blob = new Blob([productsToCsv(LOCAL_PRODUCTS)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "san-pham-vuon-cua-mit.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const tracked = products.filter((p) => typeof p.stock === "number").length;
  const low = products.filter((p) => typeof p.stock === "number" && p.stock > 0 && p.stock <= 3).length;
  const out = products.filter((p) => !p.inStock || (typeof p.stock === "number" && p.stock <= 0)).length;

  if (!unlocked) {
    return (
      <main className="mx-auto flex max-w-sm flex-col px-4 py-16">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">Chủ cửa hàng</p>
        <h1 className="font-display mt-1 text-3xl">Nhập mã PIN</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Trang quản lý được bảo vệ. PIN mặc định là <code className="text-foreground">662166</code>{" "}
          (6 số cuối SĐT shop) — nên đổi sau khi vào.
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
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Chủ cửa hàng</p>
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
        <Button type="button" variant="ghost" size="sm" onClick={() => setShowPinChange((v) => !v)}>
          Đổi PIN
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
        Sửa giá / tồn trên Sheet → web cập nhật. Khi khách đặt hàng, Apps Script tự trừ{" "}
        <code>ton_kho</code>, tắt <code>con_hang</code> nếu hết, gửi email đơn mới + cảnh báo tồn.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Nguồn:{" "}
        {source === "sheet"
          ? `Google Sheet · ${products.length} SP · theo dõi tồn: ${tracked} · sắp hết: ${low} · hết: ${out}`
          : "bảng mẫu"}
        {warning ? ` · ${warning}` : ""}
      </p>

      <h2 className="font-display mt-10 text-xl">Thông báo đơn mới (email + Telegram)</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Zalo cá nhân không có API gửi tin tự động miễn phí. Dùng <strong>email</strong> (mặc định) +{" "}
        <strong>Telegram</strong> báo điện thoại ngay khi có đơn.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          Telegram → <code>@BotFather</code> → <code>/newbot</code> → copy bot token.
        </li>
        <li>
          Nhắn bot → mở <code>https://api.telegram.org/botTOKEN/getUpdates</code> → lấy chat.id.
        </li>
        <li>
          Apps Script → Script properties: <code>TELEGRAM_BOT_TOKEN</code> + <code>TELEGRAM_CHAT_ID</code>.
        </li>
        <li>
          Copy mã /apps-script.gs bên dưới → Deploy Version: <strong>New</strong>. Chạy <code>testTelegram</code> để thử.
        </li>
      </ol>

      <h2 className="font-display mt-10 text-xl">Checklist — thêm 1 sản phẩm + ảnh</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Chọn một cách ảnh: Drive (link cột hinh) hoặc GitHub public/products → /products/ten.jpg.
      </p>

      <h2 className="font-display mt-10 text-xl">Tồn kho tự động</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          Cột <code className="text-foreground">ton_kho</code> trên Sheet (sát <code>con_hang</code>).
        </li>
        <li>Để trống = không giới hạn. =0 → Hết hàng.</li>
      </ol>

      <div className="mt-8 flex flex-col gap-4">
        <Field label="Mã bảng (Sheet ID)">
          <Input value={sheetId} onChange={(e) => setSheetId(e.target.value)} placeholder="1AbCDef..." />
        </Field>
        <Field label="URL CSV xuất bản (để trống nếu dùng Sheet ID)">
          <Input
            value={csvUrl}
            onChange={(e) => setCsvUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tên tab sản phẩm">
            <Input value={sheetName} onChange={(e) => setSheetName(e.target.value)} />
          </Field>
          <Field label="gid tab">
            <Input value={gid} onChange={(e) => setGid(e.target.value)} />
          </Field>
        </div>
        <Field label="Webhook đơn hàng (Apps Script)">
          <Input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
          />
        </Field>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button size="lg" onClick={() => void save()} disabled={loading}>
            {loading ? "Đang đọc bảng…" : "Lưu và đồng bộ"}
          </Button>
          <Button size="lg" variant="outline" onClick={downloadCsv}>
            Tải CSV mẫu
          </Button>
        </div>
      </div>

      <h2 className="font-display mt-12 text-xl">Apps Script (đơn + trừ tồn + báo đơn)</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Copy mã → dán Apps Script → Lưu → Deploy Version New. Có sendOrderNotify_ (email + Telegram).
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
