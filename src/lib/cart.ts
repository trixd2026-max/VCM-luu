import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./catalog";
import { salePrice } from "./catalog";

export type CartLine = {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  qty: number;
  note?: string;
};

type CartState = {
  lines: CartLine[];
  add: (product: Product, qty?: number, note?: string) => void;
  addCustom: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (product, qty = 1, note) => {
        const id = note ? `${product.id}::${note.slice(0, 24)}` : product.id;
        const existing = get().lines.find((l) => l.id === id);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.id === id ? { ...l, qty: l.qty + qty } : l,
            ),
          });
          return;
        }
        set({
          lines: [
            ...get().lines,
            {
              id,
              name: product.name,
              price: salePrice(product),
              unit: product.unit,
              image: product.image,
              qty,
              note,
            },
          ],
        });
      },
      addCustom: (line) => {
        const existing = get().lines.find((l) => l.id === line.id);
        const qty = line.qty ?? 1;
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.id === line.id ? { ...l, qty: l.qty + qty } : l,
            ),
          });
          return;
        }
        set({ lines: [...get().lines, { ...line, qty }] });
      },
      setQty: (id, qty) => {
        if (qty <= 0) {
          set({ lines: get().lines.filter((l) => l.id !== id) });
          return;
        }
        set({
          lines: get().lines.map((l) => (l.id === id ? { ...l, qty } : l)),
        });
      },
      remove: (id) => set({ lines: get().lines.filter((l) => l.id !== id) }),
      clear: () => set({ lines: [] }),
    }),
    { name: "vcm-cart" },
  ),
);

export function cartCount(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.qty, 0);
}

export function cartTotal(lines: CartLine[]) {
  return lines.reduce((n, l) => n + l.price * l.qty, 0);
}
