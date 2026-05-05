"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

type CollageItem = {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  speed: number;
  layer: number;
};

const imagePool = [
  "/images/portrait/portrait-2.jpg",
  "/images/weddings/wedding-3.jpg",
  "/images/family/family-1.jpg",
  "/images/babybauch/babybauch-1.jpg",
  "/images/newborn/newborn-1.jpg",
  "/images/events/event-1.jpg",
  "/images/portrait/portrait-6.jpg",
  "/images/weddings/wedding-8.jpg",
  "/images/family/family-2.jpg",
  "/images/portrait/portrait-12.jpg",
  "/images/weddings/wedding-12.jpg",
  "/images/events/event-4.jpg",
  "/images/babybauch/babybauch-2.jpg",
  "/images/newborn/newborn-2.jpg",
  "/images/portrait/portrait-18.jpg",
  "/images/weddings/wedding-16.jpg",
  "/images/events/event-8.jpg",
  "/images/portrait/portrait-24.jpg",
  "/images/weddings/wedding-1.jpg",
  "/images/events/event-11.jpg",
  "/images/portrait/portrait-30.jpg",
  "/images/weddings/wedding-6.jpg",
  "/images/events/event-14.JPG",
  "/images/portrait/portrait-9.jpg",
  "/images/weddings/wedding-19.JPG",
  "/images/events/event-3.jpg",
  "/images/portrait/portrait-15.jpg",
  "/images/weddings/wedding-10.jpg",
  "/images/events/event-6.jpg",
  "/images/hero/hero-2.jpg",
];

const layerSettings = [
  { min: 230, max: 320, opacity: 0.98, speed: 14 },
  { min: 170, max: 240, opacity: 0.86, speed: -10 },
  { min: 120, max: 180, opacity: 0.68, speed: 7 },
  { min: 76, max: 130, opacity: 0.5, speed: -5 },
];

const collageItems: CollageItem[] = Array.from({ length: 62 }, (_, index) => {
  const layer = index % layerSettings.length;
  const settings = layerSettings[layer];
  const widthRange = settings.max - settings.min;
  const width = settings.min + ((index * 37) % widthRange);
  const ratio = 0.64 + ((index * 17) % 26) / 100;
  const x = -10 + ((index * 17 + layer * 19) % 126);
  const y = 1 + ((index * 23 + layer * 13) % 86);
  const speedVariation = 0.74 + ((index * 13) % 44) / 100;

  return {
    src: imagePool[index % imagePool.length],
    x,
    y,
    width,
    height: Math.round(width / ratio),
    opacity: settings.opacity,
    speed: settings.speed * speedVariation * 1.48,
    layer,
  };
});

function wrapX(value: number, width: number, viewportWidth: number) {
  const buffer = Math.max(180, viewportWidth * 0.14);

  if (value > viewportWidth + buffer) {
    return -width - buffer * 0.4;
  }

  if (value < -width - buffer) {
    return viewportWidth + buffer * 0.4;
  }

  return value;
}

export default function HeroImageWall() {
  const rootRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const itemElements = itemRefs.current;
    const positions = collageItems.map(() => ({ x: 0 }));
    let initialized = false;
    let frameId = 0;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min(40, now - lastTime) / 1000;
      lastTime = now;
      const viewportWidth = root.getBoundingClientRect().width;

      if (!initialized) {
        collageItems.forEach((item, index) => {
          positions[index].x = (item.x / 100) * viewportWidth;
        });
        initialized = true;
      }

      itemElements.forEach((element, index) => {
        if (!element) return;
        const item = collageItems[index];
        const width = element.offsetWidth || item.width;

        positions[index].x = wrapX(
          positions[index].x + (reduceMotion ? 0 : item.speed * dt),
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
    <section
      ref={rootRef}
      className="relative min-h-[90svh] overflow-hidden bg-[#050505] text-white md:min-h-[94vh]"
    >
      <div className="pointer-events-none absolute inset-0">
        {collageItems.map((item, index) => (
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
              width: `clamp(72px, ${item.width / 12}vw, ${item.width}px)`,
              height: `clamp(94px, ${item.height / 12}vw, ${item.height}px)`,
              opacity: item.opacity,
              zIndex: 10 - item.layer,
              transform: `translate3d(${item.x}vw, 0, 0)`,
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-md bg-white/5 shadow-[0_18px_70px_rgba(0,0,0,0.22)]">
              <Image
                src={item.src}
                alt=""
                fill
                sizes="(max-width: 640px) 34vw, (max-width: 1024px) 24vw, 18vw"
                quality={66}
                className="object-cover saturate-[0.98] contrast-[1.04]"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_27%_48%,rgba(5,5,5,0.92)_0%,rgba(5,5,5,0.78)_28%,rgba(5,5,5,0.28)_52%,rgba(5,5,5,0.1)_74%,rgba(5,5,5,0.24)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.76)_0%,rgba(5,5,5,0.58)_38%,rgba(5,5,5,0.14)_58%,rgba(5,5,5,0.04)_82%,rgba(5,5,5,0.18)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[7vh] bg-[linear-gradient(to_top,#faf8f3_0%,rgba(250,248,243,0.46)_28%,rgba(250,248,243,0)_100%)]" />

      <div className="relative z-30 flex min-h-[90svh] items-end px-6 pb-16 pt-28 md:min-h-[94vh] md:items-center md:px-10 md:pb-0 md:pt-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-[42rem]">
            <p className="text-sm uppercase tracking-[0.3em] text-white/68">
              R.ArtPhotographie
            </p>

            <h1 className="mt-5 text-[2.45rem] font-light leading-[1.02] text-white min-[380px]:text-[2.8rem] md:mt-6 md:text-7xl md:leading-[0.96]">
              Fotografin in Kaufbeuren & im Allgäu
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 md:text-lg md:leading-9">
              Professionelle Portraits, Hochzeiten, Familien- und
              Babybauchshootings in Kaufbeuren, Kempten, Marktoberdorf, Füssen
              und Umgebung.
            </p>

            <p className="mt-5 text-sm leading-7 text-white/70 md:text-base">
              ★ 5,0 Google Bewertung · 47 Rezensionen · Kaufbeuren & Allgäu
            </p>

            <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <div className="pointer-events-none absolute inset-[-1.25rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.24)_42%,rgba(0,0,0,0)_72%)]" />
              <Link
                href="/kontakt"
                className="relative inline-flex min-h-[54px] items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-black shadow-[0_14px_44px_rgba(0,0,0,0.24)] transition hover:bg-[#e7dfd3]"
              >
                Shooting anfragen
              </Link>

              <Link
                href="/galerie"
                className="relative inline-flex min-h-[54px] items-center justify-center rounded-full border border-white/55 bg-black/34 px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_44px_rgba(0,0,0,0.18)] backdrop-blur transition hover:border-white/75 hover:bg-black/48"
              >
                Arbeiten ansehen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
