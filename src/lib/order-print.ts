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
        ? `<div style="color:#666;font-size:12px;margin-top:2px">${escapeHtml(l.note)}</div>`
        : "";
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;vertical-align:top">
          <strong>${escapeHtml(l.name)}</strong>${note}
        </td>
        <td style="padding:8px 4px;border-bottom:1px solid #eee;text-align:center;white-space:nowrap">${l.qty} ${escapeHtml(l.unit)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">${formatVnd(l.price * l.qty)}</td>
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
    @page { margin: 16mm; }
    body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #1a1a1a; max-width: 720px; margin: 0 auto; padding: 24px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    .muted { color: #666; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    .totals td { padding: 6px 0; }
    .grand { font-size: 18px; font-weight: 700; }
  </style>
</head>
<body>
  <p class="muted">${escapeHtml(SHOP.name)} · ${escapeHtml(SHOP.address)}</p>
  <h1>${escapeHtml(input.title ?? "Phiếu tạm tính")}</h1>
  <p class="muted">
    ${input.orderId ? `Mã: <strong>${escapeHtml(input.orderId)}</strong> · ` : ""}
    Lúc: ${escapeHtml(when)}
  </p>
  ${
    c?.name || c?.phone || c?.address
      ? `<p style="margin-top:12px;font-size:14px">
          ${c.name ? `<div><strong>Khách:</strong> ${escapeHtml(c.name)}</div>` : ""}
          ${c.phone ? `<div><strong>SĐT:</strong> ${escapeHtml(c.phone)}</div>` : ""}
          ${c.address ? `<div><strong>Địa chỉ:</strong> ${escapeHtml(c.address)}</div>` : ""}
        </p>`
      : ""
  }
  <table>
    <thead>
      <tr>
        <th style="text-align:left;padding-bottom:8px;border-bottom:2px solid #222">Món</th>
        <th style="text-align:center;padding-bottom:8px;border-bottom:2px solid #222">SL</th>
        <th style="text-align:right;padding-bottom:8px;border-bottom:2px solid #222">Thành tiền</th>
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
  <p class="muted" style="margin-top:24px">
    Phiếu tạm tính — xác nhận với ${escapeHtml(SHOP.owner)}: Zalo/ĐT
    <strong>${escapeHtml(SHOP.phoneDisplay)}</strong>
  </p>
</body>
</html>`;
  return printHtmlInFrame(html);
}

export function printDeliverySlip(input: DeliverySlipInput) {
  const when =
    input.time ||
    new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8"/>
  <title>Phiếu giao ${escapeHtml(input.orderId || "")}</title>
  <style>
    @page { size: A5; margin: 10mm; }
    body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #111; margin: 0; padding: 12px; }
    .slip { border: 2px solid #111; padding: 14px 16px; max-width: 420px; }
    .shop { font-size: 11px; color: #444; text-transform: uppercase; letter-spacing: 0.04em; }
    h1 { font-size: 18px; margin: 4px 0 8px; }
    .row { margin: 6px 0; font-size: 14px; }
    .label { color: #555; font-size: 11px; display: block; }
    .big { font-size: 16px; font-weight: 700; }
    .phone { font-size: 20px; font-weight: 700; letter-spacing: 0.02em; }
    .items { margin-top: 10px; padding-top: 8px; border-top: 1px dashed #999; font-size: 13px; white-space: pre-wrap; word-break: break-word; }
    .foot { margin-top: 14px; font-size: 11px; color: #555; display: flex; justify-content: space-between; gap: 8px; }
    .box { margin-top: 12px; border: 1px solid #ccc; height: 48px; }
  </style>
</head>
<body>
  <div class="slip">
    <div class="shop">${escapeHtml(SHOP.name)} · Phiếu giao</div>
    <h1>${escapeHtml(input.orderId || "Đơn hàng")}</h1>
    <div class="row"><span class="label">Thời gian</span>${escapeHtml(when)}</div>
    <div class="row"><span class="label">Người nhận</span><span class="big">${escapeHtml(input.name || "—")}</span></div>
    <div class="row"><span class="label">SĐT</span><span class="phone">${escapeHtml(input.phone || "—")}</span></div>
    <div class="row"><span class="label">Địa chỉ giao</span>${escapeHtml(input.address || "—")}</div>
    <div class="items"><span class="label">Món</span>${escapeHtml(input.items || "—")}</div>
    ${input.total ? `<div class="row" style="margin-top:10px"><span class="label">Tổng</span><span class="big">${escapeHtml(input.total)}</span></div>` : ""}
    ${input.note ? `<div class="row"><span class="label">Ghi chú</span>${escapeHtml(input.note)}</div>` : ""}
    <div class="foot">
      <span>Shop: ${escapeHtml(SHOP.phoneDisplay)}</span>
      <span>Ký nhận</span>
    </div>
    <div class="box"></div>
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
