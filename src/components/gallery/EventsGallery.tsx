"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  images: string[];
};

export default function EventsGallery({ images }: Props) {
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
            <button onClick={() => setActiveIndex(0)}>
              <Image
                src={images[0]}
                alt="Event 1"
                width={1400}
                height={1800}
                className="h-[540px] w-full rounded-[28px] object-cover hover:scale-[1.02] transition"
              />
            </button>
          </div>

          <div className="grid gap-5 md:col-span-5">
            <button onClick={() => setActiveIndex(1)}>
              <Image
                src={images[1]}
                alt="Event 2"
                width={1000}
                height={1200}
                className="h-[260px] w-full rounded-[28px] object-cover hover:scale-[1.02] transition"
              />
            </button>

            <button onClick={() => setActiveIndex(2)}>
              <Image
                src={images[2]}
                alt="Event 3"
                width={1000}
                height={1200}
                className="h-[260px] w-full rounded-[28px] object-cover hover:scale-[1.02] transition"
              />
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {[3, 4, 5].map((i) => (
            <button key={i} onClick={() => setActiveIndex(i)}>
              <Image
                src={images[i]}
                alt={`Event ${i}`}
                width={1000}
                height={1400}
                className="h-[420px] w-full rounded-[28px] object-cover hover:scale-[1.02] transition"
              />
            </button>
          ))}
        </div>
      </section>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={close}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute top-6 right-6 text-white text-xl"
          >
            ✕
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-6 text-white text-3xl"
          >
            ←
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-6 text-white text-3xl"
          >
            →
          </button>

          <Image
            src={images[activeIndex]}
            alt="Event groß"
            width={1600}
            height={2200}
            className="max-h-[90vh] w-auto rounded-xl"
          />
        </div>
      )}
    </>
  );
}
