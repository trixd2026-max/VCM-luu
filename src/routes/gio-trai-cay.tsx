import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BASKET_OCCASIONS,
  OCCASION_PRICE_HINTS,
  getBasketTiers,
  isTierSuggested,
  suggestTierPrice,
} from "@/lib/shop";
import { formatVnd } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { useCatalog } from "@/lib/catalog-store";
import { printOrderEstimate } from "@/lib/order-print";
import { cn } from "@/lib/utils";

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

type Search = { muc?: string; dip?: string };

export const Route = createFileRoute("/gio-trai-cay")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    muc: typeof s.muc === "string" ? s.muc : undefined,
    dip: typeof s.dip === "string" ? s.dip : undefined,
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

  const initialOccasion =
    search.dip && BASKET_OCCASIONS.some((o) => o.id === search.dip)
      ? search.dip
      : "bieu-tang";

  const [occasion, setOccasion] = useState(initialOccasion);
  const [tier, setTier] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [when, setWhen] = useState("");
  const [occasionTouched, setOccasionTouched] = useState(false);

  useEffect(() => {
    if (tierPrices.length === 0) return;
    const fromUrl = Number(search.muc) || 0;
    if (fromUrl && tierPrices.includes(fromUrl) && !occasionTouched) {
      setTier(fromUrl);
      return;
    }
    const suggested = suggestTierPrice(tierPrices, occasion);
    if (suggested != null) setTier(suggested);
  }, [occasion, tierPrices, search.muc, occasionTouched]);

  useEffect(() => {
    if (tierPrices.length === 0 || tier <= 0) return;
    if (!tierPrices.includes(tier)) {
      setTier(suggestTierPrice(tierPrices, occasion) ?? tierPrices[0]);
    }
  }, [tierPrices, tier, occasion]);

  const selected = tiers.find((t) => t.price === tier);
  const heroImage =
    selected?.product?.image ||
    FALLBACK_TIER_IMAGE[tier] ||
    "/products/gio.jpg";

  const hint = OCCASION_PRICE_HINTS[occasion];
  const occLabel =
    BASKET_OCCASIONS.find((o) => o.id === occasion)?.label ?? occasion;

  const fruits = products.filter(
    (p) => p.category === "trai-cay-vuon" || p.category === "trai-cay-nhap",
  );

  function toggle(id: string) {
    setPicks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function buildNote() {
    const names = fruits.filter((f) => picks.includes(f.id)).map((f) => f.name);
    return [
      occLabel,
      names.length ? `Ưu tiên: ${names.join(", ")}` : "Trái theo ngày",
      message,
      when ? `Giao: ${when}` : "",
      selected?.product ? `Mẫu: ${selected.product.name}` : "",
    ]
      .filter(Boolean)
      .join(" · ");
  }

  function buildLine() {
    return {
      id: selected?.product
        ? `gio-${selected.product.id}-${Date.now()}`
        : `gio-custom-${tier}-${Date.now()}`,
      name: selected?.product?.name ?? `Giỏ trái cây ${formatVnd(tier)}`,
      price: tier || 0,
      unit: "giỏ",
      image: heroImage,
      note: buildNote(),
      qty: 1,
    };
  }

  function addBasket() {
    if (!tier) {
      toast.error("Chọn mức giá giỏ");
      return;
    }
    addCustom(buildLine());
    toast.success("Đã thêm giỏ vào hàng");
  }

  function printEstimate() {
    if (!tier) {
      toast.error("Chọn mức giá trước khi in");
      return;
    }
    const line = buildLine();
    const res = printOrderEstimate({
      title: `Tạm tính giỏ · ${occLabel}`,
      lines: [line],
      extraNote: hint?.tip,
    });
    if (!res.ok) toast.error(res.error);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Dịch vụ gói</p>
      <h1 className="font-display mt-1 text-4xl">Giỏ trái cây theo ý</h1>
      <p className="mt-3 text-muted-foreground">
        Chọn <strong>dịp</strong> → hệ thống gợi ý mức giá phù hợp. Gói giấy kính, nơ, hoa —
        giao đúng giờ nếu báo trước.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl">
        <img
          src={heroImage}
          alt={selected?.product?.name ?? "Giỏ trái cây"}
          className="aspect-video w-full object-cover"
        />
      </div>

      {selected?.product ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Mẫu: <span className="text-foreground">{selected.product.name}</span>
        </p>
      ) : null}

      <h2 className="font-display mt-10 text-xl">1. Dịp sử dụng</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {BASKET_OCCASIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => {
              setOccasion(o.id);
              setOccasionTouched(true);
            }}
            className={cn(
              "rounded-full px-3.5 py-2 text-sm transition-colors",
              occasion === o.id
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-muted",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      {hint ? (
        <p className="mt-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Gợi ý cho {occLabel}:</span>{" "}
          {hint.tip}
        </p>
      ) : null}

      <h2 className="font-display mt-10 text-xl">2. Mức giá</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Mức <span className="text-primary">viền nổi</span> phù hợp dịp đã chọn
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tiers.map((t) => {
          const suggested = isTierSuggested(t.price, occasion);
          const active = tier === t.price;
          return (
            <button
              key={t.price}
              type="button"
              onClick={() => setTier(t.price)}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm tabular-nums transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : suggested
                    ? "border-2 border-primary/50 bg-primary/5 text-foreground hover:bg-primary/10"
                    : "bg-card text-foreground hover:bg-muted",
              )}
            >
              {formatVnd(t.price)}
              {suggested && !active ? (
                <span className="ml-1 text-[10px] text-primary">phù hợp</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <h2 className="font-display mt-10 text-xl">3. Trái ưu tiên (tuỳ chọn)</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Shop sẽ chọn trái ngon trong ngày; tick nếu muốn ưu tiên món nào
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {fruits.slice(0, 24).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => toggle(f.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm transition-colors",
              picks.includes(f.id)
                ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                : "bg-muted/60 text-foreground hover:bg-muted",
            )}
          >
            {f.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Lời trên thiệp</span>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Chúc mừng… / Kính viếng…"
            rows={3}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Giờ / ngày giao</span>
          <Input
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            placeholder="VD: Sáng mai 9–11h"
          />
          <span className="text-xs text-muted-foreground">
            Chi tiết địa chỉ khi đặt hàng
          </span>
        </label>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button type="button" size="lg" className="flex-1" onClick={addBasket}>
          Thêm giỏ {tier ? formatVnd(tier) : ""} vào hàng
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="gap-2"
          onClick={printEstimate}
        >
          <Printer className="size-4" />
          In / PDF tạm tính
        </Button>
      </div>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Hoặc{" "}
        <Link to="/cua-hang" search={{ nhom: "gio-trai-cay" }} className="underline-offset-2 hover:underline">
          chọn giỏ có sẵn trong cửa hàng
        </Link>
      </p>
    </main>
  );
}
