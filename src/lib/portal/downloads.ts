import "server-only";

import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getAdminUser, getGallerySession } from "@/lib/portal/session";

/**
 * Wer darf was herunterladen.
 *
 * An einer Stelle, nicht verteilt über drei Routen. Die Frage "darf dieser
 * Aufruf diese Datei bekommen" ist die einzige, an der hier wirklich etwas
 * hängt – bei fremden Hochzeitsbildern will ich sie einmal beantworten und
 * einmal prüfen können, nicht dreimal ähnlich.
 */

export type Berechtigung =
  | { erlaubt: false; grund: "unbekannt" | "gesperrt" | "abgelaufen" }
  | { erlaubt: true; wer: "admin" | "kunde" };

/**
 * Darf der Aufrufer die Enddateien dieses Projekts holen?
 *
 * Regina immer. Die Kundschaft erst, wenn die Galerie ausgeliefert ist –
 * vorher liegen dort Dateien, die noch niemand sehen soll.
 */
export async function darfEnddateien(projectId: string): Promise<Berechtigung> {
  const [projekt] = await db()
    .select({
      status: schema.projects.status,
      expiresAt: schema.projects.expiresAt,
    })
    .from(schema.projects)
    .where(eq(schema.projects.id, projectId))
    .limit(1);

  if (!projekt) return { erlaubt: false, grund: "unbekannt" };

  if (await getAdminUser()) return { erlaubt: true, wer: "admin" };

  const sitzung = await getGallerySession(projectId);
  if (!sitzung) return { erlaubt: false, grund: "unbekannt" };

  if (projekt.expiresAt.getTime() < Date.now()) {
    return { erlaubt: false, grund: "abgelaufen" };
  }

  if (projekt.status !== "delivered") {
    return { erlaubt: false, grund: "gesperrt" };
  }

  return { erlaubt: true, wer: "kunde" };
}

/** Die Enddateien eines Projekts, in der Reihenfolge des Hochladens. */
export function enddateien(projectId: string) {
  return db()
    .select({
      id: schema.assets.id,
      fileName: schema.assets.fileName,
      r2Key: schema.assets.r2Key,
      byteSize: schema.assets.byteSize,
      // Fuer den Shop: ohne die Masse laesst sich weder der Beschnitt noch
      // die Aufloesung berechnen.
      width: schema.assets.width,
      height: schema.assets.height,
    })
    .from(schema.assets)
    .where(
      and(
        eq(schema.assets.projectId, projectId),
        eq(schema.assets.kind, "final")
      )
    )
    .orderBy(asc(schema.assets.sortIndex));
}

/**
 * Die vom Paar ausgewählten Originale – für Regina.
 *
 * Das ist der Kern ihres Arbeitstags: Sie hat die Bilder längst hochgeladen,
 * das Portal kennt die Auswahl. Ohne diese Abfrage müsste sie vierzig
 * Dateinamen von einem Bildschirm gegen mehrere hundert Aufnahmen auf ihrer
 * Platte abgleichen.
 */
export function ausgewaehlteOriginale(projectId: string) {
  return db()
    .select({
      id: schema.assets.id,
      fileName: schema.assets.fileName,
      r2Key: schema.assets.r2Key,
      byteSize: schema.assets.byteSize,
    })
    .from(schema.favorites)
    .innerJoin(schema.assets, eq(schema.assets.id, schema.favorites.assetId))
    .where(eq(schema.favorites.projectId, projectId))
    .orderBy(asc(schema.assets.sortIndex));
}
