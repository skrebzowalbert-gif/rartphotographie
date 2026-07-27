import {
  areaServed,
  business,
  googleReviews,
  googleBusinessProfileUrl,
  instagramUrl,
  publicContactEmail,
  siteUrl,
} from "@/lib/site";

/** Stabile @id-Werte, damit Google die Entitäten seitenübergreifend verknüpft. */
export const businessId = `${siteUrl}/#localbusiness`;
export const personId = `${siteUrl}/#regina`;
export const websiteId = `${siteUrl}/#website`;

/**
 * Die Fotografin als Person. Google bewertet lokale Dienstleister höher, wenn
 * eine identifizierbare Person hinter dem Betrieb steht (E-E-A-T).
 */
const personJsonLd = {
  "@type": "Person",
  "@id": personId,
  name: business.legalName,
  alternateName: "Regina",
  jobTitle: "Fotografin",
  worksFor: { "@id": businessId },
  image: `${siteUrl}/images/about/regina_about1.jpg`,
  sameAs: [instagramUrl],
};

const servicesOffered = [
  {
    name: "Portraitshooting",
    description:
      "Portraitfotografie in Kaufbeuren mit ruhiger Anleitung, klaren Posen und natürlicher Bildsprache.",
    url: `${siteUrl}/preise#portrait`,
    price: 200,
  },
  {
    name: "Hochzeitsfotografie",
    description:
      "Hochzeitsfotograf in Kaufbeuren und im Allgäu: vom Standesamt bis zur vollen Tagesreportage.",
    url: `${siteUrl}/preise#hochzeit-mini`,
    price: 350,
  },
  {
    name: "Familienshooting",
    description:
      "Familienfotos in Kaufbeuren und Umgebung, entspannt und ohne Zeitdruck, auch mit kleinen Kindern.",
    url: `${siteUrl}/preise#familie`,
    price: 250,
  },
  {
    name: "Babybauchshooting",
    description:
      "Babybauch- und Schwangerschaftsfotografie in Kaufbeuren, ruhig begleitet und individuell abgestimmt.",
    url: `${siteUrl}/preise#babybauch`,
    price: 200,
  },
  {
    name: "Newbornshooting",
    description:
      "Newborn-Fotografie in Kaufbeuren mit viel Zeit, Wärme und Rücksicht auf den Rhythmus des Babys.",
    url: `${siteUrl}/preise#newborn`,
    price: 250,
  },
];

/**
 * Haupt-Entität: das lokale Unternehmen.
 *
 * Typ-Hierarchie: Photographer ist ein spezialisierter LocalBusiness. Beide
 * Typen anzugeben ist erlaubt und liefert Google die genaueste Kategorie,
 * ohne den allgemeinen LocalBusiness-Kontext zu verlieren.
 */
export function buildLocalBusinessJsonLd() {
  const node: Record<string, unknown> = {
    "@type": ["LocalBusiness", "Photographer"],
    "@id": businessId,
    name: business.name,
    legalName: business.legalName,
    description:
      "Fotografin in Kaufbeuren für Portrait, Hochzeit, Familie, Babybauch und Newborn. Shootings in Kaufbeuren, im Ostallgäu und im gesamten Allgäu.",
    url: siteUrl,
    image: [
      `${siteUrl}/images/hero/hero-1.jpg`,
      `${siteUrl}/images/portrait/portrait-2.jpg`,
      `${siteUrl}/images/weddings/wedding-3.jpg`,
    ],
    logo: `${siteUrl}/images/brand/logo-rart.png`,
    email: publicContactEmail,
    founder: { "@id": personId },
    address: {
      "@type": "PostalAddress",
      streetAddress: business.street,
      postalCode: business.postalCode,
      addressLocality: business.city,
      addressRegion: business.region,
      addressCountry: business.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.latitude,
      longitude: business.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${business.name} ${business.street} ${business.postalCode} ${business.city}`
    )}`,
    areaServed: areaServed.map((city) => ({ "@type": "City", name: city })),
    priceRange: "200 € – 1200 €",
    currenciesAccepted: "EUR",
    knowsLanguage: ["de", "ru"],
    sameAs: [instagramUrl, googleBusinessProfileUrl],
    openingHoursSpecification: business.openingHours.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Fotoshootings in Kaufbeuren und im Allgäu",
      itemListElement: servicesOffered.map((service) => ({
        "@type": "Offer",
        priceCurrency: "EUR",
        price: service.price,
        url: service.url,
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          serviceType: service.name,
          provider: { "@id": businessId },
          areaServed: areaServed.map((city) => ({ "@type": "City", name: city })),
        },
      })),
    },
  };

  // Telefonnummer nur ausgeben, wenn eine hinterlegt ist. Ein leeres
  // telephone-Feld ist ein Fehler in den strukturierten Daten.
  if (business.phone) {
    node.telephone = business.phone;
  }

  // aggregateRating nur ausgeben, wenn die Zahl öffentlich bei Google
  // nachprüfbar ist. Erfundene Bewertungen sind ein Richtlinienverstoß.
  if (googleReviews) {
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: googleReviews.rating,
      reviewCount: googleReviews.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return node;
}

const websiteJsonLd = {
  "@type": "WebSite",
  "@id": websiteId,
  url: siteUrl,
  name: business.name,
  inLanguage: "de-DE",
  publisher: { "@id": businessId },
};

/** Wird einmal im Root-Layout ausgegeben und gilt für die gesamte Website. */
export function buildSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [buildLocalBusinessJsonLd(), personJsonLd, websiteJsonLd],
  };
}

/**
 * FAQ-Markup. Die Fragen stehen bereits als Text auf der Seite – dieses
 * Markup macht daraus ein aufklappbares Google-Suchergebnis.
 */
export function buildFaqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Brotkrumen-Navigation für die Suchergebnisdarstellung. */
export function buildBreadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Start", path: "/" }, ...trail].map(
      (crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: `${siteUrl}${crumb.path}`,
      })
    ),
  };
}

/** Dienstleistungsseite (z. B. die Geo-Landingpages). */
export function buildServiceJsonLd(params: {
  name: string;
  description: string;
  path: string;
  city: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: params.name,
    description: params.description,
    serviceType: "Fotografie",
    url: `${siteUrl}${params.path}`,
    provider: { "@id": businessId },
    areaServed: { "@type": "City", name: params.city },
  };
}

/** Kleiner Helfer, damit die Ausgabe im JSX immer gleich aussieht. */
export function jsonLdScript(data: unknown) {
  return {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  } as const;
}
