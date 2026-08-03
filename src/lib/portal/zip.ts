import "server-only";

/**
 * Ein Paket aus vielen Bildern – im Fluss, ohne es vorher zusammenzubauen.
 *
 * Warum von Hand und nicht mit einer Bibliothek?
 *
 * Die üblichen Pakete komprimieren, puffern oder legen die Datei zwischendrin
 * auf die Platte. Alle drei sind hier falsch: JPEGs lassen sich nicht
 * nennenswert komprimieren (Rechenzeit ohne Gegenwert), ein Puffer über
 * mehrere Gigabyte sprengt den Arbeitsspeicher einer Serverless-Funktion, und
 * eine Platte gibt es dort nicht. Was bleibt, ist ein ZIP ohne Kompression,
 * das Byte für Byte weitergereicht wird – und das sind rund hundert Zeilen.
 *
 * Ohne Kompression ("stored") ist ein ZIP fast nur ein Umschlag: Für jede
 * Datei ein Kopf, danach die Bytes unverändert, am Ende ein Verzeichnis.
 *
 * Die Prüfsumme jeder Datei steht erst fest, wenn sie durchgelaufen ist. Dafür
 * gibt es im Format den "Data Descriptor": Der Kopf lässt die Felder leer
 * (Merkmal Bit 3), die Werte kommen hinterher. Genau dafür wurde das gemacht.
 */

const CRC_TABELLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();

function crcSchritt(crc: number, bytes: Uint8Array) {
  let c = crc;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABELLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return c >>> 0;
}

/**
 * Obergrenze für ein Paket.
 *
 * Zwei Gründe, und der zweite wiegt schwerer:
 *
 * – Über 4 GB verlangt das Format die Erweiterung "ZIP64". Die ist machbar,
 *   aber zusätzlicher Code für einen Fall, der hier nicht auftreten soll.
 * – Eine Serverless-Funktion wird nach spätestens 800 Sekunden abgebrochen.
 *   Ein Paket, das länger braucht, stirbt mitten im Herunterladen – und der
 *   Nutzer sieht eine halb geladene Datei ohne Erklärung. Lieber vorher
 *   sagen, dass es zu groß ist, und die Dateien einzeln anbieten.
 */
export const PAKET_GRENZE_BYTES = 3 * 1024 * 1024 * 1024;

export type PaketEintrag = {
  /** Name im Paket, z. B. "IMG_5457.jpg". */
  name: string;
  /** Ablageschlüssel in R2. */
  key: string;
};

function namenSaeubern(name: string) {
  // Schraegstriche wuerden im Paket Ordner aufmachen, Steuerzeichen manche
  // Entpacker verwirren. Der Name kommt aus einer hochgeladenen Datei - also
  // aus fremder Hand.
  //
  // Leerzeichen und Bindestriche bleiben ausdruecklich stehen: "Julia & Max
  // 2026-05-12.jpg" ist ein voellig normaler Dateiname. Ein Zeichenbereich
  // "[ -]" haette genau die beiden geloescht.
  return name
    .replace(/[/\\]/g, "_")
    .replace(/[\x00-\x1f\x7f]/g, "");
}

/** Sorgt dafür, dass kein Name zweimal vorkommt. */
export function eindeutigeNamen(namen: string[]): string[] {
  const gesehen = new Map<string, number>();

  return namen.map((roh) => {
    const name = namenSaeubern(roh);
    const anzahl = gesehen.get(name) ?? 0;
    gesehen.set(name, anzahl + 1);

    if (anzahl === 0) return name;

    // "IMG_1.jpg" wird beim zweiten Mal zu "IMG_1 (2).jpg".
    const punkt = name.lastIndexOf(".");
    return punkt > 0
      ? `${name.slice(0, punkt)} (${anzahl + 1})${name.slice(punkt)}`
      : `${name} (${anzahl + 1})`;
  });
}

function zahl16(wert: number) {
  const b = new Uint8Array(2);
  new DataView(b.buffer).setUint16(0, wert, true);
  return b;
}

function zahl32(wert: number) {
  const b = new Uint8Array(4);
  new DataView(b.buffer).setUint32(0, wert >>> 0, true);
  return b;
}

