import {
  randomBytes,
  scrypt,
  timingSafeEqual,
  type ScryptOptions,
} from "node:crypto";

/**
 * Eigene Promise-Hülle statt promisify: promisify wählt die Überladung ohne
 * Options-Argument, und ohne Options lässt sich weder N noch maxmem setzen –
 * dann liefe scrypt mit den schwachen Standardwerten.
 */
function scryptAsync(
  password: string,
  salt: Buffer,
  keyLength: number,
  options: ScryptOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

/**
 * Passwort-Hashing für Galerie-Zugänge.
 *
 * scrypt aus node:crypto statt Argon2id – eine bewusste Abwägung:
 * Argon2id gilt als der modernere Algorithmus, braucht aber ein natives Modul.
 * Native Module sind auf Vercel die häufigste Ursache für Builds, die lokal
 * laufen und in der Produktion brechen. scrypt ist speicherhart, von OWASP
 * ausdrücklich als Alternative genannt und in Node eingebaut. Für ein
 * Galerie-Passwort, das Regina zufällig erzeugen lässt, ist der Unterschied
 * praktisch bedeutungslos, das Ausfallrisiko dagegen nicht.
 *
 * N = 2^16 bedeutet 64 MiB Speicher je Prüfung. Das bremst massenhaftes
 * Durchprobieren auf Grafikkarten wirksam aus und bleibt in einer
 * Serverless-Funktion in etwa 100 ms machbar.
 */
const N = 2 ** 16;
const r = 8;
const p = 1;
const KEY_LENGTH = 64;

/** Node begrenzt scrypt standardmäßig auf 32 MiB – zu wenig für N = 2^16. */
const MAX_MEM = 192 * 1024 * 1024;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scryptAsync(password.normalize("NFKC"), salt, KEY_LENGTH, {
    N,
    r,
    p,
    maxmem: MAX_MEM,
  });

  // Parameter wandern mit in den Hash. Sonst lässt sich N später nicht
  // erhöhen, ohne alle bestehenden Passwörter ungültig zu machen.
  return [
    "scrypt",
    N,
    r,
    p,
    salt.toString("base64url"),
    derived.toString("base64url"),
  ].join("$");
}

/**
 * Prüft ein Passwort gegen einen gespeicherten Hash.
 *
 * Der Vergleich läuft über timingSafeEqual: Ein gewöhnliches === bricht beim
 * ersten abweichenden Byte ab, und aus dieser Laufzeitdifferenz lässt sich der
 * Hash zeichenweise erraten.
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, nRaw, rRaw, pRaw, saltRaw, hashRaw] = parts;
  const params = {
    N: Number(nRaw),
    r: Number(rRaw),
    p: Number(pRaw),
    maxmem: MAX_MEM,
  };

  if (!Number.isFinite(params.N) || !Number.isFinite(params.r) || !Number.isFinite(params.p)) {
    return false;
  }

  const expected = Buffer.from(hashRaw, "base64url");

  let derived: Buffer;
  try {
    derived = await scryptAsync(
      password.normalize("NFKC"),
      Buffer.from(saltRaw, "base64url"),
      expected.length,
      params
    );
  } catch {
    return false;
  }

  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

/**
 * Alphabet ohne 0/O, 1/l/I und ohne Buchstaben, die sich am Telefon
 * verwechseln lassen. Regina liest das Passwort vor oder schreibt es in eine
 * Karte – Lesbarkeit ist hier ein echtes Sicherheitsmerkmal, weil sonst
 * doch wieder "hochzeit2026" gewählt wird.
 */
const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

/**
 * Erzeugt ein Galerie-Passwort. Vorgabe 12 Zeichen aus 32 möglichen, das sind
 * 60 Bit Entropie – jenseits von allem, was sich durchprobieren lässt,
 * besonders mit der Sperre nach wenigen Fehlversuchen.
 *
 * Gruppiert in Viererblöcken ("k7mq-x3rt-9wbd"), damit es sich diktieren und
 * abtippen lässt.
 */
export function generateGalleryPassword(length = 12): string {
  const bytes = randomBytes(length);
  let out = "";

  for (let i = 0; i < length; i++) {
    // Modulo auf 32 ist hier verzerrungsfrei, weil 256 ein Vielfaches von 32 ist.
    out += ALPHABET[bytes[i] % ALPHABET.length];
    if ((i + 1) % 4 === 0 && i < length - 1) out += "-";
  }

  return out;
}
