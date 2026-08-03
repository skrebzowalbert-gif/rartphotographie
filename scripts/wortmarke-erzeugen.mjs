/*
  Erzeugt die Wortmarke fuer das Wasserzeichen als Bild – einmalig, von Hand.

  Warum nicht zur Laufzeit aus Text?

  Weil in der Serverless-Umgebung, in der die Bildroute laeuft, keine Schrift
  installiert ist. Text in einem SVG wird dort von der Grafikbibliothek
  stillschweigend gar nicht gezeichnet: kein Fehler, keine Meldung, nur ein
  Bild ohne Wasserzeichen. Lokal faellt das nie auf, weil macOS Helvetica
  mitbringt.

  Das Ergebnis wird als Base64 in src/lib/portal/wortmarke.ts abgelegt und
  eingecheckt. Damit haengt das Wasserzeichen an nichts mehr, was die Umgebung
  mitbringen muss oder auch nicht.

  Neu erzeugen:  node scripts/wortmarke-erzeugen.mjs
*/

import { writeFileSync } from "node:fs";
import sharp from "sharp";

const TEXT = "R.ARTPHOTOGRAPHIE";
const FONT_SIZE = 96;
const BREITE = 1800;
const HOEHE = 260;

const svg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${BREITE}" height="${HOEHE}">
     <defs>
       <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
         <feDropShadow dx="0" dy="0" stdDeviation="5"
                       flood-color="#000" flood-opacity="0.55"/>
       </filter>
     </defs>
     <!-- Die Deckkraft wird hier eingebrannt und nicht zur Laufzeit gesetzt.
          Zur Laufzeit gibt es kein SVG mehr, nur noch dieses fertige Bild –
          und genau darum geht es: nichts mehr, was die Umgebung liefern muss. -->
     <g opacity="0.34">
       <text x="${BREITE / 2}" y="${HOEHE / 2}"
             text-anchor="middle" dominant-baseline="middle"
             fill="#ffffff" filter="url(#s)"
             font-family="Helvetica, Arial, sans-serif"
             font-size="${FONT_SIZE}" letter-spacing="${(FONT_SIZE * 0.22).toFixed(1)}">
         ${TEXT}
       </text>
     </g>
   </svg>`
);

const png = await sharp(svg).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toBuffer();
const meta = await sharp(png).metadata();

// Sicherung gegen genau den Fehler, den diese Datei behebt: Wird das Skript je
// auf einem Rechner ohne die Schrift ausgefuehrt, entstuende ein leeres Bild –
// und niemand haette es gemerkt.
const stats = await sharp(png).stats();
if ((stats.channels[3]?.max ?? 0) < 40) {
  throw new Error(
    "Die Wortmarke ist leer geblieben – auf diesem Rechner fehlt die Schrift."
  );
}

writeFileSync(
  "src/lib/portal/wortmarke.ts",
  `/*
  Die Wortmarke des Wasserzeichens als PNG, Base64-kodiert.

  Erzeugt von scripts/wortmarke-erzeugen.mjs – nicht von Hand aendern.

  Als Zeichenkette und nicht als Datei, damit sie sicher im Serverless-Bundle
  landet: Eine Datei neben dem Code wird nur mitgenommen, wenn die
  Abhaengigkeitsverfolgung sie erkennt, und ein fehlendes Wasserzeichen faellt
  niemandem auf, bis die Bilder bereits bei der Kundschaft liegen.

  Groesse: ${meta.width}x${meta.height}
*/

export const WORTMARKE_PNG = Buffer.from(
  "${png.toString("base64")}",
  "base64"
);
`
);

console.log(`Wortmarke: ${meta.width}x${meta.height}, ${(png.length / 1024).toFixed(1)} kB`);
