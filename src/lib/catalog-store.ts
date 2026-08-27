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
};

export const useCatalog = create<CatalogState>((set, get) => ({
  products: LOCAL_PRODUCTS,
  source: "local",
  loading: false,
  loaded: false,
  load: async () => {
    const cfg = useSheetConfig.getState();
    const hasSheet = Boolean(cfg.sheetId.trim() || cfg.csvUrl.trim());
    if (!hasSheet) {
      set({ products: LOCAL_PRODUCTS, source: "local", loaded: true, warning: undefined, loading: false });
      return;
    }
    if (get().loading) return;
    set({ loading: true });
    try {
      const result = await fetchCatalog({
        data: {
          sheetId: cfg.sheetId.trim() || undefined,
          csvUrl: cfg.csvUrl.trim() || undefined,
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
