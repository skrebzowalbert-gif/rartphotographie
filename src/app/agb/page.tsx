import type { Metadata } from "next";
import Link from "next/link";
import { business, publicContactEmail, phoneDisplay } from "@/lib/site";

/**
 * ENTWURF – VOR DEM LIVEGANG ANWALTLICH PRÜFEN LASSEN.
 *
 * Textgerüst, keine Rechtsberatung. Erforderlich, weil über /gutscheine
 * Wertgutscheine an Verbraucher verkauft werden.
 */
export const metadata: Metadata = {
  title: "AGB",
  description:
    "Allgemeine Geschäftsbedingungen von R.ArtPhotographie, Kaufbeuren – für Fotoshootings und den Kauf von Wertgutscheinen.",
  alternates: { canonical: "/agb" },
  robots: { index: false, follow: true },
};

const sections = [
  {
    title: "1. Geltungsbereich und Vertragspartner",
    paragraphs: [
      `Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen ${business.legalName}, ${business.street}, ${business.postalCode} ${business.city} (nachfolgend „Fotografin") und dem Auftraggeber über Fotoshootings sowie über den Kauf von Wertgutscheinen über diese Website.`,
      "Abweichende Bedingungen des Auftraggebers werden nicht Vertragsbestandteil, es sei denn, ihrer Geltung wird ausdrücklich schriftlich zugestimmt.",
    ],
  },
  {
    title: "2. Vertragsschluss",
    paragraphs: [
      "Die Darstellung der Leistungen auf dieser Website stellt kein rechtlich bindendes Angebot dar, sondern eine unverbindliche Aufforderung zur Anfrage.",
      "Eine Anfrage über das Kontaktformular ist unverbindlich und kostenfrei. Der Vertrag über ein Fotoshooting kommt erst mit der ausdrücklichen Terminbestätigung durch die Fotografin in Textform zustande.",
      "Beim Kauf eines Wertgutscheins kommt der Vertrag mit dem Abschluss des Bezahlvorgangs zustande. Der Gutschein wird anschließend per E-Mail zugesandt.",
    ],
  },
  {
    title: "3. Preise und Zahlung",
    paragraphs: [
      "Es gelten die zum Zeitpunkt der Buchung auf der Preis-Seite ausgewiesenen Preise. Alle Preise verstehen sich als Endpreise.",
      "HINWEIS FÜR DIE BETREIBERIN: Hier ist die zutreffende Umsatzsteuer-Angabe zu ergänzen – entweder der Ausweis der gesetzlichen Umsatzsteuer oder der Hinweis nach § 19 UStG (Kleinunternehmerregelung: es wird keine Umsatzsteuer berechnet).",
      "Die Zahlung von Wertgutscheinen erfolgt über den Zahlungsdienstleister Stripe. Die Vergütung für Shootings ist, sofern nicht abweichend vereinbart, nach dem Termin und vor Auslieferung der bearbeiteten Bilder fällig.",
    ],
  },
  {
    title: "4. Wertgutscheine",
    paragraphs: [
      "Wertgutscheine sind auf alle angebotenen Shootingarten anrechenbar und übertragbar.",
      "Wertgutscheine sind ab Ausstellungsdatum drei Jahre gültig; die Frist beginnt mit dem Schluss des Jahres, in dem der Gutschein ausgestellt wurde (§ 195, § 199 BGB).",
      "Eine Barauszahlung von Wertgutscheinen ist ausgeschlossen. Restguthaben bleiben bis zum Ablauf der Gültigkeit erhalten.",
    ],
  },
  {
    title: "5. Termine, Absage und Ausfall",
    paragraphs: [
      "Vereinbarte Termine sind verbindlich. Eine kostenfreie Absage oder Verlegung durch den Auftraggeber ist bis 14 Tage vor dem Termin möglich.",
      "HINWEIS FÜR DIE BETREIBERIN: Die Stornofristen und etwaige Ausfallpauschalen sind an die tatsächliche Praxis anzupassen und müssen der AGB-Inhaltskontrolle nach §§ 305 ff. BGB standhalten.",
      "Bei Outdoor-Shootings kann der Termin wetterbedingt einvernehmlich verlegt werden. Ein Ersatztermin wird zeitnah angeboten.",
      "Kann die Fotografin den Termin aus Gründen, die sie zu vertreten hat, nicht wahrnehmen, wird ein Ersatztermin angeboten oder bereits geleistete Zahlungen werden vollständig erstattet.",
    ],
  },
  {
    title: "6. Leistungsumfang und Bildauswahl",
    paragraphs: [
      "Der Umfang der Leistung, insbesondere Dauer des Shootings und Anzahl der bearbeiteten Bilder, ergibt sich aus dem gebuchten Paket.",
      "Die Auswahl und Bearbeitung der Bilder erfolgt nach dem gestalterischen Ermessen der Fotografin. Ein Anspruch auf Herausgabe unbearbeiteter Aufnahmen oder auf eine bestimmte Bildauswahl besteht nicht.",
    ],
  },
  {
    title: "7. Nutzungsrechte",
    paragraphs: [
      "Die Fotografin bleibt Urheberin der Aufnahmen. Der Auftraggeber erhält ein einfaches, räumlich und zeitlich unbeschränktes Nutzungsrecht zur privaten Verwendung.",
      "Eine kommerzielle Nutzung, die Weitergabe an Dritte zu gewerblichen Zwecken sowie die Bearbeitung der Bilder, insbesondere durch Filter oder Beschnitt bei Veröffentlichung, bedürfen der vorherigen Zustimmung.",
      "Bei Veröffentlichung in sozialen Medien wird um eine Urhebernennung gebeten.",
    ],
  },
  {
    title: "8. Verwendung durch die Fotografin",
    paragraphs: [
      "Eine Verwendung der Aufnahmen zu Eigenwerbezwecken der Fotografin, etwa auf dieser Website, im Portfolio oder in sozialen Medien, erfolgt ausschließlich nach vorheriger, ausdrücklicher und jederzeit widerruflicher Einwilligung der abgebildeten Personen.",
    ],
  },
  {
    title: "9. Haftung",
    paragraphs: [
      "Die Fotografin haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei der Verletzung von Leben, Körper oder Gesundheit.",
      "Bei einfacher Fahrlässigkeit haftet die Fotografin nur bei Verletzung einer wesentlichen Vertragspflicht und begrenzt auf den vertragstypischen, vorhersehbaren Schaden.",
      "Für den Verlust von Bilddaten nach Auslieferung und Ablauf der vereinbarten Aufbewahrungsfrist wird keine Haftung übernommen. Dem Auftraggeber wird empfohlen, eigene Sicherungskopien anzulegen.",
    ],
  },
  {
    title: "10. Streitbeilegung",
    paragraphs: [
      "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit. Zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle ist die Fotografin nicht verpflichtet und nicht bereit.",
    ],
  },
  {
    title: "11. Schlussbestimmungen",
    paragraphs: [
      "Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Bei Verbrauchern gilt diese Rechtswahl nur, soweit dadurch der Schutz zwingender Verbraucherschutzvorschriften des Aufenthaltsstaats nicht entzogen wird.",
      "Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.",
    ],
  },
];

