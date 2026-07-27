"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { phoneDisplay, phoneHref } from "@/lib/site";

/**
 * Dauerhaft sichtbare Kontaktleiste auf Mobilgeräten.
 *
 * Vorher gab es auf dem Handy keinen einzigen persistenten Kontaktweg – der
 * Nutzer musste erst das Burger-Menü öffnen. Bei lokalen Dienstleistungen ist
 * das der teuerste Klick, den man verlangen kann.
 */
export default function MobileCtaBar() {
  const pathname = usePathname();

  // Auf der Kontaktseite selbst wäre die Leiste nur im Weg.
  if (pathname === "/kontakt") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-[#e7dfd3]/97 px-4 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
      <div className="flex items-center gap-3 py-3">
        <Link
          href="/kontakt"
          className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white"
        >
          Shooting anfragen
        </Link>

        {phoneHref && (
          <a
            href={phoneHref}
            aria-label={`Anrufen: ${phoneDisplay}`}
            className="inline-flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full border border-black/25 text-black"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.5.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.57 3.5a1 1 0 0 1-.25 1z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
