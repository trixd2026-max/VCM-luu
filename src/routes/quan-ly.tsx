import { useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSheetConfig } from "@/lib/sheet-config";
import { useCatalog } from "@/lib/catalog-store";
import { LOCAL_PRODUCTS, productsToCsv } from "@/lib/catalog";

export const Route = createFileRoute("/quan-ly")({ component: AdminPage });

/** Apps Script embedded — see /tmp clean version; temporary minimal placeholder restored below */
const SCRIPT = "// Temporary - user should paste clean script from assistant message\nvar ALERT_EMAIL = \"trixd2026@gmail.com\";\n";

function AdminPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-4xl">Google Sheet & tồn kho</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Đang cập nhật mã Apps Script. Vui lòng dùng mã do trợ lý gửi trong chat.
      </p>
    </main>
  );
}
