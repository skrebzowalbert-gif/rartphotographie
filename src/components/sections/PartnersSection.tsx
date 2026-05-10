import Image from "next/image";
import type { SanityPartner, SanityPartnerCategory } from "@/sanity/queries";

export const partnerCategoryLabels: Record<SanityPartnerCategory, string> = {
  location: "Location",
  cake: "Hochzeitstorte",
  video: "Video",
  makeup: "Make-up",
  florist: "Floristik",
  "bridal-fashion": "Brautmode",
  music: "Musik / DJ",
  vehicle: "Fahrzeug",
  other: "Partner",
};

function getPartnerCategoryLabel(category?: string) {
  if (!category) return "Partner";

  return (
    partnerCategoryLabels[category as SanityPartnerCategory] ||
    category.replace(/-/g, " ")
  );
}

type PartnersSectionProps = {
  partners: SanityPartner[];
  eyebrow?: string;
  title?: string;
  intro?: string;
  compact?: boolean;
};

export default function PartnersSection({
  partners,
  eyebrow = "Partner",
  title = "Vertrauensvolle Zusammenarbeit mit",
  intro = "Eine kleine Auswahl an Partnern rund um Shootings, Hochzeiten und besondere Momente.",
  compact = false,
}: PartnersSectionProps) {
  if (!partners.length) return null;

  const logoPartners = partners.filter(
    (partner): partner is SanityPartner & { logoUrl: string } =>
      Boolean(partner.logoUrl)
  );
  const featuredPartner =
    partners.find((partner) => partner.isClosePartner) ||
    partners.find((partner) => partner.isFeatured);
  const remainingPartners = featuredPartner
    ? partners.filter((partner) => partner.id !== featuredPartner.id)
    : partners;

  return (
    <section
      className={`px-6 md:px-10 ${compact ? "py-12" : "py-16 md:py-20"}`}
    >
      <div className="mx-auto max-w-7xl border-y border-black/10 py-10 md:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.34em] text-black/38">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-light leading-tight md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-black/62">
            {intro}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-6xl">
            {logoPartners.length > 0 && (
              <div className="mb-10 overflow-x-auto">
                <div className="flex min-w-max items-center justify-center gap-x-10 border-y border-black/10 py-7 pr-4 sm:min-w-0 sm:flex-wrap sm:gap-x-12 sm:gap-y-6">
                  {logoPartners.map((partner) => (
                    <div
                      key={`logo-${partner.id}`}
                      className="relative h-11 w-36 shrink-0 opacity-45 grayscale transition hover:opacity-90 hover:grayscale-0"
                      title={partner.name}
                    >
                      <Image
                        src={partner.logoUrl}
                        alt={`${partner.name} Logo`}
                        fill
                        sizes="144px"
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {featuredPartner && (
              <article className="relative mb-8 border border-black/35 bg-transparent px-5 py-5 md:px-7 md:py-6">
                <div className="absolute right-0 top-0 translate-y-[-1px]">
                  <span className="inline-flex rounded-full border border-black/15 px-3 py-1 text-xs text-black/58">
                    {featuredPartner.isClosePartner
                      ? "Engster Partner"
                      : "Empfohlen"}
                  </span>
                </div>

                <div className="grid gap-5 pt-4 md:grid-cols-[96px_1fr] md:items-start md:gap-6 md:pt-0">
                  {featuredPartner.logoUrl && (
                    <div className="relative h-16 w-24 opacity-75 grayscale transition hover:opacity-95 hover:grayscale-0">
                      <Image
                        src={featuredPartner.logoUrl}
                        alt={`${featuredPartner.name} Logo`}
                        fill
                        sizes="96px"
                        className="object-contain object-left"
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-3">
                      <h3 className="text-xl font-medium leading-tight md:text-2xl">
                        {featuredPartner.name}
                      </h3>
                      <p className="text-xs uppercase tracking-[0.22em] text-black/42">
                        {getPartnerCategoryLabel(featuredPartner.category)}
                      </p>
                    </div>

                    {featuredPartner.description && (
                      <p className="mt-5 text-sm leading-7 text-black/64 md:text-base md:leading-8">
                        {featuredPartner.description}
                      </p>
                    )}

                    {featuredPartner.websiteUrl && (
                      <a
                        href={featuredPartner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex min-h-[42px] items-center justify-center border-t border-black/14 pt-4 text-sm font-semibold text-[#1f1714] transition hover:text-black/70"
                      >
                        Website ansehen
                      </a>
                    )}
                  </div>
                </div>
              </article>
            )}

            {remainingPartners.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {remainingPartners.map((partner) => (
                  <article
                    key={partner.id}
                    className="flex min-h-full flex-col border border-black/12 px-5 py-5"
                  >
                    <div className="grid grid-cols-[64px_1fr] gap-4">
                      {partner.logoUrl ? (
                        <div className="relative h-10 w-16 opacity-70 grayscale transition hover:opacity-95 hover:grayscale-0">
                          <Image
                            src={partner.logoUrl}
                            alt={`${partner.name} Logo`}
                            fill
                            sizes="64px"
                            className="object-contain object-left"
                          />
                        </div>
                      ) : (
                        <div aria-hidden="true" />
                      )}

                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-black/40">
                          {getPartnerCategoryLabel(partner.category)}
                        </p>
                        <h3 className="mt-2 text-lg font-medium leading-tight">
                          {partner.name}
                        </h3>
                      </div>
                    </div>

                    {partner.description && (
                      <p className="mt-3 text-sm leading-7 text-black/62">
                        {partner.description}
                      </p>
                    )}

                    {partner.websiteUrl && (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex border-t border-black/12 pt-4 text-sm font-semibold text-[#1f1714] transition hover:text-black/70"
                      >
                        Website ansehen
                      </a>
                    )}
                  </article>
                ))}
              </div>
            )}

            <p className="mt-7 border-t border-black/10 pt-5 text-xs leading-6 text-black/45">
              Externe Leistungen werden direkt über den jeweiligen Partner
              angeboten. Es gelten die Bedingungen des jeweiligen Anbieters.
            </p>
        </div>
      </div>
    </section>
  );
}
