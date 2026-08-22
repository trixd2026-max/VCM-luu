import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteShell } from "@/components/layout/site-shell";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { SHOP } from "@/lib/shop";
import appCss from "../styles.css?url";

const APP_NAME = SHOP.name;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${APP_NAME} — Trái cây vườn, giỏ quà, tráp cưới hỏi` },
      {
        name: "description",
        content:
          "Vườn Của Mít — trái cây, nông sản sạch, giỏ kính cúng và tráp cưới hỏi. Chị Hằng 0345 662 166, Thôn Phụng Sơn, Tuy Phước Đông, Gia Lai.",
      },
      { name: "theme-color", content: "#2c5340" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="vi" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <SiteShell>
            <Outlet />
          </SiteShell>
          <WhatsappFab />
          <Toaster
            position="top-center"
            toastOptions={{
              className:
                "font-sans bg-card text-foreground border-border shadow-[0_8px_24px_rgba(28,38,31,0.12)]",
            }}
          />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
