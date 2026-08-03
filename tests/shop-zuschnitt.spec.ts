import { expect, test } from "playwright/test";
import {
  berechneZuschnitt,
  bewerte,
  hinweisText,
  mindestPixel,
} from "../src/lib/shop/zuschnitt";
import { KATALOG, findeVariante, preisText } from "../src/lib/shop/katalog";
import { eindeutigeNamen, mitEndung } from "../src/lib/portal/dateinamen";

/*
  Reine Rechnerei, kein Browser und keine Datenbank.

  Diese beiden Rechnungen entscheiden, ob ein Brautpaar ein Bild bekommt, auf
  dem der Kopf noch dran ist und das nicht matschig aussieht. Ein Fehler hier
  faellt erst auf, wenn die Leinwand an der Wand haengt - dann ist er teuer
  und nicht mehr zu reparieren.
*/

test.describe("Beschnitt", () => {
  test("ein 3:2-Foto auf ein 3:4-Format verliert an den Seiten, nicht oben", () => {
    // 6000 x 4000 (Kamera, quer) auf 30 x 41 cm (hoch).
    const z = berechneZuschnitt({
      quelleBreitePx: 6000,
      quelleHoehePx: 4000,
      zielBreiteCm: 30,
      zielHoeheCm: 41,
    });

    // Die Hoehe bleibt voll erhalten, die Breite wird beschnitten.
    expect(z.hoehePx).toBe(4000);
    expect(z.breitePx).toBe(Math.floor(4000 * (30 / 41)));
    expect(z.breitePx).toBeLessThan(6000);

    // Und das ist der Punkt: Von einem Querformat auf ein Hochformat bleibt
    // weniger als die Haelfte uebrig. Wer das nicht sieht, kauft blind.
    expect(z.anteil).toBeLessThan(0.5);
  });

  test("ein Hochformat auf ein Querformat verliert oben und unten", () => {
    const z = berechneZuschnitt({
      quelleBreitePx: 4000,
      quelleHoehePx: 6000,
      zielBreiteCm: 30,
      zielHoeheCm: 21,
    });

    expect(z.breitePx).toBe(4000);
    expect(z.hoehePx).toBe(Math.floor(4000 / (30 / 21)));
    expect(z.hoehePx).toBeLessThan(6000);
  });

  test("passt das Verhaeltnis, faellt nichts weg", () => {
    const z = berechneZuschnitt({
      quelleBreitePx: 3000,
      quelleHoehePx: 3000,
      zielBreiteCm: 30,
      zielHoeheCm: 30,
    });

    expect(z.breitePx).toBe(3000);
    expect(z.hoehePx).toBe(3000);
    expect(z.anteil).toBeCloseTo(1, 5);
  });

  test("unsinnige Masse ergeben ein unbestellbares Ergebnis, keinen Absturz", () => {
    for (const fall of [
      { quelleBreitePx: 0, quelleHoehePx: 100, zielBreiteCm: 30, zielHoeheCm: 30 },
      { quelleBreitePx: 100, quelleHoehePx: 100, zielBreiteCm: 0, zielHoeheCm: 30 },
      { quelleBreitePx: -5, quelleHoehePx: 100, zielBreiteCm: 30, zielHoeheCm: 30 },
    ]) {
      const z = berechneZuschnitt(fall);
      expect(z.bestellbar).toBe(false);
      expect(Number.isFinite(z.dpi)).toBe(true);
    }
  });
});

test.describe("Aufloesung", () => {
  test("ein Handyfoto auf 61 x 91 cm wird abgelehnt", () => {
    // 12 Megapixel, typisches Handy-Querformat.
    const z = berechneZuschnitt({
      quelleBreitePx: 4032,
      quelleHoehePx: 3024,
      zielBreiteCm: 61,
      zielHoeheCm: 91,
    });

    expect(z.bewertung).toBe("zu klein");
    expect(z.bestellbar).toBe(false);
    expect(hinweisText(z)).toContain("zu klein");
  });

  test("dasselbe Handyfoto auf 30 x 30 cm ist in Ordnung", () => {
    const z = berechneZuschnitt({
      quelleBreitePx: 4032,
      quelleHoehePx: 3024,
      zielBreiteCm: 30,
      zielHoeheCm: 30,
    });

    expect(z.bestellbar).toBe(true);
    expect(z.dpi).toBeGreaterThanOrEqual(180);
  });

  /*
    Diese beiden Faelle sind der Grund, warum es die Rechnung ueberhaupt gibt.

    Ich hatte erwartet, dass eine 24-Megapixel-Kameradatei jedes Format im
    Katalog traegt. Das stimmt nicht: Aus einem QUERFORMAT auf die grosse
    Leinwand im Hochformat bleiben nach dem Beschnitt nur noch rund 110 dpi
    uebrig - sichtbar unscharf. Ohne diese Pruefung haette Regina das erst
    erfahren, wenn das Bild an der Wand haengt.
  */
  test("Querformat auf grosse Hochkant-Leinwand reicht selbst aus der Kamera nicht", () => {
    const z = berechneZuschnitt({
      quelleBreitePx: 6000,
      quelleHoehePx: 4000,
      zielBreiteCm: 61,
      zielHoeheCm: 91,
    });

    expect(z.bestellbar).toBe(false);
    expect(z.dpi).toBeLessThan(150);
  });

  test("dieselbe Kamera im Hochformat traegt das grosse Format", () => {
    const z = berechneZuschnitt({
      quelleBreitePx: 4000,
      quelleHoehePx: 6000,
      zielBreiteCm: 61,
      zielHoeheCm: 91,
    });

    expect(z.bestellbar).toBe(true);
  });

  test("die Schwellen liegen dort, wo sie dokumentiert sind", () => {
    expect(bewerte(300)).toBe("sehr gut");
    expect(bewerte(299)).toBe("gut");
    expect(bewerte(180)).toBe("gut");
    expect(bewerte(179)).toBe("grenzwertig");
    expect(bewerte(150)).toBe("grenzwertig");
    expect(bewerte(149)).toBe("zu klein");
  });

  test("die Mindestpixel passen zur Bewertung", () => {
    const { breite, hoehe } = mindestPixel(30, 41);
    const gerade = berechneZuschnitt({
      quelleBreitePx: breite,
      quelleHoehePx: hoehe,
      zielBreiteCm: 30,
      zielHoeheCm: 41,
    });
    expect(gerade.bestellbar).toBe(true);

    const knapp = berechneZuschnitt({
      quelleBreitePx: Math.floor(breite * 0.9),
      quelleHoehePx: Math.floor(hoehe * 0.9),
      zielBreiteCm: 30,
      zielHoeheCm: 41,
    });
    expect(knapp.bestellbar).toBe(false);
  });
});

