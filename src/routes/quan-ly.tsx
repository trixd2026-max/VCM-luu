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
        Kết nối Google Sheet để sửa giá, thêm sản phẩm, ẩn hết hàng — web tự cập nhật.
        Mức giá trang <strong>Giỏ quà</strong> cũng lấy từ các dòng <code>gio-trai-cay</code> trên Sheet.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Nguồn hiện tại: {source === "sheet" ? "Google Sheet" : "bảng mẫu"}
        {warning ? ` · ${warning}` : ""}
      </p>

      <h2 className="font-display mt-10 text-xl">1. Kết nối bảng lần đầu</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>Bấm <strong>Tải CSV mẫu</strong> bên dưới (hoặc dùng bảng đang có).</li>
        <li>Mở Google Trang tính → Tệp → Nhập → tải file CSV lên (nếu tạo mới).</li>
        <li>
          Chia sẻ bảng: <strong>Bất kỳ ai có liên kết</strong> → quyền <strong>Người xem</strong>
          (bắt buộc, không thì web không đọc được).
        </li>
        <li>
          Copy <strong>Sheet ID</strong> trên thanh địa chỉ — đoạn giữa{" "}
          <code>/d/</code> và <code>/edit</code>.
        </li>
        <li>
          Điền <strong>Tên tab</strong> đúng với tab sản phẩm (vd.{" "}
          <code>san-pham-vuon-cua-mit</code>).
        </li>
        <li>Bấm <strong>Lưu và đồng bộ</strong> — dòng “Nguồn hiện tại” phải hiện Google Sheet.</li>
      </ol>

      <h2 className="font-display mt-10 text-xl">2. Cột trên Sheet (bắt buộc)</h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-border bg-card text-sm">
        <table className="w-full min-w-[28rem] text-left">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Cột</th>
              <th className="px-3 py-2 font-medium">Ý nghĩa</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">id</td>
              <td className="px-3 py-2">Mã duy nhất (vd. gc450, sau-rieng)</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">ten</td>
              <td className="px-3 py-2">Tên hiển thị</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">danh_muc</td>
              <td className="px-3 py-2">
                trai-cay-vuon · trai-cay-nhap · <strong className="text-foreground">gio-trai-cay</strong> ·
                hop-qua · lang-hoa · trap-cuoi
              </td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">gia</td>
              <td className="px-3 py-2">Số (vd. 450000) — không cần dấu chấm/phẩy</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">don_vi</td>
              <td className="px-3 py-2">kg · quả · giỏ · hộp · lẵng · set</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">mo_ta</td>
              <td className="px-3 py-2">Mô tả ngắn (tránh câu generic placeholder)</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">hinh</td>
              <td className="px-3 py-2">Đường dẫn ảnh (vd. /products/gio-gc450.jpg)</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">noi_bat</td>
              <td className="px-3 py-2">1 = nổi bật (ưu tiên làm mẫu mức giá Giỏ quà)</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">con_hang</td>
              <td className="px-3 py-2">1 = còn bán · 0 = ẩn / hết hàng</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-mono text-foreground">giam_gia</td>
              <td className="px-3 py-2">% giảm (0 nếu không giảm)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="font-display mt-10 text-xl">3. Đồng bộ Giỏ trái cây → Giỏ quà</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          Mọi dòng <code className="text-foreground">danh_muc = gio-trai-cay</code>,{" "}
          <code className="text-foreground">con_hang = 1</code> sẽ tạo <strong>một mức giá</strong> trên
          trang Giỏ quà (và khối “Mẫu giỏ gói sẵn” trang chủ).
        </li>
        <li>
          Cùng một <code>gia</code> → chỉ giữ một mức; ưu tiên dòng có{" "}
          <code className="text-foreground">noi_bat = 1</code> (ảnh + tên mẫu).
        </li>
        <li>
          Thêm mức mới: thêm 1 dòng (vd. id <code>gc300</code>, giá <code>300000</code>, danh_muc{" "}
          <code>gio-trai-cay</code>) → reload web, nút 300.000₫ xuất hiện.
        </li>
        <li>
          Ẩn mức: đặt <code>con_hang = 0</code> hoặc xóa dòng → mức biến mất khỏi Giỏ quà.
        </li>
        <li>
          Dòng placeholder (mô tả “Trao vị ngọt, gửi yêu thương” hoặc mã GC/GH lẻ 10K)
          bị bỏ qua, không hiện trên cửa hàng / Giỏ quà.
        </li>
      </ul>

      <h2 className="font-display mt-10 text-xl">4. Sau khi sửa Sheet</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>Lưu Google Sheet (Ctrl/Cmd + S).</li>
        <li>
          Vào <code>/quan-ly</code> → bấm <strong>Lưu và đồng bộ</strong>, hoặc reload trang cửa hàng /
          Giỏ quà.
        </li>
        <li>Kiểm tra dòng “Nguồn hiện tại: Google Sheet” (không còn cảnh báo).</li>
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

      <h2 className="font-display mt-12 text-xl">5. Nhận đơn vào Sheet (Apps Script)</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>Trong Google Sheet: Tiện ích → Apps Script.</li>
        <li>Xóa code mặc định, dán đoạn bên dưới → Lưu.</li>
        <li>
          Triển khai → Ứng dụng web → Quyền truy cập: <strong>Bất kỳ ai</strong> → Sao chép URL.
        </li>
        <li>Dán URL vào ô Webhook bên trên → Lưu và đồng bộ.</li>
      </ol>
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
