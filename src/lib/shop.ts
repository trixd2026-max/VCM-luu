export const SHOP = {
  name: "Vườn Của Mít",
  shortName: "Vườn Mít",
  owner: "Chị Hằng",
  phone: "0909123456",
  phoneDisplay: "0909 123 456",
  phone2: "0912345678",
  phone2Display: "0912 345 678",
  zalo: "https://zalo.me/0909123456",
  facebook: "https://facebook.com/vuoncuamit",
  address: "Ấp 3, xã Tân An, huyện Cái Bè, Tiền Giang",
  hours: "6:00 – 18:00 (hàng ngày)",
  email: "trixd2026@gmail.com",
} as const;

/** Options phí ship — đồng bộ form /thanh-toan */
export const SHIPPING_OPTIONS = [
  { id: "pickup", label: "Tự đến lấy tại vườn", fee: 0 },
  { id: "xa", label: "Giao trong xã", fee: 15000 },
  { id: "huyen", label: "Giao trong huyện", fee: 30000 },
  { id: "xa-hon", label: "Xa hơn (thỏa thuận)", fee: 0 },
] as const;

export type ShippingOptionId = (typeof SHIPPING_OPTIONS)[number]["id"];

export const DELIVERY_SLOTS = [
  { id: "sang", label: "Sáng (7–11h)" },
  { id: "chieu", label: "Chiều (13–17h)" },
  { id: "toi", label: "Tối (sau 17h)" },
] as const;

export type DeliverySlotId = (typeof DELIVERY_SLOTS)[number]["id"];

export const DELIVERY_DAYS = [
  { id: "hom-nay", label: "Hôm nay" },
  { id: "ngay-mai", label: "Ngày mai" },
  { id: "hen", label: "Chọn ngày trên lịch" },
] as const;

export type DeliveryDayId = (typeof DELIVERY_DAYS)[number]["id"];

/** Nhóm danh mục cửa hàng */
export const CATEGORIES = [
  { id: "trai-cay", label: "Trái cây" },
  { id: "gio-trai-cay", label: "Giỏ trái cây" },
  { id: "trap-cuoi-hoi", label: "Tráp cưới hỏi" },
  { id: "hoa-vieng", label: "Hoa viếng" },
  { id: "khac", label: "Khác" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function categoryLabel(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

/** Mức giá giỏ quà — lấy từ catalog category gio-trai-cay */
export function getBasketTiers(products: { id: string; name: string; price: number; category?: string; inStock?: boolean }[]) {
  return products
    .filter((p) => (p.category === "gio-trai-cay" || p.id.startsWith("gio-")) && p.inStock !== false)
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
    }))
    .sort((a, b) => a.price - b.price);
}
