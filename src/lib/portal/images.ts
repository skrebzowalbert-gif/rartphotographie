import "server-only";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { bucket, r2 } from "./r2";

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
 */
function watermarkSvg(width: number, height: number) {
  const step = Math.round(width / 2.2);
  const fontSize = Math.max(13, Math.round(width / 42));

  const marks: string[] = [];
  for (let y = -height; y < height * 2; y += step) {
    for (let x = -width; x < width * 2; x += step) {
      marks.push(
        `<text x="${x}" y="${y}" transform="rotate(-30 ${x} ${y})">R.ARTPHOTOGRAPHIE</text>`
      );
    }
  }

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
       <defs>
         <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
           <feDropShadow dx="0" dy="0" stdDeviation="1.5"
                         flood-color="#000" flood-opacity="0.35"/>
         </filter>
       </defs>
       <g fill="#ffffff" fill-opacity="0.30" filter="url(#s)"
          font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}"
          letter-spacing="${(fontSize * 0.22).toFixed(1)}">
         ${marks.join("")}
       </g>
     </svg>`
  );
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
  if (!original) throw new Error("Das Bild liegt nicht im Speicher.");

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
    pipeline = sharp(resized.data).composite([
      {
        input: watermarkSvg(resized.info.width, resized.info.height),
        blend: "over",
      },
    ]);
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
