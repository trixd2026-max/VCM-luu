import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as cartTotal, b as useCart, d as useCartReady, g as useSheetConfig, h as submitSheetOrder, m as SHOP, u as Button, v as formatVnd, y as makeOrderId } from "./router-8HaLVA_X.mjs";
import { t as Input } from "./input-BrcKONiG.mjs";
import { t as Skeleton } from "./skeleton-cOr9hq3l.mjs";
import { t as Textarea } from "./textarea-CFyTFpnH.mjs";
import { t as Label } from "./label-D9agDL_9.mjs";
import { r as copyZaloMessage, t as buildOrderMessage } from "./zalo-C6R4qyEp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/thanh-toan-aBxXXIDW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CheckoutPage() {
	const lines = useCart((s) => s.lines);
	const ready = useCartReady();
	const clear = useCart((s) => s.clear);
	const total = cartTotal(lines);
	const webhookUrl = useSheetConfig((s) => s.webhookUrl);
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-5xl px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Đặt hàng"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-8 h-40 w-full" })]
	});
	if (lines.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-xl px-4 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Chưa có món để đặt"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/cua-hang",
				children: "Về cửa hàng"
			})
		})]
	});
	async function placeOrder(via) {
		if (!phone.trim()) {
			toast.error("Nhập số điện thoại để cửa hàng liên hệ.");
			return;
		}
		setSending(true);
		const orderId = makeOrderId();
		const items = lines.map((l) => `${l.qty} ${l.unit} ${l.name}${l.note ? ` (${l.note})` : ""}`).join("; ");
		const payload = {
			orderId,
			name: name.trim() || "Khách",
			phone: phone.trim(),
			address: address.trim(),
			note: note.trim(),
			total,
			items,
			type: "don-hang",
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		if (via === "zalo") window.open(SHOP.zalo, "_blank", "noopener,noreferrer");
		if (webhookUrl.trim()) {
			const result = await submitSheetOrder({ data: {
				webhookUrl: webhookUrl.trim(),
				order: payload
			} });
			if (result.saved) toast.success("Đã ghi đơn vào Google Sheet");
			else if (result.error) toast.message("Đơn vẫn gửi được qua điện thoại", { description: result.error });
		}
		const message = buildOrderMessage({
			orderId,
			name: payload.name,
			phone: payload.phone,
			address: payload.address,
			note: payload.note,
			lines
		});
		clear();
		setSending(false);
		if (via === "call") {
			window.location.href = `tel:${SHOP.phone}`;
			navigate({ to: "/" });
			return;
		}
		if (await copyZaloMessage(message)) toast.success("Đã copy đơn — dán vào Zalo gửi chị Hằng");
		else toast.message("Mở Zalo và gửi đơn cho chị Hằng");
		navigate({ to: "/" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-5xl gap-10 px-4 py-10 lg:grid-cols-[1fr_20rem]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl",
				children: "Đặt hàng"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					"Gửi đơn qua Zalo cho ",
					SHOP.owner,
					". Thanh toán khi nhận, hoặc chuyển khoản sau khi xác nhận."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 flex flex-col gap-4",
				onSubmit: (e) => {
					e.preventDefault();
					placeOrder("zalo");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Họ tên",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Tên người nhận"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Số điện thoại",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							required: true,
							inputMode: "tel",
							value: phone,
							onChange: (e) => setPhone(e.target.value),
							placeholder: "09xx xxx xxx"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Địa chỉ giao",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: address,
							onChange: (e) => setAddress(e.target.value),
							placeholder: "Thôn, xã — để trống nếu tự lấy"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Ghi chú",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: "Giờ giao, lời thiệp, dị ứng…"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "lg",
							className: "flex-1",
							disabled: sending,
							children: "Nhắn Zalo đặt hàng"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "lg",
							variant: "outline",
							className: "flex-1",
							disabled: sending,
							onClick: () => void placeOrder("call"),
							children: ["Gọi ", SHOP.phoneDisplay]
						})]
					})
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "h-fit rounded-2xl bg-card p-5 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Đơn của bạn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 flex flex-col gap-2 text-sm",
					children: lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 truncate",
							children: [
								l.qty,
								"× ",
								l.name
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: formatVnd(l.price * l.qty)
						})]
					}, l.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex justify-between border-t border-border pt-3 font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tổng" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: formatVnd(total)
					})]
				})
			]
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { CheckoutPage as component };
