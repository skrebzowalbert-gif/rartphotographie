import type { Metadata } from "next";
import Link from "next/link";
import { business, publicContactEmail, phoneDisplay } from "@/lib/site";

/**
 * Keine Rechtsberatung. Der Text ist inhaltlich vollständig und an den
 * §§ 305 ff. BGB ausgerichtet, ersetzt aber keine anwaltliche Prüfung.
 *
 * Die Stornofristen in § 5 sind ein Vorschlag und müssen der tatsächlichen
 * Praxis entsprechen – sonst steht in den AGB etwas anderes, als Regina lebt.
 * Die Ausfallpauschalen sind bewusst moderat gehalten und enthalten den nach
 * § 309 Nr. 5 b BGB zwingenden Vorbehalt des Gegenbeweises; ohne ihn wäre die
 * gesamte Klausel unwirksam.
 */
export const metadata: Metadata = {
  title: "AGB",
  description:
    "Allgemeine Geschäftsbedingungen von R.ArtPhotographie, Kaufbeuren – für Fotoshootings und den Kauf von Wertgutscheinen.",
  alternates: { canonical: "/agb" },
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
      "Beim Kauf eines Wertgutscheins kommt der Vertrag mit dem Abschluss des Bezahlvorgangs zustande. Der Gutschein wird unmittelbar danach als PDF per E-Mail zugesandt und steht zusätzlich auf der Bestätigungsseite zum Download bereit. Ein Versand des gedruckten Gutscheins per Post erfolgt nur, wenn dies beim Kauf ausdrücklich gewählt wurde.",
    ],
  },
  {
    title: "3. Preise und Zahlung",
    paragraphs: [
      "Es gelten die zum Zeitpunkt der Buchung auf der Preis-Seite ausgewiesenen Preise. Alle Preise verstehen sich als Endpreise.",
      "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet und daher auch nicht ausgewiesen (Kleinunternehmerregelung).",
      "Die Zahlung von Wertgutscheinen erfolgt über den Zahlungsdienstleister Stripe. Die Vergütung für Shootings ist, sofern nicht abweichend vereinbart, nach dem Termin und vor Auslieferung der bearbeiteten Bilder fällig.",
    ],
  },
  {
    title: "4. Wertgutscheine",
    paragraphs: [
      "Wertgutscheine sind auf alle angebotenen Shootingarten anrechenbar und übertragbar. Zum Einlösen genügt die Angabe des Gutscheincodes bei der Anfrage.",
      "Wertgutscheine sind ab Ausstellungsdatum drei Jahre gültig; die Frist beginnt mit dem Schluss des Jahres, in dem der Gutschein ausgestellt wurde (§ 195, § 199 BGB).",
      "Eine Barauszahlung von Wertgutscheinen ist ausgeschlossen. Restguthaben bleiben bis zum Ablauf der Gültigkeit erhalten.",
    ],
  },
  {
    title: "5. Termine, Absage und Ausfall",
    paragraphs: [
      "Vereinbarte Termine sind verbindlich. Eine kostenfreie Absage oder Verlegung durch den Auftraggeber ist bis 14 Tage vor dem Termin möglich – ohne Angabe von Gründen und ohne Kosten.",
      "Bei einer Absage zwischen 13 und 3 Tagen vor dem Termin wird eine Ausfallpauschale von 30 Prozent des vereinbarten Preises fällig, bei einer Absage später als 3 Tage vor dem Termin oder bei Nichterscheinen 50 Prozent. Dem Auftraggeber bleibt ausdrücklich der Nachweis vorbehalten, dass ein Schaden überhaupt nicht entstanden oder wesentlich niedriger ist als die Pauschale.",
      "Wer krank wird oder wessen Kind krank wird, sagt einfach Bescheid: In solchen Fällen wird ein Ersatztermin vereinbart, ohne dass eine Pauschale anfällt.",
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
    <main className="min-h-screen bg-sand px-[var(--shell-x)] pb-24 text-ink">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow text-ink/55">
          Rechtliches
        </p>
        <h1 className="display-lg mt-5 text-ink">
          Allgemeine Geschäftsbedingungen
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-ink/70">
          Damit klar ist, worauf ihr euch verlasst und worauf ich mich verlasse.
          Fragt gern nach, wenn etwas unklar bleibt – ich erkläre es lieber
          vorher.
        </p>

        <div className="mt-12 space-y-10 text-base leading-8 text-ink/80">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-2xl text-ink">
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
            <h2 className="font-display text-2xl text-ink">Kontakt</h2>
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
