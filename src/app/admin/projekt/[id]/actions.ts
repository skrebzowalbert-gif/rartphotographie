"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { record } from "@/lib/portal/audit";
import { getAdminUser } from "@/lib/portal/session";
import { deleteAssetObjects } from "@/lib/portal/r2";
import { generateGalleryPassword, hashPassword } from "@/lib/portal/password";

const schemaWatermark = z.object({
  projectId: z.uuid(),
  enabled: z.enum(["an", "aus"]),
});

/**
 * Wasserzeichen umschalten.
 *
 * Kostet keine Neuberechnung: Die Auslieferung legt Vorschauen unter einem
 * Schlüssel ab, der den Schalterzustand enthält. Umschalten greift also auf
 * eine andere – möglicherweise schon vorhandene – Fassung zu.
 */
export async function setWatermark(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) return;

  const parsed = schemaWatermark.safeParse({
    projectId: formData.get("projectId"),
    enabled: formData.get("enabled"),
  });
  if (!parsed.success) return;

  const enabled = parsed.data.enabled === "an";

  await db()
    .update(schema.projects)
    .set({ watermarkEnabled: enabled, updatedAt: new Date() })
    .where(eq(schema.projects.id, parsed.data.projectId));

  await record({
    actor: "admin",
    actorId: admin.userId,
    projectId: parsed.data.projectId,
    action: "project.status.changed",
    detail: { watermark: enabled },
  });

  revalidatePath(`/admin/projekt/${parsed.data.projectId}`);
}

/** Gibt die Galerie für die Kundschaft frei oder nimmt sie zurück. */
export async function setStatus(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) return;

  const projectId = z.uuid().safeParse(formData.get("projectId"));
  const status = z
    .enum(["draft", "selecting", "selected", "delivered"])
    .safeParse(formData.get("status"));

  if (!projectId.success || !status.success) return;

  await db()
    .update(schema.projects)
    .set({ status: status.data, updatedAt: new Date() })
    .where(eq(schema.projects.id, projectId.data));

  await record({
    actor: "admin",
    actorId: admin.userId,
    projectId: projectId.data,
    action: "project.status.changed",
    detail: { status: status.data },
  });

  revalidatePath(`/admin/projekt/${projectId.data}`);
  revalidatePath("/admin");
}

/**
 * Ein Bild wieder entfernen.
 *
 * Zuerst aus der Datenbank, dann aus dem Speicher – und zwar in dieser
 * Reihenfolge: Bleibt eine Datei im Bucket liegen, kostet das ein paar Cent.
 * Bliebe umgekehrt ein Datensatz ohne Datei stehen, zeigte die Kundengalerie
 * eine Lücke. Das eine ist ärgerlich, das andere peinlich.
 */
export async function deleteAsset(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) return;

  const assetId = z.uuid().safeParse(formData.get("assetId"));
  const projectId = z.uuid().safeParse(formData.get("projectId"));
  if (!assetId.success || !projectId.success) return;

  const removed = await db()
    .delete(schema.assets)
    .where(
      and(
        eq(schema.assets.id, assetId.data),
        // Projektzugehörigkeit gehört in die WHERE-Bedingung, nicht in eine
        // vorgelagerte Prüfung – so kann dazwischen nichts passieren.
        eq(schema.assets.projectId, projectId.data)
      )
    )
    .returning({ r2Key: schema.assets.r2Key });

  if (removed.length === 0) return;

  await deleteAssetObjects({
    projectId: projectId.data,
    assetId: assetId.data,
    r2Key: removed[0].r2Key,
  }).catch((error) => {
    console.error("Datei blieb im Speicher liegen:", error);
  });

  revalidatePath(`/admin/projekt/${projectId.data}`);
  revalidatePath("/admin");
}

export type ResetState = { password?: string; error?: string };

/**
 * Ein neues Galerie-Passwort erzeugen.
 *
 * Das alte lässt sich nicht anzeigen – gespeichert ist nur eine nicht
 * umkehrbare Prüfsumme. Wer die Datenbank erbeutet, bekommt damit keinen
 * Zugang zu einer einzigen Galerie. Der Preis dafür ist genau diese Funktion:
 * Vergessen heißt neu setzen, nicht nachschlagen.
 *
 * Bestehende Sitzungen bleiben absichtlich gültig. Ein Paar, das gerade
 * mitten in der Auswahl ist, soll nicht herausfliegen, nur weil Regina den
 * Link an die Eltern weitergeben will.
 */
export async function resetGalleryPassword(
  _previous: ResetState,
  formData: FormData
): Promise<ResetState> {
  const admin = await getAdminUser();
  if (!admin) return { error: "Nicht angemeldet." };

  const projectId = z.uuid().safeParse(formData.get("projectId"));
  if (!projectId.success) return { error: "Ungültige Anfrage." };

  const password = generateGalleryPassword();

  const updated = await db()
    .update(schema.projects)
    .set({ passwordHash: await hashPassword(password), updatedAt: new Date() })
    .where(eq(schema.projects.id, projectId.data))
    .returning({ id: schema.projects.id });

  if (updated.length === 0) return { error: "Galerie nicht gefunden." };

  await record({
    actor: "admin",
    actorId: admin.userId,
    projectId: projectId.data,
    action: "project.password.reset",
  });

  revalidatePath(`/admin/projekt/${projectId.data}`);

  // Wie beim Anlegen: einmal zurückgeben, nie über die Adresszeile.
  return { password };
}

const schemaLimit = z.object({
  projectId: z.uuid(),
  /* Leer heisst "unbegrenzt" – das ist ein gueltiger Wunsch, kein Versehen. */
  limit: z.string(),
});

/**
 * Wie viele Bilder im Paket enthalten sind.
 *
 * Bisher liess sich das nur beim Anlegen setzen. Das reicht nicht: Regina
 * einigt sich mit einem Paar auch mal waehrend der Auswahl auf eine andere
 * Zahl, und dann muesste sie sonst die ganze Galerie neu anlegen – samt neuem
 * Link und neuem Passwort, waehrend das Paar schon drin ist.
 *
 * Die Zahl ist bewusst KEINE harte Sperre. Wer sein Lieblingsbild als 41. von
 * 40 nicht anklicken kann, waehlt nicht weniger aus, sondern aergert sich –
 * und Regina erfaehrt nie, welches Bild es gewesen waere. Die Galerie zeigt
 * stattdessen an, dass es mehr sind, und beide Seiten reden darueber.
 */
export async function setSelectionLimit(formData: FormData) {
  const admin = await getAdminUser();
  if (!admin) return;

  const parsed = schemaLimit.safeParse({
    projectId: formData.get("projectId"),
    limit: formData.get("limit") ?? "",
  });
  if (!parsed.success) return;

  const roh = Number(parsed.data.limit.trim());
  const limit =
    parsed.data.limit.trim() === "" || !Number.isFinite(roh) || roh <= 0
      ? null
      : Math.min(Math.round(roh), 10_000);

  await db()
    .update(schema.projects)
    .set({ selectionLimit: limit, updatedAt: new Date() })
    .where(eq(schema.projects.id, parsed.data.projectId));

  await record({
    actor: "admin",
    actorId: admin.userId,
    projectId: parsed.data.projectId,
    action: "project.status.changed",
    detail: { selectionLimit: limit },
  });

  revalidatePath(`/admin/projekt/${parsed.data.projectId}`);
}
