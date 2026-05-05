import Link from "next/link";

export default function VoucherOptions() {
  return (
    <section className="mt-24 px-6 md:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2">
        
        {/* OPTION 1 */}
        <div className="group relative overflow-hidden rounded-[28px] bg-[#f4efe8] p-10 transition hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="max-w-[420px]">
            <h3 className="text-[32px] leading-tight">
              Gutschein für ein Shooting
            </h3>

            <p className="mt-4 text-black/60 leading-8">
              Verschenke ein fertiges Erlebnis – von Portrait bis Familienshooting.
              Ein Moment, der bleibt.
            </p>

            <div className="mt-8">
              <Link
                href="/gutscheine#checkout"
                className="inline-flex h-[52px] items-center justify-center rounded-full bg-black px-6 text-sm text-white transition hover:opacity-90"
              >
                Shooting-Gutschein kaufen
              </Link>
            </div>
          </div>
        </div>

        {/* OPTION 2 */}
        <div className="group relative overflow-hidden rounded-[28px] bg-[#f4efe8] p-10 transition hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="max-w-[420px]">
            <h3 className="text-[32px] leading-tight">
              Wertgutschein
            </h3>

            <p className="mt-4 text-black/60 leading-8">
              Flexibel einsetzbar – der Beschenkte entscheidet selbst,
              welcher Moment fotografiert werden soll.
            </p>

            <div className="mt-8">
              <Link
                href="/gutscheine#checkout"
                className="inline-flex h-[52px] items-center justify-center rounded-full border border-black/20 px-6 text-sm transition hover:bg-black hover:text-white"
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
