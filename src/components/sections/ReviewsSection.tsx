import Link from "next/link";
import { reviews } from "@/data/reviews";

function Stars({ count }: { count: number }) {
  return <div className="tracking-[0.22em] text-[#b8892f]">{"★".repeat(count)}</div>;
}

export default function ReviewsSection() {
  const featured = reviews.items[0];
  const sideItems = reviews.items.slice(1, 4);
  const bottomItems = reviews.items.slice(4);

  return (
    <section className="relative overflow-hidden px-6 py-24 text-black md:px-10 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-black/8" />

      <div className="relative mx-auto max-w-[1500px]">
        <div className="grid gap-12 xl:grid-cols-[0.72fr_1.28fr] xl:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-black/38">
              Bewertungen
            </p>

            <h2 className="mt-4 max-w-xl text-4xl font-light leading-[0.98] md:text-6xl">
              Vertrauen, das
              <br />
              sichtbar wird
            </h2>

            <div className="mt-8 flex items-end gap-5">
              <div className="text-6xl font-light leading-none">
                {reviews.rating.toFixed(1)}
              </div>

              <div className="pb-1">
                <Stars count={5} />
                <p className="mt-2 text-sm text-black/55">
                  {reviews.total} Bewertungen · {reviews.sourceLabel}
                </p>
              </div>
            </div>

            <p className="mt-8 max-w-md text-base leading-8 text-black/60">
              Gute Bilder verkaufen nicht allein. Gute Erfahrungen tun es auch.
              Deshalb gehört sichtbares Vertrauen auf eine starke Fotografen-Seite.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/kontakt"
                className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-85"
              >
                Shooting anfragen
              </Link>

              <a
                href="https://www.google.com/search?q=R.ArtPhotographie+Kaufbeuren"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-black/12 px-6 py-3 text-sm text-black transition hover:border-black/25 hover:bg-black/5"
              >
                Bei Google ansehen
              </a>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            <article className="lg:col-span-7">
              <div className="max-w-3xl">
                <Stars count={featured.stars} />
                <p className="mt-6 text-[1.5rem] font-light leading-[1.45] md:text-[1.9rem]">
                  “{featured.text}”
                </p>
                <p className="mt-6 text-sm uppercase tracking-[0.28em] text-black/42">
                  {featured.name}
                </p>
              </div>
            </article>

            <div className="grid gap-8 lg:col-span-5">
              {sideItems.map((item) => (
                <article key={item.name}>
                  <Stars count={item.stars} />
                  <p className="mt-4 text-base leading-8 text-black/65">
                    “{item.text}”
                  </p>
                  <p className="mt-4 text-xs uppercase tracking-[0.28em] text-black/42">
                    {item.name}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-x-12 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {bottomItems.map((item) => (
            <article key={item.name} className="max-w-[32rem]">
              <Stars count={item.stars} />
              <p className="mt-4 text-base leading-8 text-black/65">
                “{item.text}”
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.28em] text-black/42">
                {item.name}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
