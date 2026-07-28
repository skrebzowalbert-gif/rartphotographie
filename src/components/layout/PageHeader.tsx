import Image from "next/image";
import Link from "next/link";
import { phoneDisplay, phoneHref } from "@/lib/site";

type Action = { href: string; label: string };

/**
 * Gemeinsamer Seitenkopf für alle Unterseiten.
 *
 * Vorher erfand jede Seite ihr eigenes Layout: mal `text-4xl font-light`,
 * mal `text-3xl font-semibold`, mal ein abgerundeter Bildrahmen, mal keiner.
 * Das ist der Hauptgrund, warum die Seiten nicht wie ein Auftritt wirkten,
 * sondern wie einzeln zusammengesetzte Vorlagen.
 *
 * Zwei Varianten:
 * - mit Bild: randlos, wie auf der Startseite
 * - ohne Bild: ruhiger Textkopf für Rechts- und Übersichtsseiten
 */
export default function PageHeader({
  eyebrow,
  heading,
  accent,
  intro,
  meta,
  image,
  primaryAction,
  showPhone = false,
  children,
}: {
  eyebrow: string;
  /** Erster Teil der Überschrift. */
  heading: string;
  /** Kursiv gesetzter Schlussteil der Überschrift. */
  accent?: string;
  intro?: string;
  /** Eine Zeile mit Eckdaten unter den Aktionen. */
  meta?: React.ReactNode;
  image?: { src: string; alt: string };
  primaryAction?: Action;
  showPhone?: boolean;
  children?: React.ReactNode;
}) {
  const text = (
    <div
      className={
        image
          ? "order-2 flex flex-col justify-center px-[var(--shell-x)] pb-14 pt-10 lg:order-1 lg:py-24 lg:pr-0"
          : "mx-auto max-w-[110rem] px-[var(--shell-x)] pb-14 pt-12 md:pb-20 md:pt-16"
      }
    >
      <p className="eyebrow rise text-ink/55">{eyebrow}</p>

      <h1 className="display-hero rise mt-6 max-w-3xl text-ink">
        {heading}
        {accent && (
          <>
            {" "}
            <span className="accent-italic">{accent}</span>
          </>
        )}
      </h1>

      {intro && (
        <p className="rise mt-7 max-w-2xl text-lg leading-8 text-ink/75">
          {intro}
        </p>
      )}

      {(primaryAction || showPhone) && (
        <div className="rise mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          {primaryAction && (
            <Link
              href={primaryAction.href}
              className="group inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full bg-ink px-8 text-base font-medium text-paper transition-colors duration-500 hover:bg-ink-soft"
            >
              {primaryAction.label}
              <span
                aria-hidden="true"
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          )}

          {showPhone && phoneHref && (
            <a
              href={phoneHref}
              className="link-sweep self-start text-base font-medium text-ink/80 sm:ml-4 sm:self-auto"
            >
              {phoneDisplay}
            </a>
          )}
        </div>
      )}

      {meta && (
        <p className="rise mt-8 border-t border-ink/12 pt-6 text-sm text-ink/62">
          {meta}
        </p>
      )}

      {children}
    </div>
  );

  if (!image) {
    return <header className="bg-sand">{text}</header>;
  }

  return (
    <header className="relative overflow-hidden bg-sand">
      <div className="mx-auto grid max-w-[110rem] items-stretch lg:min-h-[76svh] lg:grid-cols-[1fr_1fr]">
        <div className="relative order-1 h-[42svh] min-h-[300px] w-full lg:order-2 lg:h-auto">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="drift object-cover"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,var(--color-sand),transparent)] lg:hidden" />
        </div>
        {text}
      </div>
    </header>
  );
}
