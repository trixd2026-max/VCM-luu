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
      // Bỏ URL /edit — chỉ nhận CSV export thật
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

  const basketCount = products.filter((p) => p.category === "gio-trai-cay" && p.inStock).length;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Chủ cửa hàng</p>
      <h1 className="font-display mt-1 text-4xl">Google Sheet</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Kết nối Google Sheet để sửa giá, thêm sản phẩm, ẩn hết hàng — web tự cập nhật.
        Mức giá trang <strong>Giỏ quà</strong> lấy từ các dòng <code>gio-trai-cay</code> còn hàng.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Nguồn hiện tại:{" "}
        {source === "sheet"
          ? `Google Sheet · ${products.length} SP · ${basketCount} giỏ trái cây`
          : "bảng mẫu"}
        {warning ? ` · ${warning}` : ""}
      </p>

      <h2 className="font-display mt-10 text-xl">1. Kết nối bảng lần đầu</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>Bấm <strong>Tải CSV mẫu</strong> bên dưới (hoặc dùng bảng đang có).</li>
        <li>Mở Google Trang tính → Tệp → Nhập → tải file CSV lên (nếu tạo mới).</li>
        <li>
          Chia sẻ bảng: <strong>Bất kỳ ai có liên kết</strong> → quyền <strong>Người xem</strong>
          (bắt buộc).
        </li>
        <li>
          Copy <strong>Sheet ID</strong> trên thanh địa chỉ — đoạn giữa <code>/d/</code> và{" "}
          <code>/edit</code>.
        </li>
        <li>
          Điền <strong>Tên tab</strong> đúng với tab sản phẩm (vd.{" "}
          <code>san-pham-vuon-cua-mit</code>).
        </li>
        <li>Bấm <strong>Lưu và đồng bộ</strong> — phải hiện “Google Sheet · … SP”.</li>
      </ol>

      <h2 className="font-display mt-10 text-xl">2. Cột trên Sheet</h2>
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
              <td className="px-3 py-2">Mã duy nhất (vd. gc450, gh900)</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">ten</td>
              <td className="px-3 py-2">Tên hiển thị</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">danh_muc</td>
              <td className="px-3 py-2">
                trai-cay-vuon · trai-cay-nhap ·{" "}
                <strong className="text-foreground">gio-trai-cay</strong> · hop-qua · lang-hoa ·
                trap-cuoi
              </td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">gia</td>
              <td className="px-3 py-2">Số nguyên (vd. 450000)</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">don_vi</td>
              <td className="px-3 py-2">kg · quả · giỏ · hộp · lẵng · set</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">mo_ta</td>
              <td className="px-3 py-2">Mô tả ngắn</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">hinh</td>
              <td className="px-3 py-2">
                Đường dẫn ảnh đúng chữ hoa/thường (vd. <code>/products/gio-GH900.jpg</code>)
              </td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">noi_bat</td>
              <td className="px-3 py-2">1 = nổi bật / ưu tiên mẫu Giỏ quà</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-3 py-2 font-mono text-foreground">con_hang</td>
              <td className="px-3 py-2">
                <strong className="text-foreground">1 = hiện trên web</strong> · 0 = ẩn
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-mono text-foreground">giam_gia</td>
              <td className="px-3 py-2">% giảm (0 nếu không)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="font-display mt-10 text-xl">3. Giỏ trái cây & Giỏ quà</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>
          <code className="text-foreground">con_hang = 1</code> → hiện ở Cửa hàng + tạo mức trên Giỏ
          quà.
        </li>
        <li>
          <code className="text-foreground">con_hang = 0</code> → ẩn hẳn (cách tắt món).
        </li>
        <li>
          Trùng giá → một mức trên Giỏ quà; ưu tiên dòng <code>noi_bat = 1</code>.
        </li>
        <li>
          Thêm giỏ mới: thêm dòng → Lưu Sheet → bấm <strong>Lưu và đồng bộ</strong> (hoặc F5).
        </li>
      </ul>

      <h2 className="font-display mt-10 text-xl">4. Sau khi sửa Sheet</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>Lưu Google Sheet.</li>
        <li>Vào trang này → <strong>Lưu và đồng bộ</strong>.</li>
        <li>Xem số SP / số giỏ phía trên — phải tăng đúng.</li>
        <li>
          Nếu vẫn cũ: xóa cache trình duyệt cho site (hoặc mở tab ẩn danh) rồi đồng bộ lại.
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
          <Field label="gid tab (tùy chọn)">
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

      <h2 className="font-display mt-12 text-xl">5. Nhận đơn vào Sheet</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
        <li>Google Sheet → Tiện ích → Apps Script.</li>
        <li>Dán mã bên dưới → Lưu.</li>
        <li>Triển khai → Ứng dụng web → Bất kỳ ai → copy URL vào Webhook.</li>
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
