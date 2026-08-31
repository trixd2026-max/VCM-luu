import { useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSheetConfig } from "@/lib/sheet-config";
import { useCatalog } from "@/lib/catalog-store";
import { LOCAL_PRODUCTS, productsToCsv } from "@/lib/catalog";
import { APPS_SCRIPT_STOCK } from "@/lib/apps-script-stock";

export const Route = createFileRoute("/quan-ly")({ component: AdminPage });

const SCRIPT = APPS_SCRIPT_STOCK;

function AdminPage() {
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

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Chủ cửa hàng</p>
      <h1 className="font-display mt-1 text-4xl">Google Sheet & tồn kho</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Sửa giá / tồn trên Sheet → web cập nhật. Khi khách đặt hàng, Apps Script tự trừ{" "}
        <code>ton_kho</code>, tắt <code>con_hang</code> nếu hết, và gửi email cảnh báo khi sắp hết /
        hết hàng.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Nguồn:{" "}
        {source === "sheet"
          ? `Google Sheet · ${products.length} SP · theo dõi tồn: ${tracked} · sắp hết: ${low} · hết: ${out}`
          : "bảng mẫu"}
        {warning ? ` · ${warning}` : ""}
      </p>

      <h2 className="font-display mt-10 text-xl">Tồn kho tự động</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          Thêm cột <code className="text-foreground">ton_kho</code> trên tab sản phẩm (sát cột{" "}
          <code>con_hang</code>).
        </li>
        <li>
          Điền số (vd. <code>10</code>). <strong>Để trống</strong> = không giới hạn số lượng.
        </li>
        <li>
          Khi <code>ton_kho = 0</code> → web hiện <strong>Hết hàng</strong>.
        </li>
        <li>Cập nhật mã Apps Script bên dưới rồi Deploy lại webhook (Version: New).</li>
      </ol>

      <h2 className="font-display mt-10 text-xl">Cảnh báo email</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          <code>ALERT_EMAIL</code> = <code>trixd2026@gmail.com</code> (đổi trong script nếu cần).
        </li>
        <li>
          Trong Apps Script: chọn <code>testSendAlertEmail</code> → Run → Cho phép Gmail.
        </li>
        <li>
          Email tự gửi khi đơn làm tồn về 0 hoặc ≤ <code>LOW_STOCK_THRESHOLD</code> (mặc định 3).
        </li>
        <li>
          Deploy → Manage deployments → Edit → Version: <strong>New</strong> → Deploy.
        </li>
      </ol>

      <div className="mt-8 flex flex-col gap-4">
        <Field label="Mã bảng (Sheet ID)">
          <Input value={sheetId} onChange={(e) => setSheetId(e.target.value)} placeholder="1AbCDef..." />
        </Field>
        <Field label="URL CSV xuất bản (để trống nếu dùng Sheet ID)">
          <Input
            value={csvUrl}
            onChange={(e) => setCsvUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/e/…/pub?output=csv"
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
            placeholder="https://script.google.com/macros/s/…/exec"
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

      <h2 className="font-display mt-12 text-xl">Apps Script (đơn + trừ tồn + email)</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Copy mã → dán vào Apps Script (xóa code cũ) → Lưu → Deploy lại webhook.
      </p>
      <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-foreground p-4 text-xs leading-relaxed text-background">
        {SCRIPT}
      </pre>
      <Button
        variant="ghost"
        className="mt-2"
        onClick={async () => {
          await navigator.clipboard.writeText(SCRIPT);
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
