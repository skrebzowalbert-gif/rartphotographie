"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

type WallItem = {
  src: string;
  alt: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  speed: number;
  layer: number;
};

const imagePool = [
  {
    src: "/images/portrait/portrait-1.jpg",
    alt: "Fotografin Kaufbeuren Portraitshooting R.ArtPhotographie",
  },
  {
    src: "/images/portrait/portrait-2.jpg",
    alt: "Portraitfotografie Kaufbeuren R.ArtPhotographie",
  },
  {
    src: "/images/portrait/portrait-4.jpg",
    alt: "Editoriales Portraitshooting im Allgäu R.ArtPhotographie",
  },
  {
    src: "/images/portrait/portrait-6.jpg",
    alt: "Professionelles Portrait in Kaufbeuren R.ArtPhotographie",
  },
  {
    src: "/images/portrait/portrait-10.jpg",
    alt: "Fotografin Allgäu Portrait R.ArtPhotographie",
  },
  {
    src: "/images/family/family-1.jpg",
    alt: "Familienfotografie Allgäu R.ArtPhotographie",
  },
  {
    src: "/images/family/family-2.jpg",
    alt: "Familienfotos Kaufbeuren R.ArtPhotographie",
  },
  {
    src: "/images/babybauch/babybauch-1.jpg",
    alt: "Babybauch Shooting Kaufbeuren R.ArtPhotographie",
  },
  {
    src: "/images/babybauch/babybauch-2.jpg",
    alt: "Babybauchfotografie Allgäu R.ArtPhotographie",
  },
  {
    src: "/images/newborn/newborn-1.jpg",
    alt: "Newborn Shooting Kaufbeuren R.ArtPhotographie",
  },
  {
    src: "/images/newborn/newborn-2.jpg",
    alt: "Newborn Fotografie Allgäu R.ArtPhotographie",
  },
  {
    src: "/images/weddings/wedding-1.jpg",
    alt: "Hochzeitsfotografin Allgäu R.ArtPhotographie",
  },
  {
    src: "/images/weddings/wedding-3.jpg",
    alt: "Hochzeitsfotografie Kaufbeuren R.ArtPhotographie",
  },
  {
    src: "/images/weddings/wedding-8.jpg",
    alt: "Elegante Hochzeitsbilder im Allgäu R.ArtPhotographie",
  },
  {
    src: "/images/weddings/wedding-12.jpg",
    alt: "Hochzeitsreportage Allgäu R.ArtPhotographie",
  },
  {
    src: "/images/events/event-1.jpg",
    alt: "Eventfotografie Kaufbeuren R.ArtPhotographie",
  },
  {
    src: "/images/events/event-4.jpg",
    alt: "Eventfotografie Allgäu R.ArtPhotographie",
  },
  {
    src: "/images/events/event-8.jpg",
    alt: "Fotografie besonderer Momente R.ArtPhotographie",
  },
];

const layerSettings = [
  { min: 220, max: 310, opacity: 0.96, speed: 18 },
  { min: 150, max: 225, opacity: 0.82, speed: -13 },
  { min: 105, max: 165, opacity: 0.62, speed: 9 },
  { min: 72, max: 120, opacity: 0.48, speed: -6 },
];

const wallItems: WallItem[] = Array.from({ length: 44 }, (_, index) => {
  const layer = index % layerSettings.length;
  const settings = layerSettings[layer];
  const width = settings.min + ((index * 43) % (settings.max - settings.min));
  const ratio = 0.64 + ((index * 19) % 28) / 100;

  return {
    ...imagePool[index % imagePool.length],
    x: -14 + ((index * 29 + layer * 11) % 134),
    y: 4 + ((index * 31 + layer * 17) % 78),
    width,
    height: Math.round(width / ratio),
    opacity: settings.opacity,
    speed: settings.speed * (0.82 + ((index * 7) % 34) / 100),
    layer,
  };
});

const mobileWallImages = [
  ...imagePool.slice(0, 12),
  ...imagePool.slice(0, 12),
];

function wrapX(value: number, width: number, viewportWidth: number) {
  const buffer = Math.max(160, viewportWidth * 0.18);

  if (value > viewportWidth + buffer) {
    return -width - buffer * 0.35;
  }

  if (value < -width - buffer) {
    return viewportWidth + buffer * 0.35;
  }

  return value;
}

