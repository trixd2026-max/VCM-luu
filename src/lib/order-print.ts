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

/** Mở cửa sổ in / Lưu PDF (trình duyệt) */
export function printOrderEstimate(input: PrintOrderInput) {
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
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
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
    Đây là phiếu tạm tính — giá & tồn có thể đổi theo ngày. Xác nhận với ${escapeHtml(SHOP.owner)}:
    Zalo/ĐT <strong>${escapeHtml(SHOP.phoneDisplay)}</strong>
  </p>
  <p class="no-print muted" style="margin-top:20px">
    <button onclick="window.print()" style="padding:10px 18px;font-size:14px;cursor:pointer;border-radius:8px;border:1px solid #ccc;background:#111;color:#fff">
      In / Lưu PDF
    </button>
  </p>
  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 250); };</script>
</body>
</html>`;

  const w = window.open("", "_blank", "noopener,noreferrer,width=800,height=900");
  if (!w) {
    return { ok: false as const, error: "Trình duyệt chặn cửa sổ in — hãy cho phép popup" };
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
  return { ok: true as const };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
