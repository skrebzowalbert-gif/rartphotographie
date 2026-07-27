"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { phoneDisplay, phoneHref } from "@/lib/site";

const mainNavItems = [
  { href: "/", label: "Start" },
  { href: "/galerie", label: "Galerie" },
  { href: "/preise", label: "Preise" },
  { href: "/gutscheine", label: "Gutscheine" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hintergrund darf nicht scrollen, solange das Menü offen ist.
  useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const useSolidStyle = !isHome || scrolled;
  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        useSolidStyle
          ? "border-b border-black/8 bg-[#e7dfd3]/95 text-black backdrop-blur-md"
          : "bg-transparent text-white"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex items-center justify-between gap-4 py-4 md:py-5">
          <Link
            href="/"
            className={`text-xs font-semibold uppercase tracking-[0.28em] transition sm:text-sm sm:tracking-[0.35em] ${
              useSolidStyle ? "text-black" : "text-white"
            }`}
          >
            R.ArtPhotographie
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden items-center gap-8 md:flex">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-sm transition ${
                    useSolidStyle
                      ? isActive
                        ? "text-black"
                        : "text-black/75 hover:text-black"
                      : isActive
                      ? "text-white"
                      : "text-white/85 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Anrufen: für lokale Dienstleistungen der meistgenutzte Kontaktweg. */}
            {phoneHref && (
              <a
                href={phoneHref}
                aria-label={`Anrufen: ${phoneDisplay}`}
                className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition sm:inline-flex ${
                  useSolidStyle
                    ? "border-black/25 text-black hover:border-black/50"
                    : "border-white/45 text-white hover:border-white"
                }`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.5.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.4.57 3.5a1 1 0 0 1-.25 1z" />
                </svg>
                <span>Anrufen</span>
              </a>
            )}

            {/* Der auffälligste Button muss zur Anfrage führen, nicht zu Instagram. */}
            <Link
              href="/kontakt"
              className="hidden rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/85 sm:inline-flex"
            >
              Shooting anfragen
            </Link>

            <button
              type="button"
              aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={menuOpen}
              onClick={toggleMenu}
              className={`relative z-10 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border transition md:hidden ${
                useSolidStyle
                  ? "border-black/20 bg-black/[0.04]"
                  : "border-white/30 bg-black/15"
              }`}
            >
              <span className="flex w-4 flex-col gap-1.5">
                <span
                  className={`h-px w-full transition ${
                    useSolidStyle ? "bg-black" : "bg-white"
                  } ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`}
                />
                <span
                  className={`h-px w-full transition ${
                    useSolidStyle ? "bg-black" : "bg-white"
                  } ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Menü schließen"
            onClick={closeMenu}
            className="absolute inset-0 h-full w-full bg-black/30"
          />

          <nav
            aria-label="Mobile Navigation"
            className="fixed inset-x-4 top-24 z-50 flex flex-col overflow-hidden rounded-xl border border-black/10 bg-[#e7dfd3] p-4 text-black shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
          >
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="border-b border-black/8 py-4 text-[0.95rem] uppercase tracking-[0.22em] text-black/85 transition hover:text-black"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/kontakt"
              onClick={closeMenu}
              className="mt-4 inline-flex min-h-[52px] items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white"
            >
              Shooting anfragen
            </Link>

            {phoneHref && (
              <a
                href={phoneHref}
                onClick={closeMenu}
                className="mt-3 inline-flex min-h-[52px] items-center justify-center rounded-full border border-black/25 px-6 text-sm font-medium text-black"
              >
                {phoneDisplay} anrufen
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
