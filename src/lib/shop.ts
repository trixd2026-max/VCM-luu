export const SHOP = {
  name: "Vườn Của Mít",
  tagline: "Trái cây vườn · Giỏ quà · Tráp cưới hỏi",
  owner: "Chị Hằng",
  phone: "0345662166",
  phoneDisplay: "0345 662 166",
  zalo: "https://zalo.me/0345662166",
  whatsapp: "https://wa.me/84345662166",
  whatsappNumber: "84345662166",
  address: "Thôn Phụng Sơn, xã Tuy Phước Đông, tỉnh Gia Lai",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Th%C3%B4n%20Ph%E1%BB%A5ng%20S%C6%A1n%2C%20x%C3%A3%20Tuy%20Ph%C6%B0%E1%BB%9Bc%20%C4%90%C3%B4ng%2C%20t%E1%BB%89nh%20Gia%20Lai",
  hours: "Mở cửa mỗi ngày, 7:00 – 20:00",
  email: "",
} as const;

export const BASKET_TIERS = [300_000, 400_000, 500_000, 1_000_000] as const;

export const BASKET_OCCASIONS = [
  { id: "kinh-cung", label: "Kính cúng" },
  { id: "bieu-tang", label: "Biếu tặng" },
  { id: "sinh-nhat", label: "Sinh nhật" },
  { id: "tham-benh", label: "Thăm bệnh" },
  { id: "tet", label: "Tết / lễ" },
] as const;
