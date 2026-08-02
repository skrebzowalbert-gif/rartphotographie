"use client";

import { analyticsConfigured } from "@/lib/analytics";
import { reopenConsentBanner } from "@/components/analytics/ConsentBanner";

/**
 * Widerruf der Einwilligung aus der Fußzeile.
 *
 * Art. 7 Abs. 3 DSGVO verlangt, dass der Widerruf so einfach möglich ist wie
 * die Erteilung. Ohne diesen Link wäre eine einmal erteilte Einwilligung
 * praktisch nicht mehr zurückzunehmen.
 *
 * Wird nur angezeigt, wenn überhaupt eine Mess-ID hinterlegt ist – sonst gibt
 * es nichts zu widerrufen.
 */
export default function ConsentSettingsLink({
  className = "",
}: {
  className?: string;
}) {
  // analyticsConfigured wird zur Bauzeit eingesetzt und ist auf Server und
  // Client identisch – ein Hydration-Guard ist deshalb nicht nötig.
  if (!analyticsConfigured) return null;

  return (
    <button type="button" onClick={reopenConsentBanner} className={className}>
      Cookie-Einstellungen
    </button>
  );
}
