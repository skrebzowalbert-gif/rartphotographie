import Link from "next/link";
import type { Metadata } from "next";
import Stripe from "stripe";
import { instagramUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Zahlung erfolgreich",
  description: "Die Gutschein-Zahlung bei R.ArtPhotographie war erfolgreich.",
  robots: {
    index: false,
    follow: false,
  },
};

type SuccessPageProps = {
  searchParams: Promise<{
    session_id?: string | string[];
  }>;
};

async function getPaidCheckoutSession(sessionId?: string) {
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return null;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.mode !== "payment" || session.payment_status !== "paid") {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export default async function GutscheinErfolgPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const rawSessionId = params.session_id;
  const sessionId = Array.isArray(rawSessionId)
    ? rawSessionId[0]
    : rawSessionId;
  const paidSession = await getPaidCheckoutSession(sessionId);
  const isPaymentConfirmed = Boolean(paidSession);

  return (
    <main className="bg-[#e7dfd3] px-6 pb-24 text-black md:px-10">
      <section className="mx-auto max-w-4xl text-center">
        <p className="text-sm uppercase tracking-[0.32em] text-black/38">
          Gutschein
        </p>
        <h1 className="mt-5 text-4xl font-light leading-[1] md:text-6xl">
          {isPaymentConfirmed
            ? "Zahlung erfolgreich"
            : "Zahlung nicht bestätigt"}
        </h1>
        {isPaymentConfirmed ? (
          <>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-black/64 md:text-lg">
              Deine Gutschein-Zahlung ist eingegangen. Der Gutschein wird
              hochwertig vorbereitet und versendet. Falls noch Details offen
              sind, melden wir uns bei dir.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-black/58">
              Du bekommst eine Bestätigung per E-Mail. Der Gutschein wird
              anschließend vorbereitet.
            </p>
          </>
        ) : (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-black/64 md:text-lg">
            Diese Seite kann nur nach einer bestätigten Stripe-Zahlung angezeigt
            werden. Bitte starte den Gutschein-Kauf erneut oder kontaktiere uns,
            falls du bereits bezahlt hast.
          </p>
        )}

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={isPaymentConfirmed ? "/" : "/gutscheine#checkout"}
            className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:opacity-90"
            style={{ color: "#ffffff" }}
          >
            {isPaymentConfirmed ? "Zur Startseite" : "Gutschein-Kauf erneut starten"}
          </Link>
          <Link
            href="/kontakt"
            className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/25 bg-transparent px-8 py-4 text-sm font-semibold text-[#1f1714] transition hover:border-black/40 hover:bg-transparent hover:text-[#1f1714]"
          >
            Kontakt
          </Link>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/25 bg-transparent px-8 py-4 text-sm font-semibold text-[#1f1714] transition hover:border-black/40 hover:bg-transparent hover:text-[#1f1714]"
          >
            Instagram
          </a>
        </div>
      </section>
    </main>
  );
}
