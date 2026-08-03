/**
 * Dateinamen für das Paket.
 *
 * Bewusst ein eigenes Modul OHNE "server-only": Das ist reine Zeichenkettenlogik,
 * und genau die will man prüfen können, ohne einen Server zu starten. Solange
 * sie in zip.ts stand, ging das nicht – und ein Fehler darin ist bei einem
 * echten Kunden gelandet.
 */

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

/**
 * Sorgt dafür, dass der Name eine Endung hat.
 *
 * Klingt nach Kleinkram, war aber genau der Grund, warum ein Brautpaar seine
 * Bilder als Textmüll zu sehen bekam: Die hochgeladenen Dateien hießen
 * "download", "download (2)" – ohne Endung, weil sie irgendwo im Netz so
 * gespeichert worden waren. Das Paket gab den Namen originalgetreu weiter,
 * macOS konnte den Dateityp nicht erkennen und öffnete die Bilder im
 * Texteditor.
 *
 * Die Endung kommt aus dem Ablageschlüssel: Den vergeben wir selbst, und er
 * trägt den beim Hochladen geprüften Typ.
 */
export function mitEndung(name: string, r2Key: string): string {
  if (/\.[a-z0-9]{2,5}$/i.test(name)) return name;

  const treffer = r2Key.match(/\.([a-z0-9]{2,5})$/i);
  return treffer ? `${name}.${treffer[1].toLowerCase()}` : name;
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