function verketten(teile: Uint8Array[]) {
  const gesamt = teile.reduce((s, t) => s + t.length, 0);
  const aus = new Uint8Array(gesamt);
  let pos = 0;
  for (const t of teile) {
    aus.set(t, pos);
    pos += t.length;
  }
  return aus;
}

/**
 * Baut das Paket als Strom.
 *
 * `holen` liefert den Inhalt einer Datei – so bleibt dieses Modul frei von
 * allem, was mit Cloudflare zu tun hat, und lässt sich für sich prüfen.
 */
export function paketStrom(
  eintraege: PaketEintrag[],
  holen: (key: string) => Promise<ReadableStream<Uint8Array>>
): ReadableStream<Uint8Array> {
  const verzeichnis: Uint8Array[] = [];
  let versatz = 0;
  let index = 0;

  /*
    Zeitstempel im MS-DOS-Format, fest verdrahtet auf den 1.1.2000.

    Die echte Uhrzeit brächte hier nichts – ein Paket, das zweimal erzeugt
    wird, wäre dann zweimal verschieden, und die Aufnahmezeit steht ohnehin im
    Bild. Ein fester Wert macht das Ergebnis wiederholbar und prüfbar.
  */
  const dosZeit = 0;
  const dosDatum = ((2000 - 1980) << 9) | (1 << 5) | 1;

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (index < eintraege.length) {
        const eintrag = eintraege[index++];
        const name = new TextEncoder().encode(eintrag.name);

        const kopfVersatz = versatz;

        const kopf = verketten([
          zahl32(0x04034b50),
          zahl16(20), // benötigte Fassung
          // Bit 3: Prüfsumme und Größen folgen hinter den Daten.
          // Bit 11: Der Name ist UTF-8 – sonst zerfallen Umlaute.
          zahl16(0x0008 | 0x0800),
          zahl16(0), // gespeichert, nicht komprimiert
          zahl16(dosZeit),
          zahl16(dosDatum),
          zahl32(0), // Prüfsumme – kommt später
          zahl32(0), // Größe gepackt – kommt später
          zahl32(0), // Größe roh – kommt später
          zahl16(name.length),
          zahl16(0),
          name,
        ]);

        controller.enqueue(kopf);
        versatz += kopf.length;

        let crc = 0xffffffff;
        let groesse = 0;

        const leser = (await holen(eintrag.key)).getReader();
        for (;;) {
          const { done, value } = await leser.read();
          if (done) break;
          crc = crcSchritt(crc, value);
          groesse += value.length;
          controller.enqueue(value);
        }
        crc = (crc ^ 0xffffffff) >>> 0;
        versatz += groesse;

        const nachtrag = verketten([
          zahl32(0x08074b50),
          zahl32(crc),
          zahl32(groesse),
          zahl32(groesse),
        ]);
        controller.enqueue(nachtrag);
        versatz += nachtrag.length;

        verzeichnis.push(
          verketten([
            zahl32(0x02014b50),
            zahl16(20), // erzeugt von
            zahl16(20), // benötigte Fassung
            zahl16(0x0008 | 0x0800),
            zahl16(0),
            zahl16(dosZeit),
            zahl16(dosDatum),
            zahl32(crc),
            zahl32(groesse),
            zahl32(groesse),
            zahl16(name.length),
            zahl16(0), // Zusatzfeld
            zahl16(0), // Kommentar
            zahl16(0), // Datenträger
            zahl16(0), // interne Merkmale
            zahl32(0), // externe Merkmale
            zahl32(kopfVersatz),
            name,
          ])
        );

        return;
      }

      // Alles durch: Verzeichnis und Abschluss.
      const verzeichnisBytes = verketten(verzeichnis);
      controller.enqueue(verzeichnisBytes);
      controller.enqueue(
        verketten([
          zahl32(0x06054b50),
          zahl16(0),
          zahl16(0),
          zahl16(verzeichnis.length),
          zahl16(verzeichnis.length),
          zahl32(verzeichnisBytes.length),
          zahl32(versatz),
          zahl16(0),
        ])
      );
      controller.close();
    },
  });
}
