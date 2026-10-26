import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Nav from "./nav";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: "Demo NextAuth: OAuth + email/mat khau, phan quyen admin/user, SEO.",
};

// Layout khong doc session tren server de cac trang cong khai van prerender tinh (nhanh, SEO tot).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
