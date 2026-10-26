import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trang chu",
  description: "Demo xac thuc NextAuth voi OAuth, email/mat khau va phan quyen admin/user.",
  alternates: { canonical: "/" },
  openGraph: { title: SITE_NAME, url: "/", type: "website", locale: "vi_VN" },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "vi",
  };
  return (
    <main>
      <h1>{SITE_NAME}</h1>
      <p>Demo tich hop NextAuth, phan quyen bang Middleware va Server Action, kem toi uu SEO.</p>
      <ul>
        <li>Tai khoan admin: admin@example.com / admin123</li>
        <li>Tai khoan user: user@example.com / user123</li>
      </ul>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }}
      />
    </main>
  );
}
