import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { CATEGORIES, type CategoryId } from "@/lib/catalog";
import { useCatalog } from "@/lib/catalog-store";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ShopSearch = { nhom?: string; q?: string };

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
  const [query, setQuery] = useState(search.q ?? "");
  const nhom = (search.nhom as CategoryId | undefined) ?? undefined;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (nhom && p.category !== nhom) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [products, nhom, query]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Cửa hàng</p>
      <h1 className="font-display mt-1 text-4xl">Trái cây & giỏ quà</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Giá theo ngày. Đặt giỏ hoặc gọi chị Hằng để chọn trái đang ngon.
      </p>
      {source === "sheet" ? (
        <p className="mt-3 text-xs text-primary">Đã đồng bộ từ Google Sheet</p>
      ) : warning ? (
        <p className="mt-3 text-xs text-muted-foreground">{warning}</p>
      ) : null}

      <div className="relative mt-8 max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm cam, giỏ 500K, tráp…"
          className="pl-10"
        />
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
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

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Không có món khớp. Thử nhóm khác hoặc xóa từ khóa.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}

function FilterChip({
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
        "h-10 shrink-0 rounded-full px-4 text-sm",
        active ? "bg-primary text-primary-foreground" : "bg-card text-foreground",
      )}
    >
      {children}
    </button>
  );
}
