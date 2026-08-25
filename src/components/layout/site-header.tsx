import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { SHOP } from "@/lib/shop";
import { useCart, cartCount } from "@/lib/cart";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { CartDrawer } from "@/components/cart-drawer";
import { ZaloMark } from "@/components/zalo-icon";

const NAV = [
  { to: "/cua-hang", label: "Cửa hàng" },
  { to: "/gio-trai-cay", label: "Giỏ quà" },
  { to: "/trap-cuoi-hoi", label: "Tráp cưới" },
  { to: "/lien-he", label: "Liên hệ" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const lines = useCart((s) => s.lines);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(lines) : 0;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <div className="bg-primary px-4 py-2 text-center text-xs text-primary-foreground sm:text-sm">
        Đặt giỏ từ 300.000đ · Nhắn Zalo {SHOP.owner} {SHOP.phoneDisplay}
      </div>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-md bg-primary">
              <LeafMark />
            </span>
            <span className="min-w-0">
              <span className="font-display block truncate text-lg leading-none">
                {SHOP.name}
              </span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">
                {SHOP.tagline}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === item.to
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <a
              href={SHOP.zalo}
              target="_blank"
              rel="noreferrer"
              aria-label={`Nhắn Zalo ${SHOP.phoneDisplay}`}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md px-2 text-sm sm:px-3"
            >
              <ZaloMark />
              <span className="hidden tabular-nums sm:inline">{SHOP.phoneDisplay}</span>
            </a>
            <button
              type="button"
              aria-label="Giỏ hàng"
              className="relative grid size-11 place-items-center"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="size-5" />
              {count > 0 ? (
                <span className="absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground tabular-nums">
                  {count}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
              className="grid size-11 place-items-center lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {menuOpen ? (
          <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 lg:hidden">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-3 text-sm"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={SHOP.zalo}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-md px-3 py-3 text-sm"
            >
              <ZaloMark className="size-6" />
              Nhắn Zalo {SHOP.phoneDisplay}
            </a>
          </nav>
        ) : null}
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

function LeafMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-primary-foreground" aria-hidden>
      <ellipse cx="12" cy="14" rx="6" ry="7" />
      <rect x="11" y="4" width="2" height="4" rx="1" />
    </svg>
  );
}
