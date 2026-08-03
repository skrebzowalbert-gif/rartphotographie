"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { record } from "@/lib/portal/audit";
import { verifyPassword } from "@/lib/portal/password";
import {
  createGallerySession,
  isRateLimited,
  recordLoginAttempt,
  requestFingerprint,
} from "@/lib/portal/session";

export type LoginState = { error?: string };

/**
 * Anmeldung an einer Kundengalerie.
 *
 * Kein Nutzername, kein Konto – nur das Passwort aus Reginas Nachricht. Der
 * Link allein genügt nicht, das Passwort allein auch nicht.
 */
export async function loginToGallery(
  _previous: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = z
    .object({
      slug: z.string().min(1).max(120),
      password: z.string().min(1).max(200),
    })
    .safeParse({
      slug: formData.get("slug"),
      password: formData.get("password"),
    });

  if (!parsed.success) return { error: "Bitte das Passwort eingeben." };

  const { ipHash } = await requestFingerprint();

  const [project] = await db()
    .select({
      id: schema.projects.id,
      passwordHash: schema.projects.passwordHash,
      expiresAt: schema.projects.expiresAt,
      status: schema.projects.status,
    })
    .from(schema.projects)
    .where(eq(schema.projects.slug, parsed.data.slug))
    .limit(1);

  /*
    Auch bei unbekannter Galerie wird das Passwort geprüft – gegen einen
    Blindwert. Sonst wäre an der Antwortzeit ablesbar, welche Galerien
    existieren.
  */
  const hash =
    project?.passwordHash ??
    "scrypt$65536$8$1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

  if (project && (await isRateLimited(project.id, ipHash))) {
    return {
      error:
        "Zu viele Versuche. Bitte warte ein paar Minuten und versuche es dann erneut.",
    };
  }

  const ok = await verifyPassword(parsed.data.password, hash);

  if (!project || !ok) {
    await recordLoginAttempt(project?.id ?? null, ipHash, false);
    if (project) {
      await record({
        actor: "client",
        projectId: project.id,
        action: "gallery.login.failed",
      });
    }
    // Eine einzige Meldung für alle Fälle: falsches Passwort, falscher Link,
    // gelöschte Galerie. Wer probiert, soll nichts dazulernen.
    return { error: "Das Passwort stimmt nicht." };
  }

  if (project.expiresAt.getTime() < Date.now()) {
    return {
      error:
        "Diese Galerie ist abgelaufen. Melde dich bei Regina, sie schaltet sie wieder frei.",
    };
  }

  if (project.status === "draft") {
    return {
      error: "Diese Galerie ist noch nicht freigegeben. Bitte etwas Geduld.",
    };
  }

  await recordLoginAttempt(project.id, ipHash, true);
  await createGallerySession(project.id);
  await record({
    actor: "client",
    projectId: project.id,
    action: "gallery.login.success",
  });

  return {};
}
