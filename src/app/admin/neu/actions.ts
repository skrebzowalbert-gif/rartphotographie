"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createProject, DEFAULT_EXPIRY_DAYS } from "@/lib/portal/projects";
import { generateGalleryPassword } from "@/lib/portal/password";
import { getAdminUser } from "@/lib/portal/session";

/**
 * Server Actions sind öffentlich erreichbare Endpunkte.
 *
 * Dass die Schaltfläche nur auf einer geschützten Seite steht, schützt gar
 * nichts – die Aktion lässt sich direkt aufrufen. Deshalb wird die Berechtigung
 * HIER geprüft, nicht in der Seite, die das Formular zeigt.
 */
const schema = z.object({
  title: z.string().trim().min(2, "Bitte einen Titel angeben.").max(120),
  clientName: z.string().trim().min(2, "Bitte den Kundennamen angeben.").max(120),
  watermark: z.string().optional(),
  selectionLimit: z.string().optional(),
  expiryDays: z.string().optional(),
});

export type CreateProjectState = {
  error?: string;
  created?: {
    id: string;
    slug: string;
    title: string;
    /** Nur für diese eine Antwort – danach existiert nur noch der Hash. */
    password: string;
  };
};

export async function createProjectAction(
  _previous: CreateProjectState,
  formData: FormData
): Promise<CreateProjectState> {
  const admin = await getAdminUser();
  if (!admin) return { error: "Nicht angemeldet." };

  const parsed = schema.safeParse({
    title: formData.get("title"),
    clientName: formData.get("clientName"),
    watermark: formData.get("watermark") ?? undefined,
    selectionLimit: formData.get("selectionLimit") ?? undefined,
    expiryDays: formData.get("expiryDays") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Eingabe unvollständig." };
  }

  const { title, clientName, watermark, selectionLimit, expiryDays } =
    parsed.data;

  const limit = Number(selectionLimit);
  const days = Number(expiryDays);

  /*
    Das Passwort erzeugt der Server, nicht Regina.

    Selbst gewählte Galerie-Passwörter enden erfahrungsgemäß bei
    "hochzeit2026" – und eines, das für mehrere Galerien wiederverwendet wird,
    öffnet mit einem einzigen Leck gleich alle.
  */
  const password = generateGalleryPassword();

  const project = await createProject({
    title,
    clientName,
    password,
    watermarkEnabled: watermark === "on",
    selectionLimit: Number.isFinite(limit) && limit > 0 ? limit : null,
    expiresAt: new Date(
      Date.now() +
        (Number.isFinite(days) && days > 0 ? days : DEFAULT_EXPIRY_DAYS) *
          86_400_000
    ),
    actorId: admin.userId,
  });

  revalidatePath("/admin");

  /*
    Das Passwort wandert bewusst NICHT über einen redirect in die Adresszeile.
    Dort stünde es im Browserverlauf, in den Server-Protokollen und im
    Referer-Kopf jeder Folgeanfrage. Es wird einmal zurückgegeben, einmal
    angezeigt – danach gibt es nur noch den Hash.
  */
  return {
    created: {
      id: project.id,
      slug: project.slug,
      title: project.title,
      password,
    },
  };
}
