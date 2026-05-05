import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import VoucherSection from "@/components/sections/VoucherSection";

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
  details: string[];
  requestValue: string;
  vehicleAddon?: boolean;
};

const portraitItems: PriceCardProps[] = [
  {
    title: "Portraitshooting",
    image: "/images/portrait/portrait-2.jpg",
    details: [
      "Dauer: 1 Stunde",
      "Preis: 200 €",
      "Inklusive: 40 bearbeitete Fotos",
      "Digitale Dateien",
      "Online-Galerie",
    ],
    requestValue: "Portraitshooting",
  },
  {
    title: "Familienshooting",
    image: "/images/family/family-1.jpg",
    details: [
      "Dauer: 2 Stunden",
      "Preis: 250 €",
      "Inklusive: 40 bearbeitete Fotos",
      "Digitale Dateien",
      "Online-Galerie",
    ],
    requestValue: "Familienshooting",
  },
  {
    title: "Babybauchshooting",
    image: "/images/babybauch/babybauch-1.jpg",
    details: [
      "Dauer: 1 Stunde",
      "Preis: 200 €",
      "Inklusive: 40 bearbeitete Fotos",
      "Digitale Dateien",
      "Online-Galerie",
    ],
    requestValue: "Babybauchshooting",
  },
  {
    title: "Newbornshooting",
    image: "/images/newborn/newborn-1.jpg",
    details: [
      "Dauer: 3 Stunden",
      "Preis: 250 €",
      "Inklusive: 40 bearbeitete Fotos",
      "Digitale Dateien",
      "Online-Galerie",
    ],
    requestValue: "Newbornshooting",
  },
];

const weddingItems: PriceCardProps[] = [
  {
    title: "Mini-Paket",
    image: "/images/weddings/wedding-3.jpg",
    details: [
      "Dauer: 1–2 Stunden",
      "Preis: 350 €",
      "Alle bearbeiteten Fotos",
      "Digitale Dateien",
      "Online-Galerie zum Herunterladen",
    ],
    requestValue: "Hochzeit Mini-Paket",
    vehicleAddon: true,
  },
  {
    title: "Kurzpaket",
    image: "/images/weddings/wedding-6.jpg",
    details: [
      "Dauer: 3 Stunden",
      "Preis: 450 €",
      "Alle bearbeiteten Fotos",
      "Digitale Dateien",
      "Online-Galerie zum Herunterladen",
    ],
    requestValue: "Hochzeit Kurzpaket",
    vehicleAddon: true,
  },
  {
    title: "Standardpaket",
    image: "/images/weddings/wedding-8.jpg",
    details: [
      "Dauer: 5 Stunden",
      "Preis: 850 €",
      "Alle bearbeiteten Fotos",
      "Digitale Dateien",
      "Online-Galerie zum Herunterladen",
    ],
    requestValue: "Hochzeit Standardpaket",
    vehicleAddon: true,
  },
  {
    title: "Erweitertes Paket",
    image: "/images/weddings/wedding-12.jpg",
    details: [
      "Dauer: 8 Stunden",
      "Preis: 1.200 €",
      "Alle bearbeiteten Fotos",
      "Digitale Dateien",
      "Online-Galerie zum Herunterladen",
    ],
    requestValue: "Hochzeit Erweitertes Paket",
    vehicleAddon: true,
  },
];

function PriceCard({
  title,
  image,
  details,
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
  const vehicleRequestHref = `/kontakt?shooting=${encodeURIComponent(
    "Hochzeitspaket + Hochzeitsfahrzeug"
  )}&package=${encodeURIComponent(title)}&vehicle=1`;

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

        <ul className="mt-5 space-y-3 text-[15px] leading-7 text-black/72">
          {details.map((detail) => (
            <li key={detail}>• {detail}</li>
          ))}
        </ul>

        {vehicleAddon && (
          <p className="mt-5 border-t border-black/10 pt-4 text-sm leading-7 text-black/58">
            Optional: + Hochzeitsfahrzeug über Partner anfragbar
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={`/kontakt?shooting=${encodeURIComponent(requestValue)}`}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            style={{ color: "#ffffff" }}
          >
            Jetzt anfragen
          </Link>

          {vehicleAddon && (
            <Link
              href={vehicleRequestHref}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-black/25 px-5 py-3 text-center text-sm font-medium text-black/75 transition hover:border-black hover:bg-black hover:text-white"
            >
              Paket mit Fahrzeug anfragen
            </Link>
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
        </div>
      </section>

      <VoucherSection />
    </main>
  );
}
