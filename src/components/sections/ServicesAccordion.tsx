import Image from "next/image";
import Link from "next/link";

type Service = {
  title: string;
  text: string;
  href: string;
  image: string;
  alt: string;
};

const services: Service[] = [
  {
    title: "Portrait",
    text: "Du musst vor der Kamera nichts können. Ich leite dich so an, dass Portraits entstehen, in denen du dich wiedererkennst.",
    href: "/preise#portrait",
    image: "/images/portrait/portrait-2.jpg",
    alt: "Fotografin Kaufbeuren Portraitshooting R.ArtPhotographie",
  },
  {
    title: "Familie",
    text: "Familienfotos, Babybauch und Newborn ohne Druck, mit genug Zeit für Nähe, Pausen und kleine Situationen.",
    href: "/familienfotograf-kaufbeuren",
    image: "/images/family/family-2.jpg",
    alt: "Familienfotografie Allgäu R.ArtPhotographie",
  },
  {
    title: "Hochzeiten",
    text: "Euer Tag wird aufmerksam begleitet, ohne ihn zu inszenieren. Wichtig sind Bilder, die sich nach euch anfühlen.",
    href: "/preise#hochzeit-mini",
    image: "/images/weddings/wedding-3.jpg",
    alt: "Hochzeitsfotografin Allgäu R.ArtPhotographie",
  },
  {
    title: "Babybauch",
    text: "Babybauchbilder, die sich nicht gestellt anfühlen: schlicht, nah und mit einem Blick für das, was dir wichtig ist.",
    href: "/babybauch-shooting-kaufbeuren",
    image: "/images/babybauch/babybauch-1.jpg",
    alt: "Babybauch Shooting Kaufbeuren R.ArtPhotographie",
  },
  {
    title: "Gutscheine",
    text: "Ein Wertgutschein für ein Shooting, das sorgfältig vorbereitet wird und nicht wie ein Standardgeschenk wirkt.",
    href: "/gutscheine",
    image: "/images/gutschein/gutschein-main.jpg",
    alt: "Fotogutschein Kaufbeuren R.ArtPhotographie",
  },
];

export default function ServicesAccordion() {
  return (
    <section className="bg-sand-deep px-[var(--shell-x)] py-24 md:py-32">
      <div className="mx-auto max-w-[110rem]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow rise text-ink/55">Leistungen</p>
            {/*
              Vorher: "Klar positioniert. Sauber inszeniert." – zwei
              Behauptungen ohne Aussage, die für jeden Fotografen gelten.
            */}
            <h2 className="display-lg rise mt-5 max-w-2xl text-ink">
              Für die Momente,
              <br />
              die <span className="accent-italic">bleiben</span>
            </h2>
          </div>

          <p className="rise max-w-sm text-base leading-8 text-ink/70">
            Fünf Anlässe, feste Preise ab 200 €. Alles mit 40 bearbeiteten
            Bildern und ohne versteckte Kosten.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:flex lg:h-[620px] lg:gap-3 xl:h-[660px]">
          {services.map((service) => (
            <article
              key={service.title}
              className="group/service relative min-h-[390px] overflow-hidden bg-ink/10 transition-[flex,filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:min-h-[460px] lg:min-h-0 lg:flex-[1_1_0%] lg:focus-within:flex-[2.75_1_0%] lg:hover:flex-[2.75_1_0%]"
            >
              <Link
                href={service.href}
                className="block h-full min-h-[390px] outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-4 focus-visible:ring-offset-sand sm:min-h-[460px] lg:min-h-0"
                aria-label={`${service.title} ansehen`}
              >
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                  className="h-full w-full object-cover grayscale-[35%] saturate-[0.78] transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/service:scale-[1.035] group-hover/service:grayscale-0 group-hover/service:saturate-100 group-focus-within/service:scale-[1.035] group-focus-within/service:grayscale-0 group-focus-within/service:saturate-100 motion-reduce:transition-none"
                />

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.46)_34%,rgba(0,0,0,0.14)_66%,rgba(0,0,0,0.02)_100%)]" />
                <div className="pointer-events-none absolute inset-0 bg-ink/8 opacity-100 transition duration-700 group-hover/service:opacity-0 group-focus-within/service:opacity-0 motion-reduce:transition-none" />

                <div className="absolute inset-x-0 bottom-0 p-6 text-paper md:p-7 lg:p-6 xl:p-8">
                  <p className="text-xs uppercase tracking-[0.28em] text-paper/80">
                    R.ArtPhotographie
                  </p>

                  <h3 className="mt-3 text-3xl font-medium leading-none text-paper md:text-4xl lg:text-[2.05rem] xl:text-4xl">
                    {service.title}
                  </h3>

                  <p className="mt-4 max-w-[22rem] text-sm leading-7 text-paper/82 transition duration-500 group-hover/service:translate-y-0 group-hover/service:text-paper/92 group-focus-within/service:translate-y-0 group-focus-within/service:text-paper/92 motion-reduce:transition-none lg:translate-y-4 lg:opacity-90">
                    {service.text}
                  </p>

                  <span className="mt-6 inline-flex min-h-[46px] items-center rounded-full bg-paper/12 px-5 py-3 text-sm font-medium text-paper backdrop-blur transition duration-300 group-hover/service:bg-white group-hover/service:text-ink group-focus-within/service:bg-white group-focus-within/service:text-ink motion-reduce:transition-none">
                    Ansehen
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
