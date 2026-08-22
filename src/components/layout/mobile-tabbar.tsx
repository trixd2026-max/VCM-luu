import { Link, useRouterState } from "@tanstack/react-router";
import { Gift, Home, ShoppingBag, Store } from "lucide-react";
import { useCart, cartCount } from "@/lib/cart";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Trang chủ", icon: Home },
  { to: "/cua-hang", label: "Cửa hàng", icon: Store },
  { to: "/gio-trai-cay", label: "Giỏ quà", icon: Gift },
  { to: "/gio-hang", label: "Giỏ hàng", icon: ShoppingBag },
] as const;

export function MobileTabbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lines = useCart((s) => s.lines);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(lines) : 0;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-4">
        {TABS.map((tab) => {
          const active =
            tab.to === "/"
              ? pathname === "/"
              : pathname === tab.to || pathname.startsWith(`${tab.to}/`);
          const Icon = tab.icon;
          return (
            <li key={tab.to}>
              <Link
                to={tab.to}
                className={cn(
                  "relative flex h-14 flex-col items-center justify-center gap-0.5 text-[11px]",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                {tab.label}
                {tab.to === "/gio-hang" && count > 0 ? (
                  <span className="absolute top-1.5 right-6 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground tabular-nums">
                    {count}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
