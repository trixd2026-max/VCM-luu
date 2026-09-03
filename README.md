# Vườn Của Mít

Webapp bán trái cây vườn, giỏ quà, tráp cưới hỏi và hoa viếng tại **Thôn Phụng Sơn, xã Tuy Phước Đông, tỉnh Gia Lai**.

- **Live**: https://vuoncuamit-luu.vercel.app
- **Admin**: https://vuoncuamit-luu.vercel.app/quan-ly
- **Chủ shop**: Chị Hằng · Zalo/SĐT `0345 662 166` · `0942 223 984`

## Google Sheet & Apps Script (cấu hình hiện tại)

| Mục | Giá trị |
|-----|--------|
| **Sheet** | https://docs.google.com/spreadsheets/d/1jsAZvVDgr-ju-WPi6izYcslKQA2DCvKLMnwMS14eam4/edit?gid=1069887904#gid=1069887904 |
| **Sheet ID** | `1jsAZvVDgr-ju-WPi6izYcslKQA2DCvKLMnwMS14eam4` |
| **gid tab SP** | `1069887904` |
| **Tên tab SP** | `san-pham-vuon-cua-mit` |
| **Tab đơn** | `DonHang` |
| **Apps Script (edit)** | https://script.google.com/u/0/home/projects/1LOfAA6goLw2Z04Xd-a9MeN7qR6vwRa4OPTzm8OD82kYOAALiu8hnN519/edit |
| **Webhook** | URL **Web App** sau Deploy (`…/macros/s/…/exec`) — dán vào `/quan-ly` |

> **Lưu ý:** Link edit project ≠ webhook. Webhook chỉ có sau khi **Deploy → New deployment → Web app** (Execute as: Me, Who has access: Anyone).

### Setup Apps Script trên Sheet mới

1. Mở Sheet mới → **Extensions → Apps Script** (hoặc project link trên).
2. Dán toàn bộ code từ `public/apps-script.gs` → Save.
3. **Deploy → New deployment → Type: Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Copy URL dạng `https://script.google.com/macros/s/AKfycb…/exec`
5. Vào https://vuoncuamit-luu.vercel.app/quan-ly (PIN `662166`) → dán **Sheet ID** + **Webhook** → **Lưu cấu hình**.
6. (Tuỳ chọn) Trong Sheet: menu **Vườn Của Mít** → *1. Thiết lập Sheet*.
7. Sheet phải **chia sẻ: Anyone with the link can view** để web đọc CSV.

Nếu trình duyệt đã lưu cấu hình cũ (localStorage `vcm-sheet`), vào `/quan-ly` sửa lại Sheet ID / webhook rồi Lưu.

## Tính năng chính

| Tính năng | Mô tả |
|-----------|--------|
| Cửa hàng | Catalog theo danh mục (trái cây vườn / nhập, giỏ, hộp quà, lẵng hoa, tráp cưới) |
| Đồng bộ Sheet | Giá, tồn kho, nổi bật đọc từ Google Sheet |
| Giỏ hàng | Zustand + localStorage |
| Đặt hàng | Form giao/nhận → webhook Apps Script + copy tin Zalo |
| Tra cứu đơn | Theo số điện thoại |
| Admin `/quan-ly` | PIN, cấu hình Sheet/webhook, log đơn, đổi trạng thái, in phiếu giao |
| Tồn kho | Apps Script trừ `ton_kho`, email cảnh báo |

## Tech stack

- React 19 + TanStack Start / Router + Vite 8
- Tailwind CSS 4, Radix UI, Zustand
- Google Sheets + Apps Script webhook
- Deploy: Vercel

## Setup dev

```bash
npm install
npm run dev          # http://0.0.0.0:8080
npm run build
npm run typecheck
```

Cấu hình mặc định: `src/lib/sheet-config.ts`.

## Admin PIN

- Mặc định: `662166` — nên đổi sau khi vào.
- Session 12 giờ (`sessionStorage`).

## Kiểm tra đồng bộ đã xác nhận

- Sheet mới **public read CSV OK** (HTTP 200, header `id,ten,danh_muc,...`, ~170+ dòng SP).
- Ảnh local dạng `/products/SAU-RIENG.jpg` khớp file trong `public/products/`.
- Script `public/apps-script.gs` dùng `getActiveSpreadsheet()` — **phải gắn (bound) với Sheet mới** hoặc container đúng spreadsheet.

---
*Cập nhật Sheet ID + hướng dẫn Apps Script project mới — 2026-09-03.*
