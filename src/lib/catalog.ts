import { parseCsv, toCsv } from "./csv";

export const CATEGORIES = [
  { id: "trai-cay-vuon", label: "Trái cây vườn", blurb: "Hái trong ngày từ vườn nhà" },
  { id: "trai-cay-nhap", label: "Trái cây nhập", blurb: "Kiwi, táo, nho, dâu tây" },
  { id: "gio-trai-cay", label: "Giỏ trái cây", blurb: "Từ 300.000đ · biếu tặng · kính cúng" },
  { id: "hop-qua", label: "Hộp quà", blurb: "Hộp mica · hộp giấy gói sẵn" },
  { id: "lang-hoa", label: "Lẵng hoa", blurb: "Giỏ hoa trái cây · hoa viếng tang" },
  { id: "trap-cuoi", label: "Tráp cưới hỏi", blurb: "Set 5 · 7 · 9 tráp" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  unit: string;
  description: string;
  image: string;
  featured: boolean;
  inStock: boolean;
  discount: number;
  /** Số tồn kho. undefined = không theo dõi số lượng (chỉ dùng con_hang) */
  stock?: number;
};

const CATEGORY_ALIASES: Record<string, CategoryId> = {
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
  "hoa-vieng": "lang-hoa",
  "hoa viếng": "lang-hoa",
  vieng: "lang-hoa",
  "trap-cuoi": "trap-cuoi",
  "tráp cưới hỏi": "trap-cuoi",
  trap: "trap-cuoi",
};

function yes(value: string) {
  const v = value.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "x" || v === "có" || v === "co";
}

function num(value: string) {
  const n = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export const LOCAL_PRODUCTS: Product[] = [
  { id: "sau-rieng", name: "Sầu riêng", category: "trai-cay-vuon", price: 60_000, unit: "kg", description: "Sầu riêng cơm vàng, béo thơm. Bán theo kg, chọn trái vừa chín — nhắn Zalo trước để giữ hàng.", image: "/products/sau-rieng.jpg", featured: true, inStock: true, discount: 0 },
  { id: "dua-luoi-vang", name: "Dưa lưới vàng KieuFram", category: "trai-cay-vuon", price: 45_000, unit: "kg", description: "Dưa lưới vàng KieuFram vỏ vàng, thịt cam ngọt thơm. Trái đẹp, hay dùng trong giỏ biếu.", image: "/products/dua-luoi-vang.jpg", featured: true, inStock: true, discount: 0 },
  { id: "dua-luoi-xanh-t1", name: "Dưa lưới xanh T1 KieuFram", category: "trai-cay-vuon", price: 35_000, unit: "kg", description: "Dưa lưới xanh T1 KieuFram premium, thịt cam dày, ngọt đậm. Size lớn, phù hợp biếu tặng.", image: "/products/dua-luoi-xanh-t1.jpg", featured: true, inStock: true, discount: 0 },
  { id: "dua-luoi-xanh-t3", name: "Dưa lưới xanh T3 KieuFram", category: "trai-cay-vuon", price: 30_000, unit: "kg", description: "Dưa lưới xanh T3 KieuFram, thịt cam ngọt mát. Trái đều, đóng túi lưới — ăn tươi hoặc xếp giỏ.", image: "/products/dua-luoi-xanh-t3.jpg", featured: true, inStock: true, discount: 0 },
  { id: "cam-sanh", name: "Cam sành", category: "trai-cay-vuon", price: 35_000, unit: "kg", description: "Cam sành vỏ xanh, mọng nước, chua ngọt vừa miệng.", image: "/products/cam2.jpg", featured: true, inStock: true, discount: 0 },
  { id: "gio-300", name: "Giỏ trái cây 300.000đ", category: "gio-trai-cay", price: 300_000, unit: "giỏ", description: "Giỏ mây gói sẵn.", image: "/products/gio-300k.jpg", featured: true, inStock: true, discount: 0 },
  { id: "gio-500", name: "Giỏ trái cây 500.000đ", category: "gio-trai-cay", price: 500_000, unit: "giỏ", description: "Giỏ biếu lịch sự.", image: "/products/gio-500k.jpg", featured: true, inStock: true, discount: 0 },
  { id: "trap-5", name: "Tráp cưới hỏi — 5 tráp", category: "trap-cuoi", price: 2_500_000, unit: "set", description: "Set 5 tráp cơ bản.", image: "/products/trap-cuoi.jpg", featured: true, inStock: true, discount: 0 },
];

const HEADER_MAP: Record<string, keyof Product | "skip"> = {
  id: "id", ma: "id", sku: "id", ten: "name", tên: "name", name: "name",
  danh_muc: "category", danhmuc: "category", "danh muc": "category", category: "category",
  gia: "price", giá: "price", price: "price",
  don_vi: "unit", donvi: "unit", "đơn vị": "unit", unit: "unit",
  mo_ta: "description", mota: "description", "mô tả": "description", description: "description",
  hinh: "image", hình: "image", image: "image", img: "image", photo: "image",
  noi_bat: "featured", noibat: "featured", "nổi bật": "featured", featured: "featured",
  con_hang: "inStock", conhang: "inStock", "còn hàng": "inStock",
  giam_gia: "discount", giamgia: "discount", "giảm giá": "discount", discount: "discount",
};

function normalizeHeader(h: string) {
  return h.trim().toLowerCase().replace(/\s+/g, " ");
}

const STOCK_HEADERS = new Set([
  "ton_kho", "tonkho", "tồn kho", "ton kho", "qty", "quantity", "so_luong", "soluong",
]);

export function productsFromCsv(text: string): Product[] {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map(normalizeHeader);
  const keys = headers.map((h) => HEADER_MAP[h]);
  const stockCol = headers.findIndex((h) => STOCK_HEADERS.has(h));
  const out: Product[] = [];
  for (const row of rows.slice(1)) {
    const raw: Partial<Record<keyof Product, string>> = {};
    keys.forEach((key, i) => {
      if (!key || key === "skip") return;
      raw[key] = row[i] ?? "";
    });
    const id = (raw.id ?? "").trim();
    const name = (raw.name ?? "").trim();
    if (!id || !name) continue;
    const catRaw = (raw.category ?? "trai-cay-vuon").trim().toLowerCase();
    const category = CATEGORY_ALIASES[catRaw] ?? "trai-cay-vuon";

    let stock: number | undefined;
    if (stockCol >= 0) {
      const cell = (row[stockCol] ?? "").trim();
      if (cell !== "") stock = Math.max(0, num(cell));
    }

    let inStock = (raw.inStock ?? "1").trim() === "" ? true : yes(raw.inStock ?? "1");
    if (stock !== undefined && stock <= 0) inStock = false;

    out.push({
      id, name, category,
      price: num(raw.price ?? "0"),
      unit: (raw.unit ?? "kg").trim() || "kg",
      description: (raw.description ?? "").trim(),
      image: (raw.image ?? "").trim() || "/products/hero.jpg",
      featured: yes(raw.featured ?? ""),
      inStock,
      discount: num(raw.discount ?? "0"),
      stock,
    });
  }
  return out;
}

export function productsToCsv(products: Product[]): string {
  const header = ["id", "ten", "danh_muc", "gia", "don_vi", "mo_ta", "hinh", "noi_bat", "con_hang", "giam_gia", "ton_kho"];
  const rows = products.map((p) => [
    p.id, p.name, p.category, String(p.price), p.unit, p.description, p.image,
    p.featured ? "1" : "0", p.inStock ? "1" : "0", String(p.discount || 0),
    p.stock === undefined ? "" : String(p.stock),
  ]);
  return toCsv([header, ...rows]);
}

export function salePrice(product: Product) {
  if (!product.discount) return product.price;
  return Math.round(product.price * (1 - product.discount / 100));
}

export function categoryLabel(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
