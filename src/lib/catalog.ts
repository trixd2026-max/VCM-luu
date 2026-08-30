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
  {
    id: "sau-rieng",
    name: "Sầu riêng",
    category: "trai-cay-vuon",
    price: 60_000,
    unit: "kg",
    description:
      "Sầu riêng cơm vàng, béo thơm. Bán theo kg, chọn trái vừa chín — nhắn Zalo trước để giữ hàng.",
    image: "/products/sau-rieng.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "cam-sanh",
    name: "Cam sành",
    category: "trai-cay-vuon",
    price: 35_000,
    unit: "kg",
    description:
      "Cam sành vỏ xanh, mọng nước, chua ngọt vừa miệng. Phù hợp ăn tươi, ép nước hoặc bày giỏ kính cúng.",
    image: "/products/cam2.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "cam-xoan",
    name: "Cam xoàn",
    category: "trai-cay-vuon",
    price: 45_000,
    unit: "kg",
    description: "Cam xoàn vỏ mỏng, vị ngọt thanh. Chọn trái đều, nặng tay — đóng giỏ biếu rất đẹp.",
    image: "/products/cam4.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "quyt-duong",
    name: "Quýt đường",
    category: "trai-cay-vuon",
    price: 55_000,
    unit: "kg",
    description:
      "Quýt đường nhỏ, dễ bóc, ngọt đậm. Trái còn cành lá tươi — hay dùng trong giỏ Tết và mâm cúng.",
    image: "/products/quyt.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "buoi-da-xanh",
    name: "Bưởi da xanh",
    category: "trai-cay-vuon",
    price: 75_000,
    unit: "quả",
    description:
      "Bưởi da xanh múi hồng, ít hạt, ngọt thanh. Bán theo quả, chọn size vừa hoặc to theo giỏ.",
    image: "/products/buoi.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "le-tai-nung",
    name: "Lê Tai Nung Sơn La",
    category: "trai-cay-vuon",
    price: 65_000,
    unit: "kg",
    description: "Lê Tai Nung Sơn La giòn, mát, ngọt thanh. Đặc sản vùng cao — ăn tươi hoặc xếp giỏ.",
    image: "/products/le-tai-nung.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "xoai-cat",
    name: "Xoài cát Hòa Lộc",
    category: "trai-cay-vuon",
    price: 95_000,
    unit: "kg",
    description:
      "Xoài cát Hòa Lộc chín cây, thịt vàng, ít xơ, thơm. Chọn trái vừa tới — ngọt mà không nhũn.",
    image: "/products/xoai.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "xoai-keo",
    name: "Xoài keo",
    category: "trai-cay-vuon",
    price: 45_000,
    unit: "kg",
    description: "Xoài keo chua ngọt, ăn sống chấm muối ớt hoặc chờ chín. Giá mềm, trái đều.",
    image: "/products/xoai-keo.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "thanh-long-trang",
    name: "Thanh long ruột trắng",
    category: "trai-cay-vuon",
    price: 28_000,
    unit: "kg",
    description: "Thanh long ruột trắng thanh mát, giá dễ đặt số lượng cho giỏ cúng.",
    image: "/products/thanh-long2.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "dua-mat",
    name: "Dứa mật",
    category: "trai-cay-vuon",
    price: 25_000,
    unit: "quả",
    description: "Dứa mật thơm, mắt đều. Gọt sẵn theo yêu cầu hoặc để nguyên trái trong giỏ.",
    image: "/products/dua.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "hat-de",
    name: "Hạt dẻ",
    category: "trai-cay-vuon",
    price: 50_000,
    unit: "kg",
    description:
      "Hạt dẻ tươi, thơm bùi. Ăn rang hoặc hấp — phù hợp biếu và mâm cúng.",
    image: "/products/hat-de.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "na-mong-cau",
    name: "Na / mãng cầu",
    category: "trai-cay-vuon",
    price: 55_000,
    unit: "kg",
    description: "Na dai, ngọt, hạt chắc. Trái đều, hái khi vừa tới — ăn tươi hoặc bày mâm cúng.",
    image: "/products/na.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "dua-hau-kieu",
    name: "Dưa hấu đường KieuFram",
    category: "trai-cay-vuon",
    price: 22_000,
    unit: "kg",
    description:
      "Dưa hấu đường KieuFram ruột đỏ, ít hạt, ngọt. Bán nguyên trái, chọn size theo mâm cúng hoặc tiệc.",
    image: "/products/dua-hau.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "kiwi-nz",
    name: "Kiwi New Zealand",
    category: "trai-cay-nhap",
    price: 185_000,
    unit: "kg",
    description:
      "Kiwi xanh New Zealand, chua ngọt cân bằng, nhiều vitamin C. Đóng hộp quà hoặc ăn tươi.",
    image: "/products/_try_kiwi-c.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "tao-envy",
    name: "Táo Envy",
    category: "trai-cay-nhap",
    price: 165_000,
    unit: "kg",
    description: "Táo Envy giòn, ngọt, vỏ đỏ đậm. Trái đẹp, rất hợp giỏ biếu sếp và hộp quà.",
    image: "/products/tao.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "tao-fuji",
    name: "Táo Fuji",
    category: "trai-cay-nhap",
    price: 125_000,
    unit: "kg",
    description: "Táo Fuji ngọt thanh, giòn. Size đều, dễ kết hợp cam quýt trong giỏ 300–500K.",
    image: "/products/tao-vuon.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "nho-mau-don",
    name: "Nho mẫu đơn",
    category: "trai-cay-nhap",
    price: 245_000,
    unit: "kg",
    description: "Nho mẫu đơn trái to, giòn, ngọt. Hàng nhập, để lạnh — đặt trước khi gói giỏ cao cấp.",
    image: "/products/anh-nho.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "luu-do",
    name: "Lựu đỏ",
    category: "trai-cay-nhap",
    price: 95_000,
    unit: "kg",
    description: "Lựu đỏ mọng hạt, chua ngọt. Trái đẹp, hay dùng trong giỏ biếu và hộp quà.",
    image: "/products/anh-luu.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "cha-la",
    name: "Chà là tươi",
    category: "trai-cay-nhap",
    price: 85_000,
    unit: "kg",
    description: "Chà là tươi chùm, ngọt dịu, thịt dày. Ăn liền hoặc bày mâm cúng, giỏ biếu.",
    image: "/products/cha-la.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "dau-tay",
    name: "Dâu tây",
    category: "trai-cay-nhap",
    price: 150_000,
    unit: "hộp",
    description: "Dâu tây đỏ mọng, chua ngọt. Ăn tươi hoặc xếp hộp quà, giỏ sinh nhật.",
    image: "/products/dau.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "nho-xanh",
    name: "Nho xanh không hạt",
    category: "trai-cay-nhap",
    price: 95_000,
    unit: "kg",
    description: "Nho xanh không hạt, giòn ngọt. Dùng nhiều trong giỏ biếu và hộp mica.",
    image: "/products/nho.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "cherry",
    name: "Cherry",
    category: "trai-cay-nhap",
    price: 275_000,
    unit: "hộp",
    description:
      "Cherry nhập khẩu đỏ mọng, ngọt thanh. Hộp sẵn, để lạnh — biếu tặng và ăn tươi.",
    image: "/products/cherry.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "hong-tao",
    name: "Hồng táo Jujube",
    category: "trai-cay-nhap",
    price: 265_000,
    unit: "hộp",
    description:
      "Hồng táo (táo tàu) Jujube nhập khẩu, giòn ngọt. Hộp quà NTF — biếu tặng đẹp.",
    image: "/products/hong-tao.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "gio-300",
    name: "Giỏ trái cây 300.000đ",
    category: "gio-trai-cay",
    price: 300_000,
    unit: "giỏ",
    description:
      "Giỏ kính cúng / biếu nhẹ: cam, quýt, chuối, thanh long, táo. Gói giấy kính, nơ, thiệp theo lời nhắn.",
    image: "/products/gio-300k.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "gio-400",
    name: "Giỏ trái cây 400.000đ",
    category: "gio-trai-cay",
    price: 400_000,
    unit: "giỏ",
    description: "Giỏ biếu vừa: thêm bưởi hoặc xoài, trái đều tay. Phù hợp thăm hỏi, sinh nhật.",
    image: "/products/gio-400k.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "gio-500",
    name: "Giỏ trái cây 500.000đ",
    category: "gio-trai-cay",
    price: 500_000,
    unit: "giỏ",
    description:
      "Giỏ biếu lịch sự: mix vườn và trái nhập (táo, kiwi). Gói chỉn chu, có thể giao đúng giờ.",
    image: "/products/gio-500k.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "gio-600",
    name: "Giỏ trái cây 600.000đ",
    category: "gio-trai-cay",
    price: 600_000,
    unit: "giỏ",
    description:
      "Giỏ biếu đầy đặn: nho xanh, cam, lê, kiwi, dưa. Nơ lưới hồng, có bảng tên Vườn Của Mít.",
    image: "/products/gio-600k.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "gio-650",
    name: "Giỏ trái cây 650.000đ",
    category: "gio-trai-cay",
    price: 650_000,
    unit: "giỏ",
    description: "Giỏ dưa lưới, nho, kiwi, cam — nơ voan đào. Phù hợp sinh nhật, thăm hỏi.",
    image: "/products/gio-650k.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "gio-700",
    name: "Giỏ hoa trái cây 700.000đ",
    category: "gio-trai-cay",
    price: 700_000,
    unit: "giỏ",
    description: "Giỏ trái cây kết hoa hồng đỏ – hồng pastel. Tặng khai trương, chúc mừng, sinh nhật.",
    image: "/products/gio-700k.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "gio-hoa-xanh",
    name: "Giỏ hoa trái cây xanh",
    category: "gio-trai-cay",
    price: 720_000,
    unit: "giỏ",
    description: "Giỏ voan xanh, nơ bạc: dưa lưới, nho, kiwi, táo, cam. Gói sẵn, tặng là vừa.",
    image: "/products/gio-hoa2.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "gio-hoa-hong",
    name: "Giỏ hoa trái cây hồng",
    category: "gio-trai-cay",
    price: 750_000,
    unit: "giỏ",
    description: "Giỏ voan hồng, hoa hồng pastel kết nho, lê, cam, táo. Sinh nhật và biếu tặng.",
    image: "/products/gio-hoa.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "gio-nghe-thuat",
    name: "Giỏ trái cây nghệ thuật",
    category: "gio-trai-cay",
    price: 850_000,
    unit: "giỏ",
    description:
      "Giỏ nghệ thuật mix nho, táo, cam, kiwi — gói theo mẫu. Nhận thiết kế theo ngân sách.",
    image: "/products/gio.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "gio-1000",
    name: "Giỏ trái cây 1.000.000đ",
    category: "gio-trai-cay",
    price: 1_000_000,
    unit: "giỏ",
    description:
      "Giỏ cao cấp: dưa lưới, nho, kiwi, táo, lê — kết hoa tươi. Dành tặng sếp, đối tác, mừng thọ.",
    image: "/products/gio-1trieu.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "hop-qua-trai-cay",
    name: "Hộp quà trái cây",
    category: "hop-qua",
    price: 450_000,
    unit: "hộp",
    description:
      "Hộp giấy cứng, lót giấy kraft, trái cây xếp tầng. Ghi thiệp tay theo tên người nhận.",
    image: "/products/hop-qiua.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "hop-mica-nho",
    name: "Hộp mica nho xanh",
    category: "hop-qua",
    price: 350_000,
    unit: "hộp",
    description:
      "Hộp mica trong suốt, nho xanh xếp tầng — gọn, tinh tế. Thiết kế theo yêu cầu và ngân sách.",
    image: "/products/hop-qua.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "hop-qua-nho-kiwi",
    name: "Hộp quà nho – kiwi",
    category: "hop-qua",
    price: 420_000,
    unit: "hộp",
    description: "Hộp giấy cứng: nho, kiwi, táo, cam. Ghi thiệp tay theo tên người nhận.",
    image: "/products/hop2.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "lang-hoa-mung",
    name: "Lẵng hoa chúc mừng",
    category: "lang-hoa",
    price: 480_000,
    unit: "lẵng",
    description:
      "Lẵng hoa tươi chúc mừng, khai trương, sinh nhật. Hoa hồng, cúc, lá xanh — khác hoa viếng tang.",
    image: "/products/lang-hoa.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "hoa-vieng-500",
    name: "Hoa viếng 500.000đ",
    category: "lang-hoa",
    price: 500_000,
    unit: "lẵng",
    description: "Vòng hoa viếng tang cúc trắng, nơ trắng. Giao đúng giờ lễ, ghi bảng kính viếng.",
    image: "/products/hoa-vieng-500k.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "hoa-vieng-550",
    name: "Hoa viếng cúc trắng 550.000đ",
    category: "lang-hoa",
    price: 550_000,
    unit: "lẵng",
    description: "Lẵng hoa viếng cúc trắng, giấy voan trắng. Phù hợp tang lễ, viếng thăm.",
    image: "/products/hoa-vieng-550k.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "hoa-vieng-550b",
    name: "Hoa viếng đứng 550.000đ",
    category: "lang-hoa",
    price: 550_000,
    unit: "lẵng",
    description: "Hoa viếng đứng cúc trắng, lá cọ. Đặt trước để giao đúng giờ.",
    image: "/products/hoa-vieng-550b.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "hoa-vieng-kinh",
    name: "Hoa viếng kính viếng",
    category: "lang-hoa",
    price: 600_000,
    unit: "lẵng",
    description: "Kệ hoa viếng hai tầng, cúc trắng, nơ lớn, có bảng kính viếng.",
    image: "/products/hoa-vieng.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "hoa-vieng-700",
    name: "Hoa viếng hồng trắng 700.000đ",
    category: "lang-hoa",
    price: 700_000,
    unit: "lẵng",
    description: "Lẵng hoa hồng trắng, voan tầng, nơ đen. Trang trọng cho tang lễ.",
    image: "/products/hoa-vieng-700k.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "hoa-vieng-750",
    name: "Hoa viếng hai tầng 750.000đ",
    category: "lang-hoa",
    price: 750_000,
    unit: "lẵng",
    description: "Kệ hoa viếng hai tầng cúc trắng, lá cọ. Size lớn, nhìn rõ từ xa.",
    image: "/products/hoa-vieng-750k.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "trap-5",
    name: "Tráp cưới hỏi — 5 tráp",
    category: "trap-cuoi",
    price: 2_500_000,
    unit: "set",
    description:
      "Set 5 tráp cơ bản: trầu cau, trà rượu, bánh, mứt, trái cây. Gói theo lễ nghi miền Trung, trao đổi màu sắc với gia đình.",
    image: "/products/trap-cuoi.jpg",
    featured: true,
    inStock: true,
    discount: 0,
  },
  {
    id: "trap-7",
    name: "Tráp cưới hỏi — 7 tráp",
    category: "trap-cuoi",
    price: 3_500_000,
    unit: "set",
    description:
      "Set 7 tráp đầy đủ: thêm heo quay / trái cây cao cấp theo yêu cầu. Có người hỗ trợ lễ đón.",
    image: "/products/trap-cuoi.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
  {
    id: "trap-9",
    name: "Tráp cưới hỏi — 9 tráp",
    category: "trap-cuoi",
    price: 4_800_000,
    unit: "set",
    description:
      "Set 9 tráp trang trọng: trái nhập, hoa tươi, tráp phủ vải. Đặt trước ít nhất 7 ngày.",
    image: "/products/trap-cuoi.jpg",
    featured: false,
    inStock: true,
    discount: 0,
  },
];

const HEADER_MAP: Record<string, keyof Product | "skip"> = {
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
  discount: "discount",
};

function normalizeHeader(h: string) {
  return h.trim().toLowerCase().replace(/\s+/g, " ");
}

export function productsFromCsv(text: string): Product[] {
  const rows = parseCsv(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map(normalizeHeader);
  const keys = headers.map((h) => HEADER_MAP[h]);
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
      discount: num(raw.discount ?? "0"),
    });
  }
  return out;
}

export function productsToCsv(products: Product[]): string {
  const header = [
    "id",
    "ten",
    "danh_muc",
    "gia",
    "don_vi",
    "mo_ta",
    "hinh",
    "noi_bat",
    "con_hang",
    "giam_gia",
  ];
  const rows = products.map((p) => [
    p.id,
    p.name,
    p.category,
    String(p.price),
    p.unit,
    p.description,
    p.image,
    p.featured ? "1" : "0",
    p.inStock ? "1" : "0",
    String(p.discount || 0),
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
