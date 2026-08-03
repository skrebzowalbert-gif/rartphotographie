import "server-only";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { bucket, r2 } from "./r2";
import { WORTMARKE_PNG } from "./wortmarke";

/**
 * Vorschaubilder erzeugen und aufbewahren.
 *
 * Zwei Anforderungen, die sich zu widersprechen scheinen:
 *
 *   – Das Wasserzeichen soll sich pro Galerie umschalten lassen, ohne dass
 *     alle Bilder neu berechnet werden.
 *   – Bei 600 Bildern darf nicht jeder Aufruf eine Neuberechnung auslösen.
 *
 * Gelöst über einen Ablageschlüssel, der Breite UND Wasserzeichen enthält.
 * Der erste Aufruf rechnet und legt das Ergebnis in R2 ab, jeder weitere
 * liefert es nur noch aus. Schaltet Regina das Wasserzeichen um, greift ein
 * anderer Schlüssel – die schon berechnete Fassung bleibt liegen und ist
 * sofort wieder da, falls sie zurückschaltet.
 */

/** Auslieferungsbreiten. Mehr Stufen hieße mehr Rechnerei ohne sichtbaren Gewinn. */
export const WIDTHS = [400, 800, 1600] as const;
export type Width = (typeof WIDTHS)[number];

export function derivedKey(params: {
  projectId: string;
  assetId: string;
  width: Width;
  watermark: boolean;
}) {
  return `${params.projectId}/abgeleitet/${params.assetId}-${params.width}-${
    params.watermark ? "wz" : "ohne"
  }.jpg`;
}

/**
 * Das Original liegt nicht mehr im Speicher, obwohl die Datenbank es führt.
 *
 * Eigener Fehlertyp, weil dieser Fall etwas ganz anderes bedeutet als ein
 * misslungenes Verkleinern: Nicht die Verarbeitung ist kaputt, sondern die
 * Datei ist weg. Genau das ist einmal passiert – ein Aufraeumskript hat den
 * Bucket geleert –, und weil die Bildroute damals jeden Fehler in ein
 * schlichtes 404 verwandelt hat, war von aussen nur zu sehen: keine Bilder.
 * Die Unterscheidung kostet zehn Zeilen und spart eine Stunde Suchen.
 */
export class MissingOriginalError extends Error {
  constructor(public readonly key: string) {
    super(`Original nicht im Speicher: ${key}`);
    this.name = "MissingOriginalError";
  }
}

async function readObject(key: string): Promise<Buffer | null> {
  try {
    const result = await r2().send(
      new GetObjectCommand({ Bucket: bucket(), Key: key })
    );
    const bytes = await result.Body?.transformToByteArray();
    return bytes ? Buffer.from(bytes) : null;
  } catch {
    return null;
  }
}

/**
 * Das Wasserzeichen.
 *
 * Bewusst zurückhaltend: Ein Balken quer über das Bild verhindert zwar
 * Missbrauch, macht die Auswahl aber zur Qual – und Kundschaft, die ihre
 * Bilder nicht beurteilen kann, wählt schlecht und ist unzufrieden.
 *
 * Stattdessen der Schriftzug diagonal gekachelt, mit geringer Deckkraft und
 * einem feinen Schatten, damit er auf hellen wie dunklen Bildern lesbar
 * bleibt. Wer das wegretuschieren will, hat mehr Arbeit als mit dem Kauf.
 *
 * Hier stand einmal ein SVG mit einem <text>-Element. Das funktionierte auf
 * meinem Rechner tadellos und in der Auslieferung überhaupt nicht: In der
 * Serverless-Umgebung ist keine Schrift installiert, und die Grafikbibliothek
 * zeichnet dann einfach nichts – ohne Fehler, ohne Meldung. Die Kundschaft
 * bekam blanke Bilder, und niemand konnte sehen, warum.
 *
 * Deshalb liegt die Wortmarke jetzt als fertiges Bild bei und wird nur noch
 * gedreht und gekachelt. Nichts daran hängt mehr davon ab, was die Umgebung
 * zufällig mitbringt.
 */
