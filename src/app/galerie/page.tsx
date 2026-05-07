import Link from "next/link";
import type { Metadata } from "next";
import GalerieGridClient, {
  type GalleryGroup,
  type GalleryImageItem,
} from "@/components/gallery/GalerieGridClient";
import {
  getGalleryImages,
  type SanityGalleryCategory,
  type SanityGalleryImage,
} from "@/sanity/queries";

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

type GalleryGroupMeta = {
  title: string;
  subtitle: string;
  categories: SanityGalleryCategory[];
  fallbackImages: string[];
};

const groupMeta: GalleryGroupMeta[] = [
  {
    title: "Portrait",
    subtitle:
      "Klare Bildsprache, Ruhe vor der Kamera und Portraits mit Charakter.",
    categories: ["portrait"],
    fallbackImages: portraitImages,
  },
  {
    title: "Familie, Babybauch & Newborn",
    subtitle:
      "Persönliche Erinnerungen, ruhig fotografiert und hochwertig ausgearbeitet.",
    categories: [
      "family",
      "babybauch",
      "newborn",
    ],
    fallbackImages: familyImages,
  },
  {
    title: "Events",
    subtitle:
      "Stimmung, Dynamik und echte Situationen statt austauschbarer Partybilder.",
    categories: ["event"],
    fallbackImages: eventImages,
  },
  {
    title: "Hochzeiten",
    subtitle:
      "Emotionale Momente, sauber dokumentiert und ohne künstliche Überladung.",
    categories: ["wedding"],
    fallbackImages: weddingImages,
  },
];

function fallbackAlt(title: string, index: number) {
  return `${title} Fotografie ${index + 1} von R.ArtPhotographie Kaufbeuren`;
}

function toFallbackImages(title: string, images: string[]): GalleryImageItem[] {
  return images.map((src, index) => ({
    id: `fallback-${title}-${index}`,
    src,
    alt: fallbackAlt(title, index),
  }));
}

function buildFallbackGroups(): GalleryGroup[] {
  return groupMeta.map((group) => ({
    title: group.title,
    subtitle: group.subtitle,
    images: toFallbackImages(group.title, group.fallbackImages),
  }));
}

function buildSanityGroups(images: SanityGalleryImage[]): GalleryGroup[] {
  const groups = groupMeta
    .map((group) => {
      const groupImages = images
        .filter((image) => group.categories.includes(image.category))
        .map((image) => ({
          id: image.id,
          src: image.src,
          alt: image.alt,
          title: image.title,
        }));

      return {
        title: group.title,
        subtitle: group.subtitle,
        images: groupImages,
      };
    })
    .filter((group) => group.images.length > 0);

  return groups.length > 0 ? groups : buildFallbackGroups();
}

export default async function GaleriePage() {
  const sanityImages = await getGalleryImages();
  const groups =
    sanityImages.length > 0
      ? buildSanityGroups(sanityImages)
      : buildFallbackGroups();

  return (
    <main className="bg-[#e7dfd3] pb-24 text-black">
      <section className="px-6 pb-12 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.32em] text-black/38">
            Galerie
          </p>

          <div className="mt-5 grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-end">
            <div>
              <h1 className="text-4xl font-light leading-[0.98] md:text-6xl">
                Arbeiten, die man
                <br />
                wirklich sehen will
              </h1>
            </div>

            <div>
              <p className="max-w-3xl text-lg leading-8 text-black/62 md:text-xl md:leading-9">
                Eine kuratierte Auswahl aus Portrait, Familie, Events und
                Hochzeiten. Keine Zwischenebene, sondern direkt die Bilder.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/kontakt"
                  className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:opacity-90"
                  style={{ color: "#ffffff" }}
                >
                  Shooting anfragen
                </Link>

                <Link
                  href="/preise"
                  className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/14 px-8 py-4 text-sm font-medium text-black transition hover:border-black/30 hover:bg-black/5"
                  style={{ color: "#111111" }}
                >
                  Preise ansehen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GalerieGridClient groups={groups} />
    </main>
  );
}
