# Vườn Của Mít

Webapp bán trái cây vườn, giỏ quà, tráp cưới hỏi và hoa viếng tại **Thôn Phụng Sơn, xã Tuy Phước Đông, tỉnh Gia Lai**.

- **Live**: https://vuoncuamit-luu.vercel.app
- **Admin**: https://vuoncuamit-luu.vercel.app/quan-ly
- **Chủ shop**: Chị Hằng · Zalo/SĐT `0345 662 166` · `0942 223 984`

## Tính năng chính

| Tính năng | Mô tả |
|-----------|--------|
| Cửa hàng | Catalog theo danh mục (trái cây vườn / nhập, giỏ, hộp quà, lẵng hoa, tráp cưới) |
| Đồng bộ Sheet | Giá, tồn kho, nổi bật đọc từ Google Sheet (CSV export hoặc Sheet ID) |
| Giỏ hàng | Zustand + localStorage, hỗ trợ ghi chú từng dòng |
| Đặt hàng | Form giao/nhận, khung giờ, ship theo khu vực → gửi webhook Apps Script + copy tin Zalo |
| Tra cứu đơn | Theo số điện thoại |
| Admin `/quan-ly` | PIN client-side, cấu hình Sheet/webhook, log đơn gần đây, đổi trạng thái, in phiếu giao, tải CSV mẫu |
| Tồn kho | Apps Script trừ `ton_kho`, cập nhật `con_hang`, email cảnh báo sắp hết / hết |
| Email | Đơn mới + tóm tắt cuối ngày (trigger 20:00) |

## Tech stack

- **Frontend**: React 19 + TanStack Start / Router + Vite 8
- **UI**: Tailwind CSS 4, Radix UI, Lucide, Sonner
- **State**: Zustand (cart, sheet config, catalog)
- **Backend dữ liệu**: Google Sheets + Google Apps Script (webhook `doPost`)
- **Deploy**: Vercel
- **Auth admin**: PIN lưu `localStorage` / session `sessionStorage` (mặc định `662166`)

## Cấu trúc thư mục quan trọng

```
src/
  routes/           # File-based routes (index, cua-hang, gio-hang, thanh-toan, quan-ly, ...)
  lib/
    catalog.ts      # Product type, LOCAL_PRODUCTS fallback, CSV parse
    catalog-store.ts
    sheet.ts        # fetch CSV / lookup orders / submit order / update status
    sheet-config.ts # Zustand persist Sheet ID, webhook, tab names
    admin-gate.ts   # PIN gate
    cart.ts, orders.ts, order-print.ts, zalo.ts, shop.ts
  components/
public/
  apps-script.gs    # Script deploy làm Web App (webhook + menu Sheet)
  products/         # Ảnh sản phẩm tĩnh
```

## Setup nhanh (dev)

```bash
npm install
npm run dev          # http://0.0.0.0:8080
npm run build        # vite build + migrate
npm run typecheck
```

Biến môi trường (nếu dùng): xem `scripts/with-app-env.mjs` và `.grok/app-env.json`.

## Google Sheet & Apps Script

1. Tạo Spreadsheet, tab sản phẩm (tên mặc định `san-pham-vuon-cua-mit`) với cột:
   - `id`, `ten`, `danh_muc`, `gia`, `don_vi`, `mo_ta`, `hinh`, `noi_bat`, `con_hang`, `giam_gia`, `ton_kho`
2. Tab đơn hàng `DonHang` (tự tạo bởi script nếu thiếu).
3. Copy nội dung `public/apps-script.gs` vào **Extensions → Apps Script** của Sheet.
4. Deploy **Web app** (Execute as: Me, Who has access: Anyone).
5. Dán URL deploy vào trang **Quản lý** → Webhook.
6. (Tuỳ chọn) Menu **Vườn Của Mít** trong Sheet: setup dropdown trạng thái, tô màu, email tóm tắt 20:00.
7. Chia sẻ Sheet **Anyone with the link can view** (hoặc publish CSV) để frontend đọc được.

Cấu hình mặc định nằm trong `src/lib/sheet-config.ts` (có thể override trên `/quan-ly`, lưu localStorage).

