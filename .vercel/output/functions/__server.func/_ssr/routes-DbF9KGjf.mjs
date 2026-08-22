import { t as CATEGORIES } from "./catalog-jodnuEUp.mjs";
import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as ArrowRight, c as Phone, f as Leaf, h as Gift, m as Heart } from "../_libs/lucide-react.mjs";
import { _ as formatVnd, f as BASKET_TIERS, l as Button, o as useCatalog, p as SHOP } from "./router-CmyOnWoO.mjs";
import { t as ProductCard } from "./product-card-CKNSeMau.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DbF9KGjf.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const featured = useCatalog((s) => s.products).filter((p) => p.featured).slice(0, 8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative isolate min-h-[72vh] overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/products/hero.jpg",
					alt: "Quầy trái cây Vườn Của Mít",
					className: "absolute inset-0 h-full w-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-foreground/10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-end px-4 py-16 sm:justify-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm tracking-[0.2em] text-primary-foreground/80 uppercase",
							children: "Thôn Phụng Sơn · Tuy Phước Đông"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display mt-3 max-w-xl text-5xl text-primary-foreground italic sm:text-6xl",
							children: SHOP.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-md text-base text-primary-foreground/90 sm:text-lg",
							children: "Trái cây hái tại vườn, gói thành giỏ kính cúng và tráp cưới hỏi."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/cua-hang",
									children: ["Xem cửa hàng", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								variant: "secondary",
								className: "bg-card/90 text-foreground hover:bg-card",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/gio-trai-cay",
									children: "Đặt giỏ quà"
								})
							})]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-b border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustItem, {
						icon: Leaf,
						title: "Hái trong ngày",
						text: "Cam, quýt, mít, thanh long từ vườn nhà."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustItem, {
						icon: Gift,
						title: "Gói giỏ từ 300K",
						text: "Kính cúng, biếu tặng, hộp quà, lẵng hoa."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustItem, {
						icon: Heart,
						title: "Tráp cưới hỏi",
						text: "Set 5 · 7 · 9 tráp, trao đổi lễ nghi."
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-wide text-muted-foreground uppercase",
					children: "Đang có"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-1 text-3xl",
					children: "Trái cây nổi bật"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/cua-hang",
					className: "hidden items-center gap-1 text-sm sm:inline-flex",
					children: ["Tất cả", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4",
				children: featured.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3",
				children: CATEGORIES.slice(0, 6).map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/cua-hang",
					search: { nhom: cat.id },
					className: "rounded-2xl bg-background p-6 shadow-[var(--shadow-border)] transition-transform duration-200 hover:-translate-y-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: cat.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: cat.blurb
					})]
				}, cat.id))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-wide text-muted-foreground uppercase",
					children: "Giỏ biếu · kính cúng"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display mt-1 text-3xl",
					children: "Bốn mức giá gói sẵn"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-muted-foreground",
					children: "Chọn mức, ghi dịp và lời nhắn — chị Hằng gói theo trái đang ngon trong ngày."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4",
					children: BASKET_TIERS.map((tier) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/gio-trai-cay",
						search: { muc: String(tier) },
						className: "rounded-2xl bg-card px-4 py-6 text-center shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl tabular-nums",
							children: formatVnd(tier)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Đặt giỏ này"
						})]
					}, tier))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-primary text-primary-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-2xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/products/mit.jpg",
						alt: "Mít tại vườn",
						className: "aspect-portrait w-full object-cover lg:aspect-wide"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.2em] uppercase opacity-70",
						children: "Câu chuyện vườn"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-2 text-4xl italic",
						children: "Từ vườn mít nhà mình"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-primary-foreground/85",
						children: "Vườn Của Mít lấy trái trong ngày: cam, quýt, bưởi, lê, xoài, thanh long và mít Thái. Có trái nhập — kiwi, táo, dưa hấu Kiều Farm — để gói giỏ cho đủ sắc. Giao tại Thôn Phụng Sơn, xã Tuy Phước Đông."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${SHOP.phone}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4" }),
									"Gọi ",
									SHOP.phoneDisplay
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							className: "border-0 text-primary-foreground shadow-[0_0_0_1px_rgba(246,241,232,0.35)] hover:bg-primary-foreground/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/lien-he",
								children: "Địa chỉ vườn"
							})
						})]
					})
				] })]
			})
		})
	] });
}
function TrustItem({ icon: Icon, title, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mt-0.5 size-5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-medium",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: text
		})] })]
	});
}
//#endregion
export { Home as component };
