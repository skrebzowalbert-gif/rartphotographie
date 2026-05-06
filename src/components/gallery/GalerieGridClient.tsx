"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

export type GalleryImageItem = {
  src: string;
  alt: string;
  title?: string;
};

export type GalleryGroup = {
  title: string;
  subtitle: string;
  images: GalleryImageItem[];
};

type GalerieGridClientProps = {
  groups: GalleryGroup[];
};

export default function GalerieGridClient({ groups }: GalerieGridClientProps) {
  const allImages = useMemo(
    () =>
      groups.flatMap((group) =>
        group.images.map((image) => ({
          src: image.src,
          alt: image.alt,
          title: image.title,
        }))
      ),
    [groups]
  );
  const groupedImages = useMemo(() => {
    return groups.map((group, groupIndex) => {
      const offset = groups
        .slice(0, groupIndex)
        .reduce((sum, previousGroup) => sum + previousGroup.images.length, 0);
      const images = group.images.map((image, index) => ({
        ...image,
        globalIndex: offset + index,
      }));

      return {
        ...group,
        images,
      };
    });
  }, [groups]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage =
    activeIndex === null ? null : allImages[activeIndex] || null;

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((index) =>
      index === null ? null : (index - 1 + allImages.length) % allImages.length
    );
  }, [allImages.length]);

  const showNext = useCallback(() => {
    setActiveIndex((index) =>
      index === null ? null : (index + 1) % allImages.length
    );
  }, [allImages.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, closeLightbox, showNext, showPrevious]);

  return (
    <>
      {groupedImages.map((group) => (
        <section
          key={group.title}
          className="px-3 py-12 sm:px-6 md:px-10 md:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-3 px-3 sm:px-0 md:mb-10 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-black/38 md:text-sm md:tracking-[0.32em]">
                  Galerie
                </p>
                <h2 className="mt-3 text-3xl font-light leading-[1] md:text-5xl">
                  {group.title}
                </h2>
              </div>

              <p className="max-w-2xl text-sm leading-7 text-black/60 md:text-lg md:leading-8">
                {group.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:grid-cols-4 md:gap-4 xl:grid-cols-5">
              {group.images.map((image, index) => (
                  <button
                    key={`${group.title}-${image.src}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(image.globalIndex)}
                    className="group relative aspect-square min-w-0 touch-manipulation overflow-hidden bg-black/5 text-left pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:aspect-[4/5]"
                    aria-label={`${group.title} Bild ${index + 1} öffnen`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      className="pointer-events-none object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </button>
              ))}
            </div>
          </div>
        </section>
      ))}

      {activeImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/88 px-4 py-6 text-white"
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/22 bg-black/42 text-2xl leading-none text-white backdrop-blur transition hover:bg-white/12"
            aria-label="Galerie schließen"
          >
            ×
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/32 text-3xl leading-none text-white backdrop-blur transition hover:bg-white/12 sm:inline-flex"
            aria-label="Vorheriges Bild"
          >
            ‹
          </button>

          <div
            className="relative h-[82vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/32 text-3xl leading-none text-white backdrop-blur transition hover:bg-white/12 sm:inline-flex"
            aria-label="Nächstes Bild"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
