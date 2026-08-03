import "server-only";

import { db, schema } from "@/lib/db";

/**
 * Nachvollziehbarkeit.
 *
 * Zwei Gründe, warum das keine Kür ist: Regina muss im Streitfall belegen
 * können, wann eine Galerie freigegeben, eingesehen oder gelöscht wurde. Und
 * Art. 5 Abs. 2 DSGVO verlangt, die Einhaltung der Grundsätze nachweisen zu
 * können – nicht nur einzuhalten.
 *
 * Was hier NICHT hineingehört: Klartext-IPs, Passwörter, E-Mail-Adressen von
 * Gästen. Das Protokoll soll die Datenschutzlage verbessern, nicht selbst zum
 * Problem werden.
 */
export type AuditAction =
  | "admin.passkey.registered"
  | "admin.invite.created"
  | "admin.login.success"
  | "admin.login.failed"
  | "admin.logout"
  | "project.created"
  | "project.password.reset"
  | "project.status.changed"
  | "gallery.login.success"
  | "gallery.login.failed"
  | "gallery.selection.submitted"
  | "download.paket"
  | "project.purged";

export async function record(entry: {
  actor: "admin" | "client" | "system";
  actorId?: string | null;
  projectId?: string | null;
  action: AuditAction;
  detail?: Record<string, string | number | boolean | null>;
}) {
  try {
    await db().insert(schema.auditLog).values({
      actor: entry.actor,
      actorId: entry.actorId ?? null,
      projectId: entry.projectId ?? null,
      action: entry.action,
      detail: entry.detail ?? null,
    });
  } catch (error) {
    /*
      Ein fehlgeschlagener Protokolleintrag darf die eigentliche Handlung nicht
      abbrechen. Wenn Regina ein Projekt anlegt und nur das Protokoll klemmt,
      soll das Projekt trotzdem entstehen – sonst wäre die Nachvollziehbarkeit
      ein Verfügbarkeitsrisiko.
    */
    console.error("Protokolleintrag fehlgeschlagen:", entry.action, error);
  }
}
