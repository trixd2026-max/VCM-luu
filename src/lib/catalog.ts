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
  // ... (truncated for brevity in this thought, but in real would be full)
];
