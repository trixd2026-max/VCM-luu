import { _ as formatVnd, g as cartTotal, p as SHOP } from "./router-CmyOnWoO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/whatsapp-DiYLkktO.js
function buildOrderMessage(input) {
	const items = input.lines.map((l) => {
		const note = l.note ? ` (${l.note})` : "";
		return `- ${l.qty} ${l.unit} ${l.name}${note}: ${formatVnd(l.price * l.qty)}`;
	}).join("\n");
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
		input.note ? `Ghi chú: ${input.note}` : ""
	].filter(Boolean).join("\n");
}
function whatsappHref(text) {
	return `${SHOP.whatsapp}?text=${encodeURIComponent(text)}`;
}
//#endregion
export { whatsappHref as n, buildOrderMessage as t };
