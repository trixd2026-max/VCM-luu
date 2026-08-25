import { i as __toESM } from "../_runtime.mjs";
import { o as salePrice, r as categoryLabel } from "./catalog-jodnuEUp.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as findProduct, b as useCart, c as ProductImage, l as QtyControl, m as SHOP, n as Route, o as useCatalog, u as Button, v as formatVnd } from "./router-8HaLVA_X.mjs";
import { t as ProductCard } from "./product-card-DLMGh7zJ.mjs";
import { n as copyAndOpenZalo } from "./zalo-C6R4qyEp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/san-pham._id-DQ8Ixstx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const { id } = Route.useParams();
	const products = useCatalog((s) => s.products);
	const product = findProduct(products, id);
	const add = useCart((s) => s.add);
	const [qty, setQty] = (0, import_react.useState)(1);
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-xl px-4 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Không tìm thấy món này"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/cua-hang",
				children: "Về cửa hàng"
			})
		})]
	});
	const price = salePrice(product);
	const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
	const askText = `Chị ơi, em hỏi ${product.name} (${formatVnd(price)}/${product.unit}) còn hàng không ạ?`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/cua-hang",
						children: "Cửa hàng"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-2",
						children: "/"
					}),
					categoryLabel(product.category)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-10 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-2xl bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-portrait",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
							src: product.image,
							alt: product.name
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: categoryLabel(product.category)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display mt-2 text-4xl",
						children: product.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-2xl tabular-nums",
						children: [formatVnd(price), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-base text-muted-foreground",
							children: ["/", product.unit]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-prose text-muted-foreground",
						children: product.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyControl, {
							value: qty,
							onChange: setQty
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							disabled: !product.inStock,
							onClick: () => {
								add(product, qty);
								toast.success(`Đã thêm ${product.name}`);
							},
							children: "Thêm vào giỏ"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => {
								copyAndOpenZalo(askText).then((copied) => {
									if (copied) toast.message("Đã copy câu hỏi — dán vào Zalo");
								});
							},
							children: "Nhắn Zalo hỏi hàng"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${SHOP.phone}`,
								children: ["Gọi ", SHOP.phoneDisplay]
							})
						})]
					}),
					!product.inStock ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-destructive",
						children: "Tạm hết — gọi để đặt trước."
					}) : null
				] })]
			}),
			related.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Cùng nhóm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4",
					children: related.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
				})]
			}) : null
		]
	});
}
//#endregion
export { ProductPage as component };
