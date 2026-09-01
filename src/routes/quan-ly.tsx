import { useState, type ReactNode, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSheetConfig } from "@/lib/sheet-config";
import { useCatalog } from "@/lib/catalog-store";
import { LOCAL_PRODUCTS, productsToCsv } from "@/lib/catalog";

export const Route = createFileRoute("/quan-ly")({ component: AdminPage });

const SCRIPT_URL = "/apps-script.gs";

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

      <h2 className="font-display mt-10 text-xl">Checklist — thêm 1 sản phẩm + ảnh</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Làm theo thứ tự. Chọn <strong>một</strong> cách ảnh (A hoặc B).
      </p>

      <h3 className="mt-5 text-sm font-medium text-foreground">1. Ảnh sản phẩm</h3>
      <div className="mt-2 space-y-3 text-sm text-muted-foreground">
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <p className="font-medium text-foreground">Cách A — Google Drive (nhanh, không cần GitHub)</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5">
            <li>Upload ảnh lên Drive → Chia sẻ → <strong>Bất kỳ ai có liên kết</strong> (Người xem).</li>
            <li>Copy link (vd. <code className="text-foreground">https://drive.google.com/file/d/xxxx/view?usp=sharing</code>).</li>
            <li>
              Dán vào cột <code className="text-foreground">hinh</code> trên Sheet (cả link hoặc chỉ ID{" "}
              <code>xxxx</code>).
            </li>
          </ol>
        </div>
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <p className="font-medium text-foreground">Cách B — /products/... trên Vercel (ổn định lâu dài)</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5">
            <li>
              Mở{" "}
              <a
                className="text-primary underline underline-offset-2"
                href="https://github.com/trixd2026-max/vuoncuamit/tree/main/public/products"
                target="_blank"
                rel="noreferrer"
              >
                GitHub · public/products
              </a>
              .
            </li>
            <li>
              <strong>Add file → Upload files</strong> → kéo ảnh (vd. <code>mang-cau.jpg</code>) → Commit
              vào <code>main</code>.
            </li>
            <li>Đợi Vercel deploy ~1–2 phút.</li>
            <li>
              Cột <code className="text-foreground">hinh</code> ghi:{" "}
              <code className="text-foreground">/products/mang-cau.jpg</code> (đúng tên file, không dấu,
              không khoảng trắng).
            </li>
          </ol>
        </div>
      </div>

      <h3 className="mt-6 text-sm font-medium text-foreground">2. Dòng sản phẩm trên Google Sheet</h3>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
        <li>
          Thêm 1 dòng mới trên tab sản phẩm. Các cột tối thiểu:{" "}
          <code className="text-foreground">id</code>, <code className="text-foreground">ten</code>,{" "}
          <code className="text-foreground">danh_muc</code>, <code className="text-foreground">gia</code>,{" "}
          <code className="text-foreground">don_vi</code>, <code className="text-foreground">hinh</code>,{" "}
          <code className="text-foreground">con_hang</code>.
        </li>
        <li>
          <code>id</code>: không dấu, không trùng (vd. <code>mang-cau</code>).
        </li>
        <li>
          <code>danh_muc</code>: một trong{" "}
          <code>trai-cay-vuon</code> · <code>trai-cay-nhap</code> · <code>gio-trai-cay</code> ·{" "}
          <code>hop-qua</code> · <code>lang-hoa</code> · <code>trap-cuoi</code>.
        </li>
        <li>
          <code>con_hang</code> = <code>1</code> (còn bán). Tuỳ chọn: <code>ton_kho</code> = số lượng,{" "}
          <code>noi_bat</code> = <code>1</code>.
        </li>
      </ol>

      <h3 className="mt-6 text-sm font-medium text-foreground">3. Đồng bộ web</h3>
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
        <li>
          Bấm <strong>Lưu và đồng bộ</strong> bên dưới (hoặc F5 trang cửa hàng).
        </li>
        <li>
          Kiểm tra /cua-hang: thấy sản phẩm mới + ảnh. Nếu ảnh Drive không hiện → kiểm tra quyền chia sẻ
          “Bất kỳ ai có liên kết”.
        </li>
      </ol>

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
          <code>ALERT_EMAIL</code> = <code>trixd2026@gmail.com</code>.
        </li>
        <li>
          Apps Script: chọn <code>testSendAlertEmail</code> → Run → Cho phép Gmail.
        </li>
        <li>
          Email tự gửi khi đơn làm tồn về 0 hoặc ≤ 3.
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

      <h2 className="font-display mt-12 text-xl">Apps Script (đơn + trừ tồn + email)</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Copy mã → dán vào Apps Script (xóa code cũ) → Lưu → Deploy lại webhook.
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
