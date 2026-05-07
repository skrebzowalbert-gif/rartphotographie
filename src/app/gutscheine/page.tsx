import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import VoucherSection from "@/components/sections/VoucherSection";
import VoucherCheckout from "@/components/vouchers/VoucherCheckout";
import { getVoucherDiscountPromotion } from "@/lib/promotions";
import { getActivePromotions } from "@/sanity/queries";

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

export const revalidate = 0;

export default async function GutscheinePage() {
  const activePromotions = await getActivePromotions();
  const voucherPromotion = getVoucherDiscountPromotion(activePromotions);
  const promoBadge =
    voucherPromotion?.badge?.trim() || voucherPromotion?.title?.trim();
  const promoText = voucherPromotion?.text?.trim();

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

      {voucherPromotion && (
        <section className="px-6 py-4 md:px-10">
          <div className="mx-auto max-w-7xl border-y border-black/10 py-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                {promoBadge && (
                  <p className="text-xs uppercase tracking-[0.28em] text-black/40">
                    {promoBadge}
                  </p>
                )}
                {promoText && (
                  <p className="mt-2 max-w-3xl text-base leading-7 text-black/70">
                    {promoText}
                  </p>
                )}
                <p className="mt-2 text-sm leading-6 text-black/54">
                  Der Rabatt wird im nächsten Schritt automatisch
                  berücksichtigt.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <Suspense
        fallback={
          <section className="px-6 py-20 md:px-10 md:py-24">
            <div className="mx-auto max-w-7xl" />
          </section>
        }
      >
        <VoucherCheckout promotion={voucherPromotion} />
      </Suspense>
      <VoucherSection compact />
    </main>
  );
}
