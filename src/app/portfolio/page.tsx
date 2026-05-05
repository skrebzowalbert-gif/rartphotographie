import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio Fotografie Kaufbeuren",
  description:
    "Portfolio von R.ArtPhotographie: Portraitshooting, Hochzeit, Familie, Babybauch und Newborn in Kaufbeuren und Umgebung.",
  alternates: { canonical: "/portfolio" },
  openGraph: {
    title: "Portfolio | R.ArtPhotographie",
    description:
      "Ausgewählte Arbeiten aus Portrait, Hochzeit und Familie von R.ArtPhotographie.",
    url: "/portfolio",
  },
};

const mainCategories = [
  {
    title: "Portrait",
    href: "/portfolio/portrait",
    image: "/images/portrait/portrait-2.jpg",
    alt: "Fotografin Kaufbeuren Portraitshooting R.ArtPhotographie",
    text: "Editoriale Looks, klare Ästhetik und ausdrucksstarke Portraits.",
  },
  {
    title: "Familie",
    href: "/preise#familie",
    image: "/images/family/family-1.jpg",
    alt: "Familienfotografie Allgäu R.ArtPhotographie",
    text: "Familienshootings, Babybauch und Newborn in einer ruhigen, persönlichen und hochwertigen Bildsprache.",
  },
  {
    title: "Hochzeiten",
    href: "/portfolio/weddings",
    image: "/images/weddings/wedding-3.jpg",
    alt: "Hochzeitsfotografin Allgäu R.ArtPhotographie",
    text: "Emotionale Erinnerungen mit hochwertiger Bildsprache und Ruhe im Look.",
  },
];

const additionalAreas = [
  { title: "Familienshooting", href: "/preise#familie" },
  { title: "Babybauchshooting", href: "/preise#babybauch" },
  { title: "Newbornshooting", href: "/preise#newborn" },
  { title: "Portraitshooting", href: "/preise#portrait" },
  { title: "Hochzeit Mini-Paket", href: "/preise#hochzeit-mini" },
  { title: "Hochzeit Kurzpaket", href: "/preise#hochzeit-kurz" },
  { title: "Hochzeit Standardpaket", href: "/preise#hochzeit-standard" },
  { title: "Hochzeit Erweitertes Paket", href: "/preise#hochzeit-erweitert" },
];

export default function PortfolioPage() {
  return (
    <main className="bg-[#e7dfd3] px-6 pb-24 text-black md:px-10">
      <section className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.32em] text-black/38">
          Portfolio
        </p>

        <h1 className="mt-4 max-w-5xl text-4xl font-light leading-[0.98] md:text-6xl">
          Ausgewählte Arbeiten mit
          <br />
          klarer Bildsprache
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-black/62">
          Drei Hauptbereiche führen durch das Portfolio. Zusätzlich gibt es
          spezialisierte Shootings und detaillierte Pakete, die direkt
          angefragt werden können.
        </p>

        <p className="mt-4 text-base font-medium text-black/70">
          Jetzt Termine für 2026 sichern.
        </p>
      </section>

      <section className="mx-auto mt-16 grid max-w-7xl gap-8 md:grid-cols-3">
        {mainCategories.map((group) => (
          <article
            key={group.title}
            className="group overflow-hidden rounded-xl bg-black/5"
          >
            <div className="relative h-[560px] overflow-hidden">
              <Image
                src={group.image}
                alt={group.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.74)_0%,rgba(0,0,0,0.42)_34%,rgba(0,0,0,0.12)_66%,rgba(0,0,0,0.03)_100%)]" />

              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/82">
                  Kategorie
                </p>

                <h2 className="mt-3 text-3xl font-semibold text-white">
                  {group.title}
                </h2>

                <p className="mt-4 max-w-sm text-base leading-7 text-white/92">
                  {group.text}
                </p>

                <Link
                  href={group.href}
                  className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/28 bg-black/22 px-5 py-3 text-sm font-medium text-white transition hover:border-white/46 hover:bg-white/12"
                  style={{ color: "#ffffff" }}
                >
                  Bereich öffnen
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-20 max-w-7xl">
        <div className="rounded-xl border border-black/8 bg-white/22 p-8 md:p-10">
          <p className="text-sm uppercase tracking-[0.32em] text-black/42">
            Weitere Bereiche
          </p>

          <h2 className="mt-4 text-3xl font-light md:text-4xl">
            Weitere Shootings und Pakete auf einen Blick
          </h2>

          <p className="mt-4 max-w-3xl text-base leading-8 text-black/66">
            Neben den drei Hauptkategorien gibt es weitere spezialisierte
            Leistungen wie Familie, Babybauch, Newborn oder detaillierte
            Hochzeitspakete.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {additionalAreas.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-black/18 bg-white/70 px-5 py-3 text-sm font-medium text-black transition hover:border-black/30 hover:bg-white"
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/preise"
              className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
              style={{ color: "#ffffff" }}
            >
              Alle Preise und Pakete ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
