import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Fotografin Allgäu | Hochzeiten, Portraits & Familie | R.ArtPhotographie",
  description:
    "Professionelle Fotografin im Allgäu für Hochzeiten, Portraits, Familien, Babybauch und Newborn in Kaufbeuren, Kempten, Füssen und Umgebung.",
  alternates: { canonical: "/fotografin-allgaeu" },
  openGraph: {
    title:
      "Fotografin Allgäu | Hochzeiten, Portraits & Familie | R.ArtPhotographie",
    description:
      "Hochzeitsfotografie, Portraits, Familie, Babybauch und Newborn im Allgäu.",
    url: "/fotografin-allgaeu",
  },
};

const services = [
  {
    title: "Hochzeitsfotografin Allgäu",
    text: "Elegante Reportagen für Standesamt, freie Trauung und Paarshootings in der Region.",
  },
  {
    title: "Portraitfotografie Allgäu",
    text: "Ausdrucksstarke Portraits mit klarer Führung und ruhigem Premium-Look.",
  },
  {
    title: "Familienfotografie Allgäu",
    text: "Natürliche Familienbilder, Babybauchshootings und Newborn-Shootings mit Zeit und Gefühl.",
  },
  {
    title: "Fotoshooting-Gutscheine",
    text: "Hochwertige Gutscheine für Portrait, Familie oder einen frei wählbaren Wert.",
  },
];

export default function FotografinAllgaeuPage() {
  return (
    <main className="bg-[#e7dfd3] pb-24 text-black">
      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-black/38">
              Allgäu
            </p>
            <h1 className="mt-4 max-w-5xl text-4xl font-light leading-[0.98] md:text-6xl">
              Fotografin im Allgäu für Hochzeiten, Portraits & Familie
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-black/62 md:text-lg">
              ★ 5,0 Google Bewertung · 47 Rezensionen
            </p>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
            <Image
              src="/images/weddings/wedding-3.jpg"
              alt="Hochzeitsfotografin Allgäu R.ArtPhotographie"
              fill
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-black/38">
              Kaufbeuren · Kempten · Füssen
            </p>
            <h2 className="mt-4 text-3xl font-light leading-tight md:text-5xl">
              Fotografie für das gesamte Allgäu
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-black/66 md:text-lg md:leading-9">
            <p>
              R.ArtPhotographie steht für professionelle Fotografie im Allgäu:
              ruhig, emotional und hochwertig. Von Kaufbeuren aus begleite ich
              Shootings und Hochzeiten in der gesamten Region, unter anderem in
              Kempten, Marktoberdorf, Füssen, Buchloe, Pfronten,
              Leutkirch und den umliegenden Orten. Wer eine Fotografin im
              Allgäu sucht, wünscht sich meist nicht nur schöne Bilder, sondern
              eine angenehme Begleitung, klare Kommunikation und Ergebnisse, die
              persönlich wirken.
            </p>
            <p>
              Als Fotografin im Allgäu arbeite ich mit einer klaren,
              eleganten Bildsprache. Das Allgäu bietet viele Möglichkeiten:
              ruhige Landschaften, helle Räume, besondere Hochzeitslocations,
              urbane Ecken in Kempten oder persönliche Orte in Kaufbeuren und
              Umgebung. Wichtig ist nicht, dass der Ort spektakulär ist.
              Entscheidend ist, dass Licht, Stimmung und Menschen zusammenpassen.
            </p>
            <p>
              Für Hochzeiten im Allgäu entsteht eine Begleitung, die präsent
              ist, ohne den Tag zu überlagern. Vom Getting Ready über die
              Trauung bis zum Paarshooting geht es darum, kleine Situationen zu
              sehen und sie sorgfältig festzuhalten. Als Hochzeitsfotografin im
              Allgäu achte ich auf Nähe, Bewegung, kleine Gesten und eine
              elegante Ausarbeitung. So bleiben Bilder, die den Tag nicht nur
              dokumentieren, sondern seine Atmosphäre bewahren.
            </p>
            <p>
              Portraitfotografie im Allgäu kann ruhig, modern und ausdrucksstark
              sein. Viele Menschen sind vor der Kamera zunächst unsicher. Genau
              deshalb ist eine klare und persönliche Führung wichtig. Du musst
              nicht wissen, wie du stehen oder schauen sollst. Das Shooting
              entwickelt sich Schritt für Schritt, mit kleinen Anweisungen,
              Pausen und einem Blick für das, was zu dir passt.
            </p>
            <p>
              Familienfotografie im Allgäu braucht Geduld und Feingefühl.
              Besonders bei Babybauchshootings, Newborn-Shootings oder
              Familienbildern mit Kindern soll nichts gehetzt wirken. Ein
              Shooting darf ruhig, warm und menschlich sein. Es geht um echte
              Nähe, kleine Berührungen und Bilder, die nicht gestellt aussehen.
              Familien aus Kaufbeuren, Kempten, Füssen, Marktoberdorf und der
              Umgebung schätzen genau diesen entspannten Ablauf.
            </p>
            <p>
              Auch Gutscheine für Fotoshootings sind im Allgäu besonders
              beliebt, weil sie ein persönliches Erlebnis schenken. Ein
              Portraitshooting, ein Familienmoment oder ein flexibler
              Wertgutschein kann direkt über die Webseite ausgewählt werden.
              Für individuelle Beträge oder besondere Wünsche bleibt eine
              persönliche Anfrage möglich.
            </p>
            <p>
              Die Planung richtet sich nach Anlass, Jahreszeit und Ort. Ein
              Hochzeitstermin in Füssen braucht andere Abläufe als ein
              Babybauchshooting in Kaufbeuren oder ein Familienmoment bei
              Kempten. Deshalb werden Licht, Treffpunkt, Dauer, Kleidung und
              gewünschte Bildwirkung vorab besprochen. Du bekommst eine klare
              Orientierung, ohne dass der Ablauf steif oder überinszeniert
              wirkt.
            </p>
            <p>
              Gerade im Allgäu ändern sich Wetter, Licht und Stimmung schnell.
              Eine professionelle Vorbereitung hilft, flexibel zu bleiben und
              trotzdem hochwertige Ergebnisse zu bekommen. Ob draußen in der
              Natur, an einer Hochzeitslocation, in vertrauter Umgebung oder
              mit einem reduzierten Portrait-Setup: Entscheidend ist, dass die
              Bilder zu euch passen und nicht nur einem Trend folgen.
            </p>
            <p>
              Wenn du einen Fotograf im Allgäu suchst, der hochwertige Bilder
              mit einer ruhigen Arbeitsweise verbindet, ist R.ArtPhotographie
              eine klare Wahl. Der Ablauf bleibt transparent: Du sendest deine
              Anfrage, wir stimmen Wünsche und Ort ab, planen den Termin und
              setzen das Shooting professionell um. So entstehen Bilder, die
              emotional, elegant und zeitlos bleiben.
            </p>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/kontakt"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
                style={{ color: "#ffffff" }}
              >
                Shooting anfragen
              </Link>
              <Link
                href="/gutscheine#checkout"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/25 bg-transparent px-7 py-3 text-sm font-semibold text-[#1f1714] transition hover:border-black/40 hover:bg-transparent hover:text-[#1f1714]"
              >
                Gutschein kaufen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.32em] text-black/38">
            Leistungen
          </p>
          <h2 className="mt-4 text-3xl font-light md:text-5xl">
            Fotografie im Allgäu
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.title}
                className="border-t border-black/12 pt-6"
              >
                <h3 className="text-xl font-medium">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-black/62">
                  {service.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
