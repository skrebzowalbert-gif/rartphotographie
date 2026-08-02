import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import { phoneDisplay, phoneHref } from "@/lib/site";
import type { Metadata } from "next";
import VoucherSection from "@/components/sections/VoucherSection";
import PartnersSection from "@/components/sections/PartnersSection";
import { getWeddingPartners } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Preise Fotoshooting Kaufbeuren & Hochzeit Allgäu",
  description:
    "Preise für Portraitshooting Kaufbeuren, Familie, Babybauch, Newborn und Hochzeitsfotografie im Allgäu bei R.ArtPhotographie.",
  alternates: { canonical: "/preise" },
  openGraph: {
    title: "Preise | R.ArtPhotographie",
    description:
      "Transparente Preise für Portrait, Familie, Newborn, Babybauch und Hochzeiten in Kaufbeuren und im Allgäu.",
    url: "/preise",
  },
};

type PriceCardProps = {
  title: string;
  image: string;
  duration: string;
  price: string;
  scope: string;
  description: string;
  buttonLabel: string;
  requestValue: string;
  vehicleAddon?: boolean;
};

const portraitItems: PriceCardProps[] = [
  {
    title: "Portraitshooting",
    image: "/images/portrait/portrait-2.jpg",
    duration: "1 Stunde",
    price: "200 €",
    scope: "40 bearbeitete Bilder · digitale Dateien · Online-Galerie",
    description:
      "Ein ruhiges Portraitshooting mit klarer Begleitung, damit du dich vor der Kamera sicher fühlst.",
    buttonLabel: "Portrait anfragen",
    requestValue: "Portraitshooting",
  },
  {
    title: "Familienshooting",
    image: "/images/family/family-2.jpg",
    duration: "2 Stunden",
    price: "250 €",
    scope: "40 bearbeitete Bilder · digitale Dateien · Online-Galerie",
    description:
      "Für Familienmomente, die natürlich wirken und nicht gestellt aussehen.",
    buttonLabel: "Familie anfragen",
    requestValue: "Familienshooting",
  },
  {
    title: "Babybauchshooting",
    image: "/images/babybauch/babybauch-1.jpg",
    duration: "1 Stunde",
    price: "200 €",
    scope: "40 bearbeitete Bilder · digitale Dateien · Online-Galerie",
    description:
      "Ruhige Babybauchbilder mit Gefühl, ohne überladene Inszenierung.",
    buttonLabel: "Babybauch anfragen",
    requestValue: "Babybauchshooting",
  },
  {
    title: "Newbornshooting",
    image: "/images/newborn/newborn-2.jpg",
    duration: "3 Stunden",
    price: "250 €",
    scope: "40 bearbeitete Bilder · digitale Dateien · Online-Galerie",
    description: "Mit Geduld, Zeit und Ruhe für die ersten Erinnerungen.",
    buttonLabel: "Newborn anfragen",
    requestValue: "Newbornshooting",
  },
];

const weddingItems: PriceCardProps[] = [
  {
    title: "Mini-Paket",
    image: "/images/weddings/wedding-16.jpg",
    duration: "1–2 Stunden",
    price: "350 €",
    scope: "Alle bearbeiteten Bilder · digitale Dateien · Online-Galerie",
    description:
      "Für Standesamt, Trauung oder einen kleinen Ausschnitt eures Hochzeitstags.",
    buttonLabel: "Mini-Paket anfragen",
    requestValue: "Hochzeit – Mini-Paket",
    vehicleAddon: true,
  },
  {
    title: "Kurzpaket",
    image: "/images/weddings/wedding-15.jpg",
    duration: "3 Stunden",
    price: "450 €",
    scope: "Alle bearbeiteten Bilder · digitale Dateien · Online-Galerie",
    description:
      "Für die wichtigsten Stunden mit Trauung, Gratulationen und Bildern zu zweit.",
    buttonLabel: "Kurzpaket anfragen",
    requestValue: "Hochzeit – Kurzpaket",
    vehicleAddon: true,
  },
  {
    title: "Standardpaket",
    image: "/images/weddings/wedding-14.jpg",
    duration: "5 Stunden",
    price: "850 €",
    scope: "Alle bearbeiteten Bilder · digitale Dateien · Online-Galerie",
    description:
      "Für eine längere Begleitung mit genug Raum für Reportage, Details und Paarbilder.",
    buttonLabel: "Standardpaket anfragen",
    requestValue: "Hochzeit – Standardpaket",
    vehicleAddon: true,
  },
  {
    title: "Erweitertes Paket",
    image: "/images/weddings/wedding-17.JPG",
    duration: "8 Stunden",
    price: "1.200 €",
    scope: "Alle bearbeiteten Bilder · digitale Dateien · Online-Galerie",
    description:
      "Für eine umfassende Begleitung vom Ankommen bis zu den späteren Momenten des Tages.",
    buttonLabel: "Erweitertes Paket anfragen",
    requestValue: "Hochzeit – Erweitertes Paket",
    vehicleAddon: true,
  },
];

