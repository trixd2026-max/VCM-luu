/** Lưu đơn vừa đặt (session) để trang cảm ơn / Zalo */
export type LastOrder = {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  note: string;
  itemsText: string;
  subtotal: number;
  shippingFee: number;
  shippingLabel: string;
  deliveryDay: string;
  deliverySlot: string;
  grandTotal: number;
  message: string;
  createdAt: string;
};

const KEY = "vcm-last-order";

export function saveLastOrder(order: LastOrder) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

export function loadLastOrder(): LastOrder | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LastOrder;
  } catch {
    return null;
  }
}
