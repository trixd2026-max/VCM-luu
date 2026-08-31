import type { Product } from "./catalog";

export const SHOP = {
  name: "Vườn Của Mít",
  tagline: "Trái cây vườn · Giỏ quà · Tráp cưới · Hoa viếng",
  owner: "Chị Hằng",
  phone: "0345662166",
  phoneDisplay: "0345 662 166",
  zalo: "https://zalo.me/0345662166",
  address: "Xóm 1B, Thôn Phụng Sơn, xã Tuy Phước Đông, tỉnh Gia Lai",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=V%C6%AF%E1%BB%9CN%20C%E1%BB%A6A%20MIT%20Th%C3%B4n%20Ph%E1%BB%A5ng%20S%C6%A1n%2C%20x%C3%A3%20Tuy%20Ph%C6%B0%E1%BB%9Bc%20%C4%90%C3%B4ng%2C%20t%E1%BB%89nh%20Gia%20Lai",
  hours: "Mở cửa mỗi ngày, 7:00 – 20:00",
  email: "",
  phone2: "0942223984",
  phone2Display: "0942 223 984",
  facebook: "https://www.facebook.com/profile.php?id=61579721713679",
  facebookMessenger: "https://www.facebook.com/messages/t/774179609114947",
} as const;

/** Mức fallback khi Sheet chưa có sản phẩm giỏ trái cây */
export const FALLBACK_BASKET_TIERS = [
  300_000, 350_000, 400_000, 450_000, 500_000, 550_000, 600_000, 650_000, 700_000,
  750_000, 800_000, 850_000, 900_000, 1_000_000,
] as const;

/** @deprecated Dùng getBasketTiers(products) để đồng bộ từ Sheet */
export const BASKET_TIERS = FALLBACK_BASKET_TIERS;

export const BASKET_OCCASIONS = [
  { id: "kinh-cung", label: "Kính cúng" },
  { id: "bieu-tang", label: "Biếu tặng" },
  { id: "sinh-nhat", label: "Sinh nhật" },
  { id: "tham-benh", label: "Thăm bệnh" },
  { id: "tet", label: "Tết / lễ" },
  { id: "khai-truong", label: "Khai trương" },
  { id: "hoa-vieng", label: "Hoa viếng" },
  { id: "kinh-vieng", label: "Kính viếng" },
] as const;

export type BasketTierOption = {
  price: number;
  product?: Product;
};

/**
 * Lấy danh sách mức giỏ quà từ catalog (Sheet / local).
 * Nguồn đúng = Sheet: mọi dòng gio-trai-cay còn hàng (con_hang=1).
 * Gộp trùng giá → ưu tiên noi_bat=1.
 */
export function getBasketTiers(products: Product[]): BasketTierOption[] {
  const baskets = products.filter(
    (p) => p.category === "gio-trai-cay" && p.inStock && p.price > 0,
  );

  const byPrice = new Map<number, Product>();
  for (const p of baskets) {
    const existing = byPrice.get(p.price);
    if (!existing) {
      byPrice.set(p.price, p);
      continue;
    }
    // Ưu tiên nổi bật
    if (p.featured && !existing.featured) byPrice.set(p.price, p);
  }

  const tiers = [...byPrice.entries()]
    .sort(([a], [b]) => a - b)
    .map(([price, product]) => ({ price, product }));

  if (tiers.length > 0) return tiers;

  return FALLBACK_BASKET_TIERS.map((price) => ({ price }));
}

export function getBasketTierPrices(products: Product[]): number[] {
  return getBasketTiers(products).map((t) => t.price);
}
