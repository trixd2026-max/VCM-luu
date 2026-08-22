import { i as productsFromCsv, n as LOCAL_PRODUCTS } from "./catalog-jodnuEUp.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sheet-CqRtcjlO.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function isProbablyCsv(text) {
	const t = text.trimStart();
	if (t.startsWith("<") || t.startsWith("{")) return false;
	return t.includes(",") || t.includes("\n");
}
async function fetchText(url) {
	const res = await fetch(url, {
		headers: {
			Accept: "text/csv,text/plain,*/*",
			"User-Agent": "VuonCuaMit/1.0"
		},
		redirect: "follow"
	});
	if (!res.ok) throw new Error(`Không tải được bảng (${res.status})`);
	return res.text();
}
function sheetUrls(input) {
	const urls = [];
	const csvUrl = input.csvUrl?.trim();
	if (csvUrl) urls.push(csvUrl);
	const id = input.sheetId?.trim();
	if (id) {
		const name = encodeURIComponent(input.sheetName?.trim() || "SanPham");
		const gid = encodeURIComponent(input.gid?.trim() || "0");
		urls.push(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${name}`);
		urls.push(`https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`);
	}
	return urls;
}
var fetchCatalog_createServerFn_handler = createServerRpc({
	id: "7a5050eda2559b025c1ba2eed69f9a15cab896a4ac764a470710f047649134d2",
	name: "fetchCatalog",
	filename: "src/lib/sheet.ts"
}, (opts) => fetchCatalog.__executeServer(opts));
var fetchCatalog = createServerFn({ method: "POST" }).validator((input) => input).handler(fetchCatalog_createServerFn_handler, async ({ data }) => {
	const urls = sheetUrls(data);
	if (urls.length === 0) return {
		products: LOCAL_PRODUCTS,
		source: "local"
	};
	const errors = [];
	for (const url of urls) try {
		const text = await fetchText(url);
		if (!isProbablyCsv(text)) {
			errors.push("Google trả về trang đăng nhập — hãy chia sẻ bảng cho 'bất kỳ ai có liên kết'.");
			continue;
		}
		const products = productsFromCsv(text);
		if (products.length === 0) {
			errors.push("Bảng không có dòng sản phẩm hợp lệ.");
			continue;
		}
		return {
			products,
			source: "sheet"
		};
	} catch (err) {
		errors.push(err instanceof Error ? err.message : "Lỗi mạng");
	}
	return {
		products: LOCAL_PRODUCTS,
		source: "local",
		warning: errors[0] ?? "Không đọc được Google Sheet, đang dùng bảng mẫu."
	};
});
var submitSheetOrder_createServerFn_handler = createServerRpc({
	id: "dcfe2a71ac1f33c3d0121e9f9651356c6c9efe1351f6aa7e6e7567511ac5f63e",
	name: "submitSheetOrder",
	filename: "src/lib/sheet.ts"
}, (opts) => submitSheetOrder.__executeServer(opts));
var submitSheetOrder = createServerFn({ method: "POST" }).validator((input) => input).handler(submitSheetOrder_createServerFn_handler, async ({ data }) => {
	const webhookUrl = data.webhookUrl.trim();
	if (!webhookUrl) return {
		saved: false,
		error: "Chưa cấu hình webhook"
	};
	try {
		const res = await fetch(webhookUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data.order),
			redirect: "follow"
		});
		if (!res.ok) return {
			saved: false,
			error: `Sheet trả ${res.status}`
		};
		return { saved: true };
	} catch (err) {
		return {
			saved: false,
			error: err instanceof Error ? err.message : "Không ghi được đơn vào Sheet"
		};
	}
});
//#endregion
export { fetchCatalog_createServerFn_handler, submitSheetOrder_createServerFn_handler };
