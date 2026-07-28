import Link from "next/link";
import type { Metadata } from "next";
import { formatEuro } from "@/lib/vouchers";
import { formatGermanDate } from "@/lib/voucher-code";
import { loadPaidSession, toVoucherOrder } from "@/lib/voucher-order";
import { phoneDisplay, phoneHref, publicContactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gutschein gekauft",
  description: "Bestätigung des Gutschein-Kaufs bei R.ArtPhotographie.",
  robots: { index: false, follow: false },
};

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string | string[] }>;
};

export default async function GutscheinErfolgPage({
  searchParams,
}: SuccessPageProps) {
  const params = await searchParams;
  const raw = params.session_id;
  const sessionId = Array.isArray(raw) ? raw[0] : raw;
  const session = await loadPaidSession(sessionId);
  const order = session ? toVoucherOrder(session) : null;

  if (!order) {
    return (
      <main className="bg-sand text-ink">
        <section className="mx-auto max-w-3xl px-[var(--shell-x)] py-24 text-center md:py-32">
          <p className="eyebrow text-ink/55">Gutschein</p>
          <h1 className="display-lg mt-5 text-ink">Zahlung nicht bestätigt</h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-ink/75">
            Diese Seite lässt sich nur nach einer bestätigten Zahlung anzeigen.
            Falls du bereits bezahlt hast, melde dich kurz – wir finden die
            Bestellung.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/gutscheine#checkout"
              className="inline-flex min-h-[58px] items-center justify-center rounded-full bg-ink px-8 text-base font-medium text-paper transition-colors duration-500 hover:bg-ink-soft"
            >
              Kauf erneut starten
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex min-h-[58px] items-center justify-center rounded-full border border-ink/25 px-8 text-base font-medium text-ink transition-colors duration-500 hover:border-ink/55"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const downloadUrl = `/api/gutschein/pdf?session_id=${encodeURIComponent(
    order.sessionId
  )}`;

  return (
    <main className="bg-sand text-ink">
      <section className="mx-auto max-w-3xl px-[var(--shell-x)] py-20 md:py-28">
        <p className="eyebrow text-ink/55">Gutschein gekauft</p>
        <h1 className="display-lg mt-5 text-ink">
          Fertig. Dein Gutschein <span className="accent-italic">wartet</span>
        </h1>
        <p className="mt-7 text-lg leading-8 text-ink/75">
          Vielen Dank, {order.buyerName}. Du kannst den Gutschein sofort
          herunterladen und ausdrucken – zusätzlich liegt er als PDF in deinem
          E-Mail-Postfach.
        </p>

        {/*
          Der Download steht bewusst hier und nicht nur in der E-Mail: Damit
          kommt der Käufer auch dann an seinen Gutschein, wenn der Mailversand
          scheitert oder die Nachricht im Spam landet.
        */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={downloadUrl}
            className="group inline-flex min-h-[58px] items-center justify-center gap-3 rounded-full bg-ink px-8 text-base font-medium text-paper transition-colors duration-500 hover:bg-ink-soft"
          >
            Gutschein als PDF laden
            <span
              aria-hidden="true"
              className="transition-transform duration-500 group-hover:translate-y-0.5"
            >
              ↓
            </span>
          </a>
          <span className="text-sm text-ink/62">
            A4 quer · zum Ausdrucken oder digital weitergeben
          </span>
        </div>

        <dl className="mt-14 grid gap-x-10 gap-y-8 border-t border-ink/12 pt-8 sm:grid-cols-2">
          {[
            ["Gutscheincode", order.code],
            ["Wert", formatEuro(order.voucherAmount)],
            ["Gültig bis", formatGermanDate(order.validUntil)],
            ["Bestellnummer", order.orderNumber],
            ["Für", order.recipient || "—"],
            [
              "Zustellung",
              order.delivery === "post"
                ? "PDF sofort, zusätzlich per Post"
                : "PDF sofort per E-Mail",
            ],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="eyebrow text-ink/55">{label}</dt>
              <dd className="mt-2 text-lg text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        {order.delivery === "post" && (
          <p className="mt-8 border-l-2 border-ink/25 pl-5 text-base leading-7 text-ink/72">
            Der gedruckte Gutschein wird vorbereitet und an{" "}
            {[order.address.street, order.address.zip, order.address.city]
              .filter(Boolean)
              .join(", ")}{" "}
            geschickt.
          </p>
        )}

        <h2 className="display-lg mt-16 text-ink">Wie geht es weiter?</h2>
        <ol className="mt-8 space-y-6">
          {[
            "Gutschein ausdrucken oder digital weitergeben – beides funktioniert.",
            "Die beschenkte Person meldet sich mit dem Code und wünscht sich einen Termin.",
            "Wir stimmen Ablauf, Ort und Datum ab. Der Gutschein wird beim Shooting verrechnet.",
          ].map((step, index) => (
            <li key={step} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-medium text-paper">
                {index + 1}
              </span>
              <span className="text-base leading-7 text-ink/78">{step}</span>
            </li>
          ))}
        </ol>

        {/* Statt "Zur Startseite": der Moment höchster Kaufbereitschaft. */}
        <div className="mt-14 border-t border-ink/12 pt-10">
          <p className="text-lg leading-8 text-ink/75">
            Du willst selbst auch einen Termin? Dann melde dich gleich mit –
            unverbindlich.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/kontakt"
              className="group inline-flex min-h-[58px] items-center gap-3 rounded-full border border-ink/25 px-8 text-base font-medium text-ink transition-colors duration-500 hover:border-ink/55"
            >
              Shooting anfragen
              <span
                aria-hidden="true"
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            {phoneHref && (
              <a
                href={phoneHref}
                className="link-sweep text-base font-medium text-ink/80"
              >
                {phoneDisplay}
              </a>
            )}
          </div>
          <p className="mt-8 text-sm leading-6 text-ink/62">
            Fragen zur Bestellung? Schreib an{" "}
            <a
              href={`mailto:${publicContactEmail}`}
              className="underline underline-offset-4"
            >
              {publicContactEmail}
            </a>{" "}
            und nenne die Bestellnummer {order.orderNumber}.
          </p>
        </div>
      </section>
    </main>
  );
}
