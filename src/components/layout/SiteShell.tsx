"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCtaBar from "@/components/layout/MobileCtaBar";

/**
 * Entscheidet, ob eine Seite den öffentlichen Rahmen bekommt.
 *
 * Kundengalerien und der Verwaltungsbereich bekommen ihn nicht. Eine Menüleiste
 * mit "Preise" und "Shooting anfragen" über den Hochzeitsbildern eines Paares,
 * das längst gebucht hat, wirkt nicht einladend, sondern nach Verkauf – und ein
 * Fußbereich mit Leistungsübersicht unter der Bildauswahl erst recht.
 *
 * "/galerie" ohne Weiteres ist die öffentliche Portfolio-Seite und behält den
 * Rahmen; nur "/galerie/<etwas>" ist privat. Deshalb der Schrägstrich.
 */
function istPortal(pathname: string) {
  return pathname.startsWith("/galerie/") || pathname.startsWith("/admin");
}

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (istPortal(pathname ?? "")) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Fixierte Navigation: konstanter Abstand auf allen Seiten. */}
      <div className="flex-1 pt-20 md:pt-24">
        {children}
      </div>
      <Footer />
      {/* Platz, damit die fixierte Mobile-Leiste nichts überdeckt. */}
      <div className="h-[76px] md:hidden" />
      <MobileCtaBar />
    </div>
  );
}
