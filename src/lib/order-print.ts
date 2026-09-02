import { SHOP } from "./shop";
import { formatVnd } from "./format";
import type { CartLine } from "./cart";
import { cartTotal } from "./cart";

export type PrintOrderInput = {
  title?: string;
  orderId?: string;
  lines: CartLine[];
  shippingFee?: number;
  shippingLabel?: string;
  customer?: {
    name?: string;
    phone?: string;
    address?: string;
    note?: string;
  };
  extraNote?: string;
};

export type DeliverySlipInput = {
  orderId?: string;
  time?: string;
  name: string;
  phone: string;
  address: string;
  items: string;
  total?: string;
  note?: string;
};

const FRAME_ID = "vcm-print-frame";

function printHtmlInFrame(html: string) {
  if (typeof document === "undefined") {
    return { ok: false as const, error: "Chỉ in được trên trình duyệt" };
  }
  let iframe = document.getElementById(FRAME_ID) as HTMLIFrameElement | null;
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = FRAME_ID;
    iframe.setAttribute("title", "In");
    iframe.style.cssText =
      "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;";
    document.body.appendChild(iframe);
  }
  const win = iframe.contentWindow;
  const doc = iframe.contentDocument || win?.document;
  if (!win || !doc) {
    return { ok: false as const, error: "Không tạo được khung in" };
  }
  doc.open();
  doc.write(html);
  doc.close();
  const doPrint = () => {
    try {
      win.focus();
      win.print();
    } catch {
      /* ignore */
    }
  };
  setTimeout(doPrint, 150);
  return { ok: true as const };
}

