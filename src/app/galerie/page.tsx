import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import type { Metadata } from "next";
import GalerieGridClient, {
  type GalleryImageItem,
} from "@/components/gallery/GalerieGridClient";
import { getGalleryImages, type SanityGalleryImage } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Galerie Portrait, Familie, Events & Hochzeiten",
  description:
    "Bildgalerie von R.ArtPhotographie mit Portrait, Familie, Babybauch, Newborn, Event und Hochzeit aus Kaufbeuren und Umgebung.",
  alternates: { canonical: "/galerie" },
  openGraph: {
    title: "Galerie | R.ArtPhotographie",
    description:
      "Kuratierte Fotogalerie aus Portraits, Familie, Events und Hochzeiten.",
    url: "/galerie",
  },
};

const portraitImages = [
  "/images/portrait/portrait-1.jpg",
  "/images/portrait/portrait-2.jpg",
  "/images/portrait/portrait-3.jpg",
  "/images/portrait/portrait-4.jpg",
  "/images/portrait/portrait-5.jpg",
  "/images/portrait/portrait-6.jpg",
  "/images/portrait/portrait-7.jpg",
  "/images/portrait/portrait-8.jpg",
  "/images/portrait/portrait-9.jpg",
  "/images/portrait/portrait-10.jpg",
  "/images/portrait/portrait-11.jpg",
  "/images/portrait/portrait-12.jpg",
  "/images/portrait/portrait-13.jpg",
  "/images/portrait/portrait-14.jpg",
  "/images/portrait/portrait-15.jpg",
  "/images/portrait/portrait-16.jpg",
  "/images/portrait/portrait-17.jpg",
  "/images/portrait/portrait-18.jpg",
  "/images/portrait/portrait-19.jpg",
  "/images/portrait/portrait-20.jpg",
  "/images/portrait/portrait-21.jpg",
  "/images/portrait/portrait-22.jpg",
  "/images/portrait/portrait-23.jpg",
  "/images/portrait/portrait-24.jpg",
  "/images/portrait/portrait-25.jpg",
  "/images/portrait/portrait-26.jpg",
  "/images/portrait/portrait-27.jpg",
  "/images/portrait/portrait-28.jpg",
  "/images/portrait/portrait-29.jpg",
  "/images/portrait/portrait-30.jpg",
  "/images/portrait/portrait-31.jpg",
];

const familyImages = [
  "/images/family/family-1.jpg",
  "/images/family/family-2.jpg",
  "/images/babybauch/babybauch-1.jpg",
  "/images/babybauch/babybauch-2.jpg",
  "/images/newborn/newborn-1.jpg",
  "/images/newborn/newborn-2.jpg",
];

const eventImages = [
  "/images/events/event-1.jpg",
  "/images/events/event-2.jpg",
  "/images/events/event-3.jpg",
  "/images/events/event-4.jpg",
  "/images/events/event-5.jpg",
  "/images/events/event-6.jpg",
  "/images/events/event-7.jpg",
  "/images/events/event-8.jpg",
  "/images/events/event-9.jpg",
  "/images/events/event-10.jpg",
  "/images/events/event-11.jpg",
  "/images/events/event-12.JPG",
  "/images/events/event-13.JPG",
  "/images/events/event-14.JPG",
  "/images/events/event-15.jpg",
];

const weddingImages = [
  "/images/weddings/wedding-1.jpg",
  "/images/weddings/wedding-2.jpg",
  "/images/weddings/wedding-3.jpg",
  "/images/weddings/wedding-4.jpg",
  "/images/weddings/wedding-5.JPG",
  "/images/weddings/wedding-6.jpg",
  "/images/weddings/wedding-7.jpg",
  "/images/weddings/wedding-8.jpg",
  "/images/weddings/wedding-9.jpg",
  "/images/weddings/wedding-10.jpg",
  "/images/weddings/wedding-11.jpg",
  "/images/weddings/wedding-12.jpg",
  "/images/weddings/wedding-13.jpg",
  "/images/weddings/wedding-14.jpg",
  "/images/weddings/wedding-15.jpg",
  "/images/weddings/wedding-16.jpg",
  "/images/weddings/wedding-17.JPG",
  "/images/weddings/wedding-18.JPG",
  "/images/weddings/wedding-19.JPG",
  "/images/weddings/wedding-20.JPG",
];

const fallbackImages = [
  ...portraitImages,
  ...familyImages,
  ...eventImages,
  ...weddingImages,
];

function fallbackAlt(index: number) {
  return `R.ArtPhotographie Galerie Kaufbeuren und Allgäu ${index + 1}`;
}

function toFallbackImages(images: string[]): GalleryImageItem[] {
  return images.map((src, index) => ({
    id: `fallback-gallery-${index}`,
    src,
    alt: fallbackAlt(index),
  }));
}

function toGalleryImages(images: SanityGalleryImage[]): GalleryImageItem[] {
  return images.map((image) => ({
    id: image.id,
    src: image.src,
    alt: image.alt,
    title: image.title,
    width: image.width,
    height: image.height,
  }));
}

export default async function GaleriePage() {
  const sanityImages = await getGalleryImages();
  const images =
    sanityImages.length > 0
      ? toGalleryImages(sanityImages)
      : toFallbackImages(fallbackImages);

  return (
    <main className="bg-sand pb-24 text-ink">
      <PageHeader
        eyebrow="Galerie"
        heading="Arbeiten aus"
        accent="Kaufbeuren"
        intro="Portraits, Familienmomente, Babybäuche, Newborns und Hochzeiten – aus Kaufbeuren, dem Ostallgäu und dem gesamten Allgäu."
        primaryAction={{ href: "/kontakt", label: "Shooting anfragen" }}
        showPhone
      />

      <GalerieGridClient images={images} />

      <section className="px-6 pt-10 md:px-10 md:pt-14">
        <div className="mx-auto max-w-7xl border-t border-ink/10 pt-12 md:flex md:items-end md:justify-between md:gap-10 md:pt-16">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-ink/65">
              Anfrage
            </p>
            <h2 className="mt-4 text-3xl font-light leading-tight md:text-5xl">
              Du möchtest solche Bilder von dir?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink/62 md:text-lg">
              Erzähl kurz, was du dir vorstellst – ich melde mich persönlich
              zurück.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 md:mt-0 md:shrink-0">
            <Link
              href="/kontakt"
              className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-medium text-paper transition hover:opacity-90"
            >
              Shooting anfragen
            </Link>

            <Link
              href="/preise"
              className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-ink/25 bg-transparent px-7 py-3 text-sm font-semibold text-ink transition hover:border-ink/40 hover:bg-transparent hover:text-ink"
            >
              Preise ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
