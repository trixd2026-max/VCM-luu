import { create } from "zustand";
import { LOCAL_PRODUCTS, type Product } from "./catalog";
import { fetchCatalog } from "./sheet";
import { useSheetConfig } from "./sheet-config";

type CatalogState = {
  products: Product[];
  source: "local" | "sheet";
  warning?: string;
  loading: boolean;
  loaded: boolean;
  load: () => Promise<void>;
  /** Ép đọc lại Sheet (bỏ qua cờ loaded) */
  reload: () => Promise<void>;
};

export const useCatalog = create<CatalogState>((set, get) => ({
  products: LOCAL_PRODUCTS,
  source: "local",
  loading: false,
  loaded: false,
  load: async () => {
    if (get().loaded || get().loading) return;
    await get().reload();
  },
  reload: async () => {
    const cfg = useSheetConfig.getState();
    const hasSheet = Boolean(cfg.sheetId.trim() || cfg.csvUrl.trim());
    if (!hasSheet) {
      set({
        products: LOCAL_PRODUCTS,
        source: "local",
        loaded: true,
        warning: undefined,
        loading: false,
      });
      return;
    }
    if (get().loading) return;
    set({ loading: true });
    try {
      const result = await fetchCatalog({
        data: {
          sheetId: cfg.sheetId.trim() || undefined,
          // Chỉ truyền csvUrl nếu là link export/csv thật, không phải /edit
          csvUrl: (() => {
            const u = cfg.csvUrl.trim();
            if (!u) return undefined;
            if (u.includes("/edit")) return undefined;
            return u;
          })(),
          gid: cfg.gid.trim() || undefined,
          sheetName: cfg.sheetName.trim() || undefined,
        },
      });
      set({
        products: result.products,
        source: result.source,
        warning: result.warning,
        loading: false,
        loaded: true,
      });
    } catch {
      set({
        products: LOCAL_PRODUCTS,
        source: "local",
        warning: "Không đồng bộ được Sheet, đang dùng bảng mẫu.",
        loading: false,
        loaded: true,
      });
    }
  },
}));

export function findProduct(products: Product[], id: string) {
  return products.find((p) => p.id === id);
}
