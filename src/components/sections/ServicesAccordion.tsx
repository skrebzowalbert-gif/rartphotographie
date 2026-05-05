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
    text: "Editoriale Looks, klare Bildsprache und natürliche Wirkung statt Standard-Posen.",
    href: "/galerie",
    image: "/images/portrait/portrait-2.jpg",
    alt: "Fotografin Kaufbeuren Portraitshooting R.ArtPhotographie",
  },
  {
    title: "Familie",
    text: "Familienfotos, Babybauch und Newborn in einer ruhigen, persönlichen und hochwertigen Bildsprache.",
    href: "/preise#familie",
    image: "/images/family/family-1.jpg",
    alt: "Familienfotografie Allgäu R.ArtPhotographie",
  },
  {
    title: "Hochzeiten",
    text: "Emotionale Erinnerungen, hochwertig fotografiert und ohne kitschige Wirkung.",
    href: "/galerie",
    image: "/images/weddings/wedding-3.jpg",
    alt: "Hochzeitsfotografin Allgäu R.ArtPhotographie",
  },
  {
    title: "Babybauch",
    text: "Ruhige, ästhetische Babybauch-Shootings mit klarer Linienführung und Gefühl.",
    href: "/preise#babybauch",
    image: "/images/babybauch/babybauch-1.jpg",
    alt: "Babybauch Shooting Kaufbeuren R.ArtPhotographie",
  },
  {
    title: "Gutscheine",
    text: "Hochwertige Fotogutscheine als Geschenk für besondere Momente.",
    href: "/gutscheine",
    image: "/images/gutschein/gutschein-main.jpg",
    alt: "Fotogutschein Kaufbeuren R.ArtPhotographie",
  },
];

export default function ServicesAccordion() {
  return (
    <section className="px-6 py-24 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm uppercase tracking-[0.32em] text-black/38">
          Leistungen
        </p>

        <h2 className="mt-4 max-w-4xl text-4xl font-light leading-[1] md:text-6xl">
          Klar positioniert.
          <br />
          Sauber inszeniert.
        </h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:flex lg:h-[620px] lg:gap-3 xl:h-[660px]">
          {services.map((service) => (
            <article
              key={service.title}
              className="group/service relative min-h-[390px] overflow-hidden rounded-[1.65rem] bg-black/10 shadow-[0_22px_70px_rgba(33,24,17,0.08)] transition-[flex,filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:min-h-[460px] lg:min-h-0 lg:flex-[1_1_0%] lg:focus-within:flex-[2.75_1_0%] lg:hover:flex-[2.75_1_0%]"
            >
              <Link
                href={service.href}
                className="block h-full min-h-[390px] rounded-[1.65rem] outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-4 focus-visible:ring-offset-[#e7dfd3] sm:min-h-[460px] lg:min-h-0"
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
                <div className="pointer-events-none absolute inset-0 bg-black/8 opacity-100 transition duration-700 group-hover/service:opacity-0 group-focus-within/service:opacity-0 motion-reduce:transition-none" />

                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-7 lg:p-6 xl:p-8">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/66">
                    R.ArtPhotographie
                  </p>

                  <h3 className="mt-3 text-3xl font-medium leading-none text-white md:text-4xl lg:text-[2.05rem] xl:text-4xl">
                    {service.title}
                  </h3>

                  <p className="mt-4 max-w-[22rem] text-sm leading-7 text-white/82 transition duration-500 group-hover/service:translate-y-0 group-hover/service:text-white/92 group-focus-within/service:translate-y-0 group-focus-within/service:text-white/92 motion-reduce:transition-none lg:translate-y-4 lg:opacity-90">
                    {service.text}
                  </p>

                  <span className="mt-6 inline-flex min-h-[46px] items-center rounded-full bg-white/12 px-5 py-3 text-sm font-medium text-white backdrop-blur transition duration-300 group-hover/service:bg-white group-hover/service:text-black group-focus-within/service:bg-white group-focus-within/service:text-black motion-reduce:transition-none">
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
