import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gioi thieu",
  description: "Gioi thieu ve do an NextAuth: cac lop bao ve va cach phan quyen.",
  alternates: { canonical: "/about" },
  openGraph: { title: `Gioi thieu | ${SITE_NAME}`, url: "/about", type: "article", locale: "vi_VN" },
};

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `Gioi thieu | ${SITE_NAME}`,
    url: `${SITE_URL}/about`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    inLanguage: "vi",
  };
  return (
    <main>
      <h1>Gioi thieu</h1>
      <p>
        Ung dung dung NextAuth (JWT session) voi GitHub OAuth va Credentials. Vai tro <b>admin</b>{" "}
        va <b>user</b> duoc kiem tra o Middleware, o page va trong Server Action.
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }}
      />
    </main>
  );
}
