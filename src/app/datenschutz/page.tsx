import { publicContactEmail } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von R.ArtPhotographie in Kaufbeuren.",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-[#e7dfd3] px-6 pb-24 text-black md:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm uppercase tracking-[0.35em] text-black/40">
          Rechtliches
        </p>

        <h1 className="mt-4 text-4xl font-light md:text-6xl">
          Datenschutzerklärung
        </h1>

        <div className="mt-12 space-y-10 text-base leading-8 text-black/75">
          <section>
            <h2 className="text-2xl font-medium text-black">
              1. Allgemeine Hinweise
            </h2>
            <p className="mt-4">
              Der Schutz deiner persönlichen Daten ist wichtig.
              Personenbezogene Daten werden auf dieser Website nur verarbeitet,
              soweit dies für den Betrieb der Website, die Bearbeitung deiner
              Anfrage, den Gutschein-Kauf oder zur Erfüllung gesetzlicher
              Pflichten erforderlich ist.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              2. Verantwortliche Stelle
            </h2>
            <div className="mt-4">
              <p>Regina Gerdt</p>
              <p>R.ArtPhotographie</p>
              <p>Hirtenstraße 16</p>
              <p>87600 Kaufbeuren</p>
              <p className="break-words [overflow-wrap:anywhere]">
                E-Mail: {publicContactEmail}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              3. Erhebung und Verarbeitung personenbezogener Daten
            </h2>
            <p className="mt-4">
              Personenbezogene Daten werden erhoben, wenn du sie freiwillig
              mitteilst, zum Beispiel über das Kontaktformular oder beim Kauf
              eines Gutscheins. Zusätzlich werden beim Besuch der Website
              technisch erforderliche Zugriffsdaten verarbeitet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              4. Technische Zugriffsdaten und Server-Logs
            </h2>
            <p className="mt-4">
              Beim Aufruf der Website können technisch erforderliche Daten
              verarbeitet werden, etwa IP-Adresse, Datum und Uhrzeit des
              Zugriffs, aufgerufene Seite, Referrer-URL, Browsertyp,
              Betriebssystem und technische Statusmeldungen. Diese Daten dienen
              der sicheren Bereitstellung, Stabilität und Fehleranalyse der
              Website.
            </p>
            <p className="mt-4">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte
              Interesse liegt im sicheren und zuverlässigen Betrieb der
              Website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              5. Hosting über Vercel
            </h2>
            <p className="mt-4">
              Diese Website wird bei Vercel gehostet. Anbieter ist Vercel Inc.,
              440 N Barranca Ave #4133, Covina, CA 91723, USA. Beim Besuch der
              Website verarbeitet Vercel technische Zugriffsdaten, um die
              Website auszuliefern, abzusichern und zu betreiben.
            </p>
            <p className="mt-4">
              Soweit Daten in die USA übertragen werden, erfolgt dies auf
              Grundlage geeigneter Garantien im Sinne der DSGVO, insbesondere
              der EU-Standardvertragsklauseln, soweit erforderlich.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              6. Kontaktformular und Anfragen
            </h2>
            <p className="mt-4">
              Wenn du das Kontaktformular nutzt, werden die eingegebenen Daten
              zur Bearbeitung deiner Anfrage und für mögliche Rückfragen
              verarbeitet.
            </p>
            <p className="mt-4">
              Dazu gehören insbesondere Name, E-Mail-Adresse, Telefonnummer
              (sofern angegeben), Anfrageart, Wunschdatum, Nachricht sowie bei
              Hochzeitsanfragen mit Fahrzeugoption das angegebene
              Fahrzeuginteresse und Wunschfahrzeug.
            </p>
            <p className="mt-4">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die
              Anfrage der Vorbereitung oder Durchführung eines Vertrags dient,
              sowie Art. 6 Abs. 1 lit. f DSGVO für allgemeine Kommunikation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              7. E-Mail-Versand über Resend
            </h2>
            <p className="mt-4">
              Für den Versand von Kontaktanfragen und Bestätigungs-E-Mails wird
              Resend eingesetzt. Anbieter ist Resend, Inc., USA. Die über das
              Kontaktformular oder den Gutschein-Kauf eingegebenen Daten können
              an Resend übermittelt werden, damit die jeweilige E-Mail an
              R.ArtPhotographie bzw. an dich zugestellt werden kann.
            </p>
            <p className="mt-4">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bzw. Art. 6 Abs.
              1 lit. f DSGVO. Soweit Daten in die USA übertragen werden,
              erfolgt dies auf Grundlage geeigneter Garantien, soweit
              erforderlich.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              8. Gutschein-Kauf und Zahlungsabwicklung über Stripe
            </h2>
            <p className="mt-4">
              Beim Kauf eines Wertgutscheins werden die für den Kauf
              erforderlichen Daten verarbeitet. Dazu gehören insbesondere Name,
              E-Mail-Adresse, Telefonnummer (sofern angegeben),
              Gutscheinbetrag, Gutscheinempfänger, optionale Nachricht,
              Versandadresse sowie Zahlungsstatus und technische
              Bestelldaten.
            </p>
            <p className="mt-4">
              Die Zahlung wird über Stripe Checkout abgewickelt. Anbieter ist
              Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand
              Canal Dock, Dublin, Irland. Zahlungsdaten wie Kreditkartendaten
              werden nicht auf dieser Website gespeichert, sondern direkt von
              Stripe verarbeitet.
            </p>
            <p className="mt-4">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO zur Durchführung
              des Gutschein-Kaufs sowie Art. 6 Abs. 1 lit. c DSGVO für
              gesetzliche Aufbewahrungspflichten.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              9. Galerie und Promotion-Inhalte über Sanity
            </h2>
            <p className="mt-4">
              Galerie- und Aktionsinhalte werden über Sanity bereitgestellt.
              Anbieter ist Sanity AS, Norwegen. Beim Laden der Galerie können
              Bild- und Inhaltsdaten von Sanity bzw. dem Sanity-CDN geladen
              werden. Personenbezogene Daten von Website-Besuchern werden
              dadurch nach aktuellem Stand nicht für Analyse- oder
              Marketingzwecke verarbeitet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              10. Cookies, Analyse und Marketing
            </h2>
            <p className="mt-4">
              Auf dieser Website werden nach aktuellem Stand keine
              Analyse- oder Marketing-Cookies eingesetzt. Es werden keine
              Dienste wie Google Analytics, Google Tag Manager, Meta/Facebook
              Pixel, TikTok Pixel, Hotjar oder vergleichbare Tracking-Dienste
              aktiv geladen.
            </p>
            <p className="mt-4">
              Ein Cookie-Banner ist daher für diese Website derzeit nicht
              vorgesehen. Sollte sich der Einsatz externer Analyse- oder
              Marketingdienste ändern, wird diese Datenschutzerklärung
              entsprechend angepasst.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              11. Externe Links
            </h2>
            <p className="mt-4">
              Auf dieser Website befinden sich Links zu externen Plattformen,
              insbesondere zu Instagram. Beim Anklicken eines solchen Links verlässt
              du diese Website. Für die Datenverarbeitung auf den externen Plattformen
              sind ausschließlich deren Betreiber verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              12. Speicherdauer
            </h2>
            <p className="mt-4">
              Personenbezogene Daten werden nur so lange gespeichert, wie dies
              für die Bearbeitung deiner Anfrage, die Durchführung eines
              Auftrags oder eines Gutschein-Kaufs erforderlich ist. Gesetzliche
              Aufbewahrungspflichten, insbesondere steuer- und
              handelsrechtliche Vorgaben, bleiben unberührt.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              13. Rechte der betroffenen Personen
            </h2>
            <p className="mt-4">
              Du hast das Recht auf Auskunft über die bei uns gespeicherten
              personenbezogenen Daten sowie auf Berichtigung, Löschung,
              Einschränkung der Verarbeitung und Widerspruch gegen die Verarbeitung
              im Rahmen der gesetzlichen Vorschriften.
            </p>
            <p className="mt-4">
              Außerdem hast du das Recht auf Datenübertragbarkeit, soweit die
              gesetzlichen Voraussetzungen vorliegen, sowie das Recht, eine
              erteilte Einwilligung jederzeit mit Wirkung für die Zukunft zu
              widerrufen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              14. Beschwerderecht
            </h2>
            <p className="mt-4">
              Du hast das Recht, dich bei einer zuständigen Datenschutzaufsichtsbehörde
              über die Verarbeitung deiner personenbezogenen Daten zu beschweren.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
