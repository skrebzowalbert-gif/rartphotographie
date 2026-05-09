import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import VoucherSection from "@/components/sections/VoucherSection";

const vehiclePartnerUrl = "https://sportwagenvermietung-kaufbeuren.de/";

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
    image: "/images/family/family-1.jpg",
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
    image: "/images/newborn/newborn-1.jpg",
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
    image: "/images/weddings/wedding-3.jpg",
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
    image: "/images/weddings/wedding-6.jpg",
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
    image: "/images/weddings/wedding-8.jpg",
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
    image: "/images/weddings/wedding-12.jpg",
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
    <article
      id={anchorId}
      className="scroll-mt-36 overflow-hidden rounded-xl border border-black/8 bg-white/24"
    >
      <div className="relative h-[300px] overflow-hidden sm:h-[340px]">
        <Image
          src={image}
          alt={`${title} Kaufbeuren und Allgäu bei R.ArtPhotographie`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-6">
        <h3 className="text-[22px] font-semibold leading-tight">{title}</h3>

        <p className="mt-4 text-xl font-light text-black">
          {duration} · {price}
        </p>
        <p className="mt-4 text-[15px] leading-7 text-black/68">{scope}</p>
        <p className="mt-5 border-t border-black/10 pt-4 text-sm leading-7 text-black/62">
          {description}
        </p>

        {vehicleAddon && (
          <p className="mt-5 border-t border-black/10 pt-4 text-sm leading-7 text-black/58">
            Optional kann eure fotografische Begleitung mit einem Fahrzeug über
            unseren externen Partner ergänzt werden.
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={`/kontakt?shooting=${encodeURIComponent(requestValue)}`}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            style={{ color: "#ffffff" }}
          >
            {buttonLabel}
          </Link>

          {vehicleAddon && (
            <div>
              <p className="mb-2 text-center text-xs leading-5 text-black/50">
                Fahrzeugbuchung separat über externen Partner.
              </p>
              <Link
                href={`/kontakt?shooting=${encodeURIComponent(
                  requestValue
                )}&vehicleInterest=true`}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-black/25 bg-transparent px-5 py-3 text-center text-sm font-semibold text-[#1f1714] transition hover:border-black/40 hover:bg-transparent hover:text-[#1f1714]"
              >
                Mit Premium-Fahrzeug kombinieren
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function PreisePage() {
  return (
    <main className="bg-[#e7dfd3] pb-24 text-black">
      <section className="px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.32em] text-black/38">
            Portrait
          </p>

          <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
            Persönliche Shootings
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-black/64 md:text-lg">
            Shootings finden im Raum Kaufbeuren statt. Termine außerhalb
            (z. B. München) sind möglich – die Anfahrt wird individuell
            berechnet.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {portraitItems.map((item) => (
              <PriceCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-24 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.32em] text-black/38">
            Hochzeiten
          </p>

          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            Hochzeitspakete
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {weddingItems.map((item) => (
              <PriceCard key={item.title} {...item} />
            ))}
          </div>

          <div className="mx-auto mt-20 max-w-4xl border-y border-black/10 py-12 text-center md:py-16">
            <p className="text-sm uppercase tracking-[0.32em] text-black/38">
              Externer Partner
            </p>
            <h3 className="mt-4 text-3xl font-light leading-tight md:text-5xl">
              Premium-Fahrzeug zur Hochzeit
            </h3>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-black/64 md:text-lg">
              Auf Wunsch kann eure Hochzeitsbegleitung mit einem ausgewählten
              Premium-Fahrzeug ergänzt werden. Das Fahrzeug ist nicht im
              Shootingpreis enthalten und wird separat über unseren externen
              Partner angefragt.
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-black/50">
              Verfügbarkeit, Preise, Vertragsbedingungen, Stornoregelungen und
              Fahrzeugkonditionen gelten direkt beim Partner
              Sportwagenvermietung Kaufbeuren.
            </p>
            <a
              href={vehiclePartnerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-[54px] items-center justify-center rounded-full border border-black/25 bg-transparent px-7 py-3 text-sm font-semibold text-[#1f1714] transition hover:border-black/40 hover:bg-transparent hover:text-[#1f1714]"
            >
              Fahrzeuge beim Partner ansehen
            </a>
          </div>
        </div>
      </section>

      <VoucherSection />
    </main>
  );
}
