import { Link } from "@tanstack/react-router";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { useCart, cartCount, cartTotal } from "@/lib/cart";
import { formatVnd } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { QtyControl } from "./qty-control";
import { ProductImage } from "./product-image";

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const count = cartCount(lines);
  const total = cartTotal(lines);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Đóng giỏ"
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-card shadow-[0_0_0_1px_rgba(28,38,31,0.08),-16px_0_48px_rgba(28,38,31,0.12)]">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-4" />
            <h2 className="font-display text-xl">Giỏ hàng</h2>
            {count > 0 ? (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                {count}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Đóng"
            className="grid size-11 place-items-center rounded-md hover:bg-secondary"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-secondary">
                <ShoppingBag className="size-5 text-muted-foreground" />
              </span>
              <p className="mt-4 text-sm font-medium">Chưa có món nào</p>
              <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">
                Ghé cửa hàng chọn trái cây hoặc đặt giỏ quà.
              </p>
              <Button asChild className="mt-6" onClick={onClose}>
                <Link to="/cua-hang">Xem cửa hàng</Link>
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4 py-4">
              {lines.map((line) => {
                const lineTotal = line.price * line.qty;
                return (
                  <li key={line.id} className="flex gap-3">
                    <div className="size-18 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-20">
                      <div className="size-20 overflow-hidden rounded-lg bg-muted">
                        <ProductImage src={line.image} alt={line.name} />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium leading-snug">
                            {line.name}
                          </p>
                          {line.note ? (
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                              {line.note}
                            </p>
                          ) : null}
                          <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                            {formatVnd(line.price)}/{line.unit}
                          </p>
                        </div>
                        <button
                          type="button"
                          aria-label="Xóa"
                          className="grid size-9 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                          onClick={() => remove(line.id)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <QtyControl
                          className="h-9"
                          value={line.qty}
                          onChange={(n) => setQty(line.id, n)}
                        />
                        <span className="text-sm font-medium tabular-nums">
                          {formatVnd(lineTotal)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="flex flex-col gap-3 border-t border-border px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {lines.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tạm tính</span>
                <span className="font-display text-lg tabular-nums">{formatVnd(total)}</span>
              </div>
              <Button asChild className="h-12 w-full">
                <Link to="/thanh-toan" onClick={onClose}>
                  Đặt hàng · {formatVnd(total)}
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/gio-hang" onClick={onClose}>
                  Xem chi tiết giỏ
                </Link>
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" className="w-full" onClick={onClose}>
              <Link to="/gio-trai-cay">Đặt giỏ quà</Link>
            </Button>
          )}
        </footer>
      </aside>
    </div>
  );
}