export function printOrderEstimate(input: PrintOrderInput) {
  if (!input.lines.length) {
    return { ok: false as const, error: "Chưa có món để in" };
  }
  const subtotal = cartTotal(input.lines);
  const ship = input.shippingFee ?? 0;
  const grand = subtotal + ship;
  const when = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const linesHtml = input.lines
    .map((l) => {
      const note = l.note
        ? `<div style="color:#555;font-size:11px;margin-top:2px">${escapeHtml(l.note)}</div>`
        : "";
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #e5e5e5;vertical-align:top">
          <strong>${escapeHtml(l.name)}</strong>${note}
        </td>
        <td style="padding:8px 6px;border-bottom:1px solid #e5e5e5;text-align:center;white-space:nowrap">${l.qty} ${escapeHtml(l.unit)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e5e5e5;text-align:right;white-space:nowrap">${formatVnd(l.price * l.qty)}</td>
      </tr>`;
    })
    .join("");
  const c = input.customer;
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8"/>
  <title>${escapeHtml(input.title ?? "Tạm tính đơn")} — ${escapeHtml(SHOP.name)}</title>
  <style>
    @page { margin: 14mm; }
    body { font-family: "Segoe UI", system-ui, -apple-system, Roboto, sans-serif; color: #1a1a1a; max-width: 720px; margin: 0 auto; padding: 20px; }
    .brand { font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: #3d5a3d; font-weight: 600; }
    h1 { font-size: 22px; margin: 6px 0 4px; font-weight: 700; }
    .muted { color: #666; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; }
    th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #555; padding-bottom: 8px; border-bottom: 2px solid #222; }
    .totals td { padding: 5px 0; font-size: 14px; }
    .grand td { font-size: 17px; font-weight: 700; padding-top: 8px; border-top: 1px solid #ccc; }
  </style>
</head>
<body>
  <div class="brand">${escapeHtml(SHOP.name)}</div>
  <h1>${escapeHtml(input.title ?? "Phiếu tạm tính")}</h1>
  <p class="muted">${escapeHtml(SHOP.address)}</p>
  <p class="muted">
    ${input.orderId ? `Mã: <strong>${escapeHtml(input.orderId)}</strong> · ` : ""}
    ${escapeHtml(when)}
  </p>
  ${
    c?.name || c?.phone || c?.address
      ? `<p style="margin-top:12px;font-size:14px;line-height:1.5">
          ${c.name ? `<div><strong>Khách:</strong> ${escapeHtml(c.name)}</div>` : ""}
          ${c.phone ? `<div><strong>SĐT:</strong> ${escapeHtml(c.phone)}</div>` : ""}
          ${c.address ? `<div><strong>Địa chỉ:</strong> ${escapeHtml(c.address)}</div>` : ""}
        </p>`
      : ""
  }
  <table>
    <thead>
      <tr>
        <th style="text-align:left">Món</th>
        <th style="text-align:center">SL</th>
        <th style="text-align:right">Thành tiền</th>
      </tr>
    </thead>
    <tbody>${linesHtml}</tbody>
  </table>
  <table class="totals" style="margin-top:12px">
    <tr><td>Tiền hàng</td><td style="text-align:right">${formatVnd(subtotal)}</td></tr>
    ${
      input.shippingLabel
        ? `<tr><td>Ship · ${escapeHtml(input.shippingLabel)}</td><td style="text-align:right">${
            ship > 0 ? formatVnd(ship) : "0đ / thỏa thuận"
          }</td></tr>`
        : ""
    }
    <tr class="grand"><td>Tổng tạm tính</td><td style="text-align:right">${formatVnd(grand)}</td></tr>
  </table>
  ${
    input.extraNote || c?.note
      ? `<p style="margin-top:16px;font-size:13px"><strong>Ghi chú:</strong><br/>${escapeHtml(
          [input.extraNote, c?.note].filter(Boolean).join("\n"),
        ).replace(/\n/g, "<br/>")}</p>`
      : ""
  }
  <p class="muted" style="margin-top:22px">
    Phiếu tạm tính — xác nhận với ${escapeHtml(SHOP.owner)}:
    Zalo/ĐT <strong>${escapeHtml(SHOP.phoneDisplay)}</strong>
  </p>
</body>
</html>`;
  return printHtmlInFrame(html);
}

/** Phiếu giao / tem — tối ưu đọc khi ship (A5) */
export function printDeliverySlip(input: DeliverySlipInput) {
  const when =
    input.time ||
    new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const orderId = input.orderId || "—";
  const name = input.name || "Khách";
  const phone = input.phone || "—";
  const address = input.address || "—";
  const items = input.items || "—";
  const total = input.total || "";
  const note = input.note || "";

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8"/>
  <title>Phiếu giao ${escapeHtml(orderId)}</title>
  <style>
    @page { size: A5 portrait; margin: 8mm; }
    * { box-sizing: border-box; }
    body {
      font-family: "Segoe UI", system-ui, -apple-system, Roboto, sans-serif;
      color: #142018;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .slip {
      border: 2px solid #1c2e1c;
      border-radius: 6px;
      max-width: 148mm;
      margin: 0 auto;
      overflow: hidden;
    }
    .head {
      background: #1c2e1c;
      color: #f5f7f2;
      padding: 10px 14px 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
    }
    .head-brand {
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.85;
    }
    .head-title {
      font-size: 18px;
      font-weight: 700;
      margin-top: 2px;
    }
    .head-id {
      text-align: right;
      font-size: 12px;
      line-height: 1.35;
    }
    .head-id strong {
      display: block;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .body { padding: 12px 14px 14px; }
    .section { margin-bottom: 10px; }
    .label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #5a6b5a;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .name {
      font-size: 17px;
      font-weight: 700;
      line-height: 1.25;
    }
    .phone {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.03em;
      line-height: 1.2;
      margin-top: 2px;
    }
    .address {
      font-size: 14px;
      line-height: 1.4;
      font-weight: 500;
    }
    .items {
      border: 1px dashed #9aab9a;
      border-radius: 4px;
      padding: 8px 10px;
      font-size: 13px;
      line-height: 1.45;
      white-space: pre-wrap;
      word-break: break-word;
      min-height: 48px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-top: 10px;
      padding-top: 8px;
      border-top: 2px solid #1c2e1c;
    }
    .total-row .label { margin: 0; }
    .total-value {
      font-size: 18px;
      font-weight: 800;
    }
    .note {
      margin-top: 8px;
      font-size: 12px;
      line-height: 1.4;
      color: #333;
      background: #fff8e8;
      border-left: 3px solid #c9a227;
      padding: 6px 8px;
    }
    .signs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 14px;
    }
    .sign {
      border: 1px solid #b8c4b8;
      border-radius: 4px;
      min-height: 56px;
      padding: 6px 8px;
    }
    .sign .label { margin-bottom: 4px; }
    .foot {
      margin-top: 10px;
      font-size: 10px;
      color: #5a6b5a;
      display: flex;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    .badge {
      display: inline-block;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border: 1px solid #f5f7f2;
      padding: 2px 6px;
      border-radius: 999px;
      opacity: 0.9;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="slip">
    <div class="head">
      <div>
        <div class="head-brand">${escapeHtml(SHOP.name)}</div>
        <div class="head-title">Phiếu giao hàng</div>
        <span class="badge">Giao tận nơi</span>
      </div>
      <div class="head-id">
        <span style="opacity:0.8">Mã đơn</span>
        <strong>${escapeHtml(orderId)}</strong>
        <span style="opacity:0.75;font-size:11px">${escapeHtml(when)}</span>
      </div>
    </div>
    <div class="body">
      <div class="section">
        <div class="label">Người nhận</div>
        <div class="name">${escapeHtml(name)}</div>
        <div class="phone">${escapeHtml(phone)}</div>
      </div>
      <div class="section">
        <div class="label">Địa chỉ giao</div>
        <div class="address">${escapeHtml(address)}</div>
      </div>
      <div class="section">
        <div class="label">Nội dung đơn</div>
        <div class="items">${escapeHtml(items)}</div>
      </div>
      ${
        total
          ? `<div class="total-row">
              <span class="label">Thu / tổng</span>
              <span class="total-value">${escapeHtml(total)}</span>
            </div>`
          : ""
      }
      ${
        note
          ? `<div class="note"><strong>Ghi chú:</strong> ${escapeHtml(note)}</div>`
          : ""
      }
      <div class="signs">
        <div class="sign">
          <div class="label">Người giao</div>
        </div>
        <div class="sign">
          <div class="label">Người nhận ký</div>
        </div>
      </div>
      <div class="foot">
        <span>${escapeHtml(SHOP.owner)} · ${escapeHtml(SHOP.phoneDisplay)}</span>
        <span>${escapeHtml(SHOP.address)}</span>
      </div>
    </div>
  </div>
</body>
</html>`;
  return printHtmlInFrame(html);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