export default function AgbPage() {
  return (
    <main className="min-h-screen bg-sand px-6 pb-24 text-black md:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm uppercase tracking-[0.3em] text-black/60">
          Rechtliches
        </p>
        <h1 className="mt-4 text-4xl font-light md:text-6xl">
          Allgemeine Geschäftsbedingungen
        </h1>

        <div
          role="note"
          className="mt-8 rounded-md border-l-4 border-l-amber-600 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-950"
        >
          <strong>Hinweis für die Betreiberin:</strong> Dieser Text ist ein
          unverbindlicher Entwurf und ersetzt keine Rechtsberatung. Die mit
          &bdquo;HINWEIS FÜR DIE BETREIBERIN&ldquo; markierten Stellen müssen zwingend
          ausgefüllt werden. Bitte vor der Veröffentlichung anwaltlich prüfen
          lassen. Diese Seite ist derzeit auf <code>noindex</code> gesetzt.
        </div>

        <div className="mt-12 space-y-10 text-base leading-8 text-black/80">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-medium text-black">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-4">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section>
            <h2 className="text-2xl font-medium text-black">Kontakt</h2>
            <address className="mt-4 not-italic">
              {business.legalName}
              <br />
              {business.name}
              <br />
              {business.street}
              <br />
              {business.postalCode} {business.city}
              <br />
              E-Mail: {publicContactEmail}
              {phoneDisplay && (
                <>
                  <br />
                  Telefon: {phoneDisplay}
                </>
              )}
            </address>
            <p className="mt-6">
              Siehe auch die{" "}
              <Link
                href="/widerruf"
                className="underline underline-offset-4 hover:opacity-70"
              >
                Widerrufsbelehrung
              </Link>{" "}
              und die{" "}
              <Link
                href="/datenschutz"
                className="underline underline-offset-4 hover:opacity-70"
              >
                Datenschutzerklärung
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