async function watermarkTile(
  width: number,
  height: number
): Promise<Buffer | null> {
  /*
    Zu klein für ein Wasserzeichen – und das ist keine Kosmetik.

    In der SVG-Fassung stand hier width / 2.2. Bei einem 1×1-Pixel-Bild ergab
    das 0, und die Kachelschleife zählte nie hoch: eine Endlosschleife, bis der
    Arbeitsspeicher voll war. Der Node-Prozess starb mit "heap out of memory",
    und mit ihm die gesamte Website – wegen eines einzigen Vorschaubildes.

    Auf einer Briefmarke ist ein Schriftzug ohnehin nicht lesbar. Also gar
    nicht erst versuchen.
  */
  if (width < 100 || height < 40) return null;

  let gedreht = await sharp(WORTMARKE_PNG)
    .resize({ width: Math.max(90, Math.round(width * 0.33)) })
    .rotate(-30, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer({ resolveWithObject: true });

  /*
    Notfalls kleiner – und bewusst als zweite Pipeline.

    sharp weist eine Kachel zurück, die größer ist als das Bild darunter. Bei
    einem Hochkantformat geht das gut, bei einem breiten Panorama nicht: Die
    gedrehte Marke ist rund ein Sechstel so hoch wie das Bild breit ist – bei
    800 × 200 wäre sie höher als das Bild und die Auslieferung bräche ab.

    Zwei resize()-Aufrufe an derselben Kette helfen dabei NICHT: Der zweite
    ersetzt den ersten, statt ihn einzuschränken. Genau daran ist mein erster
    Versuch gescheitert – die Marke wurde auf Bildgröße aufgeblasen und lag
    als Riesenschriftzug über dem Foto.
  */
  if (gedreht.info.width > width || gedreht.info.height > height) {
    gedreht = await sharp(gedreht.data)
      .resize({ width, height, fit: "inside", withoutEnlargement: true })
      .toBuffer({ resolveWithObject: true });
  }

  // Die Kachel ist größer als die Marke selbst – der Abstand dazwischen ist
  // das, was das Wasserzeichen erträglich statt erdrückend macht.
  const kachelBreite = Math.min(width, Math.round(gedreht.info.width * 1.3));
  const kachelHoehe = Math.min(height, Math.round(gedreht.info.height * 2.4));

  return sharp({
    create: {
      width: kachelBreite,
      height: kachelHoehe,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: gedreht.data, gravity: "centre" }])
    .png()
    .toBuffer();
}

/**
 * Liefert das Vorschaubild – aus dem Zwischenspeicher oder frisch berechnet.
 *
 * Das Original wird dabei nie ausgeliefert, auch nicht versehentlich: Was
 * diese Funktion zurückgibt, ist immer ein neu kodiertes JPEG in der
 * angefragten Breite. Kameradaten aus dem EXIF – Seriennummer, GPS-Koordinaten
 * des Aufnahmeorts – fallen dabei weg, weil sharp sie nicht übernimmt. Bei
 * Bildern aus fremden Wohnungen ist das kein Nebeneffekt, sondern erwünscht.
 */
export async function getPreviewImage(params: {
  projectId: string;
  assetId: string;
  sourceKey: string;
  width: Width;
  watermark: boolean;
}): Promise<{ image: Buffer; sourceWidth: number | null; sourceHeight: number | null }> {
  const key = derivedKey(params);

  const cached = await readObject(key);
  if (cached) return { image: cached, sourceWidth: null, sourceHeight: null };

  const original = await readObject(params.sourceKey);
  if (!original) throw new MissingOriginalError(params.sourceKey);

  /*
    Die Maße des Originals mitnehmen.

    Im Browser lassen sie sich bei HEIC nicht auslesen – Chrome kann das
    Format nicht dekodieren. Hier liegt die Datei ohnehin entschlüsselt vor,
    also kostet es nichts. Ohne bekannte Seitenverhältnisse springt in der
    Kundengalerie beim Scrollen das ganze Raster.
  */
  const meta = await sharp(original, { failOn: "none" }).metadata();
  const rotated = meta.orientation && meta.orientation >= 5;
  const sourceWidth = (rotated ? meta.height : meta.width) ?? null;
  const sourceHeight = (rotated ? meta.width : meta.height) ?? null;

  const base = sharp(original, { failOn: "none" })
    // Hochformat-Aufnahmen aus der Kamera tragen die Drehung nur im EXIF.
    // Ohne rotate() lägen sie in der Galerie auf der Seite.
    .rotate()
    .resize({ width: params.width, withoutEnlargement: true });

  let pipeline = base;

  if (params.watermark) {
    const resized = await base.clone().toBuffer({ resolveWithObject: true });
    const kachel = await watermarkTile(resized.info.width, resized.info.height);

    if (kachel) {
      pipeline = sharp(resized.data).composite([
        {
          input: kachel,
          // tile wiederholt die Kachel über das ganze Bild. Das ersetzt die
          // Schleife, die früher hunderte Textelemente erzeugt hat – und mit
          // ihr die Gelegenheit, sich daran zu verrechnen.
          tile: true,
          blend: "over",
        },
      ]);
    }
  }

  const output = await pipeline
    .jpeg({ quality: 78, progressive: true, mozjpeg: true })
    .toBuffer();

  // Ablegen, damit der nächste Aufruf nur noch ausliefert. Schlägt das fehl,
  // ist das kein Grund, dem Betrachter das Bild vorzuenthalten.
  await r2()
    .send(
      new PutObjectCommand({
        Bucket: bucket(),
        Key: key,
        Body: output,
        ContentType: "image/jpeg",
      })
    )
    .catch((error) => {
      console.error("Vorschau konnte nicht abgelegt werden:", key, error);
    });

  return { image: output, sourceWidth, sourceHeight };
}
