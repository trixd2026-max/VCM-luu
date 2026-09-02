import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { QtyControl } from "@/components/qty-control";
import { ProductImage } from "@/components/product-image";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart, cartCount, cartTotal } from "@/lib/cart";
import { formatVnd } from "@/lib/format";
import { printOrderEstimate } from "@/lib/order-print";
import { useCartReady } from "@/hooks/use-hydrated";

export const Route = createFileRoute("/gio-hang")({ component: CartPage });

function CartPage() {
  const lines = useCart((s) => s.lines);
  const ready = useCartReady();
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const total = cartTotal(lines);
  const count = cartCount(lines);

  function handlePrint() {
    const res = printOrderEstimate({
      title: "Tạm tính đơn hàng",
      lines,
    });
    if (!res.ok) toast.error(res.error);
  }

  if (!ready) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-4xl">Giỏ hàng</h1>
        <div className="mt-8 flex flex-col gap-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 pb-28">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">Giỏ hàng</h1>
          {lines.length > 0 ? (
            <p className="mt-1 text-sm text-muted-foreground tabular-nums">
              {count} món · {lines.length} dòng
            </p>
          ) : null}
        </div>
        {lines.length > 0 ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              onClick={handlePrint}
            >
              <Printer className="size-3.5" />
              In / PDF
            </button>
            <button
              type="button"
              className="text-sm text-muted-foreground underline-offset-2 hover:underline"
              onClick={() => clear()}
            >
              Xóa hết
            </button>
          </div>
        ) : null}
      </div>

      {lines.length === 0 ? (
        <div className="mt-12 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-secondary">
            <ShoppingBag className="size-6 text-muted-foreground" />
          </span>
          <p className="mt-4 font-medium">Giỏ đang trống</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Chọn trái cây vườn, giỏ quà hoặc hộp quà để bắt đầu đặt hàng.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link to="/cua-hang">Cửa hàng</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/gio-trai-cay">Đặt giỏ theo dịp</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <ul className="mt-8 flex flex-col gap-4">
            {lines.map((line) => {
              const lineTotal = line.price * line.qty;
              return (
                <li
                  key={line.id}
                  className="flex gap-3 rounded-xl border border-border bg-card p-3 sm:gap-4 sm:p-4"
                >
                  <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24">
                    <ProductImage src={line.image} alt={line.name} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-medium leading-snug">{line.name}</p>
                        {line.note ? (
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {line.note}
                          </p>
                        ) : null}
                        <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                          {formatVnd(line.price)}
                          <span>/{line.unit}</span>
                        </p>
                      </div>
                      <p className="shrink-0 font-medium tabular-nums">
                        {formatVnd(lineTotal)}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <QtyControl value={line.qty} onChange={(n) => setQty(line.id, n)} />
                      <button
                        type="button"
                        className="text-sm text-muted-foreground underline-offset-2 hover:underline"
                        onClick={() => remove(line.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Tổng cộng</p>
                <p className="font-display text-xl tabular-nums leading-tight">
                  {formatVnd(total)}
                </p>
              </div>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="h-12 shrink-0 gap-1.5 px-3"
                onClick={handlePrint}
              >
                <Printer className="size-4" />
                <span className="hidden sm:inline">In</span>
              </Button>
              <Button asChild size="lg" className="h-12 shrink-0 px-5">
                <Link to="/thanh-toan">Đặt hàng</Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
