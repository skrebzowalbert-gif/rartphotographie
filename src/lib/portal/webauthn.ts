import "server-only";

import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";

/**
 * Passkeys für Reginas Zugang.
 *
 * Kein Passwort, das abgefischt, wiederverwendet oder am Telefon herausgelockt
 * werden kann. Der Browser signiert eine Challenge mit einem Schlüssel, der das
 * Gerät nie verlässt – und er tut das nur gegenüber der Domain, für die der
 * Passkey angelegt wurde. Damit läuft auch eine perfekt nachgebaute
 * Phishing-Seite ins Leere.
 *
 * Für ein Portal mit fremden Hochzeitsbildern ist das die einzige Anmeldeart,
 * die ich verantworten möchte.
 */

export const RP_NAME = "R.ArtPhotographie";

/**
 * Die Domain, an die Passkeys gebunden sind.
 *
 * In der Entwicklung zwingend "localhost": Ein Passkey für
 * www.rartphotographie.de lässt sich auf dem eigenen Rechner nicht verwenden,
 * und umgekehrt. Deshalb sind das getrennte Anmeldungen – das ist kein Mangel,
 * sondern genau der Schutz, den WebAuthn bietet.
 */
export function rpId(): string {
  const configured = process.env.PORTAL_RP_ID?.trim();
  if (configured) return configured;

  if (process.env.NODE_ENV !== "production") return "localhost";

  throw new Error("PORTAL_RP_ID fehlt – ohne sie ist keine Anmeldung möglich.");
}

export function expectedOrigin(): string {
  const configured = process.env.PORTAL_ORIGIN?.trim();
  if (configured) return configured;

  if (process.env.NODE_ENV !== "production") return "http://localhost:3000";

  throw new Error("PORTAL_ORIGIN fehlt – ohne sie ist keine Anmeldung möglich.");
}

export type StoredCredential = {
  id: string;
  publicKey: string;
  counter: number;
  transports: string[] | null;
};

export async function buildRegistrationOptions(params: {
  userId: string;
  userName: string;
  displayName: string;
  existing: StoredCredential[];
}) {
  return generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: rpId(),
    userID: new TextEncoder().encode(params.userId),
    userName: params.userName,
    userDisplayName: params.displayName,

    // Kein Attestation-Zertifikat anfordern: Wir wollen nicht wissen, welches
    // Fabrikat der Authenticator hat. Es hilft uns nichts und wäre zusätzliche
    // Information über Reginas Gerät, die wir nicht brauchen.
    attestationType: "none",

    // Verhindert, dass dasselbe Gerät versehentlich zweimal registriert wird.
    excludeCredentials: params.existing.map((c) => ({
      id: c.id,
      transports: c.transports as never,
    })),

    authenticatorSelection: {
      // Der Schlüssel soll auffindbar sein, damit die Anmeldung ohne vorherige
      // Eingabe einer Kennung funktioniert – ein Klick, Face ID, fertig.
      residentKey: "preferred",
      // Face ID, Fingerabdruck oder Geräte-PIN. Ein Schlüssel ohne
      // Nutzerprüfung wäre bei einem verlorenen Laptop wertlos.
      userVerification: "preferred",
    },
  });
}

export async function checkRegistration(params: {
  response: Parameters<typeof verifyRegistrationResponse>[0]["response"];
  expectedChallenge: string;
}) {
  const result = await verifyRegistrationResponse({
    response: params.response,
    expectedChallenge: params.expectedChallenge,
    expectedOrigin: expectedOrigin(),
    expectedRPID: rpId(),
    requireUserVerification: false,
  });

  if (!result.verified || !result.registrationInfo) return null;

  const { credential } = result.registrationInfo;

  return {
    id: credential.id,
    publicKey: Buffer.from(credential.publicKey).toString("base64url"),
    counter: credential.counter,
    transports: credential.transports ?? null,
  } satisfies StoredCredential;
}

export async function buildAuthenticationOptions(
  allowed: StoredCredential[]
) {
  return generateAuthenticationOptions({
    rpID: rpId(),
    userVerification: "preferred",
    allowCredentials: allowed.map((c) => ({
      id: c.id,
      transports: c.transports as never,
    })),
  });
}

export async function checkAuthentication(params: {
  response: Parameters<typeof verifyAuthenticationResponse>[0]["response"];
  expectedChallenge: string;
  credential: StoredCredential;
}) {
  const result = await verifyAuthenticationResponse({
    response: params.response,
    expectedChallenge: params.expectedChallenge,
    expectedOrigin: expectedOrigin(),
    expectedRPID: rpId(),
    requireUserVerification: false,
    credential: {
      id: params.credential.id,
      publicKey: new Uint8Array(
        Buffer.from(params.credential.publicKey, "base64url")
      ),
      counter: params.credential.counter,
      transports: params.credential.transports as never,
    },
  });

  if (!result.verified) return null;

  /*
    Der Signaturzähler steigt bei jeder Nutzung. Bleibt er stehen oder fällt
    zurück, ist der Schlüssel dupliziert worden – dann ist die Anmeldung zu
    verweigern, auch wenn die Signatur formal stimmt.

    Ausnahme: Viele Plattform-Authenticator (Apple, Google) zählen gar nicht
    und melden dauerhaft 0. Nur wenn beide Werte über 0 liegen, ist der
    Vergleich aussagekräftig.
  */
  const newCounter = result.authenticationInfo.newCounter;
  const oldCounter = params.credential.counter;

  if (oldCounter > 0 && newCounter > 0 && newCounter <= oldCounter) {
    return null;
  }

  return { newCounter };
}
