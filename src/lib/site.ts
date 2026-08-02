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
  economicIdNumber: string;
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

  /**
   * Wirtschafts-Identifikationsnummer nach § 139c AO, vergeben am 25.07.2026.
   *
   * NICHT zu verwechseln mit der Umsatzsteuer-Identifikationsnummer nach
   * § 27a UStG: Beide beginnen mit "DE" und haben neun Ziffern, sind aber
   * verschiedene Nummern. § 5 Abs. 1 Nr. 6 DDG nennt sie ausdrücklich als
   * gleichwertige Pflichtangabe im Impressum, "sofern vorhanden".
   *
   * Die Steuernummer aus demselben Bescheid gehört bewusst NICHT hierher.
   * Sie ist keine Pflichtangabe und hat auf einer öffentlichen Seite nichts
   * verloren.
   */
  economicIdNumber: "DE463954616",

  /** Koordinaten Hirtenstraße 16, 87600 Kaufbeuren */
  latitude: 47.8809,
  longitude: 10.6215,

  /**
   * Zeichengenau übernommen aus dem Google-Unternehmensprofil (Stand 2.8.2026:
   * Mo–Fr 10–18 Uhr, Sa 10–14 Uhr, So geschlossen).
   *
   * Beide Quellen müssen identisch bleiben. Google gleicht die Angabe ab, und
   * wer nach der genannten Zeit anruft und niemanden erreicht, ist als Kunde
   * weg. Ändert Regina die Zeiten im Profil, gehören sie auch hierher.
   *
   * Sonntag steht bewusst nicht in der Liste: Ein fehlender Tag bedeutet im
   * schema.org-Markup „geschlossen".
   */
  openingHours: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "18:00",
    },
    { days: ["Saturday"], opens: "10:00", closes: "14:00" },
  ],
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
 * Am 2.8.2026 im Google-Unternehmensprofil nachgeprüft: 5,0 bei 48
 * Rezensionen. Vorher standen hier 46 – die Zahl war überholt.
 *
 * Muss regelmäßig abgeglichen werden. Untertreiben verschenkt Vertrauen,
 * Übertreiben verstößt gegen Googles Richtlinien für strukturierte Daten.
 * Auf null setzen, wenn die Zahl nicht mehr öffentlich nachprüfbar ist –
 * dann entfällt das Bewertungs-Markup vollständig.
 */
export const googleReviews: { rating: number; count: number } | null = {
  rating: 5.0,
  count: 48,
};

/** Link zum Google-Unternehmensprofil (für "Bei Google ansehen"). */
export const googleBusinessProfileUrl =
  "https://www.google.com/search?kgmid=/g/11sdxjrxpw";
