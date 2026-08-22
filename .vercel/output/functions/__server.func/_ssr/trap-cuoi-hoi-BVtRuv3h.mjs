import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as Button, o as useCatalog, p as SHOP } from "./router-CmyOnWoO.mjs";
import { t as ProductCard } from "./product-card-CKNSeMau.mjs";
import { t as Input } from "./input-BrcKONiG.mjs";
import { t as Textarea } from "./textarea-CFyTFpnH.mjs";
import { n as whatsappHref } from "./whatsapp-DiYLkktO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trap-cuoi-hoi-BVtRuv3h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WeddingPage() {
	const trays = useCatalog((s) => s.products).filter((p) => p.category === "trap-cuoi");
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	function inquire() {
		if (!phone.trim()) {
			toast.error("Để lại số điện thoại nhé.");
			return;
		}
		const text = [
			`Chị Hằng ơi, em hỏi tráp cưới hỏi ạ.`,
			name ? `Tên: ${name}` : "",
			`SĐT: ${phone}`,
			date ? `Ngày lễ: ${date}` : "",
			note ? `Ghi chú: ${note}` : ""
		].filter(Boolean).join("\n");
		window.open(whatsappHref(text), "_blank", "noopener");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: "Lễ cưới hỏi"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-1 text-4xl",
				children: "Tráp cưới hỏi"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 max-w-2xl text-muted-foreground",
				children: [
					"Gói tráp theo lễ nghi miền Trung: trầu cau, trà rượu, bánh mứt, trái cây. Set 5, 7 hoặc 9 tráp — trao đổi màu vải, số lượng và ngày đón với ",
					SHOP.owner,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 overflow-hidden rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/products/lang-hoa.jpg",
					alt: "Hoa tươi cho lễ cưới hỏi",
					className: "aspect-video w-full object-cover"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-6 md:grid-cols-3",
				children: trays.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16 grid gap-8 rounded-2xl bg-card p-6 shadow-[var(--shadow-border)] lg:grid-cols-2 lg:p-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Đặt lịch tư vấn"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Nên báo trước 7 ngày. Có thể gửi mẫu ảnh tráp gia đình muốn theo."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Tên cô dâu / chú rể"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								inputMode: "tel",
								placeholder: "Số điện thoại"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: date,
								onChange: (e) => setDate(e.target.value),
								placeholder: "Ngày ăn hỏi / đón dâu"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: note,
								onChange: (e) => setNote(e.target.value),
								placeholder: "Số tráp, màu sắc, có heo quay không…"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2 sm:flex-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "lg",
									className: "flex-1",
									onClick: inquire,
									children: ["Nhắn ", SHOP.owner]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									variant: "outline",
									className: "flex-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: `tel:${SHOP.phone}`,
										children: ["Gọi ", SHOP.phoneDisplay]
									})
								})]
							})
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium",
						children: "Thường gồm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 flex flex-col gap-2 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Trầu cau, trà, rượu, thuốc" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Bánh mứt, kẹo, hạt" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Mâm trái cây theo mùa — cam, bưởi, nho, táo" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Hoa tươi phủ tráp, nơ" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Người hỗ trợ lễ đón (set 7 và 9)" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "ghost",
						className: "mt-6 px-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cua-hang",
							search: { nhom: "trap-cuoi" },
							children: "Xem các set tráp"
						})
					})
				] })]
			})
		]
	});
}
//#endregion
export { WeddingPage as component };
