import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BASKET_OCCASIONS, getBasketTiers } from "@/lib/shop";
import { formatVnd } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { useCatalog } from "@/lib/catalog-store";
import { cn } from "@/lib/utils";

/** Ảnh dự phòng khi Sheet chưa gắn hình cho mức giá */
const FALLBACK_TIER_IMAGE: Record<number, string> = {
  300_000: "/products/gio-300k.jpg",
  350_000: "/products/gio-350k.jpg",
  400_000: "/products/gio-400k.jpg",
  450_000: "/products/gio-gc450.jpg",
  500_000: "/products/gio-500k.jpg",
  550_000: "/products/gio-gc550.jpg",
  600_000: "/products/gio-600k.jpg",
  650_000: "/products/gio-650k.jpg",
  700_000: "/products/gio-700k.jpg",
  750_000: "/products/gio-hoa-750k.jpg",
  800_000: "/products/gio-hoa-800k.jpg",
  850_000: "/products/gio.jpg",
  900_000: "/products/gio-900k.jpg",
  1_000_000: "/products/gio-1trieu.jpg",
};

type Search = { muc?: string };

export const Route = createFileRoute("/gio-trai-cay")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    muc: typeof s.muc === "string" ? s.muc : undefined,
  }),
  component: BasketPage,
});

function BasketPage() {
  const search = Route.useSearch();
  const products = useCatalog((s) => s.products);
  const load = useCatalog((s) => s.load);
  const loaded = useCatalog((s) => s.loaded);
  const addCustom = useCart((s) => s.addCustom);

  useEffect(() => {
    if (!loaded) void load();
  }, [loaded, load]);

  const tiers = useMemo(() => getBasketTiers(products), [products]);
  const tierPrices = useMemo(() => tiers.map((t) => t.price), [tiers]);

  const initialFromUrl = Number(search.muc) || 0;
  const defaultTier =
    (initialFromUrl && tierPrices.includes(initialFromUrl)
      ? initialFromUrl
      : tierPrices[0]) || 500_000;

  const [tier, setTier] = useState(defaultTier);
  const [occasion, setOccasion] = useState("bieu-tang");
  const [picks, setPicks] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [when, setWhen] = useState("");

  // Khi catalog / URL đổi → chọn lại mức hợp lệ
  useEffect(() => {
    if (tierPrices.length === 0) return;
    if (!tierPrices.includes(tier)) {
      setTier(
        initialFromUrl && tierPrices.includes(initialFromUrl)
          ? initialFromUrl
          : tierPrices[0],
      );
    }
  }, [tierPrices, tier, initialFromUrl]);

  const selected = tiers.find((t) => t.price === tier);
  const heroImage =
    selected?.product?.image ||
    FALLBACK_TIER_IMAGE[tier] ||
    "/products/gio.jpg";

  const fruits = products.filter(
    (p) => p.category === "trai-cay-vuon" || p.category === "trai-cay-nhap",
  );

  function toggle(id: string) {
    setPicks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function addBasket() {
    const occ = BASKET_OCCASIONS.find((o) => o.id === occasion)?.label ?? occasion;
    const names = fruits.filter((f) => picks.includes(f.id)).map((f) => f.name);
    const note = [
      occ,
      names.length ? `Ưu tiên: ${names.join(", ")}` : "Trái theo ngày",
      message,
      when ? `Giao: ${when}` : "",
      selected?.product ? `Mẫu: ${selected.product.name}` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    addCustom({
      id: selected?.product
        ? `gio-${selected.product.id}-${Date.now()}`
        : `gio-custom-${tier}-${Date.now()}`,
      name: selected?.product?.name ?? `Giỏ trái cây ${formatVnd(tier)}`,
      price: tier,
      unit: "giỏ",
      image: heroImage,
      note,
    });
    toast.success("Đã thêm giỏ vào hàng");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Dịch vụ gói</p>
      <h1 className="font-display mt-1 text-4xl">Giỏ trái cây theo ý</h1>
      <p className="mt-3 text-muted-foreground">
        Kính cúng, biếu tặng — mức giá đồng bộ từ cửa hàng (Google Sheet). Gói giấy kính, nơ,
        hoa — giao đúng giờ nếu báo trước.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl">
        <img
          src={heroImage}
          alt={selected?.product?.name ?? "Giỏ trái cây"}
          className="aspect-video w-full object-cover"
        />
      </div>

      {selected?.product ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Mẫu tham chiếu: <span className="font-medium text-foreground">{selected.product.name}</span>
          {selected.product.description ? ` — ${selected.product.description}` : ""}
        </p>
      ) : null}

      <h2 className="font-display mt-10 text-xl">Chọn mức</h2>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {tiers.map(({ price }) => (
          <button
            key={price}
            type="button"
            onClick={() => setTier(price)}
            className={cn(
              "h-14 rounded-xl text-sm tabular-nums",
              tier === price ? "bg-primary text-primary-foreground" : "bg-card",
            )}
          >
            {formatVnd(price)}
          </button>
        ))}
      </div>

      <h2 className="font-display mt-10 text-xl">Dịp</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {BASKET_OCCASIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setOccasion(o.id)}
            className={cn(
              "h-11 rounded-full px-4 text-sm",
              occasion === o.id ? "bg-primary text-primary-foreground" : "bg-card",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      <h2 className="font-display mt-10 text-xl">Ưu tiên trái (không bắt buộc)</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {fruits.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => toggle(f.id)}
            className={cn(
              "h-10 rounded-full px-3 text-sm",
              picks.includes(f.id) ? "bg-primary text-primary-foreground" : "bg-card",
            )}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Input
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          placeholder="Ngày / giờ giao, ví dụ sáng mai 8h"
        />
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Lời thiệp: Chúc sức khỏe ông bà…"
        />
      </div>

      <Button size="lg" className="mt-6 w-full" onClick={addBasket}>
        Thêm giỏ {formatVnd(tier)} vào hàng
      </Button>
    </main>
  );
}
