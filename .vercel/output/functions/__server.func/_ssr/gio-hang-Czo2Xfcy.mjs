import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as cartTotal, b as useCart, c as ProductImage, d as useCartReady, l as QtyControl, u as Button, v as formatVnd } from "./router-8HaLVA_X.mjs";
import { t as Skeleton } from "./skeleton-cOr9hq3l.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gio-hang-Czo2Xfcy.js
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const lines = useCart((s) => s.lines);
	const ready = useCartReady();
	const setQty = useCart((s) => s.setQty);
	const remove = useCart((s) => s.remove);
	const total = cartTotal(lines);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Giỏ hàng"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-8 h-28 w-full" })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl",
			children: "Giỏ hàng"
		}), lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-16 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Giỏ đang trống."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/cua-hang",
					children: "Chọn trái cây"
				})
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 flex flex-col gap-6",
				children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-4 border-b border-border pb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-24 overflow-hidden rounded-lg bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
							src: line.image,
							alt: line.name
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: line.name
							}),
							line.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: line.note
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm tabular-nums",
								children: [
									formatVnd(line.price),
									"/",
									line.unit
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyControl, {
									value: line.qty,
									onChange: (n) => setQty(line.id, n)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-sm text-muted-foreground",
									onClick: () => remove(line.id),
									children: "Xóa"
								})]
							})
						]
					})]
				}, line.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "Tổng"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-2xl tabular-nums",
					children: formatVnd(total)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "lg",
				className: "mt-6 w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/thanh-toan",
					children: "Đặt hàng"
				})
			})
		] })]
	});
}
//#endregion
export { CartPage as component };