function PriceCard({
  title,
  image,
  duration,
  price,
  scope,
  description,
  buttonLabel,
  requestValue,
  vehicleAddon = false,
}: PriceCardProps) {
  const anchorId =
    title === "Familienshooting"
      ? "familie"
      : title === "Babybauchshooting"
      ? "babybauch"
      : title === "Newbornshooting"
      ? "newborn"
      : title === "Portraitshooting"
      ? "portrait"
      : title === "Kurzpaket"
      ? "hochzeit-kurz"
      : title === "Standardpaket"
      ? "hochzeit-standard"
      : title === "Erweitertes Paket"
      ? "hochzeit-erweitert"
      : title === "Mini-Paket"
      ? "hochzeit-mini"
      : undefined;
  return (
    <article id={anchorId} className="group scroll-mt-36">
      {/* Kein Rahmen, keine Karte: das Bild steht frei, der Preis darunter. */}
      <Link
        href={`/kontakt?shooting=${encodeURIComponent(requestValue)}`}
        className="zoom-parent block overflow-hidden"
      >
        <div className="unveil relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={image}
            alt={`${title} in Kaufbeuren und im Allgäu bei R.ArtPhotographie`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
      </Link>

      <div className="mt-6">
        <h3 className="font-display text-2xl leading-tight text-ink">
          {title}
        </h3>

        {/* Der Preis ist das wichtigste Element der Karte und wird auch so
            gesetzt – vorher stand er in derselben Größe wie der Fließtext. */}
        <p className="mt-3 flex items-baseline gap-3">
          <span className="font-display text-3xl text-ink">{price}</span>
          <span className="text-sm text-ink/60">{duration}</span>
        </p>

        <p className="mt-4 text-[15px] leading-7 text-ink/75">{scope}</p>

        <p className="mt-5 border-t border-ink/12 pt-4 text-sm leading-7 text-ink/65">
          {description}
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={`/kontakt?shooting=${encodeURIComponent(requestValue)}`}
            className="group/btn inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors duration-500 hover:bg-ink-soft"
          >
            {buttonLabel}
            <span
              aria-hidden="true"
              className="transition-transform duration-500 group-hover/btn:translate-x-1"
            >
              →
            </span>
          </Link>

          {vehicleAddon && (
            <Link
              href={`/kontakt?shooting=${encodeURIComponent(
                requestValue
              )}&vehicleInterest=true`}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-ink/25 px-5 text-center text-sm font-medium text-ink transition-colors duration-500 hover:border-ink/55"
            >
              Mit Premium-Fahrzeug kombinieren
            </Link>
          )}
        </div>

        {vehicleAddon && (
          <p className="mt-3 text-xs leading-5 text-ink/60">
            Fahrzeugbuchung separat über unseren Partner, nicht im
            Shootingpreis enthalten.
          </p>
        )}
      </div>
    </article>
  );
}

export default async function PreisePage() {
  const weddingPartners = await getWeddingPartners();

  return (
    <main className="bg-sand text-ink">
      <PageHeader
        eyebrow="Preise"
        heading="Was ein Shooting"
        accent="kostet"
        intro="Alle Preise stehen offen hier. Keine Pakete auf Anfrage, keine Nachverhandlung, keine versteckten Kosten."
        meta={
          <>
            Shootings im Raum Kaufbeuren und im Ostallgäu. Termine außerhalb,
            zum Beispiel München, sind möglich – die Anfahrt wird dann
            individuell berechnet. Alle Preise sind Endpreise; gemäß § 19 UStG
            wird keine Umsatzsteuer berechnet.
          </>
        }
        primaryAction={{ href: "/kontakt", label: "Shooting anfragen" }}
        showPhone
      />

      <section className="bg-sand px-[var(--shell-x)] py-16 md:py-24">
        <div className="mx-auto max-w-[110rem]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="display-lg rise text-ink">
              Persönliche <span className="accent-italic">Shootings</span>
            </h2>
            <p className="rise max-w-sm text-base leading-8 text-ink/70">
              Jedes Paket mit 40 bearbeiteten Bildern als digitale Dateien
              über eine Online-Galerie.
            </p>
          </div>

          <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-4">
            {portraitItems.map((item) => (
              <PriceCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper px-[var(--shell-x)] py-20 md:py-28">
        <div className="mx-auto max-w-[110rem]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="display-lg rise text-ink">
              Hochzeits<span className="accent-italic">pakete</span>
            </h2>
            <p className="rise max-w-sm text-base leading-8 text-ink/70">
              Vom kurzen Standesamttermin bis zur ganztägigen Begleitung.
            </p>
          </div>

          <div className="mt-14 grid gap-x-8 gap-y-16 sm:grid-cols-2 xl:grid-cols-4">
            {weddingItems.map((item) => (
              <PriceCard key={item.title} {...item} />
            ))}
          </div>

          <PartnersSection
            partners={weddingPartners}
            eyebrow="Hochzeitspartner"
            title="Ergänzungen für euren Tag"
            intro="Ausgewählte Partner rund um Hochzeit, Location, Floristik, Video, Styling und besondere Details."
            compact
          />
        </div>
      </section>

      {/* Abschluss führt zur Anfrage, nicht in den Gutscheinverkauf. */}
      <section className="bg-ink px-[var(--shell-x)] py-24 text-paper md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="display-lg rise text-paper">
            Noch unsicher, was
            <br />
            <span className="accent-italic">zu euch passt?</span>
          </h2>
          <p className="rise mx-auto mt-7 max-w-2xl text-lg leading-8 text-paper/70">
            Schreib einfach, was ihr vorhabt. Ich sage ehrlich, welches Paket
            sinnvoll ist – auch wenn es das kleinere ist.
          </p>

          <div className="rise mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/kontakt"
              className="group inline-flex min-h-[58px] items-center gap-3 rounded-full bg-paper px-8 text-base font-medium text-ink transition-opacity duration-500 hover:opacity-90"
            >
              Shooting anfragen
              <span
                aria-hidden="true"
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            {phoneHref && (
              <a
                href={phoneHref}
                className="link-sweep text-base font-medium text-paper/75"
              >
                {phoneDisplay}
              </a>
            )}
          </div>
        </div>
      </section>

      <VoucherSection />
    </main>
  );
}
