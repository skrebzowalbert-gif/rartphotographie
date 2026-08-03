"use client";

import { usePathname } from "next/navigation";

/**
 * Messung und Einwilligungsbanner nur auf der öffentlichen Website.
 *
 * Zwei Gründe, und beide wiegen schwer:
 *
 * – Datensparsamkeit. Auf "/galerie/<etwas>" steht im Seitentitel und im Pfad,
 *   wer wann geheiratet hat. Diese Adressen an Google zu schicken, wäre genau
 *   die Datenübermittlung, die eine Kundengalerie nicht haben darf –
 *   unabhängig davon, ob jemand eingewilligt hat.
 *
 * – Ruhe im Werkzeug. Das Banner erschien mitten in der Anmeldung des
 *   Verwaltungsbereichs und verdeckte dort den Anmeldeknopf.
 */
export default function PublicOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";

  // "/galerie" ohne Weiteres ist die öffentliche Portfolio-Seite und bleibt
  // gemessen; nur "/galerie/<slug>" ist eine Kundengalerie.
  if (pathname.startsWith("/galerie/") || pathname.startsWith("/admin")) {
    return null;
  }

  return <>{children}</>;
}
