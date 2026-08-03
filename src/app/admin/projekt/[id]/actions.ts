"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { record } from "@/lib/portal/audit";
import { getAdminUser } from "@/lib/portal/session";
import { deleteAssetObjects } from "@/lib/portal/r2";

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
