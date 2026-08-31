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

/** Ghi đơn + trừ ton_kho + tắt con_hang khi hết */
const SCRIPT = `function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const data = JSON.parse(e.postData.contents);

  // 1) Ghi đơn
  let orders = ss.getSheetByName("DonHang");
  if (!orders) {
    orders = ss.insertSheet("DonHang");
    orders.appendRow(["ThoiGian","MaDon","Ten","DienThoai","DiaChi","GhiChu","TongTien","ChiTiet","Loai"]);
  }
  orders.appendRow([
    new Date(), data.orderId, data.name, data.phone, data.address,
    data.note, data.total, data.items, data.type
  ]);

  // 2) Trừ tồn kho (cột ton_kho trên tab sản phẩm)
  try {
    if (data.itemsJson) {
      const lines = JSON.parse(data.itemsJson);
      const productSheet = findProductSheet_(ss);
      if (productSheet) decrementStock_(productSheet, lines);
    }
  } catch (err) {
    // Không chặn ghi đơn nếu trừ tồn lỗi
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function findProductSheet_(ss) {
  const names = ["san-pham-vuon-cua-mit", "SanPham", "Sản phẩm", "sanpham"];
  for (var i = 0; i < names.length; i++) {
    var sh = ss.getSheetByName(names[i]);
    if (sh) return sh;
  }
  // Fallback: sheet đầu tiên có cột id + ton_kho
  var sheets = ss.getSheets();
  for (var j = 0; j < sheets.length; j++) {
    var h = sheets[j].getRange(1, 1, 1, sheets[j].getLastColumn()).getValues()[0];
    var lower = h.map(function(x) { return String(x).toLowerCase().trim(); });
    if (lower.indexOf("id") >= 0 && (lower.indexOf("ton_kho") >= 0 || lower.indexOf("con_hang") >= 0)) {
      return sheets[j];
    }
  }
  return null;
}

function decrementStock_(sheet, lines) {
  var lastCol = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) {
    return String(h).toLowerCase().trim().replace(/\s+/g, "_");
  });
  var idCol = headers.indexOf("id");
  if (idCol < 0) idCol = headers.indexOf("ma");
  var stockCol = headers.indexOf("ton_kho");
  if (stockCol < 0) stockCol = headers.indexOf("tonkho");
  var inStockCol = headers.indexOf("con_hang");
  if (idCol < 0) return;

  var data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  var idToRow = {};
  for (var r = 0; r < data.length; r++) {
    idToRow[String(data[r][idCol]).trim()] = r;
  }

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var pid = String(line.productId || "").trim();
    var qty = Number(line.qty) || 0;
    if (!pid || qty <= 0) continue;
    var idx = idToRow[pid];
    if (idx === undefined) continue;

    if (stockCol >= 0) {
      var cell = data[idx][stockCol];
      if (cell === "" || cell === null) continue; // không theo dõi số
      var cur = Number(cell);
      if (!isFinite(cur)) continue;
      var next = Math.max(0, cur - qty);
      data[idx][stockCol] = next;
      sheet.getRange(idx + 2, stockCol + 1).setValue(next);
      if (next <= 0 && inStockCol >= 0) {
        sheet.getRange(idx + 2, inStockCol + 1).setValue(0);
      }
    }
  }
}`;

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
        <code>ton_kho</code> và tắt <code>con_hang</code> nếu hết.
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
          Điền số (vd. <code>10</code>). <strong>Để trống</strong> = không giới hạn số lượng (chỉ dùng{" "}
          <code>con_hang</code>).
        </li>
        <li>
          Khi <code>ton_kho = 0</code> → web hiện <strong>Hết hàng</strong> (và tự set{" "}
          <code>con_hang = 0</code> sau đơn).
        </li>
        <li>
          Cập nhật mã Apps Script bên dưới (Triển khai lại webhook) để trừ tồn khi có đơn.
        </li>
        <li>
          Sau mỗi đơn: mở Sheet kiểm tra <code>ton_kho</code> đã giảm → F5 / Lưu và đồng bộ trên web.
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

      <h2 className="font-display mt-12 text-xl">Apps Script (đơn + trừ tồn)</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Tiện ích → Apps Script → dán toàn bộ → Lưu → Triển khai → Ứng dụng web → Bất kỳ ai → copy URL
        vào Webhook.
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