export default function FeaturedImageWall() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.innerWidth < 768) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const positions = wallItems.map(() => ({ x: 0 }));
    const itemElements = itemRefs.current;
    let initialized = false;
    let frameId = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = Math.min(40, now - lastTime) / 1000;
      lastTime = now;
      const viewportWidth = root.getBoundingClientRect().width;

      if (!initialized) {
        wallItems.forEach((item, index) => {
          positions[index].x = (item.x / 100) * viewportWidth;
        });
        initialized = true;
      }

      itemElements.forEach((element, index) => {
        if (!element) return;
        const item = wallItems[index];
        const width = element.offsetWidth || item.width;

        positions[index].x = wrapX(
          positions[index].x + (reduceMotion ? 0 : item.speed * delta),
          width,
          viewportWidth
        );

        element.style.transform = `translate3d(${positions[index].x}px, 0, 0)`;
      });

      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      itemElements.forEach((element) => {
        if (element) element.style.transform = "";
      });
    };
  }, []);

  return (
    <section className="overflow-hidden bg-[#faf8f3] px-6 py-24 text-black md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-black/38">
              Ausgewählte Arbeiten
            </p>
            <h2 className="mt-5 max-w-3xl text-4xl font-light leading-[1] md:text-6xl">
              Ein bewegter Blick in Reginas Bildwelt
            </h2>
          </div>

          <div className="max-w-2xl text-base leading-8 text-black/62 md:text-lg md:leading-9">
            <p>
              Eine bewegte Auswahl aus Portraits, Hochzeiten, Familie,
              Babybauch und Events. So bekommst du direkt ein Gefühl für Stil,
              Stimmung und Arbeitsweise von R.ArtPhotographie.
            </p>
            <Link
              href="/galerie"
              className="mt-7 inline-flex min-h-[54px] items-center justify-center rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
              style={{ color: "#ffffff" }}
            >
              Galerie ansehen
            </Link>
          </div>
        </div>
      </div>

      <div className="relative left-1/2 right-1/2 mt-10 block h-[300px] w-screen -translate-x-1/2 overflow-hidden bg-[#16120f] md:hidden">
        <div className="featured-mobile-wall__track top-6">
          {mobileWallImages.map((image, index) => (
            <div
              key={`mobile-a-${image.src}-${index}`}
              className="relative h-36 w-28 shrink-0 overflow-hidden rounded-[5px] bg-white/5"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="featured-mobile-wall__track featured-mobile-wall__track--reverse bottom-7">
          {mobileWallImages
            .slice()
            .reverse()
            .map((image, index) => (
              <div
                key={`mobile-b-${image.src}-${index}`}
                className="relative h-32 w-24 shrink-0 overflow-hidden rounded-[5px] bg-white/5"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-[linear-gradient(to_right,#faf8f3_0%,rgba(250,248,243,0)_100%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-[linear-gradient(to_left,#faf8f3_0%,rgba(250,248,243,0)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(to_top,#faf8f3_0%,rgba(250,248,243,0)_100%)]" />
      </div>

      <div
        ref={rootRef}
        className="relative left-1/2 right-1/2 mt-14 hidden h-[620px] w-screen -translate-x-1/2 overflow-hidden bg-[#16120f] md:block"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(250,248,243,0.08)_0%,rgba(250,248,243,0)_42%),linear-gradient(180deg,rgba(250,248,243,0.08)_0%,rgba(250,248,243,0)_18%,rgba(250,248,243,0)_82%,rgba(250,248,243,0.12)_100%)]" />

        {wallItems.map((item, index) => (
          <div
            key={`${item.src}-${index}`}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className={`absolute left-0 will-change-transform motion-reduce:transform-none ${
              item.layer === 3 ? "hidden sm:block" : ""
            }`}
            style={{
              top: `${item.y}%`,
              width: `clamp(74px, ${item.width / 12}vw, ${item.width}px)`,
              height: `clamp(96px, ${item.height / 12}vw, ${item.height}px)`,
              opacity: item.opacity,
              zIndex: 20 - item.layer,
              transform: `translate3d(${item.x}vw, 0, 0)`,
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[6px] bg-white/5 shadow-[0_24px_72px_rgba(0,0,0,0.24)]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 36vw, (max-width: 1024px) 26vw, 18vw"
                className="object-cover saturate-[1.02] contrast-[1.03]"
              />
            </div>
          </div>
        ))}

        <div className="pointer-events-none absolute inset-y-0 left-0 w-[12vw] bg-[linear-gradient(to_right,#faf8f3_0%,rgba(250,248,243,0.46)_34%,rgba(250,248,243,0)_100%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[12vw] bg-[linear-gradient(to_left,#faf8f3_0%,rgba(250,248,243,0.34)_32%,rgba(250,248,243,0)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[8vh] bg-[linear-gradient(to_top,#faf8f3_0%,rgba(250,248,243,0.48)_32%,rgba(250,248,243,0)_100%)]" />
      </div>
    </section>
  );
}
