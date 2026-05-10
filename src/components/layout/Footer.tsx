import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-black/10 bg-[#e7dfd3] px-6 py-10 text-black md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-sm text-black/60 md:flex-row">
        
        {/* LINKS */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          <Link href="/fotografin-kaufbeuren" className="hover:text-black">
            Fotografin Kaufbeuren
          </Link>

          <Link href="/fotografin-allgaeu" className="hover:text-black">
            Fotografin Allgäu
          </Link>

          <Link href="/gutscheine" className="hover:text-black">
            Gutscheine
          </Link>

          <Link href="/kontakt" className="hover:text-black">
            Kontakt
          </Link>

          <Link href="/partner" className="hover:text-black">
            Partner
          </Link>

          <Link href="/impressum" className="hover:text-black">
            Impressum
          </Link>

          <Link href="/datenschutz" className="hover:text-black">
            Datenschutz
          </Link>
        </div>

        {/* TEXT */}
        <div className="text-center leading-7 md:text-right">
          <p>© {new Date().getFullYear()} R.ArtPhotographie</p>
          <p className="text-black/58">Fotografin in Kaufbeuren & Allgäu</p>
          <p className="text-black/48">
            Portrait · Hochzeit · Familie · Babybauch · Newborn
          </p>
          <p className="text-black/48">
            Kaufbeuren · Kempten · Marktoberdorf · Füssen · Allgäu
          </p>
        </div>
      </div>
    </footer>
  );
}
