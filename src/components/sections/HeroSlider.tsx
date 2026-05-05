"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const HERO_IMAGES = [
  {
    src: "/images/hero/hero-1.jpg",
    mobilePositionClass: "object-[36%_center]",
  },
  {
    src: "/images/hero/hero-2.jpg",
    mobilePositionClass: "object-[68%_center]",
  },
  {
    src: "/images/hero/hero-3.jpg",
    mobilePositionClass: "object-[34%_center]",
  },
];

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let timeoutId = 0;

    const scheduleNextSlide = () => {
      timeoutId = window.setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        scheduleNextSlide();
      }, 4200);
    };

    scheduleNextSlide();

    const onVisibilityChange = () => {
      window.clearTimeout(timeoutId);
      if (!document.hidden) {
        scheduleNextSlide();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <section
      data-active-slide={activeIndex}
      className="relative h-[88svh] min-h-[560px] w-full overflow-hidden md:h-[92vh] md:min-h-0"
    >

      {/* IMAGE */}
      {HERO_IMAGES.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt="Fotografin Kaufbeuren und Allgäu R.ArtPhotographie"
          fill
          preload={index === 0}
          sizes="100vw"
          aria-hidden={index !== activeIndex}
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover ${image.mobilePositionClass} transition-opacity duration-[1200ms] md:object-center ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* OVERLAY – wichtig für Premium Look */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.34)_44%,rgba(0,0,0,0.62)_100%)] md:bg-[radial-gradient(circle_at_32%_44%,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.3)_58%,rgba(0,0,0,0.48)_100%)]" />
      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(0,0,0,0.46)_0%,rgba(0,0,0,0.28)_42%,rgba(0,0,0,0.14)_100%)] md:block" />

      {/* BOTTOM FADE */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-[linear-gradient(to_top,#e7dfd3_0%,rgba(231,223,211,0.32)_48%,rgba(0,0,0,0)_100%)] md:h-[26%] md:bg-[linear-gradient(to_top,#e7dfd3_0%,rgba(231,223,211,0.72)_28%,rgba(36,31,26,0.16)_72%,rgba(0,0,0,0)_100%)]" />

      {/* CONTENT */}
      <div className="pointer-events-none relative z-10 flex h-full items-end pb-14 pt-24 md:items-center md:pb-0 md:pt-0">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="max-w-[34rem] md:max-w-2xl">

            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              R.ArtPhotographie
            </p>

            <h1 className="mt-5 text-[2.08rem] font-light leading-[1.04] text-white min-[380px]:text-[2.28rem] sm:text-[2.65rem] md:mt-6 md:text-6xl md:leading-[1.05]">
              <span className="block md:hidden">
                Fotografin in
                <br />
                Kaufbeuren &
                <br />
                im Allgäu
              </span>
              <span className="hidden md:block">
                Fotografin in Kaufbeuren
                <br />& im Allgäu
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-[0.98rem] leading-7 text-white/82 md:mt-6 md:text-lg">
              Professionelle Portraits, Hochzeiten, Familien- und
              Babybauchshootings in Kaufbeuren, Kempten, Marktoberdorf,
              Füssen und Umgebung.
            </p>

            <div className="pointer-events-auto mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-8 md:gap-4">
              <Link
                href="/kontakt"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90 sm:w-auto md:px-7"
              >
                Shooting anfragen
              </Link>

              <Link
                href="/galerie"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm text-white transition hover:bg-white/10 sm:w-auto md:px-7"
              >
                Arbeiten ansehen
              </Link>
            </div>

            <div className="mt-5 space-y-1.5 text-[0.82rem] leading-5 text-white/76 sm:flex sm:flex-wrap sm:gap-x-4 sm:space-y-0 md:mt-6 md:text-sm">
              <span className="block">
                ★ 5,0 Google Bewertung · 47 Rezensionen · Kaufbeuren & Allgäu
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INDICATOR */}
      <div className="pointer-events-none absolute bottom-6 left-6 z-20 flex gap-2">
        {HERO_IMAGES.map((_, i) => (
          <div
            key={i}
            className={`h-[3px] w-10 ${
              i === activeIndex ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
