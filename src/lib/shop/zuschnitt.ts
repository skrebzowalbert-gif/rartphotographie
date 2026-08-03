/**
 * Beschnitt und Auflösung.
 *
 * Zwei Rechnungen, die über die Hälfte aller Reklamationen in jedem Druckshop
 * entscheiden – und die man deshalb prüfen können muss, ohne einen Server zu
 * starten. Alles hier ist rein: rein Zahlen, keine Datenbank, kein Netz.
 *
 * DAS BESCHNITT-PROBLEM
 *
 * Ein Foto aus der Kamera ist 3:2. Eine Leinwand 30 × 41 cm ist rund 3:4. Es
 * passt nicht, also fällt etwas weg – und wenn niemand entscheidet, was,
 * entscheidet es die Maschine. Dann ist der Kopf ab. Deshalb rechnen wir den
 * Ausschnitt aus und zeigen ihn, bevor jemand kauft.
 *
 * DAS AUFLÖSUNGSPROBLEM
 *
 * Auf der Website darf jeder eigene Bilder hochladen. Ein Handyfoto auf
 * 61 × 91 cm sieht matschig aus, und der Ärger landet bei Regina, obwohl sie
 * das Bild nie gesehen hat. Also wird vorher gerechnet und, wenn es nicht
 * reicht, klar gesagt – nicht kleingedruckt.
 */

const ZOLL_IN_CM = 2.54;

export type Bewertung = "sehr gut" | "gut" | "grenzwertig" | "zu klein";

export type Zuschnitt = {
  /** Ausschnitt aus dem Originalbild, in Pixeln. */
  breitePx: number;
  hoehePx: number;
  /** Anteil des Originals, der übrig bleibt: 1 = nichts fällt weg. */
  anteil: number;
  /** Auflösung des gedruckten Bildes. */
  dpi: number;
  bewertung: Bewertung;
  /** Darf so bestellt werden? */
  bestellbar: boolean;
};

/**
 * Die Schwellen.
 *
 * 300 dpi ist der Wert aus dem Druckhandwerk – ab da sieht man auch aus
 * Lesenabstand keine Pixel. Für ein großes Wandbild ist das strenger als
 * nötig: Eine Leinwand von 60 × 90 cm hängt man nicht mit der Nase davor.
 * Deshalb gilt "gut" ab 180 und "grenzwertig" ab 150.
 *
 * Unter 150 dpi wird nicht bestellt. Nicht weil es technisch scheitert –
 * Prodigi würde es drucken –, sondern weil das Ergebnis Regina zugerechnet
 * wird. Ein sichtbar unscharfes Bild mit ihrem Namen darauf kostet mehr, als
 * der Auftrag einbringt.
 */
const DPI_SEHR_GUT = 300;
const DPI_GUT = 180;
const DPI_MINDESTENS = 150;

export function bewerte(dpi: number): Bewertung {
  if (dpi >= DPI_SEHR_GUT) return "sehr gut";
  if (dpi >= DPI_GUT) return "gut";
  if (dpi >= DPI_MINDESTENS) return "grenzwertig";
  return "zu klein";
}

/**
 * Der größtmögliche mittige Ausschnitt im Seitenverhältnis des Produkts.
 *
 * Bewusst mittig als Ausgangspunkt und nicht als letztes Wort: Die Oberfläche
 * lässt den Ausschnitt verschieben. Aber es muss einen Startwert geben, und
 * "so groß wie möglich, mittig" ist der einzige, der ohne Wissen über das
 * Motiv vertretbar ist.
 */
export function berechneZuschnitt(params: {
  quelleBreitePx: number;
  quelleHoehePx: number;
  zielBreiteCm: number;
  zielHoeheCm: number;
}): Zuschnitt {
  const { quelleBreitePx, quelleHoehePx, zielBreiteCm, zielHoeheCm } = params;

  // Unsinnige Eingaben ergeben ein unbestellbares Ergebnis, keinen Absturz.
  if (
    quelleBreitePx <= 0 ||
    quelleHoehePx <= 0 ||
    zielBreiteCm <= 0 ||
    zielHoeheCm <= 0
  ) {
    return {
      breitePx: 0,
      hoehePx: 0,
      anteil: 0,
      dpi: 0,
      bewertung: "zu klein",
      bestellbar: false,
    };
  }

  const quelleVerhaeltnis = quelleBreitePx / quelleHoehePx;
  const zielVerhaeltnis = zielBreiteCm / zielHoeheCm;

  let breitePx: number;
  let hoehePx: number;

  if (quelleVerhaeltnis > zielVerhaeltnis) {
    // Das Bild ist breiter als das Produkt: links und rechts fällt etwas weg.
    hoehePx = quelleHoehePx;
    breitePx = quelleHoehePx * zielVerhaeltnis;
  } else {
    // Das Bild ist höher: oben und unten fällt etwas weg.
    breitePx = quelleBreitePx;
    hoehePx = quelleBreitePx / zielVerhaeltnis;
  }

  breitePx = Math.floor(breitePx);
  hoehePx = Math.floor(hoehePx);

  /*
    Die Auflösung wird über die SCHMALERE Seite bestimmt.

    Nach dem Zuschnitt stimmen die Seitenverhältnisse überein, also müssten
    beide Rechnungen dasselbe ergeben. Durch das Abrunden oben tun sie es um
    ein Haar nicht – und dann ist der kleinere Wert der ehrliche.
  */
  const dpiBreite = breitePx / (zielBreiteCm / ZOLL_IN_CM);
  const dpiHoehe = hoehePx / (zielHoeheCm / ZOLL_IN_CM);
  const dpi = Math.min(dpiBreite, dpiHoehe);

  const bewertung = bewerte(dpi);

  return {
    breitePx,
    hoehePx,
    anteil: (breitePx * hoehePx) / (quelleBreitePx * quelleHoehePx),
    dpi: Math.round(dpi),
    bewertung,
    bestellbar: bewertung !== "zu klein",
  };
}

/**
 * Welche Pixelzahl bräuchte es mindestens für dieses Format?
 *
 * Das eine Pixel Zugabe ist kein Schönheitsfehler: berechneZuschnitt rundet
 * den Ausschnitt ab, und genau an der Schwelle kippt das Ergebnis dadurch um
 * einen Bruchteil unter 150 dpi. Ohne die Zugabe würde diese Funktion eine
 * Größe nennen, die die Prüfung anschließend ablehnt – und niemand verstünde,
 * warum.
 */
export function mindestPixel(zielBreiteCm: number, zielHoeheCm: number) {
  return {
    breite: Math.ceil((zielBreiteCm / ZOLL_IN_CM) * DPI_MINDESTENS) + 1,
    hoehe: Math.ceil((zielHoeheCm / ZOLL_IN_CM) * DPI_MINDESTENS) + 1,
  };
}

/** Ein Satz für die Kundschaft – ohne Fachbegriffe, ohne Beschönigung. */
export function hinweisText(z: Zuschnitt): string {
  switch (z.bewertung) {
    case "sehr gut":
      return "Die Auflösung reicht für dieses Format mit Reserve.";
    case "gut":
      return "Die Auflösung reicht für dieses Format.";
    case "grenzwertig":
      return "Das wird knapp. Aus der Nähe kann das Bild leicht unscharf wirken – aus zwei Metern Abstand fällt es nicht auf.";
    case "zu klein":
      return "Dieses Bild ist für dieses Format zu klein. Wähle ein kleineres Format oder ein anderes Bild.";
  }
}
