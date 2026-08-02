import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Signaturen und Pseudonymisierung.
 *
 * Ein Geheimnis für alles wäre bequem und falsch: Wer den Cookie-Schlüssel
 * erbeutet, könnte damit sonst auch die IP-Pseudonyme zurückrechnen. Deshalb
 * werden aus dem Hauptgeheimnis getrennte Zweckschlüssel abgeleitet.
 */
function rootSecret(): Buffer {
  const raw = process.env.PORTAL_SESSION_SECRET?.trim();

  if (!raw || raw.length < 32) {
    throw new Error(
      "PORTAL_SESSION_SECRET fehlt oder ist zu kurz (mindestens 32 Zeichen). " +
        "Erzeugen mit: openssl rand -base64 48"
    );
  }

  return Buffer.from(raw, "utf8");
}

function derive(purpose: string): Buffer {
  return createHmac("sha256", rootSecret()).update(purpose).digest();
}

/** Zufälliges Geheimnis in der empfohlenen Länge – für die Einrichtung. */
export function suggestSecret(): string {
  return randomBytes(48).toString("base64");
}

/**
 * Hängt eine Signatur an einen Wert.
 *
 * Zweck ist nicht Geheimhaltung – die Sitzungs-ID darf der Browser sehen –
 * sondern das Aussortieren gefälschter Cookies OHNE Datenbankabfrage. Ohne
 * diese Prüfung könnte jemand mit erfundenen IDs die Datenbank fluten.
 */
export function sign(value: string, purpose: string): string {
  const mac = createHmac("sha256", derive(purpose))
    .update(value)
    .digest("base64url");

  return `${value}.${mac}`;
}

/** Gibt den Wert zurück, wenn die Signatur stimmt – sonst null. */
export function unsign(signed: string, purpose: string): string | null {
  const index = signed.lastIndexOf(".");
  if (index <= 0) return null;

  const value = signed.slice(0, index);
  const provided = signed.slice(index + 1);

  const expected = createHmac("sha256", derive(purpose))
    .update(value)
    .digest("base64url");

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);

  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? value : null;
}

/**
 * Pseudonymisiert IP-Adresse und Browserkennung.
 *
 * Wir brauchen nur die Antwort auf "ist das dieselbe Herkunft wie vorhin".
 * Dafür genügt der Vergleich zweier Hashes. Die Klartext-IP zu speichern wäre
 * ein Verstoß gegen die Datenminimierung nach Art. 5 Abs. 1 lit. c DSGVO –
 * und im Fall eines Datenlecks der Unterschied zwischen einer Panne und einer
 * meldepflichtigen Offenlegung personenbezogener Daten.
 */
export function pseudonymise(value: string): string {
  return createHmac("sha256", derive("pseudonym:v1"))
    .update(value || "unbekannt")
    .digest("base64url")
    .slice(0, 32);
}
