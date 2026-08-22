import { useEffect, type ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { MobileTabbar } from "./mobile-tabbar";
import { useCatalog } from "@/lib/catalog-store";

export function SiteShell({ children }: { children: ReactNode }) {
  const load = useCatalog((s) => s.load);
  const loaded = useCatalog((s) => s.loaded);

  useEffect(() => {
    if (!loaded) void load();
  }, [load, loaded]);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="flex-1 pb-20 md:pb-0">{children}</div>
      <SiteFooter />
      <MobileTabbar />
    </div>
  );
}
