import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Printer,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { QtyControl } from "@/components/qty-control";
import { ProductImage } from "@/components/product-image";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart, cartCount, cartTotal } from "@/lib/cart";
import { formatVnd } from "@/lib/format";
import { printOrderEstimate } from "@/lib/order-print";
import { SHOP } from "@/lib/shop";
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
    else toast.message("Mở hộp thoại in — chọn “Lưu thành PDF” nếu cần file");
  }

  function handleClear() {
    if (!window.confirm("Xóa toàn bộ món trong giỏ?")) return;
    clear();
    toast.success("Đã xóa giỏ hàng");
  }

  function handleRemove(id: string, name: string) {
    remove(id);
    toast.message(`Đã xóa “${name}”`);
  }

  if (!ready) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-4xl">Giỏ hàng</h1>
        <div className="mt-8 flex flex-col gap-4">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-32 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            Đơn của bạn
          </p>
          <h1 className="font-display mt-0.5 text-3xl sm:text-4xl">Giỏ hàng</h1>
          {lines.length > 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="tabular-nums text-foreground font-medium">{count}</span>{" "}
              món
              {lines.length !== count ? (
                <span className="text-muted-foreground">
                  {" "}
                  · {lines.length} dòng
                </span>
              ) : null}
            </p>
          ) : null}
        </div>
        {lines.length > 0 ? (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground"
              onClick={handlePrint}
            >
              <Printer className="size-3.5" />
              In tạm tính
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-destructive"
              onClick={handleClear}
            >
              <Trash2 className="size-3.5" />
              Xóa hết
            </Button>
          </div>
        ) : null}
      </div>

      {lines.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <ul className="mt-6 flex flex-col gap-3">
            {lines.map((line) => {
              const lineTotal = line.price * line.qty;
              return (
                <li
                  key={line.id}
                  className="flex gap-3 rounded-2xl border border-border/80 bg-card p-3 shadow-sm sm:gap-4 sm:p-4"
                >
                  <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-24">
                    <ProductImage src={line.image} alt={line.name} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium leading-snug text-foreground">
                          {line.name}
                        </p>
                        {line.note ? (
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {line.note}
                          </p>
                        ) : null}
                        <p className="mt-1.5 text-sm text-muted-foreground tabular-nums">
                          {formatVnd(line.price)}
                          <span className="text-muted-foreground/80">/{line.unit}</span>
                        </p>
                      </div>
                      <p className="shrink-0 text-right font-semibold tabular-nums text-foreground">
                        {formatVnd(lineTotal)}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <QtyControl
                        value={line.qty}
                        onChange={(n) => setQty(line.id, n)}
                      />
                      <button
                        type="button"
                        className="text-sm text-muted-foreground underline-offset-2 hover:text-destructive hover:underline"
                        onClick={() => handleRemove(line.id, line.name)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 rounded-2xl border border-border/80 bg-card/80 p-4 sm:p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tạm tính ({count} món)</span>
              <span className="font-medium tabular-nums">{formatVnd(total)}</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Phí ship & giờ giao chọn ở bước đặt hàng. Thanh toán khi nhận hoặc
              chuyển khoản sau khi xác nhận với {SHOP.owner}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link to="/cua-hang">
                  <ShoppingBag className="size-3.5" />
                  Mua thêm
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/gio-trai-cay">Đặt giỏ theo dịp</Link>
              </Button>
            </div>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md">
            <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-muted-foreground">Tổng cộng</p>
                <p className="font-display text-xl tabular-nums leading-none tracking-tight">
                  {formatVnd(total)}
                </p>
              </div>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="hidden h-12 shrink-0 gap-1.5 px-3 sm:inline-flex"
                onClick={handlePrint}
              >
                <Printer className="size-4" />
                In
              </Button>
              <Button asChild size="lg" className="h-12 min-w-[9.5rem] shrink-0 gap-1.5 px-5">
                <Link to="/thanh-toan">
                  Đặt hàng
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function EmptyCart() {
  return (
    <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border bg-gradient-to-b from-card to-muted/30 px-6 py-14 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-secondary shadow-inner">
        <ShoppingBag className="size-7 text-muted-foreground" />
      </span>
      <h2 className="mt-5 font-display text-2xl">Giỏ đang trống</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Chọn trái cây vườn, giỏ quà biếu tặng hoặc tráp cưới — gói tại chỗ, giao
        khu vực Tuy Phước Đông.
      </p>
      <div className="mt-7 flex w-full max-w-xs flex-col gap-2 sm:max-w-none sm:flex-row sm:justify-center">
        <Button asChild size="lg" className="gap-1.5">
          <Link to="/cua-hang">
            <ShoppingBag className="size-4" />
            Vào cửa hàng
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/gio-trai-cay">Đặt giỏ theo dịp</Link>
        </Button>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Cần tư vấn nhanh?{" "}
        <a
          href={SHOP.zalo}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Zalo {SHOP.owner} {SHOP.phoneDisplay}
        </a>
      </p>
    </div>
  );
}
