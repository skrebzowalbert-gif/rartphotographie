/**
 * Zentrale Stammdaten der Website.
 *
 * WICHTIG: Der Produktions-Host MUSS exakt der Host sein, unter dem Vercel
 * ausliefert. Die Domain leitet rartphotographie.de -> www.rartphotographie.de
 * weiter. Steht hier der Host ohne "www", zeigt jedes canonical-Tag und jede
 * Sitemap-URL auf eine Weiterleitung und Google indexiert die Seiten nicht.
 */
const productionSiteUrl = "https://www.rartphotographie.de";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const siteUrl =
  configuredSiteUrl &&
  !configuredSiteUrl.includes("localhost") &&
  !configuredSiteUrl.includes("vercel.app")
    ? configuredSiteUrl
    : productionSiteUrl;

export const instagramUrl =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL ||
  "https://www.instagram.com/r.artphotographie";

export const publicContactEmail = "reginaackermann11@gmail.com";

/**
 * NAP (Name, Address, Phone) – muss zeichengenau mit dem Google-Unternehmens-
 * profil und allen Branchenverzeichnissen übereinstimmen. Abweichungen kosten
 * direkt Sichtbarkeit im lokalen Suchergebnis.
 */
export const business: {
  legalName: string;
  name: string;
  street: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
  phone: string;
  latitude: number;
  longitude: number;
  openingHours:
    | readonly { days: readonly string[]; opens: string; closes: string }[]
    | null;
} = {
  legalName: "Regina Gerdt",
  name: "R.ArtPhotographie",
  street: "Hirtenstraße 16",
  postalCode: "87600",
  city: "Kaufbeuren",
  region: "Bayern",
  country: "DE",

  /**
   * Mobilnummer (einziger Telefonanschluss). Anzeigeformat mit Leerzeichen,
   * der tel:-Link wird daraus automatisch nach E.164 normalisiert.
   *
   * Muss zeichengenau mit dem Google-Unternehmensprofil übereinstimmen.
   */
  phone: "+49 176 81302747",

  /** Koordinaten Hirtenstraße 16, 87600 Kaufbeuren */
  latitude: 47.8809,
  longitude: 10.6215,

  /**
   * TODO REGINA: Telefonische Erreichbarkeit eintragen, z. B.
   *
   *   openingHours: [
   *     { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
   *       opens: "09:00", closes: "18:00" },
   *     { days: ["Saturday"], opens: "10:00", closes: "16:00" },
   *   ],
   *
   * Bewusst auf null: Falsche Öffnungszeiten im Schema sind schädlicher als
   * gar keine. Wer nach der angegebenen Zeit anruft und niemanden erreicht,
   * ist als Kunde weg – und Google gleicht die Angabe mit dem
   * Unternehmensprofil ab. Beide Quellen müssen identisch sein.
   */
  openingHours: null,
};

/** Telefonnummer als tel:-Link, oder null wenn keine hinterlegt ist. */
export const phoneHref = business.phone ? `tel:${business.phone.replace(/[^\d+]/g, "")}` : null;

/** Menschenlesbare Telefonnummer, oder null. */
export const phoneDisplay = business.phone || null;

/** Einzugsgebiet – steuert Schema areaServed und die Ortsnennungen im Text. */
export const areaServed = [
  "Kaufbeuren",
  "Neugablonz",
  "Marktoberdorf",
  "Buchloe",
  "Biessenhofen",
  "Kempten",
  "Füssen",
  "Ostallgäu",
  "Allgäu",
] as const;

/**
 * TODO REGINA: Muss exakt dem Google-Unternehmensprofil entsprechen.
 * Erfundene oder veraltete Zahlen sind ein Verstoß gegen Googles
 * Richtlinien für strukturierte Daten. Auf null setzen, wenn die Zahl
 * nicht öffentlich bei Google nachprüfbar ist – dann wird das
 * Bewertungs-Markup komplett weggelassen.
 */
export const googleReviews: { rating: number; count: number } | null = {
  rating: 5.0,
  count: 46,
};

/** Link zum Google-Unternehmensprofil (für "Bei Google ansehen"). */
export const googleBusinessProfileUrl =
  "https://www.google.com/search?kgmid=/g/11sdxjrxpw";
