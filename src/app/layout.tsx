import "./globals.css";
import type { Metadata } from "next";
import SiteShell from "@/components/layout/SiteShell";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import GoogleAnalytics from "@/components/analytics/Analytics";
import ConsentBanner from "@/components/analytics/ConsentBanner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter, Playfair_Display } from "next/font/google";
import { siteUrl } from "@/lib/site";
import { buildSiteJsonLd, jsonLdScript } from "@/lib/schema";

const metadataBase = new URL(siteUrl);

// Playfair Display ist eine Display-Schrift: hervorragend für Überschriften,
// bei Fließtext in 14–16 px deutlich schlechter lesbar als eine Grotesk.
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  // Kursiv wird für die Display-Akzente gebraucht. Ohne echten Schnitt
  // würde der Browser die aufrechte Schrift schräg stellen – bei einer
  // Serife sofort als billig erkennbar.
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Fotograf Kaufbeuren – R.ArtPhotographie | Portrait & Hochzeit",
    // Kurz gehalten: Google kürzt Titel ab etwa 60 Zeichen ab. Ein langer
    // Marken-Suffix frisst genau den Platz, in dem das Keyword stehen muss.
    template: "%s | R.ArtPhotographie",
  },
  description:
    "Fotograf in Kaufbeuren für Portrait, Hochzeit, Familie, Babybauch und Newborn. Shootings in Kaufbeuren, Ostallgäu und im Allgäu. Feste Preise, persönliche Begleitung.",
  // Bewusst KEIN alternates.canonical im Root-Layout: eine Seite ohne eigenes
  // canonical würde sonst die Startseite als Original angeben und sich damit
  // selbst aus dem Index nehmen.
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "R.ArtPhotographie",
    images: [
      {
        url: "/images/hero/hero-1.jpg",
        width: 1200,
        height: 1600,
        alt: "Fotograf Kaufbeuren – Aufnahme von R.ArtPhotographie",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  /*
    Search-Console-Verifizierung über eine Umgebungsvariable, mit dem bisher
    fest eingetragenen Wert als Rückfall. Damit lässt sich eine neue Property
    verifizieren, ohne den Code anzufassen – und ein leerer Wert erzeugt kein
    kaputtes Meta-Tag.
  */
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ||
      "1S78GFngR4SKMPSWw6KQGZxRKAog87OpV6WtaNiu_VQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <script {...jsonLdScript(buildSiteJsonLd())} />
        <SiteShell>{children}</SiteShell>
        {/*
          Cookielose Reichweitenmessung. Ohne Zahlen ist nicht feststellbar,
          ob ein Ausbleiben von Anfragen an fehlendem Traffic oder an der
          Conversion liegt – genau das war hier fünf Monate lang unklar.
        */}
        {/* Cookielos, ohne Einwilligung zulässig – liefert Zahlen auch dann,
            wenn Besucher Google Analytics ablehnen. */}
        <Analytics />
        <SpeedInsights />

        {/* Google Analytics lädt ausschließlich nach Einwilligung.
            useSearchParams im Inneren verlangt eine Suspense-Grenze. */}
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <ConsentBanner />
      </body>
    </html>
  );
}
