import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { consumeChallenge, storeChallenge } from "@/lib/portal/admin-auth";
import { record } from "@/lib/portal/audit";
import { createAdminSession } from "@/lib/portal/session";
import {
  buildAuthenticationOptions,
  checkAuthentication,
} from "@/lib/portal/webauthn";

/*
  Anmeldung mit Passkey.

  Es gibt keinen Benutzernamen und kein Passwortfeld. Regina klickt einmal,
  bestätigt mit Face ID oder Fingerabdruck, fertig. Was hier geprüft wird, ist
  eine Signatur – nichts, was sich abtippen, erraten oder herauslocken lässt.
*/

const optionsSchema = z.object({ step: z.literal("options") });
const verifySchema = z.object({
  step: z.literal("verify"),
  response: z.looseObject({ id: z.string() }),
});

const bodySchema = z.discriminatedUnion("step", [optionsSchema, verifySchema]);

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (parsed.data.step === "options") {
    const credentials = await db()
      .select({
        id: schema.adminCredentials.id,
        publicKey: schema.adminCredentials.publicKey,
        counter: schema.adminCredentials.counter,
        transports: schema.adminCredentials.transports,
      })
      .from(schema.adminCredentials);

    const options = await buildAuthenticationOptions(credentials);
    await storeChallenge(options.challenge);

    return NextResponse.json(options);
  }

  const response = parsed.data.response;
  const clientChallenge = readChallenge(response);

  if (!clientChallenge || !(await consumeChallenge(clientChallenge))) {
    return NextResponse.json(
      { error: "Die Anfrage ist abgelaufen. Bitte erneut versuchen." },
      { status: 400 }
    );
  }

  const rows = await db()
    .select({
      id: schema.adminCredentials.id,
      userId: schema.adminCredentials.userId,
      publicKey: schema.adminCredentials.publicKey,
      counter: schema.adminCredentials.counter,
      transports: schema.adminCredentials.transports,
    })
    .from(schema.adminCredentials)
    .where(eq(schema.adminCredentials.id, response.id))
    .limit(1);

  const credential = rows[0];

  if (!credential) {
    await record({ actor: "admin", action: "admin.login.failed" });
    return NextResponse.json({ error: "Anmeldung fehlgeschlagen." }, { status: 401 });
  }

  const result = await checkAuthentication({
    response: response as never,
    expectedChallenge: clientChallenge,
    credential,
  });

  if (!result) {
    await record({
      actor: "admin",
      actorId: credential.userId,
      action: "admin.login.failed",
    });
    return NextResponse.json({ error: "Anmeldung fehlgeschlagen." }, { status: 401 });
  }

  await db()
    .update(schema.adminCredentials)
    .set({ counter: result.newCounter, lastUsedAt: new Date() })
    .where(eq(schema.adminCredentials.id, credential.id));

  await createAdminSession(credential.userId);

  await record({
    actor: "admin",
    actorId: credential.userId,
    action: "admin.login.success",
  });

  return NextResponse.json({ ok: true });
}

function readChallenge(response: unknown): string | null {
  try {
    const clientDataJSON = (
      response as { response?: { clientDataJSON?: string } }
    )?.response?.clientDataJSON;

    if (!clientDataJSON) return null;

    const parsed = JSON.parse(
      Buffer.from(clientDataJSON, "base64url").toString("utf8")
    );

    return typeof parsed.challenge === "string" ? parsed.challenge : null;
  } catch {
    return null;
  }
}