## Admin PIN

- Mặc định: `662166` (6 số cuối SĐT shop) — **hiển thị công khai trên UI**.
- Đổi PIN trong trang quản lý (lưu trên trình duyệt hiện tại).
- Session mở khóa 12 giờ (`sessionStorage`).

> **Lưu ý bảo mật**: Đây là bảo vệ client-side. Ai biết PIN (hoặc đọc source) đều vào được. Không dùng cho dữ liệu nhạy cảm lớn.

## Luồng đặt hàng

1. Khách thêm vào giỏ → `/thanh-toan`.
2. Điền SĐT, địa chỉ / tự lấy, ngày & khung giờ nhận.
3. Nút **Nhắn Zalo** hoặc **Gọi**:
   - Gọi webhook Apps Script → ghi `DonHang`, trừ tồn, gửi email.
   - Copy nội dung đơn → mở Zalo shop.
4. Trang `/dat-xong` + tra cứu theo SĐT.

## Phân tích & điểm cần lưu ý / “lỗi” tiềm ẩn

1. **PIN mặc định lộ trên giao diện** → nên ẩn sau lần đổi đầu tiên hoặc chỉ hiện trong README nội bộ.
2. **Cấu hình Sheet/webhook per-browser** (localStorage) → máy khác / clear data phải cấu hình lại.
3. **Webhook URL** nếu lộ có thể bị spam ghi đơn giả (nên thêm secret token đơn giản trong Apps Script).
4. **Không có server DB riêng** — phụ thuộc 100% Google (quota, downtime, CORS/CSV).
5. **Ảnh sản phẩm**: ưu tiên URL từ Sheet; fallback `/products/...`. Cần đảm bảo file tồn tại hoặc dùng link Drive public.
6. **Trạng thái đơn**: hỗ trợ `Mới` / `Moi` (không dấu) để tương thích.
7. **Không có README trước đây** → đã bổ sung file này.

Không phát hiện crash runtime rõ ràng trên các route chính khi đọc code; app ổn định cho quy mô shop nhỏ.

## Đề xuất tính năng / tool tối ưu tiếp theo

### Ưu tiên cao (ít effort, giá trị lớn)

| # | Tính năng | Lý do |
|---|-----------|--------|
| 1 | **Ẩn / bắt buộc đổi PIN** + không in PIN mặc định trên UI | Bảo mật tối thiểu |
| 2 | **Secret token** trên webhook Apps Script | Chống spam đơn giả |
| 3 | **QR chuyển khoản** (VietQR) trên trang xác nhận đơn | Thanh toán nhanh, ít nhầm |
| 4 | **Thông báo Zalo OA / Telegram bot** khi có đơn mới | Email dễ sót; Zalo là kênh chính |
| 5 | **Dashboard doanh thu / đơn theo ngày** trên `/quan-ly` | Chủ shop theo dõi nhanh |

### Trung hạn

- Upload ảnh sản phẩm (Cloudinary / Supabase Storage) thay vì chỉ URL Sheet.
- PWA (thêm vào màn hình chính, offline catalog cơ bản).
- In phiếu giao tối ưu mobile + barcode/QR mã đơn.
- Bộ lọc / tìm kiếm sản phẩm nâng cao + “Hôm nay ngon” tự động theo `noi_bat` + tồn.
- Lịch sử đơn phía khách (cookie / SĐT OTP nhẹ).

### Dài hạn / scale

- Chuyển catalog + đơn sang Postgres (đã có skeleton `db.ts` / migrations auth) thay Sheet khi đơn tăng.
- Auth thật (better-auth đã có trong deps) cho admin đa thiết bị.
- Tích hợp vận chuyển / COD tracking nếu mở rộng huyện.
- SEO: schema Product, Open Graph động theo sản phẩm.

## Scripts hữu ích

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run format
```

## Liên hệ & đóng góp

Repo: https://github.com/trixd2026-max/vuoncuamit-luu  
Shop: Zalo `0345662166` · Facebook page gắn trong footer site.

---

*README được tạo tự động sau khi audit code + live site. Cập nhật khi thay đổi cấu hình Sheet hoặc deploy mới.*
