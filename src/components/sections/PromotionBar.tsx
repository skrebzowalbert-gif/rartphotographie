import Link from "next/link";
import type { SanityPromotion } from "@/sanity/queries";

type PromotionBarProps = {
  promotion?: SanityPromotion | null;
};

function isExternalLink(href: string) {
  return /^https?:\/\//i.test(href);
}

export default function PromotionBar({ promotion }: PromotionBarProps) {
  if (!promotion) return null;

  const hasLink = Boolean(promotion.buttonText && promotion.buttonLink);
  const badge = promotion.badge || promotion.title;

  return (
    <section className="bg-[#15110e] px-4 py-3 text-[#f6efe4] md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center">
          <span className="inline-flex w-fit border-b border-[#f6efe4]/28 pb-1 text-[0.68rem] uppercase tracking-[0.28em] text-[#f6efe4]/66">
            {badge}
          </span>
          <p className="max-w-3xl text-sm leading-6 text-[#f6efe4]/82 md:text-[15px]">
            {promotion.text}
          </p>
        </div>

        {hasLink && promotion.buttonLink && promotion.buttonText && (
          isExternalLink(promotion.buttonLink) ? (
            <a
              href={promotion.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-full border border-[#f6efe4]/20 px-5 py-2 text-sm font-medium text-[#f6efe4] transition hover:border-[#f6efe4]/45 hover:bg-white/8"
            >
              {promotion.buttonText}
            </a>
          ) : (
            <Link
              href={promotion.buttonLink}
              className="inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-full border border-[#f6efe4]/20 px-5 py-2 text-sm font-medium text-[#f6efe4] transition hover:border-[#f6efe4]/45 hover:bg-white/8"
            >
              {promotion.buttonText}
            </Link>
          )
        )}
      </div>
    </section>
  );
}
