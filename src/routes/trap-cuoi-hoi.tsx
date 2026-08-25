import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductCard } from "@/components/product-card";
import { useCatalog } from "@/lib/catalog-store";
import { SHOP } from "@/lib/shop";
import { copyAndOpenZalo } from "@/lib/zalo";

export const Route = createFileRoute("/trap-cuoi-hoi")({ component: WeddingPage });

function WeddingPage() {
  const products = useCatalog((s) => s.products);
  const trays = products.filter((p) => p.category === "trap-cuoi");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  function inquire() {
    if (!phone.trim()) {
      toast.error("Để lại số điện thoại nhé.");
      return;
    }
    const text = [
      `Chị Hằng ơi, em hỏi tráp cưới hỏi ạ.`,
      name ? `Tên: ${name}` : "",
      `SĐT: ${phone}`,
      date ? `Ngày lễ: ${date}` : "",
      note ? `Ghi chú: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    void copyAndOpenZalo(text).then((copied) => {
      if (copied) toast.success("Đã copy nội dung — dán vào Zalo gửi chị Hằng");
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Lễ cưới hỏi</p>
      <h1 className="font-display mt-1 text-4xl">Tráp cưới hỏi</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Gói tráp theo lễ nghi miền Trung: trầu cau, trà rượu, bánh mứt, trái cây.
        Set 5, 7 hoặc 9 tráp — trao đổi màu vải, số lượng và ngày đón với {SHOP.owner}.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl">
        <img
          src="/products/lang-hoa.jpg"
          alt="Hoa tươi cho lễ cưới hỏi"
          className="aspect-video w-full object-cover"
        />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {trays.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <section className="mt-16 grid gap-8 rounded-2xl bg-card p-6 shadow-[var(--shadow-border)] lg:grid-cols-2 lg:p-10">
        <div>
          <h2 className="font-display text-2xl">Đặt lịch tư vấn</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Nên báo trước 7 ngày. Có thể gửi mẫu ảnh tráp gia đình muốn theo.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên cô dâu / chú rể" />
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              placeholder="Số điện thoại"
            />
            <Input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Ngày ăn hỏi / đón dâu" />
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Số tráp, màu sắc, có heo quay không…"
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button size="lg" className="flex-1" onClick={inquire}>
                Nhắn Zalo {SHOP.owner}
              </Button>
              <Button asChild size="lg" variant="outline" className="flex-1">
                <a href={`tel:${SHOP.phone}`}>Gọi {SHOP.phoneDisplay}</a>
              </Button>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-medium">Thường gồm</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <li>Trầu cau, trà, rượu, thuốc</li>
            <li>Bánh mứt, kẹo, hạt</li>
            <li>Mâm trái cây theo mùa — cam, bưởi, nho, táo</li>
            <li>Hoa tươi phủ tráp, nơ</li>
            <li>Người hỗ trợ lễ đón (set 7 và 9)</li>
          </ul>
          <Button asChild variant="ghost" className="mt-6 px-0">
            <Link to="/cua-hang" search={{ nhom: "trap-cuoi" }}>
              Xem các set tráp
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
