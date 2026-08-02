import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import {
  buildBreadcrumbJsonLd,
  jsonLdScript,
  personId,
} from "@/lib/schema";
import {
  areaServed,
  business,
  instagramUrl,
  siteUrl,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Über mich – Regina, Fotografin in Kaufbeuren",
  description:
    "Regina Gerdt, Fotografin in Kaufbeuren. Wie ich arbeite, wie ein Shooting abläuft und was du von der Zusammenarbeit erwarten kannst.",
  alternates: { canonical: "/ueber-mich" },
  openGraph: {
    title: "Über mich – Regina, Fotografin in Kaufbeuren",
    description:
      "Wie ich arbeite, wie ein Shooting abläuft und was du erwarten kannst.",
    url: "/ueber-mich",
  },
};

/** Was zwischen Anfrage und fertigen Bildern passiert. */
const steps = [
  {
    title: "Anfrage",
    text: "Du schreibst kurz, was du dir vorstellst. Unverbindlich und kostenlos. Ich melde mich in der Regel innerhalb von 24 Stunden.",
  },
  {
    title: "Vorgespräch",
    text: "Wir klären Anlass, Ort, Uhrzeit und Wünsche. Auch Kleidung und Farben besprechen wir vorher, damit am Termin nichts improvisiert werden muss.",
  },
  {
    title: "Termin",
    text: "Der Termin wird verbindlich festgehalten. Bei Outdoor-Shootings vereinbaren wir gleich, wie wir mit dem Wetter umgehen.",
  },
  {
    title: "Shooting",
    text: "Du musst nicht wissen, wie du posieren sollst. Ich leite ruhig an und gebe Orientierung, damit du dich sicher bewegen kannst.",
  },
  {
    title: "Auswahl und Bearbeitung",
    text: "Ich sichte die Aufnahmen, wähle aus und bearbeite sie sorgfältig. Bei den meisten Shootings sind 40 bearbeitete Bilder enthalten.",
  },
  {
    title: "Übergabe",
    text: "Du bekommst deine Bilder als digitale Dateien über eine Online-Galerie, aus der du sie herunterladen kannst.",
  },
];

