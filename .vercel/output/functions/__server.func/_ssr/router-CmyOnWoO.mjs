import { i as __toESM } from "../_runtime.mjs";
import { n as LOCAL_PRODUCTS, o as salePrice } from "./catalog-jodnuEUp.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, _ as createFileRoute, d as HeadContent, f as useRouterState, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as ShoppingBag, c as Phone, d as MapPin, h as Gift, i as Store, l as Minus, n as TriangleAlert, p as House, r as Trash2, s as Plus, t as X, u as Menu } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-C_uf36nf.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/format-6gjcjQBk.js
var useCart = create()(persist((set, get) => ({
	lines: [],
	add: (product, qty = 1, note) => {
		const id = note ? `${product.id}::${note.slice(0, 24)}` : product.id;
		if (get().lines.find((l) => l.id === id)) {
			set({ lines: get().lines.map((l) => l.id === id ? {
				...l,
				qty: l.qty + qty
			} : l) });
			return;
		}
		set({ lines: [...get().lines, {
			id,
			name: product.name,
			price: salePrice(product),
			unit: product.unit,
			image: product.image,
			qty,
			note
		}] });
	},
	addCustom: (line) => {
		const existing = get().lines.find((l) => l.id === line.id);
		const qty = line.qty ?? 1;
		if (existing) {
			set({ lines: get().lines.map((l) => l.id === line.id ? {
				...l,
				qty: l.qty + qty
			} : l) });
			return;
		}
		set({ lines: [...get().lines, {
			...line,
			qty
		}] });
	},
	setQty: (id, qty) => {
		if (qty <= 0) {
			set({ lines: get().lines.filter((l) => l.id !== id) });
			return;
		}
		set({ lines: get().lines.map((l) => l.id === id ? {
			...l,
			qty
		} : l) });
	},
	remove: (id) => set({ lines: get().lines.filter((l) => l.id !== id) }),
	clear: () => set({ lines: [] })
}), { name: "vcm-cart" }));
function cartCount(lines) {
	return lines.reduce((n, l) => n + l.qty, 0);
}
function cartTotal(lines) {
	return lines.reduce((n, l) => n + l.price * l.qty, 0);
}
function formatVnd(amount) {
	return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
}
function makeOrderId() {
	return `VCM-${(/* @__PURE__ */ new Date()).toISOString().slice(2, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/sheet-config-CYpJJ5IS.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var fetchCatalog = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("7a5050eda2559b025c1ba2eed69f9a15cab896a4ac764a470710f047649134d2"));
var submitSheetOrder = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("dcfe2a71ac1f33c3d0121e9f9651356c6c9efe1351f6aa7e6e7567511ac5f63e"));
var empty = {
	sheetId: "",
	csvUrl: "",
	gid: "0",
	sheetName: "SanPham",
	webhookUrl: ""
};
var useSheetConfig = create()(persist((set, get) => ({
	...empty,
	setConfig: (patch) => set(patch),
	connected: () => Boolean(get().sheetId.trim() || get().csvUrl.trim())
}), { name: "vcm-sheet" }));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-CmyOnWoO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var SHOP = {
	name: "Vườn Của Mít",
	tagline: "Trái cây vườn · Giỏ quà · Tráp cưới hỏi",
	owner: "Chị Hằng",
	phone: "0345662166",
	phoneDisplay: "0345 662 166",
	zalo: "https://zalo.me/0345662166",
	whatsapp: "https://wa.me/84345662166",
	whatsappNumber: "84345662166",
	address: "Thôn Phụng Sơn, xã Tuy Phước Đông, tỉnh Gia Lai",
	mapsUrl: "https://www.google.com/maps/search/?api=1&query=Th%C3%B4n%20Ph%E1%BB%A5ng%20S%C6%A1n%2C%20x%C3%A3%20Tuy%20Ph%C6%B0%E1%BB%9Bc%20%C4%90%C3%B4ng%2C%20t%E1%BB%89nh%20Gia%20Lai",
	hours: "Mở cửa mỗi ngày, 7:00 – 20:00",
	email: ""
};
var BASKET_TIERS = [
	3e5,
	4e5,
	5e5,
	1e6
];
var BASKET_OCCASIONS = [
	{
		id: "kinh-cung",
		label: "Kính cúng"
	},
	{
		id: "bieu-tang",
		label: "Biếu tặng"
	},
	{
		id: "sinh-nhat",
		label: "Sinh nhật"
	},
	{
		id: "tham-benh",
		label: "Thăm bệnh"
	},
	{
		id: "tet",
		label: "Tết / lễ"
	}
];
function useHydrated() {
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setHydrated(true), []);
	return hydrated;
}
/** Wait until the cart persist layer has read localStorage (or 100ms). */
function useCartReady() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const finish = () => setReady(true);
		if (useCart.persist.hasHydrated()) {
			finish();
			return;
		}
		const unsub = useCart.persist.onFinishHydration(finish);
		const t = window.setTimeout(finish, 120);
		return () => {
			unsub();
			window.clearTimeout(t);
		};
	}, []);
	return ready;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 active:not-disabled:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-accent",
			secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
			outline: "bg-transparent text-foreground shadow-[0_0_0_1px_rgba(28,38,31,0.16)] hover:bg-secondary",
			ghost: "hover:bg-secondary text-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5 text-base",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function QtyControl({ value, onChange, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("inline-flex h-11 items-center rounded-md bg-card shadow-[0_0_0_1px_rgba(28,38,31,0.12)]", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Giảm",
				className: "grid size-11 place-items-center text-foreground",
				onClick: () => onChange(Math.max(1, value - 1)),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "min-w-8 text-center text-sm tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Tăng",
				className: "grid size-11 place-items-center text-foreground",
				onClick: () => onChange(value + 1),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
			})
		]
	});
}
function ProductImage({ src, alt, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		className: cn("h-full w-full object-cover", className),
		loading: "lazy"
	});
}
function CartDrawer({ open, onClose }) {
	const lines = useCart((s) => s.lines);
	const setQty = useCart((s) => s.setQty);
	const remove = useCart((s) => s.remove);
	const count = cartCount(lines);
	const total = cartTotal(lines);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Đóng giỏ",
			className: "absolute inset-0 bg-foreground/40",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-card shadow-[0_0_0_1px_rgba(28,38,31,0.08),-16px_0_48px_rgba(28,38,31,0.12)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: "Giỏ hàng"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm text-muted-foreground tabular-nums",
								children: [
									"(",
									count,
									")"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Đóng",
						className: "grid size-11 place-items-center",
						onClick: onClose,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-0 flex-1 overflow-y-auto px-5",
					children: lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-16 text-center text-sm text-muted-foreground",
						children: "Chưa có món nào. Ghé cửa hàng chọn trái cây hoặc đặt giỏ quà."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "flex flex-col gap-5 py-2",
						children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-20 shrink-0 overflow-hidden rounded-md bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductImage, {
									src: line.image,
									alt: line.name
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-medium",
											children: line.name
										}),
										line.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: line.note
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-sm tabular-nums",
											children: [formatVnd(line.price), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: ["/", line.unit]
											})]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Xóa",
										className: "grid size-10 place-items-center text-muted-foreground",
										onClick: () => remove(line.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QtyControl, {
									className: "mt-2 h-9",
									value: line.qty,
									onChange: (n) => setQty(line.id, n)
								})]
							})]
						}, line.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "flex flex-col gap-3 border-t border-border px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Tạm tính"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium tabular-nums",
								children: formatVnd(total)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "h-12 w-full",
							disabled: lines.length === 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/thanh-toan",
								onClick: onClose,
								children: "Đặt hàng"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							className: "w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/gio-hang",
								onClick: onClose,
								children: "Xem giỏ hàng"
							})
						})
					]
				})
			]
		})]
	});
}
var NAV = [
	{
		to: "/cua-hang",
		label: "Cửa hàng"
	},
	{
		to: "/gio-trai-cay",
		label: "Giỏ quà"
	},
	{
		to: "/trap-cuoi-hoi",
		label: "Tráp cưới"
	},
	{
		to: "/lien-he",
		label: "Liên hệ"
	}
];
function SiteHeader() {
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const [cartOpen, setCartOpen] = (0, import_react.useState)(false);
	const lines = useCart((s) => s.lines);
	const count = useHydrated() ? cartCount(lines) : 0;
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-primary px-4 py-2 text-center text-xs text-primary-foreground sm:text-sm",
			children: [
				"Đặt giỏ từ 300.000đ · Gọi ",
				SHOP.owner,
				" ",
				SHOP.phoneDisplay
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex min-w-0 items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-9 place-items-center rounded-md bg-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeafMark, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display block truncate text-lg leading-none",
								children: SHOP.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-[11px] text-muted-foreground sm:block",
								children: SHOP.tagline
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden items-center gap-1 lg:flex",
						children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							className: cn("rounded-md px-3 py-2 text-sm transition-colors", pathname === item.to ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"),
							children: item.label
						}, item.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${SHOP.phone}`,
								className: "hidden h-11 items-center gap-2 rounded-md px-3 text-sm sm:inline-flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: SHOP.phoneDisplay
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-label": "Giỏ hàng",
								className: "relative grid size-11 place-items-center",
								onClick: () => setCartOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5" }), count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground tabular-nums",
									children: count
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": menuOpen ? "Đóng menu" : "Mở menu",
								className: "grid size-11 place-items-center lg:hidden",
								onClick: () => setMenuOpen((v) => !v),
								children: menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							})
						]
					})
				]
			}), menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex flex-col gap-1 border-t border-border px-4 py-3 lg:hidden",
				children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					className: "rounded-md px-3 py-3 text-sm",
					onClick: () => setMenuOpen(false),
					children: item.label
				}, item.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `tel:${SHOP.phone}`,
					className: "rounded-md px-3 py-3 text-sm",
					children: ["Gọi ", SHOP.phoneDisplay]
				})]
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {
			open: cartOpen,
			onClose: () => setCartOpen(false)
		})
	] });
}
function LeafMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: "size-5 fill-primary-foreground",
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ellipse", {
			cx: "12",
			cy: "14",
			rx: "6",
			ry: "7"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "11",
			y: "4",
			width: "2",
			height: "4",
			rx: "1"
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-16 border-t border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: SHOP.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-sm text-sm text-muted-foreground",
						children: "Trái cây vườn, nông sản sạch, giỏ kính cúng và tráp cưới hỏi. Gói tại chỗ, giao trong khu vực Tuy Phước Đông."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: "Liên hệ"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `tel:${SHOP.phone}`,
						className: "mt-3 flex items-center gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }),
							SHOP.owner,
							" · ",
							SHOP.phoneDisplay
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: SHOP.mapsUrl,
						target: "_blank",
						rel: "noreferrer",
						className: "mt-2 flex items-start gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 size-4 shrink-0" }), SHOP.address]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: SHOP.hours
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-wide text-muted-foreground uppercase",
					children: "Mục lục"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 flex flex-col gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cua-hang",
							children: "Cửa hàng"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/gio-trai-cay",
							children: "Đặt giỏ trái cây"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/trap-cuoi-hoi",
							children: "Tráp cưới hỏi"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/quan-ly",
							children: "Kết nối Google Sheet"
						}) })
					]
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "border-t border-border px-4 py-4 text-center text-xs text-muted-foreground",
			children: [SHOP.name, " · Thôn Phụng Sơn"]
		})]
	});
}
var TABS = [
	{
		to: "/",
		label: "Trang chủ",
		icon: House
	},
	{
		to: "/cua-hang",
		label: "Cửa hàng",
		icon: Store
	},
	{
		to: "/gio-trai-cay",
		label: "Giỏ quà",
		icon: Gift
	},
	{
		to: "/gio-hang",
		label: "Giỏ hàng",
		icon: ShoppingBag
	}
];
function MobileTabbar() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const lines = useCart((s) => s.lines);
	const count = useHydrated() ? cartCount(lines) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid grid-cols-4",
			children: TABS.map((tab) => {
				const active = tab.to === "/" ? pathname === "/" : pathname === tab.to || pathname.startsWith(`${tab.to}/`);
				const Icon = tab.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: tab.to,
					className: cn("relative flex h-14 flex-col items-center justify-center gap-0.5 text-[11px]", active ? "text-primary" : "text-muted-foreground"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }),
						tab.label,
						tab.to === "/gio-hang" && count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-1.5 right-6 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground tabular-nums",
							children: count
						}) : null
					]
				}) }, tab.to);
			})
		})
	});
}
var useCatalog = create((set, get) => ({
	products: LOCAL_PRODUCTS,
	source: "local",
	loading: false,
	loaded: false,
	load: async () => {
		if (get().loading) return;
		const cfg = useSheetConfig.getState();
		if (!Boolean(cfg.sheetId.trim() || cfg.csvUrl.trim())) {
			set({
				products: LOCAL_PRODUCTS,
				source: "local",
				loaded: true,
				warning: void 0
			});
			return;
		}
		set({ loading: true });
		try {
			const result = await fetchCatalog({ data: {
				sheetId: cfg.sheetId.trim() || void 0,
				csvUrl: cfg.csvUrl.trim() || void 0,
				gid: cfg.gid.trim() || void 0,
				sheetName: cfg.sheetName.trim() || void 0
			} });
			set({
				products: result.products,
				source: result.source,
				warning: result.warning,
				loading: false,
				loaded: true
			});
		} catch {
			set({
				products: LOCAL_PRODUCTS,
				source: "local",
				warning: "Không đồng bộ được Sheet, đang dùng bảng mẫu.",
				loading: false,
				loaded: true
			});
		}
	}
}));
function findProduct(products, id) {
	return products.find((p) => p.id === id);
}
function SiteShell({ children }) {
	const load = useCatalog((s) => s.load);
	const loaded = useCatalog((s) => s.loaded);
	(0, import_react.useEffect)(() => {
		if (!loaded) load();
	}, [load, loaded]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 pb-20 md:pb-0",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileTabbar, {})
		]
	});
}
function WhatsappFab() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: SHOP.whatsapp,
		target: "_blank",
		rel: "noreferrer",
		"aria-label": "Nhắn đặt hàng",
		className: "fixed right-4 bottom-20 z-30 hidden size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(28,38,31,0.2)] md:bottom-6 md:flex",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 24 24",
			className: "size-5 fill-current",
			"aria-hidden": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12.04 2c-5.46 0-9.91 4.4-9.91 9.83 0 1.73.46 3.43 1.33 4.92L2 22l5.42-1.42A10.05 10.05 0 0 0 12.04 22c5.46 0 9.91-4.4 9.91-9.83S17.5 2 12.04 2Zm5.72 14.07c-.24.67-1.4 1.24-1.93 1.32-.49.07-1.1.1-1.77-.11-.41-.13-.93-.3-1.6-.59-2.81-1.22-4.64-4.05-4.78-4.24-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09.99-2.38.26-.29.57-.36.76-.36h.55c.17 0 .41-.07.64.49.24.58.8 2 .87 2.14.07.14.12.31.02.5-.1.19-.14.31-.28.48-.14.17-.3.38-.42.51-.14.14-.29.29-.12.56.16.26.73 1.2 1.56 1.94 1.08.96 1.98 1.26 2.26 1.4.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.19-.28.38-.23.64-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.67-.17 1.34Z" })
		})
	});
}
var styles_default = "/assets/styles-YS34EjqX.css";
var APP_NAME = SHOP.name;
var Route$9 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: `${APP_NAME} — Trái cây vườn, giỏ quà, tráp cưới hỏi` },
			{
				name: "description",
				content: "Vườn Của Mít — trái cây, nông sản sạch, giỏ kính cúng và tráp cưới hỏi. Chị Hằng 0345 662 166, Thôn Phụng Sơn, Tuy Phước Đông, Gia Lai."
			},
			{
				name: "theme-color",
				content: "#2c5340"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "vi",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsappFab, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					position: "top-center",
					toastOptions: { className: "font-sans bg-card text-foreground border-border shadow-[0_8px_24px_rgba(28,38,31,0.12)]" }
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$8 = () => import("./routes-DbF9KGjf.mjs");
var Route$8 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./cua-hang-O2-t9g0U.mjs");
var Route$7 = createFileRoute("/cua-hang")({
	validateSearch: (s) => ({
		nhom: typeof s.nhom === "string" ? s.nhom : void 0,
		q: typeof s.q === "string" ? s.q : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./gio-hang-CTMvH2FD.mjs");
var Route$6 = createFileRoute("/gio-hang")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./gio-trai-cay-EFzv7bgI.mjs");
var Route$5 = createFileRoute("/gio-trai-cay")({
	validateSearch: (s) => ({ muc: typeof s.muc === "string" ? s.muc : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./lien-he-DD_je3D1.mjs");
var Route$4 = createFileRoute("/lien-he")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./quan-ly-1xbQ_TXQ.mjs");
var Route$3 = createFileRoute("/quan-ly")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./thanh-toan-DvtU8mks.mjs");
var Route$2 = createFileRoute("/thanh-toan")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./trap-cuoi-hoi-BVtRuv3h.mjs");
var Route$1 = createFileRoute("/trap-cuoi-hoi")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./san-pham._id-BU6rCqA8.mjs");
var Route = createFileRoute("/san-pham/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$8.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$9
	}),
	CuaHangRoute: Route$7.update({
		id: "/cua-hang",
		path: "/cua-hang",
		getParentRoute: () => Route$9
	}),
	GioHangRoute: Route$6.update({
		id: "/gio-hang",
		path: "/gio-hang",
		getParentRoute: () => Route$9
	}),
	GioTraiCayRoute: Route$5.update({
		id: "/gio-trai-cay",
		path: "/gio-trai-cay",
		getParentRoute: () => Route$9
	}),
	LienHeRoute: Route$4.update({
		id: "/lien-he",
		path: "/lien-he",
		getParentRoute: () => Route$9
	}),
	QuanLyRoute: Route$3.update({
		id: "/quan-ly",
		path: "/quan-ly",
		getParentRoute: () => Route$9
	}),
	ThanhToanRoute: Route$2.update({
		id: "/thanh-toan",
		path: "/thanh-toan",
		getParentRoute: () => Route$9
	}),
	TrapCuoiHoiRoute: Route$1.update({
		id: "/trap-cuoi-hoi",
		path: "/trap-cuoi-hoi",
		getParentRoute: () => Route$9
	}),
	SanPhamIdRoute: Route.update({
		id: "/san-pham/$id",
		path: "/san-pham/$id",
		getParentRoute: () => Route$9
	})
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { formatVnd as _, findProduct as a, cn as b, QtyControl as c, BASKET_OCCASIONS as d, BASKET_TIERS as f, cartTotal as g, useSheetConfig as h, Route$7 as i, Button as l, submitSheetOrder as m, Route as n, useCatalog as o, SHOP as p, Route$5 as r, ProductImage as s, router_exports as t, useCartReady as u, makeOrderId as v, useCart as y };
