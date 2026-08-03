import "server-only";

import { randomBytes } from "node:crypto";
import { desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { hashPassword } from "./password";
import { record } from "./audit";

/**
 * Die Adresse einer Galerie ist der halbe Zugang.
 *
 * Ein Link wie /galerie/julia-max-hochzeit wäre zu erraten – man käme zwar
 * nicht ohne Passwort hinein, wüsste aber, dass Julia und Max geheiratet
 * haben und bei wem. Schon das ist eine Information über Dritte, die uns
 * nicht gehört.
 *
 * Deshalb ein lesbarer Teil für Regina plus zehn Zufallszeichen. Der lesbare
 * Teil hilft ihr beim Wiederfinden, der Zufall macht das Raten aussichtslos.
 */
export function createProjectSlug(title: string): string {
  const readable = title
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");

  // 10 Zeichen aus 32 sind 50 Bit – nicht durchprobierbar.
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(10);
  let suffix = "";
  for (let i = 0; i < 10; i++) suffix += alphabet[bytes[i] % alphabet.length];

  return readable ? `${readable}-${suffix}` : suffix;
}

/** Standard-Laufzeit einer Galerie, falls Regina nichts anderes wählt. */
export const DEFAULT_EXPIRY_DAYS = 365;

export async function createProject(params: {
  title: string;
  clientName: string;
  password: string;
  watermarkEnabled: boolean;
  selectionLimit: number | null;
  expiresAt: Date;
  actorId: string;
}) {
  const slug = createProjectSlug(params.title);
  const passwordHash = await hashPassword(params.password);

  const [project] = await db()
    .insert(schema.projects)
    .values({
      slug,
      title: params.title,
      clientName: params.clientName,
      passwordHash,
      watermarkEnabled: params.watermarkEnabled,
      selectionLimit: params.selectionLimit,
      expiresAt: params.expiresAt,
    })
    .returning();

  await record({
    actor: "admin",
    actorId: params.actorId,
    projectId: project.id,
    action: "project.created",
    // Bewusst ohne Kundenname: Das Protokoll soll keine zweite Sammlung
    // personenbezogener Daten werden.
    detail: { watermark: params.watermarkEnabled },
  });

  return project;
}

/**
 * Projektübersicht fürs Dashboard.
 *
 * Die Zählungen kommen als Unterabfragen mit, nicht als eigene Runde je
 * Projekt. Bei zwanzig Galerien im Jahr wäre der Unterschied egal – aber
 * N+1-Abfragen schleichen sich genau so ein und fallen erst auf, wenn es weh
 * tut.
 */
export async function listProjects() {
  return db()
    .select({
      id: schema.projects.id,
      slug: schema.projects.slug,
      title: schema.projects.title,
      clientName: schema.projects.clientName,
      status: schema.projects.status,
      watermarkEnabled: schema.projects.watermarkEnabled,
      expiresAt: schema.projects.expiresAt,
      createdAt: schema.projects.createdAt,
      selectionSubmittedAt: schema.projects.selectionSubmittedAt,

      /*
        Ob eine Galerie abgelaufen ist, entscheidet die Datenbank.

        Die naheliegende Prüfung im Bauteil – expiresAt < Date.now() – ist beim
        Rendern unrein und liefert bei jedem Durchlauf ein anderes Ergebnis.
        now() in SQL ist innerhalb einer Abfrage konstant und benutzt zudem die
        Serverzeit, nicht die des Betrachters.
      */
      expired: sql<boolean>`${schema.projects.expiresAt} < now()`,
      previewCount: sql<number>`(
        select count(*)::int from ${schema.assets}
        where ${schema.assets.projectId} = ${schema.projects.id}
          and ${schema.assets.kind} = 'preview'
      )`,
      finalCount: sql<number>`(
        select count(*)::int from ${schema.assets}
        where ${schema.assets.projectId} = ${schema.projects.id}
          and ${schema.assets.kind} = 'final'
      )`,
      favoriteCount: sql<number>`(
        select count(*)::int from ${schema.favorites}
        where ${schema.favorites.projectId} = ${schema.projects.id}
      )`,
    })
    .from(schema.projects)
    .orderBy(desc(schema.projects.createdAt));
}

export async function getProjectById(id: string) {
  const rows = await db()
    .select()
    .from(schema.projects)
    .where(eq(schema.projects.id, id))
    .limit(1);

  return rows[0] ?? null;
}

/** Menschenlesbarer Status fürs Dashboard. */
export const STATUS_LABEL: Record<string, string> = {
  draft: "Entwurf",
  selecting: "Auswahl läuft",
  selected: "Auswahl eingegangen",
  delivered: "Fertig",
};
