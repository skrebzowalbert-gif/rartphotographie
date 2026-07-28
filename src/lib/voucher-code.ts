import { createHmac } from "node:crypto";

/**
 * Bestellnummer und Gutscheincode.
 *
 * Beide werden DETERMINISTISCH aus der Stripe-Session abgeleitet. Das ist die
 * Grundlage der Idempotenz: Liefert Stripe dasselbe Ereignis ein zweites Mal
 * aus, entstehen exakt dieselben Werte.
 *
 * Die bisherige Implementierung bildete die Bestellnummer aus `new Date()` –
 * ein Wiederholungsversuch nach Mitternacht hätte für dieselbe Bestellung eine
 * andere Nummer erzeugt.
 */

/** Ohne I, O, 0 und 1 – die verwechselt man beim Abtippen. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function secret() {
  // Der Webhook-Secret ist serverseitig und stabil. Ohne ihn wäre der Code aus
  // der Session-ID ableitbar und damit fälschbar.
  return (
    process.env.STRIPE_WEBHOOK_SECRET ||
    process.env.STRIPE_SECRET_KEY ||
    "r-art-fallback"
  );
}

function digest(sessionId: string) {
  return createHmac("sha256", secret()).update(sessionId).digest();
}

/**
 * Gutscheincode im Format RA-XXXX-XXXX. Nicht erratbar, weil er über einen
 * HMAC mit serverseitigem Schlüssel erzeugt wird.
 */
export function voucherCodeFor(sessionId: string) {
  const bytes = digest(sessionId);
  let out = "";

  for (let i = 0; i < 8; i += 1) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }

  return `RA-${out.slice(0, 4)}-${out.slice(4)}`;
}

/**
 * Bestellnummer im Format RART-JJJJMMTT-NNNN.
 *
 * Das Datum stammt aus dem Erstellungszeitpunkt der Stripe-Session, nicht aus
 * der aktuellen Uhrzeit – sonst wäre der Wert nicht wiederholbar.
 */
export function orderNumberFor(sessionId: string, createdUnixSeconds?: number) {
  const date = createdUnixSeconds
    ? new Date(createdUnixSeconds * 1000)
    : new Date(0);

  const datePart = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll("-", "");

  const bytes = digest(sessionId);
  const suffix = String(((bytes[8] << 8) | bytes[9]) % 10000).padStart(4, "0");

  return `RART-${datePart}-${suffix}`;
}

/**
 * Gültigkeit: drei Jahre ab Schluss des Ausstellungsjahres (§ 195, § 199 BGB).
 * Dieselbe Frist steht in den AGB – beide Stellen müssen übereinstimmen.
 */
export function validUntilFor(createdUnixSeconds?: number) {
  const issued = createdUnixSeconds
    ? new Date(createdUnixSeconds * 1000)
    : new Date();
  const year = issued.getUTCFullYear() + 3;

  return new Date(Date.UTC(year, 11, 31));
}

export function formatGermanDate(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "long",
    timeZone: "Europe/Berlin",
  }).format(date);
}
