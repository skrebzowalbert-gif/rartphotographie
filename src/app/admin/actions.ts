"use server";

import { z } from "zod";
import { record } from "@/lib/portal/audit";
import { createInvite } from "@/lib/portal/invites";
import { getAdminUser } from "@/lib/portal/session";

export type InviteState = {
  url?: string;
  expiresAt?: string;
  error?: string;
};

/**
 * Einen Einladungslink für ein weiteres Gerät erzeugen.
 *
 * Der Link wird genau einmal angezeigt und nirgends gespeichert – in der
 * Datenbank liegt nur sein Abdruck. Wer ihn wegklickt, erzeugt einen neuen;
 * das kostet nichts und ist allemal besser als ein Zugangslink, der dauerhaft
 * irgendwo in einer Oberfläche steht.
 */
export async function createDeviceInvite(
  _prev: InviteState,
  formData: FormData
): Promise<InviteState> {
  const admin = await getAdminUser();
  if (!admin) return { error: "Nicht angemeldet." };

  const label = z
    .string()
    .trim()
    .min(1)
    .max(60)
    .safeParse(formData.get("label"));

  if (!label.success) {
    return { error: "Bitte gib an, um welches Gerät es geht." };
  }

  const { token, expiresAt } = await createInvite({
    userId: admin.userId,
    label: label.data,
  });

  await record({
    actor: "admin",
    actorId: admin.userId,
    action: "admin.invite.created",
    // Bewusst ohne Token, auch nicht gekürzt: Das Protokoll ist kein Ort für
    // Zugangsdaten, und ein Anfang reicht zum Raten oft schon aus.
    detail: { label: label.data },
  });

  const origin = process.env.PORTAL_ORIGIN?.trim() ?? "";

  return {
    url: `${origin}/admin/geraet?token=${token}`,
    expiresAt: expiresAt.toISOString(),
  };
}
