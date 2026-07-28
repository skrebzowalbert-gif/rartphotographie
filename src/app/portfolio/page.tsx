import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
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
    href: "/familienfotograf-kaufbeuren",
    image: "/images/family/family-2.jpg",
    alt: "Familienfotografie in Kaufbeuren von R.ArtPhotographie",
    text: "Familienshootings, Babybauch und Newborn – ruhig begleitet, mit genug Zeit.",
  },
  {
    title: "Hochzeiten",
    href: "/portfolio/weddings",
    image: "/images/weddings/wedding-13.jpg",
    alt: "Hochzeitsfotografie im Allgäu von R.ArtPhotographie",
    text: "Vom Standesamt bis zur ganztägigen Reportage.",
  },
  {
    title: "Events",
    href: "/portfolio/events",
    image: "/images/events/event-1.jpg",
    alt: "Eventfotografie in Kaufbeuren und im Allgäu",
    text: "Feiern, Firmenfeste und besondere Abende.",
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
    <main className="bg-sand pb-24 text-ink">
      <PageHeader
        eyebrow="Portfolio"
        heading="Nach Anlass"
        accent="sortiert"
        intro="Portrait, Hochzeit und Events – jeder Bereich als eigene Strecke. Termine für 2026 sind noch buchbar."
        primaryAction={{ href: "/kontakt", label: "Shooting anfragen" }}
        showPhone
      />

      <section className="mx-auto grid max-w-[110rem] gap-8 px-[var(--shell-x)] sm:grid-cols-2 xl:grid-cols-4">
        {mainCategories.map((group) => (
          <article
            key={group.title}
            className="group overflow-hidden"
          >
            <div className="unveil relative aspect-[3/4] overflow-hidden">
              <Image
                src={group.image}
                alt={group.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />

              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.74)_0%,rgba(0,0,0,0.42)_34%,rgba(0,0,0,0.12)_66%,rgba(0,0,0,0.03)_100%)]" />

              <div className="absolute inset-x-0 bottom-0 p-7 text-paper">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-paper/82">
                  Kategorie
                </p>

                <h2 className="mt-3 font-display text-3xl text-paper">
                  {group.title}
                </h2>

                <p className="mt-4 max-w-sm text-base leading-7 text-paper/92">
                  {group.text}
                </p>

                <Link
                  href={group.href}
                  className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/28 bg-ink/22 px-5 py-3 text-sm font-medium text-paper transition hover:border-white/46 hover:bg-paper/12"
                >
                  Bereich öffnen
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-24 max-w-[110rem] px-[var(--shell-x)]">
        <div className="border-t border-ink/12 pt-12">
          <p className="eyebrow rise text-ink/55">Weitere Bereiche</p>

          <h2 className="display-lg rise mt-5 text-ink">
            Alle Shootings <span className="accent-italic">im Überblick</span>
          </h2>

          <p className="rise mt-6 max-w-2xl text-lg leading-8 text-ink/72">
            Neben den Hauptbereichen gibt es spezialisierte Leistungen wie
            Babybauch, Newborn oder die einzelnen Hochzeitspakete.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {additionalAreas.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-ink/25 bg-transparent px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink/40 hover:bg-transparent hover:text-ink"
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/preise"
              className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-medium text-paper transition hover:opacity-90"
            >
              Alle Preise und Pakete ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
