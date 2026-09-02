import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { CATEGORIES, type CategoryId } from "@/lib/catalog";
import { useCatalog } from "@/lib/catalog-store";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ShopSearch = { nhom?: string; q?: string };

const PAGE_SIZE = 24;

type PriceFilterId = "all" | "lt100" | "100-300" | "300-500" | "gte500";

const PRICE_FILTERS: {
  id: PriceFilterId;
  label: string;
  short: string;
  match: (price: number) => boolean;
}[] = [
  { id: "all", label: "Mọi giá", short: "Tất cả", match: () => true },
  { id: "lt100", label: "Dưới 100K", short: "<100K", match: (p) => p > 0 && p < 100_000 },
  {
    id: "100-300",
    label: "100 – 300K",
    short: "100–300K",
    match: (p) => p >= 100_000 && p < 300_000,
  },
  {
    id: "300-500",
    label: "300 – 500K",
    short: "300–500K",
    match: (p) => p >= 300_000 && p < 500_000,
  },
  { id: "gte500", label: "Từ 500K", short: "≥500K", match: (p) => p >= 500_000 },
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

  const inStock = useMemo(() => products.filter((p) => p.inStock), [products]);

  const categoryCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of inStock) {
      m.set(p.category, (m.get(p.category) ?? 0) + 1);
    }
    return m;
  }, [inStock]);

  const baseForPrice = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inStock.filter((p) => {
      if (nhom && p.category !== nhom) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [inStock, nhom, query]);

  const priceCounts = useMemo(() => {
    const m = new Map<PriceFilterId, number>();
    for (const f of PRICE_FILTERS) {
      if (f.id === "all") {
        m.set("all", baseForPrice.length);
        continue;
      }
      m.set(
        f.id,
        baseForPrice.filter((p) => f.match(p.price)).length,
      );
    }
    return m;
  }, [baseForPrice]);

  const priceMatch =
    PRICE_FILTERS.find((f) => f.id === priceId)?.match ?? (() => true);

  const filtered = useMemo(() => {
    return baseForPrice.filter((p) => priceMatch(p.price));
  }, [baseForPrice, priceMatch]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const remaining = Math.max(0, filtered.length - visibleCount);

  const hasActiveFilter = Boolean(nhom) || priceId !== "all" || query.trim() !== "";
  const priceLabel = PRICE_FILTERS.find((f) => f.id === priceId)?.label;
  const nhomLabel = nhom
    ? CATEGORIES.find((c) => c.id === nhom)?.label ?? nhom
    : null;

  function clearFilters() {
    setQuery("");
    setPriceId("all");
    void navigate({ search: { nhom: undefined, q: undefined } });
  }

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

      <div className="sticky top-14 z-20 -mx-4 mt-6 border-b border-border/70 bg-background/95 px-4 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/85 md:top-16">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm cam, giỏ 500K, tráp…"
            className="h-10 pl-10 pr-9"
          />
          {query ? (
            <button
              type="button"
              aria-label="Xóa tìm kiếm"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setQuery("")}
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        <div className="mt-2 flex gap-1.5 overflow-x-auto py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip
            active={!nhom}
            onClick={() => navigate({ search: { nhom: undefined } })}
          >
            Tất cả
            <Count n={inStock.length} active={!nhom} />
          </Chip>
          {CATEGORIES.map((c) => {
            const n = categoryCounts.get(c.id) ?? 0;
            return (
              <Chip
                key={c.id}
                active={nhom === c.id}
                onClick={() => navigate({ search: { nhom: c.id } })}
              >
                {c.label}
                <Count n={n} active={nhom === c.id} />
              </Chip>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Lọc theo giá"
          className="inline-flex max-w-full overflow-x-auto rounded-full border border-border bg-card p-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PRICE_FILTERS.map((f) => {
            const n = priceCounts.get(f.id) ?? 0;
            const active = priceId === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setPriceId(f.id)}
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1.5 text-xs transition-colors sm:px-3 sm:text-sm",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                  n === 0 && f.id !== "all" && !active && "opacity-40",
                )}
                title={`${f.label} (${n})`}
              >
                <span className="sm:hidden">{f.short}</span>
                <span className="hidden sm:inline">{f.label}</span>
              </button>
            );
          })}
        </div>

        {hasActiveFilter ? (
          <button
            type="button"
            onClick={clearFilters}
            className="self-start text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline sm:self-auto"
          >
            Xóa bộ lọc
          </button>
        ) : null}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{filtered.length}</span> sản phẩm
        {nhomLabel ? (
          <>
            {" · "}
            <span className="text-foreground">{nhomLabel}</span>
          </>
        ) : null}
        {priceId !== "all" && priceLabel ? (
          <>
            {" · "}
            <span className="text-foreground">{priceLabel}</span>
          </>
        ) : null}
        {query.trim() ? (
          <>
            {" · “"}
            <span className="text-foreground">{query.trim()}</span>
            {'"'}
          </>
        ) : null}
      </p>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Không có món khớp. Thử đổi nhóm, khoảng giá hoặc từ khóa.
          </p>
          {hasActiveFilter ? (
            <Button type="button" variant="outline" className="mt-4" onClick={clearFilters}>
              Xóa bộ lọc
            </Button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
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

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted/70 text-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

function Count({ n, active }: { n: number; active: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-px text-[10px] tabular-nums leading-none",
        active ? "bg-primary-foreground/20" : "bg-background/80 text-muted-foreground",
      )}
    >
      {n}
    </span>
  );
}
