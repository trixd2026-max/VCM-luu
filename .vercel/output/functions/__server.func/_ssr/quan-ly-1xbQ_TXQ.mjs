import { i as __toESM } from "../_runtime.mjs";
import { a as productsToCsv, n as LOCAL_PRODUCTS } from "./catalog-jodnuEUp.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as useSheetConfig, l as Button, o as useCatalog } from "./router-CmyOnWoO.mjs";
import { t as Input } from "./input-BrcKONiG.mjs";
import { t as Label } from "./label-D9agDL_9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quan-ly-1xbQ_TXQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SCRIPT = `function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("DonHang");
  if (!sheet) {
    sheet = ss.insertSheet("DonHang");
    sheet.appendRow(["ThoiGian","MaDon","Ten","DienThoai","DiaChi","GhiChu","TongTien","ChiTiet","Loai"]);
  }
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(), data.orderId, data.name, data.phone, data.address,
    data.note, data.total, data.items, data.type
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}`;
function AdminPage() {
	const cfg = useSheetConfig();
	const load = useCatalog((s) => s.load);
	const source = useCatalog((s) => s.source);
	const warning = useCatalog((s) => s.warning);
	const loading = useCatalog((s) => s.loading);
	const [sheetId, setSheetId] = (0, import_react.useState)(cfg.sheetId);
	const [csvUrl, setCsvUrl] = (0, import_react.useState)(cfg.csvUrl);
	const [sheetName, setSheetName] = (0, import_react.useState)(cfg.sheetName);
	const [gid, setGid] = (0, import_react.useState)(cfg.gid);
	const [webhookUrl, setWebhookUrl] = (0, import_react.useState)(cfg.webhookUrl);
	function save() {
		cfg.setConfig({
			sheetId,
			csvUrl,
			sheetName,
			gid,
			webhookUrl
		});
		toast.success("Đã lưu cấu hình");
		load();
	}
	function downloadCsv() {
		const blob = new Blob([productsToCsv(LOCAL_PRODUCTS)], { type: "text/csv;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "san-pham-vuon-cua-mit.csv";
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-2xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-wide text-muted-foreground uppercase",
				children: "Chủ cửa hàng"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-1 text-4xl",
				children: "Google Sheet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Cửa hàng đang chạy bằng bảng mẫu. Kết nối Google Sheet để chị Hằng sửa giá, thêm trái, ẩn món hết hàng — web tự cập nhật."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					"Nguồn hiện tại: ",
					source === "sheet" ? "Google Sheet" : "bảng mẫu",
					warning ? ` · ${warning}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-8 list-decimal space-y-2 pl-5 text-sm text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tải file CSV mẫu, mở Google Trang tính → Tệp → Nhập." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Chia sẻ: Bất kỳ ai có liên kết (người xem)." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Copy ID trên thanh địa chỉ (đoạn giữa /d/ và /edit)." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Đặt tên tab sản phẩm là SanPham (hoặc điền tên tab bên dưới)." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Để nhận đơn: Tiện ích → Apps Script, dán đoạn mã, Triển khai → Ứng dụng web → Quyền truy cập: Bất kỳ ai. Dán URL webhook." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Mã bảng (Sheet ID)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: sheetId,
							onChange: (e) => setSheetId(e.target.value),
							placeholder: "1AbCDef..."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Hoặc URL CSV đã xuất bản",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: csvUrl,
							onChange: (e) => setCsvUrl(e.target.value),
							placeholder: "https://docs.google.com/spreadsheets/d/e/…/pub?output=csv"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tên tab sản phẩm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: sheetName,
								onChange: (e) => setSheetName(e.target.value)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "gid (nếu dùng export)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: gid,
								onChange: (e) => setGid(e.target.value)
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Webhook đơn hàng (Apps Script)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: webhookUrl,
							onChange: (e) => setWebhookUrl(e.target.value),
							placeholder: "https://script.google.com/macros/s/…/exec"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							onClick: save,
							disabled: loading,
							children: loading ? "Đang đọc bảng…" : "Lưu và đồng bộ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							variant: "outline",
							onClick: downloadCsv,
							children: "Tải CSV mẫu"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display mt-12 text-xl",
				children: "Mã Apps Script"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-3 overflow-x-auto rounded-xl bg-foreground p-4 text-xs leading-relaxed text-background",
				children: SCRIPT
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "mt-2",
				onClick: async () => {
					await navigator.clipboard.writeText(SCRIPT);
					toast.success("Đã copy mã");
				},
				children: "Copy mã"
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { AdminPage as component };
