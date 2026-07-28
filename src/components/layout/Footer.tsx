import Link from "next/link";
import {
  areaServed,
  business,
  instagramUrl,
  phoneDisplay,
  phoneHref,
  publicContactEmail,
} from "@/lib/site";

const serviceLinks = [
  { href: "/babybauch-shooting-kaufbeuren", label: "Babybauch Shooting Kaufbeuren" },
  { href: "/newborn-fotograf-kaufbeuren", label: "Newborn Fotograf Kaufbeuren" },
  { href: "/familienfotograf-kaufbeuren", label: "Familienfotograf Kaufbeuren" },
  { href: "/preise#portrait", label: "Portraitshooting" },
  { href: "/preise#hochzeit-mini", label: "Hochzeitsfotografie" },
];

const siteLinks = [
  { href: "/galerie", label: "Galerie" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/preise", label: "Preise" },
  { href: "/gutscheine", label: "Gutscheine" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/ueber-mich", label: "Über mich" },
  { href: "/fotografin-kaufbeuren", label: "Fotograf Kaufbeuren" },
  { href: "/fotografin-allgaeu", label: "Fotograf Allgäu" },
  { href: "/partner", label: "Partner" },
];

const legalLinks = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB" },
  { href: "/widerruf", label: "Widerrufsbelehrung" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 bg-sand px-6 py-14 text-black md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/*
            NAP-Block (Name, Adresse, Telefon). Muss zeichengenau mit dem
            Google-Unternehmensprofil und allen Branchenverzeichnissen
            übereinstimmen – Abweichungen kosten lokale Sichtbarkeit.
          */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em]">
              R.ArtPhotographie
            </p>
            <address className="mt-4 not-italic text-sm leading-7 text-black/70">
              {business.legalName}
              <br />
              {business.street}
              <br />
              {business.postalCode} {business.city}
              <br />
              {business.region}, Deutschland
            </address>

            <div className="mt-4 flex flex-col gap-1 text-sm">
              {phoneHref && (
                <a
                  href={phoneHref}
                  className="font-medium text-black underline underline-offset-4 hover:opacity-70"
                >
                  {phoneDisplay}
                </a>
              )}
              <a
                href={`mailto:${publicContactEmail}`}
                className="break-words text-black/70 underline underline-offset-4 hover:text-black [overflow-wrap:anywhere]"
              >
                {publicContactEmail}
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-black/70 underline underline-offset-4 hover:text-black"
              >
                Instagram
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em]">
              Shootings
            </p>
            <ul className="mt-4 space-y-2 text-sm text-black/70">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-black">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em]">
              Seiten
            </p>
            <ul className="mt-4 space-y-2 text-sm text-black/70">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-black">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em]">
              Einzugsgebiet
            </p>
            <p className="mt-4 text-sm leading-7 text-black/70">
              {areaServed.join(" · ")}
            </p>

            <Link
              href="/kontakt"
              className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-black/85"
            >
              Shooting anfragen
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-black/10 pt-6 text-sm text-black/65 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} R.ArtPhotographie · Fotograf in
            Kaufbeuren &amp; im Allgäu
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-black">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
