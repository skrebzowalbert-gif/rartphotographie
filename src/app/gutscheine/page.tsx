import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import VoucherSection from "@/components/sections/VoucherSection";
import VoucherCheckout from "@/components/vouchers/VoucherCheckout";

export const metadata: Metadata = {
  title: "Wertgutschein Kaufbeuren kaufen | R.ArtPhotographie",
  description:
    "Wertgutschein ab 50 € für Fotografie bei R.ArtPhotographie in Kaufbeuren und im Allgäu kaufen. Sicher bezahlen und hochwertig vorbereiten lassen.",
  alternates: { canonical: "/gutscheine" },
  openGraph: {
    title: "Gutscheine | R.ArtPhotographie",
    description:
      "Frei wählbarer Wertgutschein ab 50 € für Fotografie in Kaufbeuren und im Allgäu.",
    url: "/gutscheine",
  },
};

export default function GutscheinePage() {
  return (
    <main className="bg-[#e7dfd3] pb-24 text-black">
      <section className="px-6 pb-4 md:px-10 md:pb-8">
        <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-black/38">
              Gutscheine
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-light leading-[0.98] md:text-6xl">
              Mit einem Geschenkgutschein Erinnerungen verschenken
            </h1>
          </div>

          <div>
            <p className="max-w-3xl text-lg leading-8 text-black/62 md:text-xl md:leading-9">
              Verschenke einen frei wählbaren Wertgutschein ab 50 € für
              Portrait, Familie, Babybauch, Newborn oder Hochzeit. Der
              Gutschein wird hochwertig vorbereitet und kann direkt verschenkt
              werden.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="#checkout"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
                style={{ color: "#ffffff" }}
              >
                Wertgutschein kaufen
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <section className="px-6 py-20 md:px-10 md:py-24">
            <div className="mx-auto max-w-7xl" />
          </section>
        }
      >
        <VoucherCheckout />
      </Suspense>
      <VoucherSection compact />
    </main>
  );
}
