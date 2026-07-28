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
  // Solange der Platzhalter-Hinweis im Text steht, gehört die Seite nicht in
  // den Index. Nach dem Ausfüllen diese Zeile entfernen.
  robots: { index: false, follow: true },
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
        TODO REGINA: Dieser Abschnitt ist der wichtigste der ganzen Seite und
        derzeit bewusst leer gelassen. Ich kann und darf hier nichts erfinden.

        Was hier hineingehört (jeweils ein bis drei Sätze):
        - Seit wann fotografierst du? (Jahreszahl)
        - Wie bist du dazu gekommen? Eine echte, konkrete Geschichte.
        - Ausbildung, Weiterbildungen, Mitgliedschaften?
        - Ungefähre Anzahl begleiteter Shootings oder Hochzeiten
        - Arbeitest du im Studio, draußen, bei Kundinnen zu Hause?
        - Etwas Persönliches: Familie, Region, warum Kaufbeuren

        Genau diese Angaben unterscheiden eine Fotografin von einer
        austauschbaren Website. Bewertungen und Preise haben Wettbewerber auch,
        die eigene Geschichte nicht.
      */}
      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div
            role="note"
            className="rounded-md border-l-4 border-l-amber-600 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-950"
          >
            <strong>Hinweis für die Betreiberin:</strong> Hier fehlt dein
            persönlicher Text – seit wann du fotografierst, wie du dazu gekommen
            bist, wie viele Shootings du begleitet hast und was dich mit
            Kaufbeuren verbindet. Der Platzhalter steht in{" "}
            <code>src/app/ueber-mich/page.tsx</code>. Solange er hier steht, ist
            die Seite auf <code>noindex</code>.
          </div>

          <h2 className="mt-12 text-3xl font-light md:text-4xl">
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
