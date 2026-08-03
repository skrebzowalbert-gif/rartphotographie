import "server-only";

import { timingSafeEqual } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";
import { db, schema } from "@/lib/db";

/**
 * Der Einmal-Einrichtungsweg.
 *
 * Es gibt einen Moment, in dem noch niemand angemeldet sein kann und trotzdem
 * jemand einen Passkey anlegen muss. Diese Lücke schließt PORTAL_SETUP_TOKEN.
 *
 * Entscheidend ist die zweite Bedingung: Der Weg funktioniert nur, solange
 * ÜBERHAUPT KEIN Zugang existiert. Sobald Reginas Passkey angelegt ist, ist er
 * tot – auch dann, wenn das Token später bekannt wird oder jemand vergisst,
 * es aus den Umgebungsvariablen zu löschen. Ein dauerhaft gültiges
 * Hintertürchen wäre genau die Art von Bequemlichkeit, die solche Systeme
 * aufbrechen lässt.
 */
export async function isSetupAllowed(providedToken: string): Promise<boolean> {
  const expected = process.env.PORTAL_SETUP_TOKEN?.trim();
  if (!expected || expected.length < 16) return false;

  const a = Buffer.from(providedToken);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!timingSafeEqual(a, b)) return false;

  return !(await hasAdmin());
}

/**
 * Ist der Zugang eingerichtet?
 *
 * Maßgeblich ist der PASSKEY, nicht der Nutzerdatensatz.
 *
 * Der Unterschied hat mich beim ersten Testlauf ausgesperrt: Der Nutzer wird
 * beim Anfordern der Optionen angelegt, der Passkey erst beim Bestätigen.
 * Bricht der Vorgang dazwischen ab – abgelehnter Systemdialog, geschlossener
 * Tab, Zeitüberschreitung –, bleibt ein Nutzer ohne Schlüssel zurück. Prüft
 * man dann auf Nutzer, ist die Einrichtung gesperrt und die Anmeldung
 * unmöglich: Das Portal wäre dauerhaft zu, ohne dass jemand etwas falsch
 * gemacht hätte.
 */
export async function hasAdmin(): Promise<boolean> {
  const rows = await db()
    .select({ id: schema.adminCredentials.id })
    .from(schema.adminCredentials)
    .limit(1);

  return rows.length > 0;
}

const CHALLENGE_TTL_MS = 5 * 60_000;

/**
 * Challenges sind Einmalwerte mit kurzer Frist.
 *
 * Sie liegen in der Datenbank statt im Cookie, damit eine bereits verwendete
 * Challenge sicher entwertet werden kann. Ein signiertes Cookie ließe sich
 * zurückspielen; eine gelöschte Zeile nicht.
 */
export async function storeChallenge(challenge: string, userId?: string) {
  // Abgelaufene gleich mit aufräumen – erspart einen eigenen Aufräumauftrag.
  await db()
    .delete(schema.adminChallenges)
    .where(lt(schema.adminChallenges.expiresAt, new Date()));

  await db().insert(schema.adminChallenges).values({
    challenge,
    userId: userId ?? null,
    expiresAt: new Date(Date.now() + CHALLENGE_TTL_MS),
  });
}

/** Holt eine Challenge und entwertet sie im selben Zug. */
export async function consumeChallenge(
  challenge: string
): Promise<{ userId: string | null } | null> {
  const rows = await db()
    .delete(schema.adminChallenges)
    .where(
      and(
        eq(schema.adminChallenges.challenge, challenge),
        gt(schema.adminChallenges.expiresAt, new Date())
      )
    )
    .returning({ userId: schema.adminChallenges.userId });

  return rows[0] ?? null;
}
