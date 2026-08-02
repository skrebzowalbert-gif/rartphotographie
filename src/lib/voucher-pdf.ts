import { readFile } from "node:fs/promises";
import path from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { business } from "@/lib/site";
import { formatEuro } from "@/lib/vouchers";
import { formatGermanDate } from "@/lib/voucher-code";

export type VoucherPdfData = {
  orderNumber: string;
  code: string;
  amountInCents: number;
  recipient: string;
  buyerName: string;
  message: string;
  validUntil: Date;
};

/** Sandton und Tinte wie auf der Website. */
const SAND = rgb(0.914, 0.882, 0.839);
const INK = rgb(0.086, 0.071, 0.059);
const INK_SOFT = rgb(0.35, 0.31, 0.27);

/**
 * Erzeugt den Gutschein als PDF.
 *
 * Bewusst mit pdf-lib und den eingebauten Standardschriften: reines
 * JavaScript, keine nativen Abhängigkeiten, kein Headless-Browser. Läuft
 * damit auch in einer Serverless-Funktion zuverlässig und in wenigen
 * Millisekunden.
 *
 * Eingebettet werden die Schriften der Website (Playfair Display und Inter).
 * Der Gutschein ist das einzige Stück, das ein Kunde ausdruckt und verschenkt –
 * dort zählt das Schriftbild. Als Rückfallebene dienen die PDF-Standardschriften
 * Times und Helvetica; schlägt das Laden fehl, entsteht trotzdem ein gültiger
 * Gutschein.
 *
 * Die Dateien liegen als WOFF2 im Projekt (96 KB für alle vier Schnitte, ein
 * Zehntel des TTF-Umfangs). fontkit entpackt sie beim Einbetten.
 *
 * Zeichenbereinigung bleibt trotzdem nötig: Der Latin-Ausschnitt der Schriften
 * enthält keine Emoji, und fehlende Zeichen lassen pdf-lib hart abbrechen –
 * sie kommen aus dem frei befüllbaren Nachrichtenfeld.
 */
function winAnsiSafe(value: string) {
  return (
    value
      // typografische Zeichen auf ASCII-Entsprechungen abbilden
      .replace(/[‘’‚‹›]/g, "'")
      .replace(/[“”„]/g, '"')
      .replace(/[–—]/g, "-")
      .replace(/…/g, "...")
      .replace(/\u00A0/g, " ")
      // Alles Übrige entfernen. \u20AC (Euro) muss ausdrücklich erlaubt sein:
      // es gehört zu WinAnsi, liegt aber außerhalb von Latin-1.
      .replace(/[^\x20-\x7E\u00A0-\u00FF\u20AC]/g, "")
  );
}

/**
 * Lädt eine Schriftdatei aus dem Projekt.
 *
 * Damit die Dateien im Serverless-Bundle landen, sind sie in next.config.ts
 * unter `outputFileTracingIncludes` für die betroffenen Routen eingetragen.
 */
async function loadFont(file: string) {
  return readFile(path.join(process.cwd(), "src", "lib", "fonts", file));
}

/**
 * Erzeugt den Gutschein. Bei `brandFonts: false` kommen ausschließlich die
 * PDF-Standardschriften zum Einsatz.
 */
