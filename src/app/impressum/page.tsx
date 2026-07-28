import type { Metadata } from "next";
import { phoneDisplay, publicContactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Kontaktangaben von R.ArtPhotographie in Kaufbeuren.",
  alternates: { canonical: "/impressum" },
};

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-sand px-6 pb-24 text-black md:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm uppercase tracking-[0.35em] text-black/65">
          Rechtliches
        </p>

        <h1 className="mt-4 text-4xl font-light md:text-6xl">Impressum</h1>

        <div className="mt-12 space-y-10 text-base leading-8 text-black/75">
          <section>
            <h2 className="text-2xl font-medium text-black">Angaben gemäß § 5 TMG</h2>
            <div className="mt-4">
              <p>Regina Gerdt</p>
              <p>R.ArtPhotographie</p>
              <p>Hirtenstraße 16</p>
              <p>87600 Kaufbeuren</p>
              <p>Deutschland</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">Kontakt</h2>
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
            <h2 className="text-2xl font-medium text-black">Umsatzsteuer</h2>
            <p className="mt-4 rounded-md border-l-4 border-l-amber-600 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Hinweis für die Betreiberin: Hier gehört die zutreffende Angabe
              hin – entweder die Umsatzsteuer-Identifikationsnummer nach § 27 a
              UStG oder der Hinweis auf die Kleinunternehmerregelung: „Gemäß
              § 19 UStG wird keine Umsatzsteuer berechnet.&ldquo;
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
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
            <h2 className="text-2xl font-medium text-black">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <div className="mt-4">
              <p>Regina Gerdt</p>
              <p>Hirtenstraße 16</p>
              <p>87600 Kaufbeuren</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">Haftung für Inhalte</h2>
            <p className="mt-4">
              Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird
              jedoch keine Gewähr übernommen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">Haftung für Links</h2>
            <p className="mt-4">
              Diese Website enthält Links zu externen Websites Dritter, auf deren
              Inhalte kein Einfluss besteht. Deshalb wird für diese fremden Inhalte
              auch keine Gewähr übernommen. Für die Inhalte der verlinkten Seiten
              ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">Urheberrecht</h2>
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
