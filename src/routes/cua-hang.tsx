import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { CATEGORIES, type CategoryId } from "@/lib/catalog";
import { useCatalog } from "@/lib/catalog-store";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ShopSearch = { nhom?: string; q?: string };

/** Số SP mỗi lần “Xem thêm” */
const PAGE_SIZE = 24;

type PriceFilterId = "all" | "lt100" | "100-300" | "300-500" | "gte500";

const PRICE_FILTERS: {
  id: PriceFilterId;
  label: string;
  match: (price: number) => boolean;
}[] = [
  { id: "all", label: "Mọi giá", match: () => true },
  { id: "lt100", label: "Dưới 100K", match: (p) => p > 0 && p < 100_000 },
  {
    id: "100-300",
    label: "100 – 300K",
    match: (p) => p >= 100_000 && p < 300_000,
  },
  {
    id: "300-500",
    label: "300 – 500K",
    match: (p) => p >= 300_000 && p < 500_000,
  },
  { id: "gte500", label: "Từ 500K", match: (p) => p >= 500_000 },
];

export const Route = createFileRoute("/cua-hang")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    nhom: typeof s.nhom === "string" ? s.nhom : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: ShopPage,
});

function ShopPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const products = useCatalog((s) => s.products);
  const warning = useCatalog((s) => s.warning);
  const source = useCatalog((s) => s.source);
  const load = useCatalog((s) => s.load);
  const loaded = useCatalog((s) => s.loaded);
  const [query, setQuery] = useState(search.q ?? "");
  const nhom = (search.nhom as CategoryId | undefined) ?? undefined;
  const [priceId, setPriceId] = useState<PriceFilterId>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    if (!loaded) void load();
  }, [loaded, load]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [nhom, query, priceId]);

  const priceMatch =
    PRICE_FILTERS.find((f) => f.id === priceId)?.match ?? (() => true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (!p.inStock) return false;
      if (nhom && p.category !== nhom) return false;
      if (!priceMatch(p.price)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [products, nhom, query, priceMatch]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const remaining = Math.max(0, filtered.length - visibleCount);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Cửa hàng</p>
      <h1 className="font-display mt-1 text-4xl">Trái cây & giỏ quà</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Giá theo ngày. Đặt giỏ hoặc gọi chị Hằng để chọn trái đang ngon.
      </p>
      {source === "sheet" ? (
        <p className="mt-1 text-xs text-muted-foreground">Đồng bộ từ Google Sheet</p>
      ) : null}
      {warning ? <p className="mt-1 text-xs text-amber-700">{warning}</p> : null}

      <div className="sticky top-14 z-20 -mx-4 mt-8 border-b border-border/80 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:top-16">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm cam, giỏ 500K, tráp…"
            className="pl-10"
          />
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip
            active={!nhom}
            onClick={() => navigate({ search: { nhom: undefined } })}
          >
            Tất cả
          </FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              active={nhom === c.id}
              onClick={() => navigate({ search: { nhom: c.id } })}
            >
              {c.label}
            </FilterChip>
          ))}
        </div>

        <div className="mt-2 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PRICE_FILTERS.map((f) => (
            <FilterChip
              key={f.id}
              active={priceId === f.id}
              onClick={() => setPriceId(f.id)}
              tone="price"
            >
              {f.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Không có món khớp. Thử nhóm khác, khoảng giá khác, hoặc xóa từ khóa.
        </p>
      ) : (
        <>
          <p className="mt-6 text-xs text-muted-foreground">
            {filtered.length} sản phẩm
            {priceId !== "all"
              ? ` · ${PRICE_FILTERS.find((f) => f.id === priceId)?.label}`
              : ""}
            {nhom
              ? ` · ${CATEGORIES.find((c) => c.id === nhom)?.label ?? nhom}`
              : ""}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {hasMore ? (
            <div className="mt-10 flex flex-col items-center gap-2">
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
              >
                Xem thêm {Math.min(PAGE_SIZE, remaining)} sản phẩm
              </Button>
              <p className="text-xs text-muted-foreground">
                Đã hiện {visible.length} / {filtered.length}
              </p>
            </div>
          ) : filtered.length > PAGE_SIZE ? (
            <p className="mt-10 text-center text-xs text-muted-foreground">
              Đã hiện tất cả {filtered.length} sản phẩm
            </p>
          ) : null}
        </>
      )}
    </main>
  );
}

function FilterChip({
  active,
  onClick,
  children,
  tone = "category",
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  tone?: "category" | "price";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-3.5 text-sm transition-colors",
        tone === "price" && "border border-border/80",
        active
          ? tone === "price"
            ? "border-primary bg-primary/10 text-primary"
            : "bg-primary text-primary-foreground"
          : "bg-card text-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
