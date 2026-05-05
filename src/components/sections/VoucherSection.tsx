import Link from "next/link";
import Image from "next/image";

type VoucherSectionProps = {
  compact?: boolean;
};

export default function VoucherSection({
  compact = false,
}: VoucherSectionProps) {
  return (
    <section
      className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden ${
        compact ? "mt-20 md:mt-24" : "mt-24 md:mt-32"
      }`}
    >
      <div className="relative min-h-[560px] md:min-h-[720px]">
        {/* Hintergrundbild ganzflächig */}
        <Image
          src="/images/gutschein/gutschein-main.jpg"
          alt="Fotoshooting Gutschein Kaufbeuren R.ArtPhotographie"
          fill
          sizes="100vw"
          className="object-cover object-[62%_center]"
        />

        {/* Verlauf von links nach rechts */}
        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(231,223,211,1) 0%, rgba(231,223,211,0.98) 24%, rgba(231,223,211,0.9) 36%, rgba(231,223,211,0.62) 50%, rgba(231,223,211,0.18) 66%, rgba(231,223,211,0) 78%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(231,223,211,0.96)_0%,rgba(231,223,211,0.9)_52%,rgba(35,28,24,0.18)_100%)] md:hidden" />

        {/* Inhalt auf normaler Breite */}
        <div className="relative z-10 flex min-h-[560px] items-center px-6 py-10 md:min-h-[720px] md:px-12 md:py-16">
          <div className="ml-0 max-w-[560px] md:ml-[6vw]">
            <p className="text-sm uppercase tracking-[0.34em] text-black/38">
              Gutscheine
            </p>

            <h2 className="mt-6 max-w-full leading-[1] md:leading-[0.95]">
  <span
    className="block text-[2.05rem] min-[380px]:text-[2.25rem] sm:text-[44px] md:text-[90px]"
    style={{
      fontFamily: '"Playfair Display", serif',
      fontWeight: 400,
      fontStyle: "italic",
      letterSpacing: "0",
    }}
  >
    Mit einem
  </span>

  <span
    className="block text-[2.05rem] min-[380px]:text-[2.25rem] sm:text-[44px] md:text-[90px]"
    style={{
      fontFamily: '"Playfair Display", serif',
      fontWeight: 400,
      fontStyle: "italic",
      letterSpacing: "0",
    }}
  >
    Geschenkgutschein
  </span>

  <span
    className="block text-[2.05rem] min-[380px]:text-[2.25rem] sm:text-[44px] md:text-[90px]"
    style={{
      fontFamily: '"Playfair Display", serif',
      fontWeight: 400,
      fontStyle: "italic",
      letterSpacing: "0",
    }}
  >
    Erinnerungen
  </span>

  <span
    className="block text-[2.05rem] min-[380px]:text-[2.25rem] sm:text-[44px] md:text-[90px]"
    style={{
      fontFamily: '"Playfair Display", serif',
      fontWeight: 400,
      fontStyle: "italic",
      letterSpacing: "0",
    }}
  >
    verschenken.
  </span>
</h2>

            <p className="mt-7 max-w-[34rem] text-base leading-8 text-black/68 md:mt-8 md:text-[18px] md:leading-9">
              Verschenke einen frei wählbaren Wertgutschein ab 50 € für
              Portrait, Familie, Schwangerschaft, Newborn oder Hochzeit.
            </p>

            <p className="mt-4 max-w-[34rem] text-base leading-8 text-black/68 md:mt-5 md:text-[18px] md:leading-9">
              Jeder Gutschein wird auf hochwertigem Papier vorbereitet und auf
              Wunsch per Post versendet.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-10 md:gap-4">
              <Link
                href="/gutscheine#checkout"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-black px-6 py-3 text-center text-sm font-medium text-white transition hover:opacity-90 md:min-h-[56px] md:px-8 md:py-4"
                style={{ color: "#ffffff" }}
              >
                Wertgutschein kaufen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
