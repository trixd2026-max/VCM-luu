//#region node_modules/.nitro/vite/services/ssr/assets/catalog-jodnuEUp.js
/** Minimal RFC4180 CSV parser (quoted fields, BOM, CRLF). */
function parseCsv(text) {
	const src = text.replace(/^\uFEFF/, "");
	const rows = [];
	let row = [];
	let cell = "";
	let i = 0;
	let inQuotes = false;
	while (i < src.length) {
		const ch = src[i];
		if (inQuotes) {
			if (ch === "\"") {
				if (src[i + 1] === "\"") {
					cell += "\"";
					i += 2;
					continue;
				}
				inQuotes = false;
				i += 1;
				continue;
			}
			cell += ch;
			i += 1;
			continue;
		}
		if (ch === "\"") {
			inQuotes = true;
			i += 1;
			continue;
		}
		if (ch === ",") {
			row.push(cell.trim());
			cell = "";
			i += 1;
			continue;
		}
		if (ch === "\n" || ch === "\r") {
			if (ch === "\r" && src[i + 1] === "\n") i += 1;
			row.push(cell.trim());
			cell = "";
			if (row.some((c) => c.length > 0)) rows.push(row);
			row = [];
			i += 1;
			continue;
		}
		cell += ch;
		i += 1;
	}
	row.push(cell.trim());
	if (row.some((c) => c.length > 0)) rows.push(row);
	return rows;
}
function toCsv(rows) {
	return rows.map((row) => row.map((value) => {
		if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, "\"\"")}"`;
		return value;
	}).join(",")).join("\n");
}
var CATEGORIES = [
	{
		id: "trai-cay-vuon",
		label: "Trái cây vườn",
		blurb: "Hái trong ngày từ vườn nhà"
	},
	{
		id: "trai-cay-nhap",
		label: "Trái cây nhập",
		blurb: "Kiwi, táo, nho, dưa hấu Kiều Farm"
	},
	{
		id: "gio-trai-cay",
		label: "Giỏ trái cây",
		blurb: "Kính cúng · biếu tặng từ 300.000đ"
	},
	{
		id: "hop-qua",
		label: "Hộp quà",
		blurb: "Gói sẵn, tặng là vừa"
	},
	{
		id: "lang-hoa",
		label: "Lẵng hoa",
		blurb: "Hoa tươi kết trái cây"
	},
	{
		id: "trap-cuoi",
		label: "Tráp cưới hỏi",
		blurb: "Set 5 · 7 · 9 tráp"
	}
];
var CATEGORY_ALIASES = {
	"trai-cay-vuon": "trai-cay-vuon",
	"trái cây vườn": "trai-cay-vuon",
	vuon: "trai-cay-vuon",
	"trai-cay-nhap": "trai-cay-nhap",
	"trái cây nhập": "trai-cay-nhap",
	nhap: "trai-cay-nhap",
	"gio-trai-cay": "gio-trai-cay",
	"giỏ trái cây": "gio-trai-cay",
	gio: "gio-trai-cay",
	"hop-qua": "hop-qua",
	"hộp quà": "hop-qua",
	"lang-hoa": "lang-hoa",
	"lẵng hoa": "lang-hoa",
	"trap-cuoi": "trap-cuoi",
	"tráp cưới hỏi": "trap-cuoi",
	trap: "trap-cuoi"
};
function yes(value) {
	const v = value.trim().toLowerCase();
	return v === "1" || v === "true" || v === "yes" || v === "x" || v === "có" || v === "co";
}
function num(value) {
	const n = Number(String(value).replace(/[^\d.-]/g, ""));
	return Number.isFinite(n) ? n : 0;
}
var LOCAL_PRODUCTS = [
	{
		id: "mit-thai",
		name: "Mít Thái",
		category: "trai-cay-vuon",
		price: 28e3,
		unit: "kg",
		description: "Mít Thái hái tại vườn — thơm, múi dày, ngọt hậu. Đặc sản mang tên cửa hàng, bán theo kg hoặc nguyên trái.",
		image: "/products/mit.jpg",
		featured: true,
		inStock: true,
		discount: 0
	},
	{
		id: "cam-sanh",
		name: "Cam sành",
		category: "trai-cay-vuon",
		price: 35e3,
		unit: "kg",
		description: "Cam sành vỏ xanh, mọng nước, chua ngọt vừa miệng. Phù hợp ăn tươi, ép nước hoặc bày giỏ kính cúng.",
		image: "/products/cam.jpg",
		featured: true,
		inStock: true,
		discount: 0
	},
	{
		id: "cam-xoan",
		name: "Cam xoàn",
		category: "trai-cay-vuon",
		price: 45e3,
		unit: "kg",
		description: "Cam xoàn vỏ mỏng, vị ngọt thanh. Chọn trái đều, nặng tay — đóng giỏ biếu rất đẹp.",
		image: "/products/cam.jpg",
		featured: false,
		inStock: true,
		discount: 0
	},
	{
		id: "quyt-duong",
		name: "Quýt đường",
		category: "trai-cay-vuon",
		price: 55e3,
		unit: "kg",
		description: "Quýt đường nhỏ, dễ bóc, ngọt đậm. Trái còn cành lá tươi — hay dùng trong giỏ Tết và mâm cúng.",
		image: "/products/quyt.jpg",
		featured: true,
		inStock: true,
		discount: 0
	},
	{
		id: "buoi-da-xanh",
		name: "Bưởi da xanh",
		category: "trai-cay-vuon",
		price: 75e3,
		unit: "quả",
		description: "Bưởi da xanh múi hồng, ít hạt, ngọt thanh. Bán theo quả, chọn size vừa hoặc to theo giỏ.",
		image: "/products/buoi.jpg",
		featured: true,
		inStock: true,
		discount: 0
	},
	{
		id: "buoi-nam-roi",
		name: "Bưởi năm roi",
		category: "trai-cay-vuon",
		price: 55e3,
		unit: "quả",
		description: "Bưởi năm roi truyền thống, vị chua ngọt dễ ăn, thích hợp cúng và biếu người lớn tuổi.",
		image: "/products/buoi.jpg",
		featured: false,
		inStock: true,
		discount: 0
	},
	{
		id: "le-tai-nung",
		name: "Lê Tai Nung",
		category: "trai-cay-vuon",
		price: 65e3,
		unit: "kg",
		description: "Lê giòn, mát, ngọt nhẹ. Ăn tươi hoặc xếp giỏ thăm bệnh, sinh nhật.",
		image: "/products/le.jpg",
		featured: false,
		inStock: true,
		discount: 0
	},
	{
		id: "xoai-cat",
		name: "Xoài cát Hòa Lộc",
		category: "trai-cay-vuon",
		price: 95e3,
		unit: "kg",
		description: "Xoài cát Hòa Lộc chín cây, thịt vàng, ít xơ, thơm. Chọn trái vừa tới — ngọt mà không nhũn.",
		image: "/products/xoai.jpg",
		featured: true,
		inStock: true,
		discount: 0
	},
	{
		id: "xoai-keo",
		name: "Xoài keo",
		category: "trai-cay-vuon",
		price: 45e3,
		unit: "kg",
		description: "Xoài keo chua ngọt, ăn sống chấm muối ớt hoặc chờ chín. Giá mềm, trái đều.",
		image: "/products/xoai-keo.jpg",
		featured: false,
		inStock: true,
		discount: 0
	},
	{
		id: "thanh-long-do",
		name: "Thanh long ruột đỏ",
		category: "trai-cay-vuon",
		price: 38e3,
		unit: "kg",
		description: "Thanh long ruột đỏ vỏ hồng, ruột bắt mắt. Ngọt mát, hay dùng trong giỏ biếu và hộp quà.",
		image: "/products/thanh-long.jpg",
		featured: true,
		inStock: true,
		discount: 0
	},
	{
		id: "thanh-long-trang",
		name: "Thanh long ruột trắng",
		category: "trai-cay-vuon",
		price: 28e3,
		unit: "kg",
		description: "Thanh long ruột trắng thanh mát, giá dễ đặt số lượng cho giỏ cúng.",
		image: "/products/thanh-long2.jpg",
		featured: false,
		inStock: true,
		discount: 0
	},
	{
		id: "chuoi-su",
		name: "Chuối sứ",
		category: "trai-cay-vuon",
		price: 18e3,
		unit: "kg",
		description: "Chuối sứ chín tự nhiên, thơm. Nải đều, phù hợp mâm cúng và giỏ thăm hỏi.",
		image: "/products/chuoi.jpg",
		featured: false,
		inStock: true,
		discount: 0
	},
	{
		id: "dua-mat",
		name: "Dứa mật",
		category: "trai-cay-vuon",
		price: 25e3,
		unit: "quả",
		description: "Dứa mật thơm, mắt đều. Gọt sẵn theo yêu cầu hoặc để nguyên trái trong giỏ.",
		image: "/products/dua.jpg",
		featured: false,
		inStock: true,
		discount: 0
	},
	{
		id: "kiwi-nz",
		name: "Kiwi New Zealand",
		category: "trai-cay-nhap",
		price: 185e3,
		unit: "kg",
		description: "Kiwi xanh New Zealand, chua ngọt cân bằng, nhiều vitamin C. Đóng hộp quà hoặc ăn tươi.",
		image: "/products/kiwi.jpg",
		featured: true,
		inStock: true,
		discount: 0
	},
	{
		id: "tao-envy",
		name: "Táo Envy",
		category: "trai-cay-nhap",
		price: 165e3,
		unit: "kg",
		description: "Táo Envy giòn, ngọt, vỏ đỏ đậm. Trái đẹp, rất hợp giỏ biếu sếp và hộp quà.",
		image: "/products/tao.jpg",
		featured: true,
		inStock: true,
		discount: 0
	},
	{
		id: "tao-fuji",
		name: "Táo Fuji",
		category: "trai-cay-nhap",
		price: 125e3,
		unit: "kg",
		description: "Táo Fuji ngọt thanh, giòn. Size đều, dễ kết hợp cam quýt trong giỏ 300–500K.",
		image: "/products/farm.jpg",
		featured: false,
		inStock: true,
		discount: 0
	},
	{
		id: "dua-hau-kieu",
		name: "Dưa hấu Kiều Farm",
		category: "trai-cay-nhap",
		price: 22e3,
		unit: "kg",
		description: "Dưa hấu Kiều Farm ruột đỏ, ít hạt, ngọt. Bán nguyên trái, chọn size theo mâm cúng hoặc tiệc.",
		image: "/products/dua-hau.jpg",
		featured: true,
		inStock: true,
		discount: 0
	},
	{
		id: "nho-mau-don",
		name: "Nho mẫu đơn",
		category: "trai-cay-nhap",
		price: 245e3,
		unit: "kg",
		description: "Nho mẫu đơn trái to, giòn, ngọt. Hàng nhập, để lạnh — đặt trước khi gói giỏ cao cấp.",
		image: "/products/nho.jpg",
		featured: false,
		inStock: true,
		discount: 0
	},
	{
		id: "gio-300",
		name: "Giỏ trái cây 300.000đ",
		category: "gio-trai-cay",
		price: 3e5,
		unit: "giỏ",
		description: "Giỏ kính cúng / biếu nhẹ: cam, quýt, chuối, thanh long, táo. Gói giấy kính, nơ, thiệp theo lời nhắn.",
		image: "/products/gio.jpg",
		featured: true,
		inStock: true,
		discount: 0
	},
	{
		id: "gio-400",
		name: "Giỏ trái cây 400.000đ",
		category: "gio-trai-cay",
		price: 4e5,
		unit: "giỏ",
		description: "Giỏ biếu vừa: thêm bưởi hoặc xoài, trái đều tay. Phù hợp thăm hỏi, sinh nhật.",
		image: "/products/gio.jpg",
		featured: false,
		inStock: true,
		discount: 0
	},
	{
		id: "gio-500",
		name: "Giỏ trái cây 500.000đ",
		category: "gio-trai-cay",
		price: 5e5,
		unit: "giỏ",
		description: "Giỏ biếu lịch sự: mix vườn và trái nhập (táo, kiwi). Gói chỉn chu, có thể giao đúng giờ.",
		image: "/products/hop-qua.jpg",
		featured: true,
		inStock: true,
		discount: 0
	},
	{
		id: "gio-1000",
		name: "Giỏ trái cây 1.000.000đ",
		category: "gio-trai-cay",
		price: 1e6,
		unit: "giỏ",
		description: "Giỏ cao cấp: nho, kiwi, táo Envy, bưởi da xanh, xoài cát. Dành tặng sếp, đối tác, mừng thọ.",
		image: "/products/hop-qua.jpg",
		featured: true,
		inStock: true,
		discount: 0
	},
	{
		id: "hop-qua-trai-cay",
		name: "Hộp quà trái cây",
		category: "hop-qua",
		price: 45e4,
		unit: "hộp",
		description: "Hộp giấy cứng, lót giấy kraft, trái cây xếp tầng. Ghi thiệp tay theo tên người nhận.",
		image: "/products/hop-qua.jpg",
		featured: false,
		inStock: true,
		discount: 0
	},
	{
		id: "lang-hoa-trai-cay",
		name: "Lẵng hoa trái cây",
		category: "lang-hoa",
		price: 55e4,
		unit: "lẵng",
		description: "Lẵng hoa tươi kết cam, táo, nho. Khai trương, chúc mừng, thăm bệnh — báo trước 1 ngày để hái hoa.",
		image: "/products/lang-hoa.jpg",
		featured: true,
		inStock: true,
		discount: 0
	},
	{
		id: "trap-5",
		name: "Tráp cưới hỏi — 5 tráp",
		category: "trap-cuoi",
		price: 25e5,
		unit: "set",
		description: "Set 5 tráp cơ bản: trầu cau, trà rượu, bánh, mứt, trái cây. Gói theo lễ nghi miền Trung, trao đổi màu sắc với gia đình.",
		image: "/products/trap.jpg",
		featured: true,
		inStock: true,
		discount: 0
	},
	{
		id: "trap-7",
		name: "Tráp cưới hỏi — 7 tráp",
		category: "trap-cuoi",
		price: 35e5,
		unit: "set",
		description: "Set 7 tráp đầy đủ: thêm heo quay / trái cây cao cấp theo yêu cầu. Có người hỗ trợ lễ đón.",
		image: "/products/trap.jpg",
		featured: false,
		inStock: true,
		discount: 0
	},
	{
		id: "trap-9",
		name: "Tráp cưới hỏi — 9 tráp",
		category: "trap-cuoi",
		price: 48e5,
		unit: "set",
		description: "Set 9 tráp trang trọng: trái nhập, hoa tươi, tráp phủ vải. Đặt trước ít nhất 7 ngày.",
		image: "/products/lang-hoa.jpg",
		featured: false,
		inStock: true,
		discount: 0
	}
];
var HEADER_MAP = {
	id: "id",
	ma: "id",
	sku: "id",
	ten: "name",
	tên: "name",
	name: "name",
	danh_muc: "category",
	danhmuc: "category",
	"danh muc": "category",
	category: "category",
	gia: "price",
	giá: "price",
	price: "price",
	don_vi: "unit",
	donvi: "unit",
	"đơn vị": "unit",
	unit: "unit",
	mo_ta: "description",
	mota: "description",
	"mô tả": "description",
	description: "description",
	hinh: "image",
	hình: "image",
	image: "image",
	img: "image",
	photo: "image",
	noi_bat: "featured",
	noibat: "featured",
	"nổi bật": "featured",
	featured: "featured",
	con_hang: "inStock",
	conhang: "inStock",
	"còn hàng": "inStock",
	stock: "inStock",
	giam_gia: "discount",
	giamgia: "discount",
	"giảm giá": "discount",
	discount: "discount"
};
function normalizeHeader(h) {
	return h.trim().toLowerCase().replace(/\s+/g, " ");
}
function productsFromCsv(text) {
	const rows = parseCsv(text);
	if (rows.length < 2) return [];
	const keys = rows[0].map(normalizeHeader).map((h) => HEADER_MAP[h]);
	const out = [];
	for (const row of rows.slice(1)) {
		const raw = {};
		keys.forEach((key, i) => {
			if (!key || key === "skip") return;
			raw[key] = row[i] ?? "";
		});
		const id = (raw.id ?? "").trim();
		const name = (raw.name ?? "").trim();
		if (!id || !name) continue;
		const category = CATEGORY_ALIASES[(raw.category ?? "trai-cay-vuon").trim().toLowerCase()] ?? "trai-cay-vuon";
		out.push({
			id,
			name,
			category,
			price: num(raw.price ?? "0"),
			unit: (raw.unit ?? "kg").trim() || "kg",
			description: (raw.description ?? "").trim(),
			image: (raw.image ?? "").trim() || "/products/hero.jpg",
			featured: yes(raw.featured ?? ""),
			inStock: (raw.inStock ?? "1").trim() === "" ? true : yes(raw.inStock ?? "1"),
			discount: num(raw.discount ?? "0")
		});
	}
	return out;
}
function productsToCsv(products) {
	return toCsv([[
		"id",
		"ten",
		"danh_muc",
		"gia",
		"don_vi",
		"mo_ta",
		"hinh",
		"noi_bat",
		"con_hang",
		"giam_gia"
	], ...products.map((p) => [
		p.id,
		p.name,
		p.category,
		String(p.price),
		p.unit,
		p.description,
		p.image,
		p.featured ? "1" : "0",
		p.inStock ? "1" : "0",
		String(p.discount || 0)
	])]);
}
function salePrice(product) {
	if (!product.discount) return product.price;
	return Math.round(product.price * (1 - product.discount / 100));
}
function categoryLabel(id) {
	return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
//#endregion
export { productsToCsv as a, productsFromCsv as i, LOCAL_PRODUCTS as n, salePrice as o, categoryLabel as r, CATEGORIES as t };
