import { publicContactEmail } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von R.ArtPhotographie in Kaufbeuren.",
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-sand px-[var(--shell-x)] pb-24 text-ink">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow text-ink/55">
          Rechtliches
        </p>

        <h1 className="display-lg mt-5 text-ink">
          Datenschutzerklärung
        </h1>

        <div className="mt-12 space-y-10 text-base leading-8 text-ink/75">
          <section>
            <h2 className="font-display text-2xl text-ink">
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
            <h2 className="font-display text-2xl text-ink">
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
            <h2 className="font-display text-2xl text-ink">
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
            <h2 className="font-display text-2xl text-ink">
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
            <h2 className="font-display text-2xl text-ink">
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
            <h2 className="font-display text-2xl text-ink">
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
            <h2 className="font-display text-2xl text-ink">
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
            <h2 className="font-display text-2xl text-ink">
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
            <h2 className="font-display text-2xl text-ink">
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
            <h2 className="font-display text-2xl text-ink">
              10. Cookies, Analyse und Marketing
            </h2>
            <p className="mt-4">
              <strong className="text-ink">
                Cookielose Reichweitenmessung (ohne Einwilligung).
              </strong>{" "}
              Wir nutzen Vercel Web Analytics und Vercel Speed Insights. Diese
              Dienste setzen keine Cookies, vergeben keine geräteübergreifende
              Kennung und speichern keine IP-Adressen. Erhoben werden
              ausschließlich aggregierte Angaben wie aufgerufene Seite,
              Herkunftsseite, ungefähre Region, Gerätetyp und Ladezeiten. Eine
              Zuordnung zu einer Person ist damit nicht möglich. Rechtsgrundlage
              ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist
              der technisch fehlerfreie Betrieb und die Verbesserung der
              Website. Anbieter: Vercel Inc., 440 N Barranca Ave #4133, Covina,
              CA 91723, USA.
            </p>

            <p className="mt-4">
              <strong className="text-ink">
                Google Analytics 4 (nur mit Einwilligung).
              </strong>{" "}
              Sofern du im Einwilligungsbanner zustimmst, setzen wir Google
              Analytics 4 ein, einen Dienst der Google Ireland Limited, Gordon
              House, Barrow Street, Dublin 4, Irland. Google Analytics
              verwendet Cookies und ähnliche Technologien, um deine Nutzung der
              Website auszuwerten. Erfasst werden unter anderem aufgerufene
              Seiten, Verweildauer, Herkunftsseite, ungefähre Region sowie
              ausgelöste Ereignisse (abgesendete Anfrage, Klick auf die
              Telefonnummer, gestarteter Gutschein-Kauf). Die IP-Adresse wird
              gekürzt verarbeitet. Die erhobenen Ereignis- und Nutzerdaten
              werden nach 14 Monaten automatisch gelöscht.
            </p>
            <p className="mt-4">
              <strong className="text-ink">Wichtig:</strong> Ohne deine
              Einwilligung wird Google Analytics nicht geladen. Es werden dann
              keinerlei Daten an Google übertragen und keine Cookies dieses
              Dienstes gesetzt. Rechtsgrundlage für den Zugriff auf dein
              Endgerät ist § 25 Abs. 1 TDDDG, für die anschließende
              Verarbeitung Art. 6 Abs. 1 lit. a DSGVO – jeweils deine
              Einwilligung.
            </p>
            <p className="mt-4">
              Eine Übermittlung in die USA ist nicht ausgeschlossen. Google ist
              nach dem EU-US Data Privacy Framework zertifiziert; ergänzend
              gelten die Standardvertragsklauseln der EU-Kommission. Trotz
              dieser Garantien besteht bei einer Übermittlung in die USA das
              Restrisiko eines Zugriffs durch dortige Behörden.
            </p>
            <p className="mt-4">
              <strong className="text-ink">Widerruf.</strong> Du kannst deine
              Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.
              Klicke dafür im Fußbereich jeder Seite auf
              &bdquo;Cookie-Einstellungen&ldquo; und wähle &bdquo;Ablehnen&ldquo;. Die Rechtmäßigkeit
              der bis zum Widerruf erfolgten Verarbeitung bleibt unberührt.
            </p>
            <p className="mt-4">
              Weitere Analyse- oder Marketingdienste wie Google Tag Manager,
              Meta/Facebook Pixel, TikTok Pixel oder Hotjar werden nicht
              eingesetzt.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink">
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
            <h2 className="font-display text-2xl text-ink">
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
            <h2 className="font-display text-2xl text-ink">
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
            <h2 className="font-display text-2xl text-ink">
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
