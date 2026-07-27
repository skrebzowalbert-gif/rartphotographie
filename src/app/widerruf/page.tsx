import type { Metadata } from "next";
import { business, publicContactEmail, phoneDisplay } from "@/lib/site";

/**
 * ENTWURF – VOR DEM LIVEGANG ANWALTLICH PRÜFEN LASSEN.
 *
 * Diese Seite ist ein Textgerüst, keine Rechtsberatung. Sie ist erforderlich,
 * weil über /gutscheine Wertgutscheine an Verbraucher verkauft werden
 * (Fernabsatzvertrag, §§ 312g, 355 BGB). Fehlende oder fehlerhafte
 * Widerrufsbelehrungen verlängern die Widerrufsfrist auf zwölf Monate und
 * vierzehn Tage und sind ein klassischer Abmahngrund.
 */
export const metadata: Metadata = {
  title: "Widerrufsbelehrung",
  description:
    "Widerrufsbelehrung und Muster-Widerrufsformular für den Kauf von Gutscheinen bei R.ArtPhotographie in Kaufbeuren.",
  alternates: { canonical: "/widerruf" },
  robots: { index: false, follow: true },
};

export default function WiderrufPage() {
  return (
    <main className="min-h-screen bg-[#e7dfd3] px-6 pb-24 text-black md:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm uppercase tracking-[0.3em] text-black/60">
          Rechtliches
        </p>
        <h1 className="mt-4 text-4xl font-light md:text-6xl">
          Widerrufsbelehrung
        </h1>

        <div
          role="note"
          className="mt-8 rounded-md border-l-4 border-l-amber-600 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-950"
        >
          <strong>Hinweis für die Betreiberin:</strong> Dieser Text ist ein
          unverbindlicher Entwurf und ersetzt keine Rechtsberatung. Bitte vor
          der Veröffentlichung anwaltlich prüfen oder durch einen geprüften
          Rechtstext-Generator ersetzen. Diese Seite ist derzeit auf{" "}
          <code>noindex</code> gesetzt.
        </div>

        <div className="mt-12 space-y-10 text-base leading-8 text-black/80">
          <section>
            <h2 className="text-2xl font-medium text-black">Widerrufsrecht</h2>
            <p className="mt-4">
              Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
              diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn
              Tage ab dem Tag des Vertragsabschlusses.
            </p>
            <p className="mt-4">
              Um dein Widerrufsrecht auszuüben, musst du mich —{" "}
              {business.legalName}, {business.street}, {business.postalCode}{" "}
              {business.city}, E-Mail: {publicContactEmail}
              {phoneDisplay ? `, Telefon: ${phoneDisplay}` : ""} — mittels einer
              eindeutigen Erklärung (z. B. ein mit der Post versandter Brief
              oder eine E-Mail) über deinen Entschluss, diesen Vertrag zu
              widerrufen, informieren. Du kannst dafür das unten stehende
              Muster-Widerrufsformular verwenden, das jedoch nicht
              vorgeschrieben ist.
            </p>
            <p className="mt-4">
              Zur Wahrung der Widerrufsfrist reicht es aus, dass du die
              Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der
              Widerrufsfrist absendest.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              Folgen des Widerrufs
            </h2>
            <p className="mt-4">
              Wenn du diesen Vertrag widerrufst, habe ich dir alle Zahlungen,
              die ich von dir erhalten habe, einschließlich der Lieferkosten
              (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben,
              dass du eine andere Art der Lieferung als die von mir angebotene,
              günstigste Standardlieferung gewählt hast), unverzüglich und
              spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem
              die Mitteilung über deinen Widerruf dieses Vertrags bei mir
              eingegangen ist.
            </p>
            <p className="mt-4">
              Für diese Rückzahlung verwende ich dasselbe Zahlungsmittel, das du
              bei der ursprünglichen Transaktion eingesetzt hast, es sei denn,
              mit dir wurde ausdrücklich etwas anderes vereinbart; in keinem
              Fall werden dir wegen dieser Rückzahlung Entgelte berechnet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              Vorzeitiges Erlöschen des Widerrufsrechts
            </h2>
            <p className="mt-4">
              Das Widerrufsrecht erlischt bei einem Vertrag über die Erbringung
              von Dienstleistungen, wenn ich die Dienstleistung vollständig
              erbracht habe und mit der Ausführung erst begonnen habe, nachdem
              du dazu deine ausdrückliche Zustimmung gegeben und gleichzeitig
              deine Kenntnis davon bestätigt hast, dass du dein Widerrufsrecht
              bei vollständiger Vertragserfüllung verlierst.
            </p>
            <p className="mt-4">
              <strong>Hinweis zu Fototerminen:</strong> Für die Buchung eines
              konkreten Shooting-Termins gilt zusätzlich § 312g Abs. 2 Nr. 9
              BGB. Danach besteht kein Widerrufsrecht bei Verträgen über
              Dienstleistungen im Zusammenhang mit Freizeitbetätigungen, wenn
              der Vertrag für die Erbringung einen spezifischen Termin
              vorsieht.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium text-black">
              Muster-Widerrufsformular
            </h2>
            <p className="mt-4 text-sm text-black/70">
              (Wenn du den Vertrag widerrufen willst, fülle bitte dieses
              Formular aus und sende es zurück.)
            </p>
            <div className="mt-4 rounded-md border border-black/15 bg-white/55 p-5 text-sm leading-8">
              <p>
                An {business.legalName}, {business.street},{" "}
                {business.postalCode} {business.city}, E-Mail:{" "}
                {publicContactEmail}
              </p>
              <p className="mt-4">
                Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)
                abgeschlossenen Vertrag über den Kauf der folgenden Waren (*) /
                die Erbringung der folgenden Dienstleistung (*)
              </p>
              <p className="mt-4">Bestellt am (*) / erhalten am (*)</p>
              <p className="mt-4">Name des/der Verbraucher(s)</p>
              <p className="mt-4">Anschrift des/der Verbraucher(s)</p>
              <p className="mt-4">
                Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf
                Papier)
              </p>
              <p className="mt-4">Datum</p>
              <p className="mt-6 text-black/60">(*) Unzutreffendes streichen.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