async function renderVoucher(data: VoucherPdfData, brandFonts: boolean) {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  pdf.setTitle(`Gutschein ${data.code} – R.ArtPhotographie`);
  pdf.setAuthor(business.name);
  pdf.setSubject("Wertgutschein für ein Fotoshooting");
  pdf.setCreator("rartphotographie.de");

  // A4 quer: passt besser zum Gutscheinformat und druckt auf jedem Drucker.
  const page = pdf.addPage([842, 595]);
  const { width, height } = page.getSize();

  /*
    Schriftwahl, empirisch ermittelt:

    - Playfair Display wird eingebettet und auf die tatsächlich benutzten
      Zeichen reduziert. Das ist die prägende Schrift des Gutscheins
      ("Wertgutschein", der Betrag, die persönliche Nachricht) und trägt den
      Markenauftritt. Subsetting bringt das PDF von 527 KB auf 17 KB.

    - Für die kleinen Beschriftungen bleibt Helvetica. Inter wurde getestet und
      wieder entfernt: fontkit verliert beim Reduzieren einzelne Glyphen, aus
      "GUTSCHEINCODE" wurde "u SC EI C E". Ohne Reduzierung wäre das PDF rund
      700 KB groß – für einen Mailanhang unverhältnismäßig, zumal der
      Unterschied zwischen Inter und Helvetica bei 8 bis 13 Punkt praktisch
      unsichtbar ist.
  */
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let serif = await pdf.embedFont(StandardFonts.TimesRoman);
  let serifItalic = await pdf.embedFont(StandardFonts.TimesRomanItalic);

  if (brandFonts) {
    const [playfair, playfairItalic] = await Promise.all([
      loadFont("playfair-regular.ttf"),
      loadFont("playfair-italic.ttf"),
    ]);

    serif = await pdf.embedFont(playfair, { subset: true });
    serifItalic = await pdf.embedFont(playfairItalic, { subset: true });
  }

  page.drawRectangle({ x: 0, y: 0, width, height, color: SAND });

  // Feine Rahmenlinie mit Abstand zum Blattrand
  page.drawRectangle({
    x: 34,
    y: 34,
    width: width - 68,
    height: height - 68,
    borderColor: INK,
    borderWidth: 0.8,
  });

  const left = 74;

  const text = (
    value: string,
    x: number,
    y: number,
    size: number,
    font = sans,
    color = INK
  ) => page.drawText(winAnsiSafe(value), { x, y, size, font, color });

  // Feste Y-Werte von oben nach unten. Die vorherige Fassung rechnete gegen
  // die Seitenhöhe und schob den Nachrichtenblock unter die Fußzeile –
  // er wurde dadurch nie gezeichnet.
  text("R.ARTPHOTOGRAPHIE", left, 505, 11, sansBold, INK_SOFT);
  text("Fotografie in Kaufbeuren und im Allgäu", left, 488, 10, sans, INK_SOFT);

  text("Wertgutschein", left, 420, 42, serif);
  text("für ein Fotoshooting", left, 388, 20, serifItalic, INK_SOFT);

  // Betrag als dominantes Element
  text(formatEuro(data.amountInCents), left, 316, 54, serif);

  page.drawLine({
    start: { x: left, y: 292 },
    end: { x: width - left, y: 292 },
    thickness: 0.8,
    color: INK,
  });

  const col = (n: number) => left + n * 174;

  const field = (label: string, value: string, index: number) => {
    text(label.toUpperCase(), col(index), 264, 8, sansBold, INK_SOFT);
    text(value || "-", col(index), 242, 13, sans);
  };

  field("Gutscheincode", data.code, 0);
  field("Für", data.recipient, 1);
  field("Von", data.buyerName, 2);
  field("Gültig bis", formatGermanDate(data.validUntil), 3);

  if (data.message) {
    text("PERSÖNLICHE NACHRICHT", left, 202, 8, sansBold, INK_SOFT);

    // Einfacher Zeilenumbruch; der Text kommt aus einem auf 500 Zeichen
    // begrenzten Formularfeld. Untergrenze 132, damit die Fußzeile frei bleibt.
    const words = winAnsiSafe(data.message).split(/\s+/).filter(Boolean);
    const maxWidth = width - 2 * left;
    const bottom = 132;
    let line = "";
    let y = 180;

    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;

      if (serifItalic.widthOfTextAtSize(candidate, 13) > maxWidth) {
        text(line, left, y, 13, serifItalic);
        y -= 19;
        line = word;
        if (y < bottom) {
          line = "";
          break;
        }
      } else {
        line = candidate;
      }
    }

    if (line) text(line, left, y, 13, serifItalic);
  }

  page.drawLine({
    start: { x: left, y: 112 },
    end: { x: width - left, y: 112 },
    thickness: 0.5,
    color: INK_SOFT,
  });

  text(
    "Einlösbar für Portrait, Familie, Babybauch, Newborn und Hochzeit.",
    left,
    92,
    10,
    sans,
    INK_SOFT
  );
  text(
    "Zum Einlösen einfach diesen Code bei der Anfrage angeben.",
    left,
    76,
    10,
    sans,
    INK_SOFT
  );
  text(
    `${business.legalName} · ${business.street} · ${business.postalCode} ${business.city} · rartphotographie.de`,
    left,
    54,
    9,
    sans,
    INK_SOFT
  );

  const orderLabel = `Bestellnummer ${data.orderNumber}`;
  text(
    orderLabel,
    width - left - sans.widthOfTextAtSize(orderLabel, 9),
    54,
    9,
    sans,
    INK_SOFT
  );

  return pdf.save();
}

/**
 * Öffentlicher Einstieg mit echter Rückfallebene.
 *
 * Wichtig: Fehler beim Einbetten einer Schrift treten erst beim Speichern auf,
 * nicht beim Aufruf von embedFont. Ein try/catch um das Einbetten hätte sie
 * deshalb nie gefangen – erst der komplette Durchlauf inklusive save() zeigt,
 * ob das PDF gültig ist. Schlägt er fehl, wird der Gutschein mit den
 * Standardschriften erzeugt: Ein bezahlter Kunde bekommt lieber ein schlichtes
 * PDF als gar keines.
 */
export async function buildVoucherPdf(data: VoucherPdfData) {
  try {
    return await renderVoucher(data, true);
  } catch (error) {
    console.error(
      "[gutschein] Markenschrift fehlgeschlagen, weiche auf Standardschriften aus:",
      error
    );
    return renderVoucher(data, false);
  }
}
