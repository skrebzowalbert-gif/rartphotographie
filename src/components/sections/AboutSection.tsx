import Link from "next/link";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="px-6 py-16 md:px-10 md:py-28 xl:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center xl:grid-cols-[minmax(0,1fr)_480px] xl:gap-20">
          <div className="relative mx-auto w-full max-w-[420px] lg:order-2 lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] md:rounded-[2.4rem]">
              <Image
                src="/images/about/regina_about1.jpg"
                alt="Fotografin Regina von R.ArtPhotographie in Kaufbeuren"
                fill
                sizes="(max-width: 1024px) 420px, 480px"
                className="h-full w-full object-cover object-[38%_center]"
              />
            </div>

            <div className="mt-4 hidden items-center justify-between gap-5 text-xs uppercase tracking-[0.24em] text-black/38 lg:flex">
              <span>R.ArtPhotographie</span>
              <span>Kaufbeuren</span>
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-black/38">
              Über Regina
            </p>

            <h2 className="mt-5 max-w-4xl text-[2.25rem] font-light leading-[1] min-[380px]:text-[2.45rem] md:text-6xl md:leading-[0.98]">
              Fotografie mit
              <br />
              Gefühl, Ruhe
              <br />
              und klarer Handschrift
            </h2>

            <div className="mt-7 grid gap-5 text-base leading-8 text-black/66 md:mt-8 md:text-lg md:leading-9 xl:grid-cols-2">
              <p>
                Ich fotografiere Menschen nicht einfach nur schön, sondern so,
                dass Bilder entstehen, die wirklich zu ihnen passen. Mein Fokus
                liegt auf einer klaren Bildsprache, einer ruhigen Atmosphäre
                beim Shooting und Ergebnissen, die hochwertig wirken statt
                gestellt.
              </p>

              <p>
                Ob Portrait, Familie oder Hochzeit: Mir ist wichtig, dass echte
                Momente sichtbar werden und du dich vor der Kamera sicher
                fühlst. Genau daraus entstehen Aufnahmen, die nicht beliebig
                aussehen, sondern Charakter haben.
              </p>
            </div>

            <div className="mt-10 grid gap-5 border-y border-black/10 py-6 md:mt-12 md:grid-cols-3 md:py-7">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-black/38">
                  Stil
                </p>
                <p className="mt-3 text-sm leading-7 text-black/68">
                  Klar, hochwertig und ohne künstliche Übertreibung.
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-black/38">
                  Ablauf
                </p>
                <p className="mt-3 text-sm leading-7 text-black/68">
                  Ruhige Begleitung, klare Abstimmung und entspannte Führung.
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-black/38">
                  Ergebnis
                </p>
                <p className="mt-3 text-sm leading-7 text-black/68">
                  Bilder mit Substanz, Emotion und professioneller Wirkung.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/kontakt"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto"
                style={{ color: "#ffffff" }}
              >
                Shooting anfragen
              </Link>

              <Link
                href="/galerie"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/25 bg-transparent px-7 py-3 text-sm font-semibold text-[#1f1714] transition hover:border-black/40 hover:bg-transparent hover:text-[#1f1714] sm:w-auto"
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
