import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as formatVnd, b as cn, d as BASKET_OCCASIONS, f as BASKET_TIERS, l as Button, o as useCatalog, r as Route$5, y as useCart } from "./router-CmyOnWoO.mjs";
import { t as Input } from "./input-BrcKONiG.mjs";
import { t as Textarea } from "./textarea-CFyTFpnH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gio-trai-cay-EFzv7bgI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BasketPage() {
	const search = Route$5.useSearch();
	const products = useCatalog((s) => s.products);
	const addCustom = useCart((s) => s.addCustom);
	const initial = Number(search.muc) || 3e5;
	const [tier, setTier] = (0, import_react.useState)(BASKET_TIERS.includes(initial) ? initial : 3e5);
	const [occasion, setOccasion] = (0, import_react.useState)("bieu-tang");
	const [picks, setPicks] = (0, import_react.useState)([]);
	const [message, setMessage] = (0, import_react.useState)("");
	const [when, setWhen] = (0, import_react.useState)("");
	const fruits = products.filter((p) => p.category === "trai-cay-vuon" || p.category === "trai-cay-nhap");
	function toggle(id) {
		setPicks((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	}
	function addBasket() {
		const occ = BASKET_OCCASIONS.find((o) => o.id === occasion)?.label ?? occasion;
		const names = fruits.filter((f) => picks.includes(f.id)).map((f) => f.name);
		const note = [
			occ,
			names.length ? `Ưu tiên: ${names.join(", ")}` : "Trái theo ngày",
			message,
			when ? `Giao: ${when}` : ""
		].filter(Boolean).join(" · ");
		addCustom({
			id: `gio-custom-${tier}-${Date.now()}`,
			name: `Giỏ trái cây ${formatVnd(tier)}`,
			price: tier,
			unit: "giỏ",
			image: "/products/gio.jpg",
			note
		});
		toast.success("Đã thêm giỏ vào hàng");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: "Dịch vụ gói"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-1 text-4xl",
				children: "Giỏ trái cây theo ý"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted-foreground",
				children: "Kính cúng, biếu tặng từ 300, 400, 500 nghìn đến 1 triệu đồng. Gói giấy kính, nơ, thiệp — giao đúng giờ nếu báo trước."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 overflow-hidden rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/products/gio.jpg",
					alt: "Giỏ trái cây",
					className: "aspect-video w-full object-cover"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-10 text-xl",
				children: "Chọn mức"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: BASKET_TIERS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTier(t),
					className: cn("h-14 rounded-xl text-sm tabular-nums", tier === t ? "bg-primary text-primary-foreground" : "bg-card"),
					children: formatVnd(t)
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-10 text-xl",
				children: "Dịp"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: BASKET_OCCASIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setOccasion(o.id),
					className: cn("h-11 rounded-full px-4 text-sm", occasion === o.id ? "bg-primary text-primary-foreground" : "bg-card"),
					children: o.label
				}, o.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-10 text-xl",
				children: "Ưu tiên trái (không bắt buộc)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: fruits.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => toggle(f.id),
					className: cn("h-10 rounded-full px-3 text-sm", picks.includes(f.id) ? "bg-primary text-primary-foreground" : "bg-card"),
					children: f.name
				}, f.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: when,
					onChange: (e) => setWhen(e.target.value),
					placeholder: "Ngày / giờ giao, ví dụ sáng mai 8h"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: message,
					onChange: (e) => setMessage(e.target.value),
					placeholder: "Lời thiệp: Chúc sức khỏe ông bà…"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "lg",
				className: "mt-6 w-full",
				onClick: addBasket,
				children: [
					"Thêm giỏ ",
					formatVnd(tier),
					" vào hàng"
				]
			})
		]
	});
}
//#endregion
export { BasketPage as component };
