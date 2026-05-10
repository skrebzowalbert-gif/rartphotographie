import "./globals.css";
import type { Metadata } from "next";
import SiteShell from "@/components/layout/SiteShell";
import { Playfair_Display } from "next/font/google";
import { instagramUrl, publicContactEmail, siteUrl } from "@/lib/site";

const metadataBase = new URL(siteUrl);

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "R.ArtPhotographie",
  image: `${siteUrl}/images/hero/hero-1.jpg`,
  url: siteUrl,
  email: publicContactEmail,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hirtenstraße 16",
    postalCode: "87600",
    addressLocality: "Kaufbeuren",
    addressCountry: "DE",
  },
  areaServed: ["Kaufbeuren", "Allgäu"],
  sameAs: [instagramUrl],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: 47,
  },
  priceRange: "€€",
  description:
    "Fotografin für Portraitshooting, Hochzeitsfotografie, Familie und Fotoshooting Gutscheine in Kaufbeuren und im Allgäu.",
};

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "R.ArtPhotographie | Fotografin in Kaufbeuren",
    template: "%s",
  },
  description:
    "Fotografin in Kaufbeuren für Portraitshootings, Hochzeiten, Familie und Gutscheine. Emotionale Bilder, persönliche Begleitung und klare Abstimmung.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "R.ArtPhotographie",
    title: "R.ArtPhotographie | Fotografin in Kaufbeuren",
    description:
      "Portrait, Hochzeit, Familie und Gutscheine in Kaufbeuren und im Allgäu.",
    images: [
      {
        url: "/images/hero/hero-1.jpg",
        width: 1200,
        height: 1600,
        alt: "Fotografie von R.ArtPhotographie in Kaufbeuren",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "1S78GFngR4SKMPSWw6KQGZxRKAog87OpV6WtaNiu_VQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      </head>
      <body className={playfair.className}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
