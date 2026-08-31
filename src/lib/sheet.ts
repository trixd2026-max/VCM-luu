import { createServerFn } from "@tanstack/react-start";
import { LOCAL_PRODUCTS, productsFromCsv, type Product } from "./catalog";

export type SheetConfigInput = {
  sheetId?: string;
  csvUrl?: string;
  gid?: string;
  sheetName?: string;
};

export type CatalogResult = {
  products: Product[];
  source: "local" | "sheet";
  warning?: string;
};

function isProbablyCsv(text: string) {
  const t = text.trimStart();
  if (t.startsWith("<") || t.startsWith("{")) return false;
  return t.includes(",") || t.includes("\n");
}

async function fetchText(url: string) {
  const res = await fetch(url, {
    headers: {
      Accept: "text/csv,text/plain,*/*",
      "User-Agent": "VuonCuaMit/1.0",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Không tải được bảng (${res.status})`);
  return res.text();
}

function sheetUrls(input: SheetConfigInput): string[] {
  const urls: string[] = [];
  const csvUrl = input.csvUrl?.trim();
  if (csvUrl && !csvUrl.includes("/edit")) urls.push(csvUrl);

  const id = input.sheetId?.trim();
  if (id) {
    const name = encodeURIComponent(input.sheetName?.trim() || "SanPham");
    const gid = encodeURIComponent(input.gid?.trim() || "0");
    urls.push(
      `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${name}`,
    );
    urls.push(
      `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`,
    );
  }
  return urls;
}

export const fetchCatalog = createServerFn({ method: "POST" })
  .validator((input: SheetConfigInput) => input)
  .handler(async ({ data }): Promise<CatalogResult> => {
    const urls = sheetUrls(data);
    if (urls.length === 0) {
      return { products: LOCAL_PRODUCTS, source: "local" };
    }

    const errors: string[] = [];
    for (const url of urls) {
      try {
        const text = await fetchText(url);
        if (!isProbablyCsv(text)) {
          errors.push("Google trả về trang đăng nhập — hãy chia sẻ bảng cho 'bất kỳ ai có liên kết'.");
          continue;
        }
        const products = productsFromCsv(text);
        if (products.length === 0) {
          errors.push("Bảng không có dòng sản phẩm hợp lệ.");
          continue;
        }
        return { products, source: "sheet" };
      } catch (err) {
        errors.push(err instanceof Error ? err.message : "Lỗi mạng");
      }
    }

    return {
      products: LOCAL_PRODUCTS,
      source: "local",
      warning: errors[0] ?? "Không đọc được Google Sheet, đang dùng bảng mẫu.",
    };
  });

export type OrderLinePayload = {
  productId: string;
  name: string;
  qty: number;
  unit: string;
  price: number;
};

export type OrderPayload = {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  note: string;
  total: number;
  items: string;
  /** JSON chi tiết để Apps Script trừ tồn */
  itemsJson: string;
  type: string;
  createdAt: string;
};

export const submitSheetOrder = createServerFn({ method: "POST" })
  .validator((input: { webhookUrl: string; order: OrderPayload }) => input)
  .handler(async ({ data }): Promise<{ saved: boolean; error?: string }> => {
    const webhookUrl = data.webhookUrl.trim();
    if (!webhookUrl) return { saved: false, error: "Chưa cấu hình webhook" };
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.order),
        redirect: "follow",
      });
      if (!res.ok) {
        return { saved: false, error: `Sheet trả ${res.status}` };
      }
      return { saved: true };
    } catch (err) {
      return {
        saved: false,
        error: err instanceof Error ? err.message : "Không ghi được đơn vào Sheet",
      };
    }
  });
