import Link from "next/link";
import type { Metadata } from "next";
import HeroSlider from "@/components/sections/HeroSlider";
import FeaturedImageWall from "@/components/sections/FeaturedImageWall";
import ReviewsSection from "@/components/sections/ReviewsSection";
import VoucherSection from "@/components/sections/VoucherSection";
import AboutEditorial from "@/components/sections/AboutEditorial";
import ServicesAccordion from "@/components/sections/ServicesAccordion";
import PromotionBar from "@/components/sections/PromotionBar";
import { instagramUrl } from "@/lib/site";
import { getActivePromotions } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Fotografin Kaufbeuren & Allgäu | R.ArtPhotographie",
  description:
    "Professionelle Fotografin in Kaufbeuren & Allgäu für Portraits, Hochzeiten, Familie, Babybauch und Newborn. 5,0 Google Bewertung · 47 Rezensionen.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Fotografin Kaufbeuren & Allgäu | R.ArtPhotographie",
    description:
      "Professionelle Fotografin in Kaufbeuren & Allgäu für Portraits, Hochzeiten, Familie, Babybauch und Newborn.",
    url: "/",
  },
};

export const revalidate = 0;

export default async function Home() {
  const promotions = await getActivePromotions();
  const activePromotion = promotions[0] || null;

  return (
    <main className="bg-[#e7dfd3] text-black">
      <PromotionBar promotion={activePromotion} />
      <HeroSlider />

      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 xl:grid-cols-[0.8fr_1.2fr] xl:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-black/38">
              R.ArtPhotographie
            </p>

            <h2 className="mt-5 text-4xl font-light leading-[0.98] md:text-6xl">
              Bilder mit Haltung,
              <br />
              nicht mit Zufall
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="text-lg leading-8 text-black/65 md:text-xl md:leading-9">
              Bei R.ArtPhotographie geht es nicht um steife Posen. Du bekommst
              ein Shooting, das ruhig geführt wird und sich natürlich anfühlt,
              mit Bildern, die zu dir passen.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/kontakt"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
                style={{ color: "#ffffff" }}
              >
                Shooting anfragen
              </Link>

              <Link
                href="/galerie"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/14 px-7 py-3 text-sm font-medium text-black transition hover:border-black/30 hover:bg-black/5"
                style={{ color: "#111111" }}
              >
                Arbeiten ansehen
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-3 text-sm text-black/58">
              <Link href="/fotografin-kaufbeuren" className="hover:text-black">
                Fotografin Kaufbeuren
              </Link>
              <span>·</span>
              <Link href="/fotografin-allgaeu" className="hover:text-black">
                Fotografin Allgäu
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 md:px-10 md:pb-28">
        <div className="mx-auto grid max-w-7xl gap-10 border-y border-black/10 py-14 md:py-20 xl:grid-cols-[0.85fr_1.15fr] xl:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-black/38">
              Kaufbeuren & Allgäu
            </p>
            <h2 className="mt-4 max-w-4xl text-4xl font-light leading-[1] md:text-6xl">
              Fotografin in Kaufbeuren & im Allgäu
            </h2>
          </div>

          <div className="max-w-3xl text-base leading-8 text-black/66 md:text-lg md:leading-9">
            <p>
              Du suchst eine Fotografin in Kaufbeuren oder im Allgäu?
              R.ArtPhotographie begleitet Portraitshootings, Familienmomente,
              Babybauchshootings und Hochzeiten in Kaufbeuren, Kempten,
              Marktoberdorf, Füssen und Umgebung.
            </p>
            <p className="mt-5">
              Wichtig ist nicht, dass du perfekt posierst, sondern dass du dich
              vor der Kamera sicher fühlst. Ohne Druck. Ohne künstliche Posen.
              Mit Bildern, in denen du dich wiedererkennst.
            </p>

            <div className="mt-8">
              <Link
                href="/kontakt"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
                style={{ color: "#ffffff" }}
              >
                Shooting anfragen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FeaturedImageWall />
      <ServicesAccordion />
      <AboutEditorial />

      <ReviewsSection />

      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl rounded-xl border border-black/8 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),rgba(255,255,255,0.04))] px-8 py-14 text-center md:px-14 md:py-20">
          <p className="text-sm uppercase tracking-[0.32em] text-black/38">
            Nächster Schritt
          </p>

          <h2 className="mt-5 text-4xl font-light leading-[1] md:text-6xl">
            Lass uns dein Shooting
            <br />
            konkret planen
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-black/62 md:text-lg">
            Erzähl kurz, was du dir vorstellst. Danach klären wir gemeinsam,
            welcher Ort, welcher Ablauf und welches Shooting zu dir passt.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/kontakt"
              className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:opacity-90"
              style={{ color: "#ffffff" }}
            >
              Anfrage senden
            </Link>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/14 px-8 py-4 text-sm font-medium text-black transition hover:border-black/30 hover:bg-black/5"
              style={{ color: "#111111" }}
            >
              Instagram ansehen
            </a>
          </div>
        </div>
      </section>

      <VoucherSection compact />
    </main>
  );
}
