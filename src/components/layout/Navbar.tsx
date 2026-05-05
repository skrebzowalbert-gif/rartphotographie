"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { instagramUrl } from "@/lib/site";

const mainNavItems = [
  { href: "/", label: "Start" },
  { href: "/galerie", label: "Galerie" },
  { href: "/preise", label: "Preise" },
  { href: "/gutscheine", label: "Gutscheine" },
  { href: "/kontakt", label: "Kontakt" },
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

  const useSolidStyle = !isHome || scrolled;
  const toggleMenu = () => setMenuOpen((open) => !open);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`pointer-events-auto fixed left-0 top-0 z-[99998] w-full transition-all duration-300 ${
        useSolidStyle
          ? "border-b border-black/8 bg-[#e7dfd3]/92 text-black backdrop-blur-md"
          : "bg-transparent text-white"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex items-center justify-between py-4 md:py-5">
          <Link
            href="/"
            className={`text-xs font-semibold uppercase tracking-[0.28em] transition sm:text-sm sm:tracking-[0.35em] ${
              useSolidStyle ? "text-black" : "text-white"
            }`}
          >
            R.ArtPhotographie
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition ${
                    useSolidStyle
                      ? isActive
                        ? "text-black"
                        : "text-black/65 hover:text-black"
                      : isActive
                      ? "text-white"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={menuOpen}
            onClick={(event) => {
              event.stopPropagation();
              toggleMenu();
            }}
            onTouchEnd={(event) => {
              event.preventDefault();
              event.stopPropagation();
              toggleMenu();
            }}
            className={`pointer-events-auto relative z-[100000] flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border transition md:hidden ${
              useSolidStyle
                ? "border-black/14 bg-black/[0.03]"
                : "border-white/22 bg-black/10"
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

          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className={`hidden rounded-full px-4 py-2 text-sm transition sm:inline-flex ${
              useSolidStyle
                ? "border border-black/15 bg-black/[0.03] text-black hover:border-black/30 hover:bg-black/[0.06]"
                : "border border-white/20 bg-white/8 text-white hover:border-white/40 hover:bg-white/12"
            }`}
          >
            Instagram
          </a>
        </div>
      </div>

      {menuOpen && (
        <div className="pointer-events-auto fixed inset-0 z-[99999] md:hidden">
          <button
            type="button"
            aria-label="Menü schließen"
            onClick={closeMenu}
            onTouchEnd={(event) => {
              event.preventDefault();
              event.stopPropagation();
              closeMenu();
            }}
            className="absolute inset-0 h-full w-full bg-black/20"
          />

          <nav className="pointer-events-auto fixed inset-x-4 top-24 z-[100000] flex flex-col overflow-hidden rounded-md border border-black/10 bg-[#e7dfd3] p-4 text-black shadow-[0_24px_70px_rgba(0,0,0,0.22)]">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="border-b border-black/8 py-4 text-[0.95rem] uppercase tracking-[0.22em] text-black/82 transition hover:text-black"
              >
                {item.label}
              </Link>
            ))}

            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              className="py-4 text-[0.95rem] uppercase tracking-[0.22em] text-black/82 transition hover:text-black"
            >
              Instagram
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
