import { SHOP } from "./shop";
import { formatVnd } from "./format";
import type { CartLine } from "./cart";
import { cartTotal } from "./cart";

export function buildOrderMessage(input: {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  note: string;
  lines: CartLine[];
}) {
  const items = input.lines
    .map((l) => {
      const note = l.note ? ` (${l.note})` : "";
      return `- ${l.qty} ${l.unit} ${l.name}${note}: ${formatVnd(l.price * l.qty)}`;
    })
    .join("\n");
  const total = formatVnd(cartTotal(input.lines));
  return [
    `Xin chào ${SHOP.name},`,
    `Em muốn đặt đơn ${input.orderId}:`,
    "",
    items,
    "",
    `Tổng: ${total}`,
    `Tên: ${input.name}`,
    `SĐT: ${input.phone}`,
    input.address ? `Địa chỉ: ${input.address}` : "",
    input.note ? `Ghi chú: ${input.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function zaloHref() {
  return SHOP.zalo;
}

export function openZalo() {
  window.open(SHOP.zalo, "_blank", "noopener,noreferrer");
}

export async function copyZaloMessage(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function copyAndOpenZalo(text: string) {
  openZalo();
  return copyZaloMessage(text);
}
