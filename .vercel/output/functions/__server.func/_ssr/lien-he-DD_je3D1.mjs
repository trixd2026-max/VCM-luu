import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Phone, d as MapPin, g as Clock } from "../_libs/lucide-react.mjs";
import { l as Button, p as SHOP } from "./router-CmyOnWoO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lien-he-DD_je3D1.js
var import_jsx_runtime = require_jsx_runtime();
function ContactPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: "Ghé vườn"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-1 text-4xl",
				children: "Liên hệ"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-muted-foreground",
				children: [SHOP.owner, " nhận đặt giỏ, hộp quà và tráp cưới hỏi. Gọi hoặc nhắn trước khi ghé lấy hàng."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 overflow-hidden rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/products/cho.jpg",
					alt: "Trái cây tại vườn",
					className: "aspect-video w-full object-cover"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-8 flex flex-col gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mt-0.5 size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: SHOP.owner
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `tel:${SHOP.phone}`,
							className: "text-sm tabular-nums",
							children: SHOP.phoneDisplay
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "Địa chỉ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: SHOP.address
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mt-0.5 size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "Giờ mở"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: SHOP.hours
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3 sm:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `tel:${SHOP.phone}`,
							children: "Gọi ngay"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: SHOP.whatsapp,
							target: "_blank",
							rel: "noreferrer",
							children: "Nhắn WhatsApp"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						variant: "secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: SHOP.mapsUrl,
							target: "_blank",
							rel: "noreferrer",
							children: "Mở bản đồ"
						})
					})
				]
			})
		]
	});
}
//#endregion
export { ContactPage as component };
