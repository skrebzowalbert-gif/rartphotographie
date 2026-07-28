import Link from "next/link";
import { reviews } from "@/data/reviews";
import { googleBusinessProfileUrl, googleReviews } from "@/lib/site";

/**
 * Bewertungen.
 *
 * Bewusst als dunkle Sektion. Die Seite bestand vorher durchgehend aus
 * beigen Flächen mit Kästen darauf – ohne Kontrastwechsel entsteht kein
 * Rhythmus, und jede Sektion wirkt gleich wichtig.
 *
 * Der erste Beleg trägt die Fläche als großes Zitat, die übrigen stehen
 * schlank daneben. Keine Karten, keine Rahmen.
 */
export default function ReviewsSection() {
  const [featured, ...rest] = reviews.items;
  const rating = googleReviews?.rating ?? reviews.rating;
  const count = googleReviews?.count ?? reviews.total;

  return (
    <section className="bg-ink px-[var(--shell-x)] py-24 text-paper md:py-36">
      <div className="mx-auto max-w-[110rem]">
        <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
          <div>
            <p className="eyebrow rise text-paper/50">Was Kundinnen sagen</p>

            <blockquote className="rise mt-8">
              <p className="display-lg text-paper">
                &bdquo;{featured.text.split(".")[0]}.&ldquo;
              </p>
              <footer className="mt-6 text-sm text-paper/55">
                {featured.name}
              </footer>
            </blockquote>

            <div className="rise mt-14 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-paper/15 pt-8">
              <span className="font-display text-5xl text-paper">
                {rating.toFixed(1).replace(".", ",")}
              </span>
              <span
                aria-hidden="true"
                className="tracking-[0.25em] text-[#c9a227]"
              >
                ★★★★★
              </span>
              <span className="text-sm text-paper/60">
                {count} Bewertungen bei Google
              </span>
            </div>

            <div className="rise mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/kontakt"
                className="group inline-flex min-h-[58px] items-center gap-3 rounded-full bg-paper px-8 text-base font-medium text-ink transition-opacity duration-500 hover:opacity-90"
              >
                Shooting anfragen
                <span
                  aria-hidden="true"
                  className="transition-transform duration-500 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
              <a
                href={googleBusinessProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="link-sweep text-base font-medium text-paper/75"
              >
                Bei Google ansehen
              </a>
            </div>
          </div>

          {/* Weitere Stimmen – schlanke Spalte, nur durch Linien getrennt. */}
          <div className="stagger divide-y divide-paper/12 border-t border-paper/12">
            {rest.map((review) => (
              <figure key={review.name} className="py-7">
                <p className="text-base leading-7 text-paper/78">
                  {review.text}
                </p>
                <figcaption className="mt-3 text-sm text-paper/50">
                  {review.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
