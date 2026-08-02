"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  analyticsConfigured,
  getServerConsent,
  readConsent,
  subscribeToConsent,
  writeConsent,
} from "@/lib/analytics";

/** Öffnet das Banner erneut – für den Widerruf aus der Fußzeile. */
export const REOPEN_CONSENT_EVENT = "rart-consent-reopen";

export function reopenConsentBanner() {
  window.dispatchEvent(new Event(REOPEN_CONSENT_EVENT));
}

/**
 * Einwilligungsbanner.
 *
 * Erscheint nur, wenn eine Mess-ID hinterlegt ist und noch keine Entscheidung
 * getroffen wurde. Ohne NEXT_PUBLIC_GA_ID sieht der Besucher gar nichts – die
 * Seite bleibt dann so cookiefrei wie bisher.
 *
 * Gestaltung bewusst als schmale Leiste unten statt als Vollbild-Sperre: Sie
 * verdeckt keinen Inhalt und blockiert den Besucher nicht, der gerade eine
 * Anfrage schreiben will.
 *
 * Ablehnen ist genauso leicht wie Zustimmen (Art. 7 Abs. 3 DSGVO: der Widerruf
 * muss so einfach sein wie die Erteilung), und die Entscheidung lässt sich über
 * die Fußzeile jederzeit ändern.
 */
export default function ConsentBanner() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    readConsent,
    getServerConsent
  );
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const onReopen = () => setReopened(true);
    window.addEventListener(REOPEN_CONSENT_EVENT, onReopen);
    return () => window.removeEventListener(REOPEN_CONSENT_EVENT, onReopen);
  }, []);

  // Entscheidung speichern und das Banner schließen. Bewusst hier statt in
  // einem Effect: eine Zustandsänderung als Reaktion auf einen Klick gehört in
  // den Klick, nicht in einen nachgelagerten Renderdurchlauf.
  const decide = (value: "granted" | "denied") => {
    writeConsent(value);
    setReopened(false);
  };

  const visible = analyticsConfigured && (consent === null || reopened);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Einwilligung zur Reichweitenmessung"
      // Über der mobilen Kontaktleiste, damit beide bedienbar bleiben.
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-paper/15 bg-ink px-[var(--shell-x)] py-5 text-paper"
    >
      <div className="mx-auto flex max-w-[110rem] flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <p className="max-w-3xl text-sm leading-6 text-paper/80">
          Wir würden gern mit Google Analytics messen, welche Seiten gelesen
          werden, um die Website zu verbessern. Das setzt Cookies und überträgt
          Daten an Google. Nur mit deiner Einwilligung – ohne sie wird nichts
          geladen.{" "}
          <Link
            href="/datenschutz"
            className="underline underline-offset-4 hover:text-paper"
          >
            Datenschutzerklärung
          </Link>
        </p>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          {/* Ablehnen steht zuerst und ist gleich prominent. */}
          <button
            type="button"
            onClick={() => decide("denied")}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-paper/35 px-7 text-sm font-medium text-paper transition-colors duration-300 hover:border-paper/70"
          >
            Ablehnen
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-paper px-7 text-sm font-medium text-ink transition-opacity duration-300 hover:opacity-90"
          >
            Einverstanden
          </button>
        </div>
      </div>
    </div>
  );
}
