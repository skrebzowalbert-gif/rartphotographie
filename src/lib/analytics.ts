/**
 * Messung und Einwilligung.
 *
 * Rechtlicher Rahmen: Google Analytics setzt Cookies und überträgt Daten an
 * Google. Nach § 25 TDDDG ist dafür eine vorherige Einwilligung nötig – eine
 * Analyse ist keine "unbedingt erforderliche" Funktion.
 *
 * Deshalb wird gtag.js NICHT geladen, solange keine Einwilligung vorliegt.
 * Ohne Einwilligung geht kein einziger Aufruf an Google. Das ist strenger als
 * der oft genutzte "Consent Mode denied", bei dem trotzdem cookielose Signale
 * gesendet werden – und in Deutschland die sichere Auslegung.
 *
 * Unabhängig davon läuft weiterhin die cookielose Reichweitenmessung von
 * Vercel. Sie braucht keine Einwilligung und liefert Zahlen auch dann, wenn
 * Besucher ablehnen.
 */

export const CONSENT_STORAGE_KEY = "rart-consent-analytics";
export const CONSENT_CHANGED_EVENT = "rart-consent-changed";

export type ConsentValue = "granted" | "denied";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() || "";

/** Ist überhaupt eine Mess-ID hinterlegt? Ohne sie bleibt alles inaktiv. */
export const analyticsConfigured = GA_MEASUREMENT_ID.length > 0;

/**
 * Abonnierbarer Zugriff auf die Einwilligung.
 *
 * React stellt für externe Datenquellen useSyncExternalStore bereit. Der
 * naheliegende Weg – im useEffect aus dem localStorage lesen und setState
 * aufrufen – erzeugt eine zusätzliche Renderrunde und wird zu Recht vom Linter
 * bemängelt.
 */
export function subscribeToConsent(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
  // Auch Änderungen aus anderen Tabs übernehmen.
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Serverseitig gibt es keine Einwilligung – dort gilt immer "unbekannt". */
export function getServerConsent(): ConsentValue | null {
  return null;
}

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    // Privater Modus oder blockierter Speicher: dann gilt "keine Entscheidung".
    return null;
  }
}

export function writeConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Nicht speicherbar – die Entscheidung gilt dann nur für diese Sitzung.
  }

  window.dispatchEvent(
    new CustomEvent<ConsentValue>(CONSENT_CHANGED_EVENT, { detail: value })
  );
}

type GtagArgs =
  | ["js", Date]
  | ["config", string, Record<string, unknown>?]
  | ["event", string, Record<string, unknown>?]
  | ["consent", "default" | "update", Record<string, string>];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

/**
 * Ereignisse, die uns interessieren.
 *
 * Bewusst eine feste Liste statt freier Strings: In GA4 sind Ereignisnamen
 * nachträglich kaum zu bereinigen, und ein Tippfehler erzeugt still eine
 * zweite, leere Kennzahl.
 */
export type TrackedEvent =
  /** Kontaktformular erfolgreich abgeschickt. */
  | "anfrage_gesendet"
  /** Klick auf eine Telefonnummer. */
  | "anruf_geklickt"
  /** Weiterleitung zum Bezahlvorgang für einen Gutschein ausgelöst. */
  | "gutschein_checkout_gestartet";

/**
 * Meldet ein Ereignis an GA4 – aber nur, wenn eine Mess-ID hinterlegt ist UND
 * eingewilligt wurde. Ohne beides passiert nichts, ohne Fehler.
 */
export function trackEvent(
  name: TrackedEvent,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;
  if (!analyticsConfigured) return;
  if (readConsent() !== "granted") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", name, params);
}
