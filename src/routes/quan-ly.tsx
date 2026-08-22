import { useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSheetConfig } from "@/lib/sheet-config";
import { useCatalog } from "@/lib/catalog-store";
import { LOCAL_PRODUCTS, productsToCsv } from "@/lib/catalog";

export const Route = createFileRoute("/quan-ly")({ component: AdminPage });

const SCRIPT = `function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("DonHang");
  if (!sheet) {
    sheet = ss.insertSheet("DonHang");
    sheet.appendRow(["ThoiGian","MaDon","Ten","DienThoai","DiaChi","GhiChu","TongTien","ChiTiet","Loai"]);
  }
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(), data.orderId, data.name, data.phone, data.address,
    data.note, data.total, data.items, data.type
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

function AdminPage() {
  const cfg = useSheetConfig();
  const load = useCatalog((s) => s.load);
  const source = useCatalog((s) => s.source);
  const warning = useCatalog((s) => s.warning);
  const loading = useCatalog((s) => s.loading);
  const [sheetId, setSheetId] = useState(cfg.sheetId);
  const [csvUrl, setCsvUrl] = useState(cfg.csvUrl);
  const [sheetName, setSheetName] = useState(cfg.sheetName);
  const [gid, setGid] = useState(cfg.gid);
  const [webhookUrl, setWebhookUrl] = useState(cfg.webhookUrl);

  function save() {
    cfg.setConfig({ sheetId, csvUrl, sheetName, gid, webhookUrl });
    toast.success("Đã lưu cấu hình");
    void load();
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

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Chủ cửa hàng</p>
      <h1 className="font-display mt-1 text-4xl">Google Sheet</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Cửa hàng đang chạy bằng bảng mẫu. Kết nối Google Sheet để chị Hằng sửa giá,
        thêm trái, ẩn món hết hàng — web tự cập nhật.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Nguồn hiện tại: {source === "sheet" ? "Google Sheet" : "bảng mẫu"}
        {warning ? ` · ${warning}` : ""}
      </p>

      <ol className="mt-8 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>Tải file CSV mẫu, mở Google Trang tính → Tệp → Nhập.</li>
        <li>Chia sẻ: Bất kỳ ai có liên kết (người xem).</li>
        <li>Copy ID trên thanh địa chỉ (đoạn giữa /d/ và /edit).</li>
        <li>Đặt tên tab sản phẩm là SanPham (hoặc điền tên tab bên dưới).</li>
        <li>
          Để nhận đơn: Tiện ích → Apps Script, dán đoạn mã, Triển khai → Ứng dụng
          web → Quyền truy cập: Bất kỳ ai. Dán URL webhook.
        </li>
      </ol>

      <div className="mt-8 flex flex-col gap-4">
        <Field label="Mã bảng (Sheet ID)">
          <Input
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
            placeholder="1AbCDef..."
          />
        </Field>
        <Field label="Hoặc URL CSV đã xuất bản">
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
          <Field label="gid (nếu dùng export)">
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
          <Button size="lg" onClick={save} disabled={loading}>
            {loading ? "Đang đọc bảng…" : "Lưu và đồng bộ"}
          </Button>
          <Button size="lg" variant="outline" onClick={downloadCsv}>
            Tải CSV mẫu
          </Button>
        </div>
      </div>

      <h2 className="font-display mt-12 text-xl">Mã Apps Script</h2>
      <pre className="mt-3 overflow-x-auto rounded-xl bg-foreground p-4 text-xs leading-relaxed text-background">
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
