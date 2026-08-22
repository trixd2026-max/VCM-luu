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
        <header className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-4" />
            <h2 className="font-display text-xl">Giỏ hàng</h2>
            <span className="text-sm text-muted-foreground tabular-nums">({count})</span>
          </div>
          <button
            type="button"
            aria-label="Đóng"
            className="grid size-11 place-items-center"
            onClick={onClose}
          >
            <X className="size-5" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-5">
          {lines.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Chưa có món nào. Ghé cửa hàng chọn trái cây hoặc đặt giỏ quà.
            </p>
          ) : (
            <ul className="flex flex-col gap-5 py-2">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-3">
                  <div className="size-20 shrink-0 overflow-hidden rounded-md bg-muted">
                    <ProductImage src={line.image} alt={line.name} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="truncate font-medium">{line.name}</p>
                        {line.note ? (
                          <p className="text-xs text-muted-foreground">{line.note}</p>
                        ) : null}
                        <p className="mt-1 text-sm tabular-nums">
                          {formatVnd(line.price)}
                          <span className="text-muted-foreground">/{line.unit}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label="Xóa"
                        className="grid size-10 place-items-center text-muted-foreground"
                        onClick={() => remove(line.id)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <QtyControl
                      className="mt-2 h-9"
                      value={line.qty}
                      onChange={(n) => setQty(line.id, n)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <footer className="flex flex-col gap-3 border-t border-border px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tạm tính</span>
            <span className="font-medium tabular-nums">{formatVnd(total)}</span>
          </div>
          <Button asChild className="h-12 w-full" disabled={lines.length === 0}>
            <Link to="/thanh-toan" onClick={onClose}>
              Đặt hàng
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link to="/gio-hang" onClick={onClose}>
              Xem giỏ hàng
            </Link>
          </Button>
        </footer>
      </aside>
    </div>
  );
}
