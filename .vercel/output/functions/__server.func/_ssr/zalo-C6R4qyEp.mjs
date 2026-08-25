import { _ as cartTotal, m as SHOP, v as formatVnd } from "./router-8HaLVA_X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/zalo-C6R4qyEp.js
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
function openZalo() {
	window.open(SHOP.zalo, "_blank", "noopener,noreferrer");
}
async function copyZaloMessage(text) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}
async function copyAndOpenZalo(text) {
	openZalo();
	return copyZaloMessage(text);
}
//#endregion
export { copyAndOpenZalo as n, copyZaloMessage as r, buildOrderMessage as t };
