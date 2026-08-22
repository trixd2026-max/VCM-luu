import { o as salePrice, r as categoryLabel } from "./catalog-jodnuEUp.mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as formatVnd, s as ProductImage, y as useCart } from "./router-CmyOnWoO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-CKNSeMau.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product }) {
	const add = useCart((s) => s.add);
	const price = salePrice(product);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/san-pham/$id",
			params: { id: product.id },
			className: "relative block overflow-hidden rounded-xl bg-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-portrait overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
					src: product.image,
					alt: product.name,
					className: "transition-transform duration-500 ease-out group-hover:scale-[1.03]"
				})
			}), !product.inStock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-3 left-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium",
				children: "Hết hàng"
			}) : product.featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground",
				children: "Đang bán chạy"
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-1 pt-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-wide text-muted-foreground uppercase",
					children: categoryLabel(product.category)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/san-pham/$id",
					params: { id: product.id },
					className: "font-display text-lg leading-snug text-foreground",
					children: product.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex items-end justify-between gap-2 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm tabular-nums",
						children: [formatVnd(price), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: ["/", product.unit]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !product.inStock,
						"aria-label": `Thêm ${product.name}`,
						className: "grid size-11 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-150 enabled:active:scale-[0.96] disabled:opacity-40",
						onClick: () => {
							add(product, 1);
							toast.success(`Đã thêm ${product.name}`);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
					})]
				})
			]
		})]
	});
}
//#endregion
export { ProductCard as t };
