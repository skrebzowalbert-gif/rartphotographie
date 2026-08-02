"use client";

import Script from "next/script";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  GA_MEASUREMENT_ID,
  analyticsConfigured,
  getServerConsent,
  readConsent,
  subscribeToConsent,
  trackEvent,
} from "@/lib/analytics";

/**
 * Lädt Google Analytics erst nach Einwilligung und meldet Seitenaufrufe.
 *
 * Ohne Einwilligung wird kein Script eingebunden – es geht kein Aufruf an
 * Google. Ohne hinterlegte Mess-ID passiert ebenfalls nichts, die Seite
 * funktioniert also unverändert, solange NEXT_PUBLIC_GA_ID nicht gesetzt ist.
 */
export default function Analytics() {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    readConsent,
    getServerConsent
  );
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
    Seitenaufrufe werden selbst gemeldet statt über die automatische Erfassung.
    Grund: Next.js wechselt die Seite ohne echten Seitenneuaufbau, GA4 würde
    sonst nur den ersten Aufruf sehen.
  */
  useEffect(() => {
    if (!ready || consent !== "granted" || typeof window.gtag !== "function") {
      return;
    }

    const query = searchParams.toString();
    window.gtag("event", "page_view", {
      page_path: query ? `${pathname}?${query}` : pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [ready, consent, pathname, searchParams]);

  /*
    Telefonklicks werden zentral erfasst, statt jeden einzelnen Link anzufassen.
    Die Nummer steht in Navigation, Fußzeile, Kontaktseite, mobiler Leiste und
    auf mehreren Landingpages – ein Listener deckt alle ab, auch künftige.
  */
  const onDocumentClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    const link = target?.closest?.('a[href^="tel:"]');

    if (link) {
      trackEvent("anruf_geklickt", {
        position: link.closest("footer")
          ? "fusszeile"
          : link.closest("header")
          ? "navigation"
          : "inhalt",
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [onDocumentClick]);

  if (!analyticsConfigured || consent !== "granted") {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted'
          });
          gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true,
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}
