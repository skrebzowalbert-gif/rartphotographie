import type { Metadata } from "next";
import { business, phoneDisplay, publicContactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Kontaktangaben von R.ArtPhotographie in Kaufbeuren.",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-sand px-[var(--shell-x)] pb-24 text-ink">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow text-ink/55">
          Rechtliches
        </p>

        <h1 className="display-lg mt-5 text-ink">Impressum</h1>

        <div className="mt-12 space-y-10 text-base leading-8 text-ink/75">
          <section>
            <h2 className="font-display text-2xl text-ink">Angaben gemäß § 5 TMG</h2>
            <div className="mt-4">
              <p>Regina Gerdt</p>
              <p>R.ArtPhotographie</p>
              <p>Hirtenstraße 16</p>
              <p>87600 Kaufbeuren</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink">Kontakt</h2>
            <div className="mt-4">
              {/*
                § 5 Abs. 1 Nr. 2 TMG verlangt Angaben, die eine unmittelbare
                Kommunikation ermöglichen. Eine Telefonnummer ist der sicherste
                Weg, diese Anforderung zu erfüllen – und für einen lokalen
                Dienstleister ohnehin unverzichtbar.
              */}
              {phoneDisplay ? (
                <p>Telefon: {phoneDisplay}</p>
              ) : (
                <p className="rounded-md border-l-4 border-l-amber-600 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                  Hinweis für die Betreiberin: Hier fehlt die Telefonnummer.
                  Bitte in <code>src/lib/site.ts</code> unter{" "}
                  <code>business.phone</code> eintragen.
                </p>
              )}
              <p className="break-words [overflow-wrap:anywhere]">
                E-Mail: {publicContactEmail}
              </p>
            </div>
          </section>

          <section>
            {/*
              § 5 Abs. 1 Nr. 6 DDG verlangt die Umsatzsteuer-Identifikations-
              nummer nach § 27a UStG ODER die Wirtschafts-Identifikationsnummer
              nach § 139c AO, sofern vorhanden. Regina hat letztere; damit ist
              die Pflichtangabe erfüllt.
            */}
            <h2 className="font-display text-2xl text-ink">
              Wirtschafts-Identifikationsnummer
            </h2>
            <p className="mt-4">
              Wirtschafts-Identifikationsnummer nach § 139c AO:{" "}
              {business.economicIdNumber}
            </p>
            {/*
              Nicht im Impressum vorgeschrieben, aber die Angabe, nach der
              Besucher hier suchen. Die preisrechtlich verpflichtende Stelle
              ist die Preisangabe selbst (§ 3 PAngV) – dort steht sie ebenfalls.
            */}
            <p className="mt-4">
              Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und daher auch
              nicht ausgewiesen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink">
              Verbraucherstreitbeilegung
            </h2>
            <p className="mt-4">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung bereit. Wir sind nicht verpflichtet und
              nicht bereit, an einem Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <div className="mt-4">
              <p>Regina Gerdt</p>
              <p>Hirtenstraße 16</p>
              <p>87600 Kaufbeuren</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink">Haftung für Inhalte</h2>
            <p className="mt-4">
              Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird
              jedoch keine Gewähr übernommen.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink">Haftung für Links</h2>
            <p className="mt-4">
              Diese Website enthält Links zu externen Websites Dritter, auf deren
              Inhalte kein Einfluss besteht. Deshalb wird für diese fremden Inhalte
              auch keine Gewähr übernommen. Für die Inhalte der verlinkten Seiten
              ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink">Urheberrecht</h2>
            <p className="mt-4">
              Die auf dieser Website veröffentlichten Inhalte und Werke unterliegen
              dem deutschen Urheberrecht. Jede Art der Verwertung außerhalb der
              Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung
              der jeweiligen Urheberin bzw. Rechteinhaberin.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
