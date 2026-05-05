"use client";

import Image from "next/image";

const DATA = [
  "/images/portrait/portrait-1.jpg",
  "/images/portrait/portrait-2.jpg",
  "/images/portrait/portrait-3.jpg",
  "/images/portrait/portrait-4.jpg",
  "/images/portrait/portrait-5.jpg",
  "/images/portrait/portrait-6.jpg",
  "/images/portrait/portrait-7.jpg",
  "/images/portrait/portrait-9.jpg",
  "/images/portrait/portrait-10.jpg",
  "/images/family/family-1.jpg",
  "/images/family/family-2.jpg",
  "/images/babybauch/babybauch-1.jpg",
  "/images/babybauch/babybauch-2.jpg",
  "/images/newborn/newborn-1.jpg",
  "/images/newborn/newborn-2.jpg",
  "/images/weddings/wedding-1.jpg",
  "/images/weddings/wedding-2.jpg",
  "/images/weddings/wedding-3.jpg",
  "/images/weddings/wedding-4.jpg",
  "/images/weddings/wedding-8.jpg",
];

const LOOP_DATA = [...DATA, ...DATA];

export default function PortfolioCarousel3D() {
  return (
    <section className="portfolio-carousel relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
      <div className="mx-auto mb-10 max-w-7xl px-6 md:px-10">
        <p className="text-center text-sm uppercase tracking-[0.32em] text-black/38">
          Ausgewählte Arbeiten
        </p>
      </div>

      <div className="portfolio-carousel__scene">
        <div className="portfolio-carousel__track">
          {LOOP_DATA.map((src, index) => (
            <div key={`${src}-${index}`} className="portfolio-carousel__item">
              <Image
                src={src}
                alt="Ausgewählte Fotografie aus dem Portfolio von R.ArtPhotographie"
                width={300}
                height={430}
                sizes="(max-width: 768px) 150px, 300px"
                className="portfolio-carousel__image"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
