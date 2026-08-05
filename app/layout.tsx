import type { Metadata } from "next";
import Image from "next/image";
import { Archivo, Karla, JetBrains_Mono } from "next/font/google";
import { BUSINESS as B, NAP, isResolved } from "@/content/business";
import { ROUTES } from "@/lib/routes";
import SiteNav from "@/components/SiteNav";
import StickyCall from "@/components/StickyCall";
import "./globals.css";

const display = Archivo({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-archivo" });
const body = Karla({ subsets: ["latin"], variable: "--font-karla" });
const data = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-jbm" });

export const metadata: Metadata = {
  metadataBase: new URL(B.url),
  title: { default: `${B.name} — Barbershop in ${NAP.cityState}`, template: `%s | ${B.name}` },
  description:
    "Community barbershop in Bellingham. Open seven days, walk-ins welcome, $12 Tuesdays for anyone who needs the break.",
  openGraph: {
    type: "website",
    siteName: B.name,
    url: B.url,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${B.name} in ${NAP.cityState}` }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

const FOOTER_LINKS = [
  { name: "Services", href: ROUTES.services },
  { name: "Prices", href: ROUTES.pricing },
  { name: "Community", href: ROUTES.community },
  { name: "Gallery", href: ROUTES.gallery },
  { name: "Reviews", href: ROUTES.reviews },
  { name: "About", href: ROUTES.about },
  { name: "Book", href: ROUTES.book },
  { name: "Contact", href: ROUTES.contact },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const socials = B.sameAs.filter(isResolved);
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${data.variable}`}>
      <body className="pb-20 md:pb-0">
        <header className="sticky top-0 z-40 border-b-2 border-ink bg-shopwhite/95 backdrop-blur">
          <div className="relative mx-auto max-w-5xl px-5 py-3 flex items-center gap-4">
            <a href={ROUTES.home} className="flex items-center gap-2.5 shrink-0">
              <Image src="/images/bs-logo.webp" alt="Barber Shack logo" width={32} height={32} className="rounded-full" priority />
              <span className="display text-xl sm:text-2xl">{B.name}</span>
            </a>
            <SiteNav />
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-5">{children}</main>

        <footer className="border-t-2 border-ink mt-20">
          <div className="mx-auto max-w-5xl px-5 py-12 grid gap-10 sm:grid-cols-2">
            <div className="board text-sm">
              {/* NAP appears here exactly as it appears in schema and GBP — Rule 9. */}
              <p className="display text-2xl mb-3">{B.name}</p>
              <p>{NAP.full}</p>
              <p className="mt-1">
                <a href={`tel:${B.phoneTel}`} className="hover:text-signal">{B.phoneDisplay}</a>
                {isResolved(B.email) ? ` · ${B.email}` : ""}
              </p>
              <p className="mt-4 text-chrome">
                Open seven days · Walk-ins welcome · Wheelchair accessible · $12 Tuesdays
              </p>
              <p className="mt-2 text-xs text-chrome">
                {B.legalName} · WA salon license #{B.shopLicense} · UBI {B.ubi}
              </p>
              {socials.length > 0 && (
                <p className="mt-3 flex gap-4">
                  {socials.map((u) => (
                    <a key={u} href={u} target="_blank" rel="noopener" className="hover:text-signal">
                      {u.includes("facebook") ? "Facebook" : u.includes("instagram") ? "Instagram" : "Link"}
                    </a>
                  ))}
                </p>
              )}
            </div>
            <nav className="board text-sm sm:text-right grid grid-cols-2 gap-y-2 sm:block sm:space-y-2 self-start">
              {FOOTER_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="block hover:text-signal">{l.name}</a>
              ))}
            </nav>
          </div>
          <div className="border-t border-chrome/30">
            <p className="mx-auto max-w-5xl px-5 py-5 board text-xs text-chrome">
              © {new Date().getFullYear()} {B.name} · {NAP.cityState}
            </p>
          </div>
        </footer>

        <StickyCall />
      </body>
    </html>
  );
}
