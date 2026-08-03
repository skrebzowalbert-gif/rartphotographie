"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";

type Mode = "login" | "register";

/**
 * Ein Knopf für den gesamten Anmeldevorgang.
 *
 * Kein Benutzername, kein Passwortfeld, keine Zwischenseite. Der Browser
 * fragt nach Face ID oder Fingerabdruck, danach ist Regina drin.
 *
 * Die Fehlermeldungen sind bewusst in Klartext und ohne Fachbegriffe: Wenn
 * hier etwas klemmt, steht sie vor einem verschlossenen Werkzeug und braucht
 * einen nächsten Schritt, keine Diagnose.
 */
export default function PasskeyButton({
  mode,
  setupToken,
  inviteToken,
  label,
  redirectTo = "/admin",
  children,
}: {
  mode: Mode;
  setupToken?: string;
  inviteToken?: string;
  label?: string;
  redirectTo?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endpoint =
    mode === "login" ? "/api/portal/auth/login" : "/api/portal/auth/register";

  async function run() {
    setBusy(true);
    setError(null);

    try {
      const optionsResponse = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ step: "options", setupToken, inviteToken, label }),
      });

      if (!optionsResponse.ok) {
        const data = await optionsResponse.json().catch(() => ({}));
        throw new Error(data.error ?? "Der Server hat die Anfrage abgelehnt.");
      }

      const options = await optionsResponse.json();

      const credential =
        mode === "login"
          ? await startAuthentication({ optionsJSON: options })
          : await startRegistration({ optionsJSON: options });

      const verifyResponse = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          step: "verify",
          setupToken,
          inviteToken,
          label,
          response: credential,
        }),
      });

      if (!verifyResponse.ok) {
        const data = await verifyResponse.json().catch(() => ({}));
        throw new Error(data.error ?? "Die Anmeldung wurde nicht bestätigt.");
      }

      router.replace(redirectTo);
      router.refresh();
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : "Unbekannter Fehler.";

      // Bricht der Nutzer den Systemdialog ab, ist das kein Fehler.
      if (/NotAllowedError|abort/i.test(message)) {
        setError(null);
      } else {
        setError(message);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className="inline-flex min-h-[58px] items-center justify-center rounded-full bg-ink px-8 text-base font-medium text-paper transition-colors duration-500 hover:bg-ink-soft disabled:opacity-60"
      >
        {busy ? "Einen Moment…" : children}
      </button>

      {error && (
        <p
          role="alert"
          className="mt-5 max-w-md rounded-xl border border-ink/12 bg-paper/40 px-4 py-3 text-sm leading-7 text-ink/75"
        >
          {error}
        </p>
      )}
    </div>
  );
}
