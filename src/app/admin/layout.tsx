import type { Metadata } from "next";

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
    <main className="min-h-screen bg-sand px-[var(--shell-x)] py-16 text-ink">
      <div className="mx-auto max-w-[110rem]">{children}</div>
    </main>
  );
}
