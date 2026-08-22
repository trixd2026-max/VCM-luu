import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { QtyControl } from "@/components/qty-control";
import { ProductImage } from "@/components/product-image";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart, cartTotal } from "@/lib/cart";
import { formatVnd } from "@/lib/format";
import { useCartReady } from "@/hooks/use-hydrated";

export const Route = createFileRoute("/gio-hang")({ component: CartPage });

function CartPage() {
  const lines = useCart((s) => s.lines);
  const ready = useCartReady();
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const total = cartTotal(lines);

  if (!ready) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-4xl">Giỏ hàng</h1>
        <Skeleton className="mt-8 h-28 w-full" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl">Giỏ hàng</h1>
      {lines.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">Giỏ đang trống.</p>
          <Button asChild className="mt-6">
            <Link to="/cua-hang">Chọn trái cây</Link>
          </Button>
        </div>
      ) : (
        <>
          <ul className="mt-8 flex flex-col gap-6">
            {lines.map((line) => (
              <li key={line.id} className="flex gap-4 border-b border-border pb-6">
                <div className="size-24 overflow-hidden rounded-lg bg-muted">
                  <ProductImage src={line.image} alt={line.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{line.name}</p>
                  {line.note ? (
                    <p className="text-sm text-muted-foreground">{line.note}</p>
                  ) : null}
                  <p className="mt-1 text-sm tabular-nums">
                    {formatVnd(line.price)}/{line.unit}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <QtyControl value={line.qty} onChange={(n) => setQty(line.id, n)} />
                    <button
                      type="button"
                      className="text-sm text-muted-foreground"
                      onClick={() => remove(line.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center justify-between">
            <span className="text-muted-foreground">Tổng</span>
            <span className="font-display text-2xl tabular-nums">{formatVnd(total)}</span>
          </div>
          <Button asChild size="lg" className="mt-6 w-full">
            <Link to="/thanh-toan">Đặt hàng</Link>
          </Button>
        </>
      )}
    </main>
  );
}
