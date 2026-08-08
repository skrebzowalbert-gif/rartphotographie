"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";

type Mode = "login" | "register";

/** Was der Knopf nach einem Fehlschlag anzeigt. */
type Hinweis = {
  text: string;
  /** Ein Weg heraus, wenn es hier nicht weitergeht. */
  weiter?: { href: string; text: string };
};

/**
 * Alles, woran sich ein Fehler erkennen lässt, in einer Zeichenkette.
 *
 * Je nach Browser und Bibliothek steckt die Ursache mal in `name`
 * (DOMException), mal in `code` (WebAuthnError von SimpleWebAuthn), mal erst
 * im `cause`. Danach einzeln zu fragen wäre eine Kette von Sonderfällen, die
 * beim nächsten Bibliotheksschritt wieder bricht. Ein Suchtext über alle drei
 * ist gröber, aber deutlich haltbarer.
 */
function kennung(caught: unknown): string {
  if (typeof caught !== "object" || caught === null) return "";

  const fehler = caught as {
    name?: unknown;
    code?: unknown;
    cause?: { name?: unknown };
  };

  return [fehler.name, fehler.code, fehler.cause?.name]
    .filter((wert): wert is string => typeof wert === "string")
    .join(" ");
}

const IM_APP_FENSTER =
  "Dieser Browser kann keine Passkeys anlegen. Das kleine Vorschaufenster in " +
  "WhatsApp, Instagram oder Facebook gehört dazu. Tippe unten rechts auf das " +
  "Teilen-Symbol und wähle „In Safari öffnen“ – auf Android „In Chrome öffnen“.";

/**
 * Übersetzt, was schiefging.
 *
 * Die Meldungen des Browsers sind englisch, technisch und für Regina wertlos:
 * "The authenticator was previously registered" sagt ihr nicht, dass sie
 * gerade nichts tun muss außer sich anzumelden. Jede Meldung hier nennt
 * deshalb den nächsten Schritt, nicht die Ursache.
 */
function deuten(caught: unknown, mode: Mode): Hinweis | null {
  const merkmale = kennung(caught);

  /*
    Der häufigste Fall auf einem iPhone – und der einzige, der wie ein Defekt
    aussieht, obwohl er keiner ist.

    Reginas Passkey vom Mac liegt im iCloud-Schlüsselbund und ist damit auf
    ihrem Telefon längst vorhanden. Freischalten lässt sich da nichts mehr,
    also verweigert das Gerät den Dialog. Sie braucht die Einladung gar nicht:
    Anmelden genügt.
  */
  if (/InvalidStateError|PREVIOUSLY_REGISTERED/i.test(merkmale)) {
    return {
      text:
        "Auf diesem Gerät gibt es schon einen Passkey für die Verwaltung – " +
        "vermutlich ist er über den iCloud-Schlüsselbund vom Mac hierher " +
        "gewandert. Du musst nichts freischalten.",
      weiter: { href: "/admin/anmelden", text: "Direkt anmelden" },
    };
  }

  // Systemdialog weggetippt oder zu lange offen gelassen. Kein Fehler.
  if (/NotAllowedError|AbortError|CEREMONY_ABORTED|abort/i.test(merkmale)) {
    return mode === "register"
      ? {
          text:
            "Abgebrochen. Der Einladungslink gilt weiter – er wird erst " +
            "verbraucht, wenn das Freischalten wirklich geklappt hat. Du " +
            "kannst es also gleich noch einmal versuchen.",
        }
      : {
          text:
            "Abgebrochen – oder auf diesem Gerät liegt noch kein Passkey für " +
            "die Verwaltung. Dann brauchst du einen Einladungslink von einem " +
            "Gerät, das schon freigeschaltet ist.",
        };
  }

  /*
    Falsche Adresse. Passkeys gelten für genau eine Domain, und "mit www" und
    "ohne www" sind für den Browser zwei verschiedene. Wer die Adresse von Hand
    tippt, landet leicht auf der falschen.
  */
  if (/SecurityError|INVALID_DOMAIN|INVALID_RP_ID/i.test(merkmale)) {
    return {
      text:
        "Die Adresse in der Adresszeile passt nicht zu diesem Zugang. Ein " +
        "Passkey gilt immer nur für genau eine Schreibweise der Domain – " +
        "öffne den Link unverändert, so wie du ihn bekommen hast, statt die " +
        "Adresse abzutippen.",
    };
  }

  if (/NotSupportedError|NOT_SUPPORTED|not supported/i.test(merkmale)) {
    return { text: IM_APP_FENSTER };
  }

  /*
    Ein abgerissener fetch landet als TypeError hier – auf dem Handy im
    Funkloch der wahrscheinlichste Fehler überhaupt. "Failed to fetch" auf
    Englisch stehen zu lassen wäre die schlechteste Antwort darauf.
  */
  if (caught instanceof TypeError) {
    return {
      text:
        "Die Anfrage kam nicht durch. Das liegt meist am Empfang – versuch " +
        "es gleich noch einmal.",
    };
  }

  const meldung =
    caught instanceof Error && caught.message
      ? caught.message
      : "Unbekannter Fehler.";

  return { text: meldung };
}

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
  const [hinweis, setHinweis] = useState<Hinweis | null>(null);

  const endpoint =
    mode === "login" ? "/api/portal/auth/login" : "/api/portal/auth/register";

  async function run() {
    /*
      Vor dem ersten Netzaufruf prüfen, ob dieser Browser überhaupt Passkeys
      kennt. Sonst fordern wir Optionen an, legen eine Challenge in der
      Datenbank ab und scheitern erst danach – an etwas, das von Anfang an
      feststand.
    */
    if (typeof window !== "undefined" && !window.PublicKeyCredential) {
      setHinweis({ text: IM_APP_FENSTER });
      return;
    }

    setBusy(true);
    setHinweis(null);

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
      setHinweis(deuten(caught, mode));
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

      {hinweis && (
        <div
          role="alert"
          className="mt-5 max-w-md rounded-xl border border-ink/12 bg-paper/40 px-4 py-3 text-sm leading-7 text-ink/75"
        >
          <p>{hinweis.text}</p>

          {hinweis.weiter && (
            <Link
              href={hinweis.weiter.href}
              className="mt-3 inline-block font-medium text-ink underline underline-offset-4"
            >
              {hinweis.weiter.text}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
