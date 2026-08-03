import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { and, eq, isNull, lt, or, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";

/**
 * Einladung für ein weiteres Gerät.
 *
 * Der Ablauf hat genau einen Zweck: Regina soll auf ihrem eigenen Handy einen
 * eigenen Passkey anlegen können, ohne dass jemals ein Geheimnis zwischen ihr
 * und mir hin und her wandert. Sie bekommt einen Link, öffnet ihn, bestätigt
 * mit dem Fingerabdruck – fertig. Der Link ist danach tot.
 *
 * Drei Eigenschaften machen ihn vertretbar:
 *   – kurze Frist (30 Minuten): Ein Link, der in einem Chatverlauf liegen
 *     bleibt, ist morgen kein Zugang mehr.
 *   – einmalig: Wer ihn abfängt, nachdem Regina ihn benutzt hat, hält nichts
 *     in der Hand.
 *   – erzeugt nur, wer bereits angemeldet ist.
 */

const TTL_MS = 30 * 60_000;

function hash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/** Erzeugt eine Einladung und gibt das Token genau einmal zurück. */
export async function createInvite(params: {
  userId: string;
  label: string;
}): Promise<{ token: string; expiresAt: Date }> {
  /*
    hex, nicht base64.

    base64 enthält "+", "/" und "=", und die überleben den Weg durch eine
    Adresszeile und diverse Messenger nicht unbeschadet. Genau daran ist der
    erste Einrichtungslink gescheitert: Das Token kam verstümmelt an und die
    Seite antwortete "Nicht berechtigt".
  */
  const token = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + TTL_MS);

  // Abgelaufene und verbrauchte Einladungen gleich mit aufräumen.
  await db()
    .delete(schema.adminInvites)
    .where(
      or(
        lt(schema.adminInvites.expiresAt, new Date()),
        lt(schema.adminInvites.usedAt, new Date())
      )
    );

  await db().insert(schema.adminInvites).values({
    tokenHash: hash(token),
    userId: params.userId,
    label: params.label,
    expiresAt,
  });

  return { token, expiresAt };
}

/**
 * Prüft eine Einladung, ohne sie zu verbrauchen.
 *
 * Die Seite muss vor dem Systemdialog wissen, ob der Link überhaupt gilt –
 * sonst tippt Regina auf den Fingerabdrucksensor und bekommt danach eine
 * Fehlermeldung.
 */
export async function readInvite(
  token: string
): Promise<{ id: string; userId: string; label: string } | null> {
  if (!/^[0-9a-f]{48}$/.test(token)) return null;

  const [invite] = await db()
    .select({
      id: schema.adminInvites.id,
      userId: schema.adminInvites.userId,
      label: schema.adminInvites.label,
      /*
        Die Frist entscheidet die Datenbank, nicht der Server-Prozess.

        Date.now() beim Rendern ist unrein und misst außerdem die Uhr des
        Rechners, auf dem der Code gerade läuft. Bei einer Frist von dreißig
        Minuten ist now() aus derselben Quelle, die den Wert geschrieben hat,
        schlicht die richtige Referenz.
      */
      abgelaufen: sql<boolean>`${schema.adminInvites.expiresAt} < now()`,
    })
    .from(schema.adminInvites)
    .where(
      and(
        eq(schema.adminInvites.tokenHash, hash(token)),
        isNull(schema.adminInvites.usedAt)
      )
    )
    .limit(1);

  // Unbekannt, verbraucht und abgelaufen ergeben bewusst dieselbe Antwort.
  if (!invite || invite.abgelaufen) return null;

  return { id: invite.id, userId: invite.userId, label: invite.label };
}

/** Entwertet die Einladung. Nach dem ersten erfolgreichen Passkey. */
export async function consumeInvite(id: string) {
  await db()
    .update(schema.adminInvites)
    .set({ usedAt: new Date() })
    .where(and(eq(schema.adminInvites.id, id), isNull(schema.adminInvites.usedAt)));
}
