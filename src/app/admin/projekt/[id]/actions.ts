"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { record } from "@/lib/portal/audit";
import { getAdminUser } from "@/lib/portal/session";

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
