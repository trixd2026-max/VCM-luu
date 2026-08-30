import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Gift, Heart, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { SHOP, BASKET_TIERS } from "@/lib/shop";
import { useCatalog } from "@/lib/catalog-store";
import { formatVnd } from "@/lib/format";
import { CATEGORIES } from "@/lib/catalog";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const products = useCatalog((s) => s.products);
  const featuredFruit = products
    .filter((p) => p.featured && (p.category === "trai-cay-vuon" || p.category === "trai-cay-nhap"))
    .slice(0, 4);
  const featuredGifts = products
    .filter(
      (p) =>
        p.featured &&
        (p.category === "gio-trai-cay" || p.category === "lang-hoa" || p.category === "trap-cuoi"),
    )
    .slice(0, 4);
  const featured = [...featuredFruit, ...featuredGifts];

  return (
    <main>
      {/* Banner panel + nút nổi */}
      <section className="relative bg-[#e7f4c4]">
        <div className="relative mx-auto max-w-6xl">
          <img
            src="/products/panel.jpg"
            alt="Vườn Của Mít — trái cây, giỏ quà, tráp cưới, hoa viếng"
            className="w-full object-contain"
          />
          {/* Nút nổi trên panel */}
          <div className="absolute inset-x-0 bottom-4 z-10 flex flex-wrap items-center justify-center gap-2 px-4 sm:bottom-8 sm:gap-3">
            <Button
              asChild
              size="lg"
              className="h-11 min-w-[140px] shadow-lg sm:h-12 sm:min-w-[160px]"
            >
              <Link to="/cua-hang">
                Xem cửa hàng
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-11 min-w-[140px] shadow-lg sm:h-12 sm:min-w-[160px]"
            >
              <Link to="/gio-trai-cay">Đặt giỏ quà</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:grid-cols-3">
          <TrustItem icon={Leaf} title="Hái trong ngày" text="Cam, quýt, mít, thanh long từ vườn nhà." />
          <TrustItem icon={Gift} title="Gói giỏ từ 300K" text="Kính cúng, biếu tặng, giỏ hoa trái cây." />
          <TrustItem icon={Heart} title="Tráp cưới · hoa viếng" text="Set 5 · 7 · 9 tráp, lẵng hoa tang lễ." />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-wide text-muted-foreground uppercase">Đang có</p>
            <h2 className="font-display mt-1 text-3xl">Đang bán chạy</h2>
          </div>
          <Link to="/cua-hang" className="hidden items-center gap-1 text-sm sm:inline-flex">
            Tất cả
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              to="/cua-hang"
              search={{ nhom: cat.id }}
              className="rounded-2xl bg-background p-6 shadow-[var(--shadow-border)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <p className="font-display text-2xl">{cat.label}</p>
              <p className="mt-2 text-sm text-muted-foreground">{cat.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">Giỏ biếu · kính cúng</p>
        <h2 className="font-display mt-1 text-3xl">Mẫu giỏ gói sẵn</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Chọn mức, ghi dịp và lời nhắn — chị Hằng gói theo trái đang ngon trong ngày.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {BASKET_TIERS.map((tier) => (
            <Link
              key={tier}
              to="/gio-trai-cay"
              search={{ muc: String(tier) }}
              className="rounded-2xl bg-card px-4 py-6 text-center shadow-[var(--shadow-border)]"
            >
              <p className="font-display text-2xl tabular-nums">{formatVnd(tier)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Đặt giỏ này</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl">
            <img src="/products/sau-rieng.jpg" alt="Sầu riêng tại vườn" className="aspect-portrait w-full object-cover lg:aspect-wide" />
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase opacity-70">Câu chuyện</p>
            <h2 className="font-display mt-2 text-4xl italic">{SHOP.name}</h2>
            <p className="mt-4 text-primary-foreground/85">
              Vườn Của Mít lấy trái trong ngày: cam, quýt, bưởi, lê, xoài, thanh long
              và mít Thái. Có trái nhập — kiwi, táo, dưa hấu Kiều Farm — để gói giỏ cho
              đủ sắc. Giao tại Thôn Phụng Sơn, xã Tuy Phước Đông.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <a href={SHOP.zalo} target="_blank" rel="noreferrer">
                  Nhắn Zalo {SHOP.phoneDisplay}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-0 text-primary-foreground shadow-[0_0_0_1px_rgba(246,241,232,0.35)] hover:bg-primary-foreground/10"
              >
                <Link to="/lien-he">Địa chỉ cửa hàng</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function TrustItem({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Leaf;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
