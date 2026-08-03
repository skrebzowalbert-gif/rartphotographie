import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import {
  consumeChallenge,
  isSetupAllowed,
  storeChallenge,
} from "@/lib/portal/admin-auth";
import { record } from "@/lib/portal/audit";
import { createAdminSession, getAdminUser } from "@/lib/portal/session";
import {
  buildRegistrationOptions,
  checkRegistration,
} from "@/lib/portal/webauthn";

/*
  Anlegen eines Passkeys – in zwei Schritten, wie WebAuthn es vorsieht.

  Zugelassen ist das in genau zwei Fällen:
  1. Es existiert noch kein Zugang und das Einrichtungs-Token stimmt.
  2. Regina ist bereits angemeldet und legt ein weiteres Gerät an.

  Der zweite Fall ist wichtiger, als er klingt: Wer nur einen Passkey hat und
  das Telefon verliert, kommt nicht mehr an die eigenen Kundengalerien.
*/

const optionsSchema = z.object({
  step: z.literal("options"),
  setupToken: z.string().optional(),
  label: z.string().max(60).optional(),
});

const verifySchema = z.object({
  step: z.literal("verify"),
  setupToken: z.string().optional(),
  label: z.string().max(60).optional(),
  response: z.looseObject({ id: z.string() }),
});

const bodySchema = z.discriminatedUnion("step", [optionsSchema, verifySchema]);

async function resolveActor(setupToken?: string) {
  const existing = await getAdminUser();
  if (existing) return { kind: "session" as const, user: existing };

  if (setupToken && (await isSetupAllowed(setupToken))) {
    return { kind: "setup" as const, user: null };
  }

  return null;
}

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const body = parsed.data;
  const actor = await resolveActor(body.setupToken);

  if (!actor) {
    // Bewusst dieselbe Antwort für "kein Token", "falsches Token" und "schon
    // eingerichtet". Wer probiert, soll nicht erfahren, welcher Fall vorliegt.
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 403 });
  }

  if (body.step === "options") {
    let userId: string;
    let userName: string;
    let displayName: string;

    if (actor.kind === "session") {
      userId = actor.user.userId;
      userName = actor.user.email;
      displayName = actor.user.displayName;
    } else {
      /*
        Erster Zugang. Einen bereits vorhandenen Nutzer ohne Passkey
        wiederverwenden statt einen zweiten anzulegen: Ein abgebrochener
        Versuch hinterlässt genau so einen Datensatz, und bei jedem neuen
        Anlauf eine weitere Karteileiche zu erzeugen wäre unsauber.
      */
      const [existingUser] = await db()
        .select()
        .from(schema.adminUsers)
        .limit(1);

      const user =
        existingUser ??
        (
          await db()
            .insert(schema.adminUsers)
            .values({
              email: "regina@rartphotographie.de",
              displayName: "Regina Gerdt",
            })
            .returning()
        )[0];

      userId = user.id;
      userName = user.email;
      displayName = user.displayName;
    }

    const existing = await db()
      .select({
        id: schema.adminCredentials.id,
        publicKey: schema.adminCredentials.publicKey,
        counter: schema.adminCredentials.counter,
        transports: schema.adminCredentials.transports,
      })
      .from(schema.adminCredentials)
      .where(eq(schema.adminCredentials.userId, userId));

    const options = await buildRegistrationOptions({
      userId,
      userName,
      displayName,
      existing,
    });

    await storeChallenge(options.challenge, userId);

    return NextResponse.json(options);
  }

  /* ---------------------------------------------------------------- */
  /* Schritt 2: Antwort des Authenticators prüfen                      */
  /* ---------------------------------------------------------------- */

  const clientChallenge = readChallenge(body.response);
  if (!clientChallenge) {
    return NextResponse.json({ error: "Ungültige Antwort." }, { status: 400 });
  }

  const stored = await consumeChallenge(clientChallenge);
  if (!stored?.userId) {
    return NextResponse.json(
      { error: "Die Anfrage ist abgelaufen. Bitte erneut versuchen." },
      { status: 400 }
    );
  }

  const credential = await checkRegistration({
    response: body.response as never,
    expectedChallenge: clientChallenge,
  });

  if (!credential) {
    return NextResponse.json(
      { error: "Der Passkey konnte nicht bestätigt werden." },
      { status: 400 }
    );
  }

  await db().insert(schema.adminCredentials).values({
    id: credential.id,
    userId: stored.userId,
    publicKey: credential.publicKey,
    counter: credential.counter,
    transports: credential.transports,
    label: body.label?.trim() || "Gerät",
  });

  await record({
    actor: "admin",
    actorId: stored.userId,
    action: "admin.passkey.registered",
    detail: { label: body.label?.trim() || "Gerät" },
  });

  // Nach der Einrichtung gleich angemeldet – sonst müsste Regina den frisch
  // angelegten Passkey sofort noch einmal benutzen.
  if (actor.kind === "setup") {
    await createAdminSession(stored.userId);
  }

  return NextResponse.json({ ok: true });
}

/**
 * Liest die Challenge aus der Antwort des Browsers.
 *
 * clientDataJSON ist base64url-kodiert und enthält unter anderem die
 * Challenge, die der Authenticator signiert hat. Wir lesen sie nur aus, um den
 * passenden Datenbankeintrag zu finden – geprüft wird sie anschließend von
 * SimpleWebAuthn gegen genau diesen Wert.
 */
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
