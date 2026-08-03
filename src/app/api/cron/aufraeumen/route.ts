import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { and, eq, isNull, lte, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { record } from "@/lib/portal/audit";
import { deleteProjectObjects } from "@/lib/portal/r2";
import { sendExpiryReminder } from "@/lib/portal/notify";

/*
  Der Aufräumauftrag. Läuft einmal täglich.

  Zwei Aufgaben, in dieser Reihenfolge:

    1. Erinnern, bevor gelöscht wird.
    2. Löschen, wenn die Frist abgelaufen ist.

  Die Reihenfolge ist keine Geschmacksfrage. Wer zuerst löscht und dann
  erinnert, hat eine Warnung verschickt, die nichts mehr nützt.

  WARUM DAS ÜBERHAUPT LÖSCHT

  In der Galerie steht "Verfügbar bis …, danach werden die Bilder gelöscht".
  Eine Zusage, die niemand einhält, ist schlimmer als keine – sie erzeugt
  Vertrauen, das das System nicht deckt. Und Art. 5 DSGVO verlangt, dass
  personenbezogene Daten nicht länger vorgehalten werden als nötig; bei
  fremden Hochzeitsbildern ist das keine Formalie.
*/

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** Wie lange vorher erinnert wird. */
const ERINNERUNG_TAGE = 14;

function darfLaufen(request: Request): boolean {
  const erwartet = process.env.CRON_SECRET?.trim();

  /*
    Ohne Geheimnis läuft gar nichts.

    Diese Route löscht Kundendaten. Wäre sie ohne Schutz erreichbar, könnte
    jeder mit der Adresse eine Galerie leeren – und es sähe aus wie ein
    planmäßiger Ablauf. Fehlt die Variable, ist das ein Konfigurationsfehler
    und kein Grund, ungeschützt zu arbeiten.
  */
  if (!erwartet || erwartet.length < 16) return false;

  const kopf = request.headers.get("authorization") ?? "";
  const geliefert = kopf.startsWith("Bearer ") ? kopf.slice(7) : "";

  const a = Buffer.from(geliefert);
  const b = Buffer.from(erwartet);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!darfLaufen(request)) {
    return new NextResponse(null, { status: 404 });
  }

  const erinnert: string[] = [];
  const geloescht: string[] = [];

  /* --- 1. Erinnern ------------------------------------------------- */

  const bald = await db()
    .select({
      id: schema.projects.id,
      slug: schema.projects.slug,
      title: schema.projects.title,
      clientName: schema.projects.clientName,
      expiresAt: schema.projects.expiresAt,
    })
    .from(schema.projects)
    .where(
      and(
        isNull(schema.projects.reminderSentAt),
        isNull(schema.projects.purgedAt),
        eq(schema.projects.status, "delivered"),
        /*
          Fristen rechnet die Datenbank, nicht der Server-Prozess.

          Date.now() wäre die Uhr der Maschine, auf der die Funktion gerade
          läuft – und die steht in einem Rechenzentrum irgendwo. now() kommt
          aus derselben Quelle, die expiresAt geschrieben hat.
        */
        sql`${schema.projects.expiresAt} <= now() + ${`${ERINNERUNG_TAGE} days`}::interval`,
        sql`${schema.projects.expiresAt} > now()`
      )
    );

  for (const projekt of bald) {
    /*
      Erst merken, dann schicken.

      Andersherum wäre der Fehlerfall der teure: Geht das Verschicken durch
      und das Speichern nicht, mahnt der nächste Lauf erneut. So bleibt im
      schlimmsten Fall eine Erinnerung aus – ärgerlich, aber die Galerie
      steht ja noch zwei Wochen.
    */
    await db()
      .update(schema.projects)
      .set({ reminderSentAt: new Date() })
      .where(eq(schema.projects.id, projekt.id));

    await sendExpiryReminder({
      title: projekt.title,
      clientName: projekt.clientName,
      slug: projekt.slug,
      expiresAt: projekt.expiresAt,
    });

    erinnert.push(projekt.id);
  }

  /* --- 2. Löschen --------------------------------------------------- */

  const abgelaufen = await db()
    .select({ id: schema.projects.id, title: schema.projects.title })
    .from(schema.projects)
    .where(
      and(
        isNull(schema.projects.purgedAt),
        lte(schema.projects.expiresAt, sql`now()`)
      )
    );

  for (const projekt of abgelaufen) {
    /*
      Die Dateien zuerst, der Vermerk danach.

      Bricht es dazwischen ab, versucht es der nächste Lauf erneut – das ist
      der harmlose Fehlerfall. Andersherum wäre eine Galerie als gelöscht
      vermerkt, deren Bilder noch liegen: der Fall, den man weder bemerkt noch
      belegen kann.
    */
    const anzahl = await deleteProjectObjects(projekt.id);

    await db()
      .update(schema.projects)
      .set({ purgedAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.projects.id, projekt.id));

    /*
      Die Datenbankzeilen bleiben stehen.

      Die Galerie zeigt dann "Diese Galerie ist abgelaufen" statt ins Leere zu
      laufen, und im Protokoll bleibt nachweisbar, dass und wann geloescht
      wurde. Was verschwindet, sind die Bilder – und darum geht es.
    */
    await record({
      actor: "system",
      projectId: projekt.id,
      action: "project.purged",
      detail: { dateien: anzahl },
    });

    geloescht.push(projekt.id);
  }

  return NextResponse.json({
    erinnert: erinnert.length,
    geloescht: geloescht.length,
  });
}
