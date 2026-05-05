"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  images: string[];
};

export default function PortraitGallery({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = () => setActiveIndex(null);

  const prev = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  };

  const next = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % images.length);
  };

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (activeIndex === null) return;

      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // Keyboard handlers intentionally use the current active index on each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, images.length]);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-14">
        <div className="grid gap-5 md:grid-cols-12">
          <div className="md:col-span-7">
            <button
              type="button"
              onClick={() => setActiveIndex(0)}
              className="block w-full overflow-hidden rounded-[28px]"
            >
              <Image
                src={images[0]}
                alt="Portrait 1"
                width={1400}
                height={1800}
                className="h-[540px] w-full object-cover transition duration-700 hover:scale-[1.02] md:h-[720px]"
              />
            </button>
          </div>

          <div className="grid gap-5 md:col-span-5">
            <button
              type="button"
              onClick={() => setActiveIndex(1)}
              className="block w-full overflow-hidden rounded-[28px]"
            >
              <Image
                src={images[1]}
                alt="Portrait 2"
                width={1000}
                height={1200}
                className="h-[260px] w-full object-cover transition duration-700 hover:scale-[1.02] md:h-[350px]"
              />
            </button>

            <button
              type="button"
              onClick={() => setActiveIndex(2)}
              className="block w-full overflow-hidden rounded-[28px]"
            >
              <Image
                src={images[2]}
                alt="Portrait 3"
                width={1000}
                height={1200}
                className="h-[260px] w-full object-cover transition duration-700 hover:scale-[1.02] md:h-[350px]"
              />
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-12">
          <div className="md:col-span-4">
            <button
              type="button"
              onClick={() => setActiveIndex(3)}
              className="block w-full overflow-hidden rounded-[28px]"
            >
              <Image
                src={images[3]}
                alt="Portrait 4"
                width={1000}
                height={1400}
                className="h-[420px] w-full object-cover transition duration-700 hover:scale-[1.02] md:h-[560px]"
              />
            </button>
          </div>

          <div className="md:col-span-4">
            <button
              type="button"
              onClick={() => setActiveIndex(4)}
              className="block w-full overflow-hidden rounded-[28px]"
            >
              <Image
                src={images[4]}
                alt="Portrait 5"
                width={1000}
                height={1400}
                className="h-[420px] w-full object-cover transition duration-700 hover:scale-[1.02] md:h-[560px]"
              />
            </button>
          </div>

          <div className="md:col-span-4">
            <button
              type="button"
              onClick={() => setActiveIndex(5)}
              className="block w-full overflow-hidden rounded-[28px]"
            >
              <Image
                src={images[5]}
                alt="Portrait 6"
                width={1000}
                height={1400}
                className="h-[420px] w-full object-cover transition duration-700 hover:scale-[1.02] md:h-[560px]"
              />
            </button>
          </div>
        </div>
      </section>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 px-4 py-6 backdrop-blur-sm"
          onClick={close}
        >
          <div className="relative flex h-full w-full items-center justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="absolute right-3 top-3 z-10 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm text-white transition hover:border-white/35"
            >
              Schließen
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 px-4 py-3 text-white transition hover:border-white/35"
            >
              ←
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 px-4 py-3 text-white transition hover:border-white/35"
            >
              →
            </button>

            <div
              className="relative max-h-full max-w-[92vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[activeIndex]}
                alt={`Portrait groß ${activeIndex + 1}`}
                width={1600}
                height={2200}
                className="max-h-[88vh] w-auto rounded-[24px] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
