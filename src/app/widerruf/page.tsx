import type { Metadata } from "next";
import { business, publicContactEmail, phoneDisplay } from "@/lib/site";

/**
 * Keine Rechtsberatung, aber eng am gesetzlichen Muster (Anlage 1 zu
 * Art. 246a § 1 Abs. 2 EGBGB) gehalten.
 *
 * Erforderlich, weil über /gutscheine Wertgutscheine an Verbraucher verkauft
 * werden (Fernabsatzvertrag, §§ 312g, 355 BGB). Eine fehlende oder fehlerhafte
 * Belehrung verlängert die Widerrufsfrist auf zwölf Monate und vierzehn Tage.
 *
 * Bewusste Entscheidung: Der Checkout holt KEINE Zustimmung zum vorzeitigen
 * Erlöschen des Widerrufsrechts ein. Das Recht bleibt beim Gutscheinkauf also
 * volle vierzehn Tage bestehen. Ob ein Wertgutschein überhaupt als "digitaler
 * Inhalt" im Sinne des § 356 Abs. 5 BGB gilt, ist umstritten – die sichere
 * und zugleich kundenfreundliche Variante ist, das Recht stehen zu lassen.
 */
export const metadata: Metadata = {
  title: "Widerrufsbelehrung",
  description:
    "Widerrufsbelehrung und Muster-Widerrufsformular für den Kauf von Gutscheinen bei R.ArtPhotographie in Kaufbeuren.",
  alternates: { canonical: "/widerruf" },
};

export default function WiderrufPage() {
  return (
    <main className="min-h-screen bg-sand px-[var(--shell-x)] pb-24 text-ink">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow text-ink/55">
          Rechtliches
        </p>
        <h1 className="display-lg mt-5 text-ink">
          Widerrufsbelehrung
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-ink/70">
          Wenn du einen Gutschein gekauft hast und es dir anders überlegst,
          bekommst du dein Geld zurück. Eine kurze Nachricht genügt, eine
          Begründung brauche ich nicht.
        </p>

        <div className="mt-12 space-y-10 text-base leading-8 text-ink/80">
          <section>
            <h2 className="font-display text-2xl text-ink">Widerrufsrecht</h2>
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
            <h2 className="font-display text-2xl text-ink">
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
            <h2 className="font-display text-2xl text-ink">
              Vorzeitiges Erlöschen des Widerrufsrechts
            </h2>
            <p className="mt-4">
              <strong>Beim Gutscheinkauf gilt das nicht.</strong> Auch wenn du
              das PDF sofort nach der Zahlung bekommst, bleibt dein
              Widerrufsrecht die vollen vierzehn Tage bestehen. Ich lasse mir
              beim Kauf ausdrücklich nicht bestätigen, dass du darauf
              verzichtest.
            </p>
            <p className="mt-4">
              Allgemein erlischt das Widerrufsrecht bei einem Vertrag über die
              Erbringung von Dienstleistungen erst dann, wenn die Leistung
              vollständig erbracht wurde und mit der Ausführung erst begonnen
              wurde, nachdem du ausdrücklich zugestimmt und zugleich bestätigt
              hast, dass du dein Widerrufsrecht bei vollständiger
              Vertragserfüllung verlierst.
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
            <h2 className="font-display text-2xl text-ink">
              Muster-Widerrufsformular
            </h2>
            <p className="mt-4 text-sm text-ink/70">
              (Wenn du den Vertrag widerrufen willst, fülle bitte dieses
              Formular aus und sende es zurück.)
            </p>
            <div className="mt-4 rounded-md border border-ink/15 bg-paper/55 p-5 text-sm leading-8">
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
              <p className="mt-6 text-ink/60">(*) Unzutreffendes streichen.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
