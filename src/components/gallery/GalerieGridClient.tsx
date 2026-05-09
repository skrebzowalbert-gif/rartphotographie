"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

export type GalleryImageItem = {
  id: string;
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
};

export type GalleryGroup = {
  title: string;
  subtitle: string;
  images: GalleryImageItem[];
};

type GalerieGridClientProps = {
  images: GalleryImageItem[];
};

export default function GalerieGridClient({ images }: GalerieGridClientProps) {
  const allImages = useMemo(
    () =>
      images.map((image) => ({
        id: image.id,
        src: image.src,
        alt: image.alt,
        title: image.title,
        width: image.width,
        height: image.height,
      })),
    [images]
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeLoaded, setActiveLoaded] = useState(false);
  const activeImage =
    activeIndex === null ? null : allImages[activeIndex] || null;

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
    setActiveLoaded(false);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveLoaded(false);
    setActiveIndex((index) =>
      index === null ? null : (index - 1 + allImages.length) % allImages.length
    );
  }, [allImages.length]);

  const showNext = useCallback(() => {
    setActiveLoaded(false);
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
      <section className="px-3 py-12 sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="columns-2 gap-2 sm:columns-3 md:columns-4 md:gap-4 xl:columns-5">
            {allImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => {
                  setActiveLoaded(false);
                  setActiveIndex(index);
                }}
                className="group mb-2 block w-full min-w-0 break-inside-avoid touch-manipulation overflow-hidden bg-transparent text-left pointer-events-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black md:mb-4"
                aria-label={`Galeriebild ${index + 1} öffnen`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width || 1200}
                  height={image.height || 1600}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="pointer-events-none h-auto w-full transition duration-500 group-hover:scale-[1.015]"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

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
            className="relative h-[82vh] w-full max-w-5xl bg-black/30"
            onClick={(event) => event.stopPropagation()}
          >
            {!activeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-white/58">
                Bild lädt
              </div>
            )}
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="100vw"
              className={`object-contain transition-opacity duration-300 ${
                activeLoaded ? "opacity-100" : "opacity-0"
              }`}
              priority
              onLoadingComplete={() => setActiveLoaded(true)}
              onError={() => setActiveLoaded(true)}
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
