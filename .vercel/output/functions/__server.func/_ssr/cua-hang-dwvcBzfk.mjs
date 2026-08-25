import { i as __toESM } from "../_runtime.mjs";
import { t as CATEGORIES } from "./catalog-jodnuEUp.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Search } from "../_libs/lucide-react.mjs";
import { i as Route$7, o as useCatalog, x as cn } from "./router-8HaLVA_X.mjs";
import { t as ProductCard } from "./product-card-DLMGh7zJ.mjs";
import { t as Input } from "./input-BrcKONiG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cua-hang-dwvcBzfk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ShopPage() {
	const search = Route$7.useSearch();
	const navigate = Route$7.useNavigate();
	const products = useCatalog((s) => s.products);
	const warning = useCatalog((s) => s.warning);
	const source = useCatalog((s) => s.source);
	const [query, setQuery] = (0, import_react.useState)(search.q ?? "");
	const nhom = search.nhom ?? void 0;
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return products.filter((p) => {
			if (nhom && p.category !== nhom) return false;
			if (!q) return true;
			return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
		});
	}, [
		products,
		nhom,
		query
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: "Cửa hàng"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-1 text-4xl",
				children: "Trái cây & giỏ quà"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-muted-foreground",
				children: "Giá theo ngày. Đặt giỏ hoặc gọi chị Hằng để chọn trái đang ngon."
			}),
			source === "sheet" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-primary",
				children: "Đã đồng bộ từ Google Sheet"
			}) : warning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: warning
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-8 max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Tìm cam, giỏ 500K, tráp…",
					className: "pl-10"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-2 overflow-x-auto pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					active: !nhom,
					onClick: () => navigate({ search: { nhom: void 0 } }),
					children: "Tất cả"
				}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					active: nhom === c.id,
					onClick: () => navigate({ search: { nhom: c.id } }),
					children: c.label
				}, c.id))]
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-16 text-center text-sm text-muted-foreground",
				children: "Không có món khớp. Thử nhóm khác hoặc xóa từ khóa."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4",
				children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
			})
		]
	});
}
function FilterChip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-10 shrink-0 rounded-full px-4 text-sm", active ? "bg-primary text-primary-foreground" : "bg-card text-foreground"),
		children
	});
}
//#endregion
export { ShopPage as component };