export default function UeberMichPage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: business.legalName,
    alternateName: "Regina",
    jobTitle: "Fotografin",
    url: `${siteUrl}/ueber-mich`,
    image: `${siteUrl}/images/about/regina_about1.jpg`,
    sameAs: [instagramUrl],
    address: {
      "@type": "PostalAddress",
      addressLocality: business.city,
      addressRegion: business.region,
      addressCountry: business.country,
    },
    knowsAbout: [
      "Portraitfotografie",
      "Hochzeitsfotografie",
      "Familienfotografie",
      "Babybauchfotografie",
      "Newbornfotografie",
    ],
  };

  return (
    <main className="bg-sand pb-24 text-ink">
      <script {...jsonLdScript(personJsonLd)} />
      <script
        {...jsonLdScript(
          buildBreadcrumbJsonLd([{ name: "Über mich", path: "/ueber-mich" }])
        )}
      />

      <PageHeader
        eyebrow="Über mich"
        heading="Hallo, ich bin"
        accent="Regina"
        intro="Ich fotografiere in Kaufbeuren und im Allgäu – Babybauch, Newborn, Familie, Portrait und Hochzeiten. Mir ist wichtig, dass du dich vor der Kamera nicht verstellen musst."
        image={{
          src: "/images/about/regina_about1.jpg",
          alt: "Regina Gerdt, Fotografin bei R.ArtPhotographie in Kaufbeuren",
        }}
        primaryAction={{ href: "/kontakt", label: "Shooting anfragen" }}
        showPhone
      />

      {/*
        REGINA: Dieser Abschnitt steht bewusst ohne Jahreszahlen, ohne Anzahl
        begleiteter Shootings und ohne Angaben zu Ausbildung – ich habe nichts
        erfunden, was ich nicht belegen kann.

        Wenn du fünf Minuten hast, ersetze oder ergänze:
        - Seit wann du fotografierst (eine Jahreszahl wirkt stark)
        - Wie du dazu gekommen bist – eine echte, konkrete Geschichte
        - Ausbildung, Weiterbildungen, Mitgliedschaften
        - Ungefähr, wie viele Shootings oder Hochzeiten du begleitet hast

        Genau solche Angaben unterscheiden dich von einer austauschbaren
        Website. Preise und Bewertungen haben Wettbewerber auch, deine
        Geschichte nicht.
      */}
      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-light md:text-4xl">
            Wer hinter der Kamera steht
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-ink/78 md:text-lg">
            <p>
              Ich bin Regina. R.ArtPhotographie ist kein Team und kein Studio
              mit Empfangstresen – ich bin die, die ans Telefon geht, die euch
              beim Shooting begleitet und die abends die Bilder bearbeitet.
              Wenn ihr mir schreibt, antworte ich selbst.
            </p>
            <p>
              Fotografiert wird dort, wo ihr euch wohlfühlt: bei euch zu Hause,
              draußen im Ostallgäu oder an einem Ort, der für euch eine
              Bedeutung hat. Kaufbeuren und die Gegend kenne ich gut genug, um
              euch Vorschläge zu machen, falls euch selbst keiner einfällt.
            </p>
            <p>
              Am liebsten fotografiere ich die Zeiten, die sich später nicht
              wiederholen lassen. Ein Babybauch ist nach ein paar Wochen weg.
              Ein Neugeborenes ist nur wenige Tage lang so klein, wie es auf
              den Bildern aussieht. Kinder verändern sich schneller, als man
              Fotos ausdruckt. Genau deshalb mache ich das.
            </p>
            <p>
              Was ein Shooting kostet, steht offen auf der Preisseite – nichts
              nur auf Anfrage. Und wenn ich beim Vorgespräch merke, dass ich
              für euer Vorhaben nicht die Richtige bin, sage ich das lieber
              vorher als hinterher.
            </p>
          </div>

          <h2 className="mt-14 text-3xl font-light md:text-4xl">
            Wie ich arbeite
          </h2>
          <div className="mt-6 space-y-5 text-base leading-8 text-ink/78 md:text-lg">
            <p>
              Die meisten Menschen, die zu mir kommen, sagen im Vorgespräch
              denselben Satz: &bdquo;Ich bin nicht fotogen.&ldquo; Fast nie stimmt
              das.
              Meistens fehlt nur jemand, der sagt, wohin mit den Händen.
            </p>
            <p>
              Deshalb arbeite ich mit Anleitung statt mit starren Posen. Ich
              sage dir, wie du stehen, dich drehen oder bewegen kannst, und
              fotografiere in den Momenten dazwischen. Das braucht etwas mehr
              Zeit als ein durchgetaktetes Studioshooting, dafür sehen die
              Bilder danach nicht gestellt aus.
            </p>
            <p>
              Besonders bei Babybauch-, Newborn- und Familienshootings ist Ruhe
              wichtiger als ein enger Zeitplan. Ein Newborn-Termin dauert bei
              mir drei Stunden, weil ein Baby nicht nach Uhrzeit funktioniert.
              Es gibt Pausen zum Stillen, Wickeln und Beruhigen – das ist
              eingeplant, nicht geduldet.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-4 md:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-light md:text-4xl">
            So läuft ein Shooting ab
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-ink/75">
            Von der ersten Nachricht bis zu den fertigen Bildern.
          </p>

          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-xl border border-ink/12 bg-paper/45 p-6"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-medium text-paper">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-xl font-medium">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-ink/75">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-5xl rounded-xl border border-ink/12 bg-paper/45 p-8 md:p-10">
          <h2 className="text-3xl font-light md:text-4xl">Gut zu wissen</h2>
          <dl className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/70">
                Wo ich fotografiere
              </dt>
              <dd className="mt-2 leading-7 text-ink/78">
                {areaServed.join(" · ")}. Weitere Orte nach Absprache.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/70">
                Was enthalten ist
              </dt>
              <dd className="mt-2 leading-7 text-ink/78">
                Bei den meisten Shootings 40 bearbeitete Bilder als digitale
                Dateien über eine Online-Galerie.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/70">
                Preise
              </dt>
              <dd className="mt-2 leading-7 text-ink/78">
                Ab 200 €, offen einsehbar auf der{" "}
                <Link
                  href="/preise"
                  className="underline underline-offset-4 hover:opacity-70"
                >
                  Preisseite
                </Link>
                . Keine versteckten Kosten.
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/70">
                Anfrage
              </dt>
              <dd className="mt-2 leading-7 text-ink/78">
                Unverbindlich und kostenlos. Antwort in der Regel innerhalb von
                24 Stunden.
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/kontakt"
              className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-ink px-8 text-base font-medium text-paper transition hover:bg-ink/85"
            >
              Shooting anfragen
            </Link>
            <Link
              href="/galerie"
              className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-ink/30 px-8 text-base font-medium transition hover:border-ink/60"
            >
              Arbeiten ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