test.describe("Katalog", () => {
  test("jede Variante ist plausibel und teurer als der Einkauf", () => {
    for (const produkt of KATALOG) {
      expect(produkt.varianten.length).toBeGreaterThan(0);

      for (const v of produkt.varianten) {
        expect(v.sku).toMatch(/^[A-Z0-9_-]+$/);
        expect(v.breiteCm).toBeGreaterThan(0);
        expect(v.hoeheCm).toBeGreaterThan(0);

        /*
          Der eigentliche Punkt dieses Tests: Ein Verkaufspreis unter dem
          Einkauf faellt beim Lesen nicht auf, kostet aber bei jeder
          Bestellung Geld. Ein Zahlendreher im Katalog reicht dafuer.
        */
        expect(
          v.preisCent / 100,
          `${v.sku} wuerde mit Verlust verkauft`
        ).toBeGreaterThan(v.einkaufCa);

        // Und eine Obergrenze, damit ein Zahlendreher nach oben auch auffaellt.
        expect(v.preisCent / 100).toBeLessThan(v.einkaufCa * 6);
      }
    }
  });

  test("Artikelnummern kommen nur einmal vor", () => {
    const alle = KATALOG.flatMap((p) => p.varianten.map((v) => v.sku));
    expect(new Set(alle).size).toBe(alle.length);
  });

  test("jede Artikelnummer laesst sich zurueckfinden", () => {
    for (const produkt of KATALOG) {
      for (const v of produkt.varianten) {
        const treffer = findeVariante(v.sku);
        expect(treffer?.produkt.id).toBe(produkt.id);
        expect(treffer?.variante.bezeichnung).toBe(v.bezeichnung);
      }
    }
    expect(findeVariante("GIBT-ES-NICHT")).toBeUndefined();
  });

  test("Preise stehen in deutscher Schreibweise", () => {
    expect(preisText(8900)).toContain("89,00");
    expect(preisText(8900)).toContain("€");
  });
});

test.describe("Dateinamen im Paket", () => {
  /*
    Der Fall, der bei einem echten Kunden gelandet ist.

    Die hochgeladenen Dateien hiessen "download", "download (2)" - ohne
    Endung, weil sie irgendwo im Netz so gespeichert worden waren. Das Paket
    gab die Namen originalgetreu weiter, macOS erkannte den Typ nicht und
    oeffnete die Hochzeitsbilder im Texteditor.
  */
  test("ein Name ohne Endung bekommt die aus dem Ablageschluessel", () => {
    expect(mitEndung("download", "projekt/final/abc-123.jpg")).toBe("download.jpg");
    expect(mitEndung("download (2)", "projekt/final/abc.PNG")).toBe("download (2).png");
  });

  test("ein Name mit Endung bleibt unangetastet", () => {
    expect(mitEndung("IMG_5457.jpeg", "projekt/final/abc.jpg")).toBe("IMG_5457.jpeg");
    expect(mitEndung("Julia & Max 2026-05-12.jpg", "x/y.jpg")).toBe(
      "Julia & Max 2026-05-12.jpg"
    );
  });

  test("ohne erkennbare Endung bleibt es beim Namen, statt zu raten", () => {
    expect(mitEndung("download", "projekt/final/abc")).toBe("download");
  });

  test("gleiche Namen werden auseinandergehalten", () => {
    expect(eindeutigeNamen(["download.jpg", "download.jpg", "download.jpg"])).toEqual([
      "download.jpg",
      "download (2).jpg",
      "download (3).jpg",
    ]);
  });

  test("Leerzeichen und Bindestriche bleiben erhalten", () => {
    expect(eindeutigeNamen(["Julia & Max 2026-05-12.jpg"])).toEqual([
      "Julia & Max 2026-05-12.jpg",
    ]);
  });
});
