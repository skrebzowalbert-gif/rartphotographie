import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Fotografin Kaufbeuren | Portrait, Hochzeit & Familie | R.ArtPhotographie",
  description:
    "R.ArtPhotographie ist deine Fotografin in Kaufbeuren für Portraitshootings, Hochzeiten, Familienfotos, Babybauch und Newborn. Jetzt Shooting anfragen.",
  alternates: { canonical: "/fotografin-kaufbeuren" },
  openGraph: {
    title:
      "Fotografin Kaufbeuren | Portrait, Hochzeit & Familie | R.ArtPhotographie",
    description:
      "Portraitfotografie, Hochzeitsfotografie, Familienfotos, Babybauch und Newborn in Kaufbeuren.",
    url: "/fotografin-kaufbeuren",
  },
};

const services = [
  {
    title: "Portraitfotografie Kaufbeuren",
    text: "Ruhige Führung vor der Kamera, klare Posen und Portraits mit Charakter.",
  },
  {
    title: "Hochzeitsfotografin Kaufbeuren",
    text: "Emotionale Begleitung vom Paarshooting bis zur Reportage mit eleganter Bildsprache.",
  },
  {
    title: "Familienfotografie Kaufbeuren",
    text: "Natürliche Familienbilder, Babybauchshootings und Newborn-Aufnahmen mit persönlicher Abstimmung.",
  },
  {
    title: "Gutscheine",
    text: "Fotoshooting-Gutscheine für besondere Menschen, direkt kaufbar oder individuell anfragbar.",
  },
];

export default function FotografinKaufbeurenPage() {
  return (
    <main className="bg-[#e7dfd3] pb-24 text-black">
      <section className="px-6 pb-16 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-black/38">
              Kaufbeuren
            </p>
            <h1 className="mt-4 max-w-5xl text-4xl font-light leading-[0.98] md:text-6xl">
              Fotografin in Kaufbeuren für Portrait, Hochzeit & Familie
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-black/62 md:text-lg">
              ★ 5,0 Google Bewertung · 47 Rezensionen
            </p>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
            <Image
              src="/images/portrait/portrait-2.jpg"
              alt="Fotografin Kaufbeuren Portraitshooting R.ArtPhotographie"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
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
              Fotografie vor Ort
            </p>
            <h2 className="mt-4 text-3xl font-light leading-tight md:text-5xl">
              Persönlich, ruhig und hochwertig
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-black/66 md:text-lg md:leading-9">
            <p>
              R.ArtPhotographie ist deine Fotografin in Kaufbeuren, wenn du
              Bilder suchst, die hochwertig wirken und trotzdem natürlich
              bleiben. Ein gutes Shooting beginnt nicht erst beim Auslösen,
              sondern bei der Vorbereitung: Welche Stimmung passt zu dir?
              Welche Kleidung funktioniert vor der Kamera? Welcher Ort in oder
              um Kaufbeuren unterstützt die gewünschte Bildsprache? Genau diese
              Fragen werden vorab geklärt, damit du dich beim Shooting sicher
              fühlst und die Ergebnisse zu dir passen.
            </p>
            <p>
              Als Fotografin in Kaufbeuren begleite ich Portraitshootings,
              Familienfotos, Babybauchshootings, Newborn-Shootings und
              Hochzeiten mit einer ruhigen, klaren Arbeitsweise. Für viele
              Kundinnen und Kunden ist die Kamera zunächst ungewohnt. Deshalb
              geht es nicht um starre Posen, sondern um sanfte Anleitung,
              entspannte Bewegungen und ein Gespür für den richtigen Moment.
              So entstehen Bilder, die präsent, elegant und persönlich wirken.
            </p>
            <p>
              Für Portraitfotografie in Kaufbeuren eignet sich ein reduzierter,
              moderner Look ebenso wie eine natürliche Umgebung. Ob du
              ausdrucksstarke Bilder für dich selbst, Paarbilder, Business-nahe
              Portraits oder ein besonderes Geschenk planst: Das Shooting wird
              auf deine Wünsche abgestimmt. Der Stil bleibt klar, emotional und
              ohne künstliche Überladung.
            </p>
            <p>
              Auch Hochzeiten in Kaufbeuren und Umgebung werden mit einem Blick
              für echte Nähe, Licht und Atmosphäre begleitet. Als
              Hochzeitsfotografin in Kaufbeuren ist mir wichtig, dass ihr euch
              nicht inszeniert fühlen müsst. Die Begleitung kann vom kurzen
              Standesamttermin bis zur längeren Reportage reichen. Entscheidend
              ist, dass die Bilder die Stimmung des Tages bewahren und zugleich
              hochwertig ausgearbeitet sind.
            </p>
            <p>
              Familienfotografie in Kaufbeuren lebt von Vertrauen. Gerade mit
              Kindern, Babybauch oder Newborn ist ein ruhiger Ablauf wichtig.
              Es gibt Zeit für kleine Pausen, natürliche Nähe und echte
              Momente. So entstehen Familienbilder, die nicht beliebig aussehen,
              sondern eure Verbindung zeigen. Viele Kundinnen und Kunden kommen
              aus Kaufbeuren selbst, aus Neugablonz, Biessenhofen,
              Marktoberdorf, Buchloe oder der näheren Umgebung.
            </p>
            <p>
              Vor dem Shooting bekommst du eine ehrliche Einschätzung, was für
              dein Ziel sinnvoll ist: Studioähnliche Ruhe, ein natürlicher Ort,
              eine klare Portraitstrecke oder eine fotografische Begleitung zu
              Hause. Auch Kleidung, Farben und kleine Details werden
              besprochen, damit die Bilder später hochwertig und stimmig
              wirken. Gerade bei Babybauch, Newborn und Familienfotos sorgt
              diese Vorbereitung dafür, dass der Termin entspannt bleibt.
            </p>
            <p>
              Kaufbeuren bietet dafür viele Möglichkeiten. Ein Portrait kann
              reduziert und elegant wirken, ein Familienshooting weich und nah,
              eine Hochzeit dokumentarisch und emotional. R.ArtPhotographie
              verbindet diese unterschiedlichen Anforderungen mit einem
              wiedererkennbaren Stil: ruhig, hochwertig, persönlich und ohne
              austauschbare Effekte.
            </p>
            <p>
              Wenn du einen Fotograf in Kaufbeuren suchst, der dich persönlich
              begleitet und nicht nur schnell Bilder erstellt, ist
              R.ArtPhotographie eine ruhige und hochwertige Wahl. Der Ablauf ist
              bewusst klar gehalten: Anfrage senden, Wünsche besprechen,
              Termin abstimmen, Shooting erleben und anschließend eine
              sorgfältig bearbeitete Auswahl erhalten. Das Ziel sind Bilder,
              die du gerne zeigst und die auch nach Jahren noch Bestand haben.
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
                href="/preise"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/14 px-7 py-3 text-sm font-medium text-black transition hover:border-black/30 hover:bg-black/5"
              >
                Preise ansehen
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
            Fotografie in Kaufbeuren
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
