import type { Product } from "./catalog";

/** Có theo dõi số lượng? (có điền ton_kho trên Sheet) */
export function tracksStock(p: Product): boolean {
  return typeof p.stock === "number" && Number.isFinite(p.stock);
}

/** Còn bán được không */
export function isAvailable(p: Product): boolean {
  if (!p.inStock) return false;
  if (tracksStock(p) && (p.stock as number) <= 0) return false;
  return true;
}

/** Số còn lại — null = không giới hạn số lượng */
export function remainingStock(p: Product): number | null {
  if (!tracksStock(p)) return null;
  return Math.max(0, p.stock as number);
}

/** Max qty cho phép thêm vào giỏ */
export function maxOrderQty(p: Product): number {
  const r = remainingStock(p);
  if (r === null) return 99;
  return Math.min(99, r);
}

/** Nhãn hiển thị tồn */
export function stockLabel(p: Product): string | null {
  if (!p.inStock || (tracksStock(p) && (p.stock as number) <= 0)) return "Hết hàng";
  const r = remainingStock(p);
  if (r === null) return null;
  if (r <= 3) return `Sắp hết · còn ${r}`;
  return `Còn ${r}`;
}
