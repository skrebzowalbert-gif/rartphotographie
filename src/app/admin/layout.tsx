import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { default: "Verwaltung", template: "%s · Verwaltung" },
  // Der Verwaltungsbereich gehört unter keinen Umständen in eine Suchmaschine.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-sand px-[var(--shell-x)] pb-16 pt-10 text-ink">
      <div className="mx-auto max-w-[110rem]">
        {/*
          Der Verwaltungsbereich trägt die öffentliche Menüleiste nicht mehr –
          die gehört zur Website, nicht zum Arbeitsplatz. Damit fehlte aber der
          Weg zurück zur Übersicht, sobald man in einer Galerie steckt. Also
          eine Zeile, mehr braucht es nicht.
        */}
        <Link
          href="/admin"
          className="eyebrow inline-block text-ink/45 transition-colors duration-300 hover:text-ink"
        >
          R.Artphotographie · Verwaltung
        </Link>

        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}
