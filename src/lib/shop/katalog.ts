/**
 * Was Regina verkauft.
 *
 * Die Artikelnummern und Einkaufspreise stammen aus Prodigis Preislisten für
 * Deutschland, abgerufen am 3. August 2026 – nicht aus einem Prospekt und
 * nicht geschätzt. Der Einkaufspreis steht hier trotzdem nur als Fußnote:
 * Verbindlich ist beim Bestellen immer das Angebot, das die Schnittstelle in
 * dem Moment liefert. Preise ändern sich, und eine Zahl im Code, die von
 * Prodigis Realität abweicht, wäre schlimmer als keine.
 *
 * ZWEI ENTSCHEIDUNGEN, die man am Katalog sieht:
 *
 * 1. Nur Produktion in Deutschland oder den Niederlanden. Prodigi fertigt
 *    gerahmte Drucke überwiegend in Großbritannien – für ein Brautpaar in
 *    Kaufbeuren hieße das Zoll, Einfuhrumsatzsteuer und Wartezeit. Diese
 *    Artikel fehlen hier bewusst, obwohl es sie gibt.
 *
 * 2. Wenige Größen statt aller. Prodigi bietet allein bei Leinwand über 90
 *    Formate an. Wer aus 90 Größen wählen soll, wählt gar nicht.
 */

export type Familie = "album" | "leinwand" | "rahmen";

export type Variante = {
  /** Prodigis Artikelnummer. */
  sku: string;
  /** Was in der Auswahl steht, z. B. "30 × 41 cm". */
  bezeichnung: string;
  breiteCm: number;
  hoeheCm: number;
  /**
   * UNSER Verkaufspreis in Cent, brutto.
   *
   * Regina ist Kleinunternehmerin nach § 19 UStG: Sie weist keine
   * Umsatzsteuer aus – kann aber auch die 19 %, die Prodigi ihr berechnet,
   * nicht als Vorsteuer abziehen. Die sind für sie echte Kosten und stecken
   * deshalb in dieser Zahl.
   */
  preisCent: number;
  /** Einkauf inkl. Versand und Steuer, Stand 3.8.2026. Nur zur Orientierung. */
  einkaufCa: number;
};

export type Produkt = {
  id: Familie;
  name: string;
  einzeiler: string;
  beschreibung: string;
  herkunft: "Deutschland" | "Niederlande";
  /** Wie viele Bilder das Produkt aufnimmt. Ein Album mehrere, ein Bild eines. */
  bilder: "eins" | "mehrere";
  varianten: Variante[];
};

export const KATALOG: Produkt[] = [
  {
    id: "album",
    name: "Layflat-Album",
    einzeiler: "Aufklappbar ohne Falz in der Mitte",
    beschreibung:
      "Die Doppelseite läuft durch, ohne dass ein Bild im Bund verschwindet. Fester Einband, matt, Innenseiten auf 190 g. Gedruckt in Deutschland, Lieferung in ein bis zwei Tagen.",
    herkunft: "Deutschland",
    bilder: "mehrere",
    varianten: [
      {
        sku: "BOOK-FE-A4-P-LF-G",
        bezeichnung: "21 × 30 cm hoch",
        breiteCm: 21,
        hoeheCm: 30,
        preisCent: 8900,
        einkaufCa: 32.61,
      },
      {
        sku: "BOOK-FE-A4-L-LF-G",
        bezeichnung: "30 × 21 cm quer",
        breiteCm: 30,
        hoeheCm: 21,
        preisCent: 8900,
        einkaufCa: 31.42,
      },
      {
        sku: "BOOK-FE-8_3-SQ-LF-G",
        bezeichnung: "21 × 21 cm quadratisch",
        breiteCm: 21,
        hoeheCm: 21,
        preisCent: 8900,
        einkaufCa: 32.73,
      },
      {
        sku: "BOOK-FE-11_7-SQ-LF-G",
        bezeichnung: "29 × 29 cm quadratisch",
        breiteCm: 29,
        hoeheCm: 29,
        preisCent: 10900,
        einkaufCa: 37.37,
      },
    ],
  },
  {
    id: "leinwand",
    name: "Leinwand",
    einzeiler: "Auf Keilrahmen gespannt, 38 mm",
    beschreibung:
      "Baumwollleinwand, 400 g, auf einen 38 mm starken Keilrahmen gezogen. Kommt fertig zum Aufhängen. Gefertigt in den Niederlanden.",
    herkunft: "Niederlande",
    bilder: "eins",
    varianten: [
      {
        sku: "GLOBAL-CAN-12X12",
        bezeichnung: "30 × 30 cm",
        breiteCm: 30,
        hoeheCm: 30,
        preisCent: 7900,
        einkaufCa: 36.46,
      },
      {
        sku: "GLOBAL-CAN-12X16",
        bezeichnung: "30 × 41 cm",
        breiteCm: 30,
        hoeheCm: 41,
        preisCent: 8900,
        einkaufCa: 38.84,
      },
      {
        sku: "GLOBAL-CAN-16X16",
        bezeichnung: "41 × 41 cm",
        breiteCm: 41,
        hoeheCm: 41,
        preisCent: 9900,
        einkaufCa: 43.6,
      },
      {
        sku: "GLOBAL-CAN-20X24",
        bezeichnung: "51 × 61 cm",
        breiteCm: 51,
        hoeheCm: 61,
        preisCent: 13900,
        einkaufCa: 59.07,
      },
      {
        sku: "GLOBAL-CAN-24X36",
        bezeichnung: "61 × 91 cm",
        breiteCm: 61,
        hoeheCm: 91,
        preisCent: 18900,
        einkaufCa: 83.24,
      },
    ],
  },
  {
    id: "rahmen",
    name: "Gerahmter Druck",
    einzeiler: "Fine-Art-Papier mit Passepartout",
    beschreibung:
      "Druck auf 200 g Fine-Art-Papier, mit Passepartout hinter Acrylglas gerahmt. Gefertigt in den Niederlanden – die britischen Rahmen führen wir bewusst nicht, sie kämen mit Zoll.",
    herkunft: "Niederlande",
    bilder: "eins",
    varianten: [
      {
        sku: "GLOBAL-CFPM-A4",
        bezeichnung: "21 × 30 cm",
        breiteCm: 21,
        hoeheCm: 29.7,
        preisCent: 10900,
        einkaufCa: 47.17,
      },
      {
        sku: "GLOBAL-CFPM-12X12",
        bezeichnung: "30 × 30 cm",
        breiteCm: 30,
        hoeheCm: 30,
        preisCent: 11900,
        einkaufCa: 49.55,
      },
      {
        sku: "GLOBAL-CFPM-11X14",
        bezeichnung: "28 × 35 cm",
        breiteCm: 28,
        hoeheCm: 35,
        preisCent: 11900,
        einkaufCa: 51.93,
      },
    ],
  },
];

export function findeProdukt(id: string): Produkt | undefined {
  return KATALOG.find((p) => p.id === id);
}

export function findeVariante(sku: string): { produkt: Produkt; variante: Variante } | undefined {
  for (const produkt of KATALOG) {
    const variante = produkt.varianten.find((v) => v.sku === sku);
    if (variante) return { produkt, variante };
  }
  return undefined;
}

export function preisText(cent: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cent / 100);
}
