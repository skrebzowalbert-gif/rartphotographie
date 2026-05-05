"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatEuro } from "@/lib/vouchers";

type FormState = {
  voucherId: "wert-custom";
  voucherCustomAmount: string;
  name: string;
  email: string;
  phone: string;
  recipient: string;
  message: string;
  street: string;
  zip: string;
  city: string;
};

type Status =
  | { type: "error"; message: string }
  | { type: "info"; message: string }
  | null;

const initialForm: FormState = {
  voucherId: "wert-custom",
  voucherCustomAmount: "",
  name: "",
  email: "",
  phone: "",
  recipient: "",
  message: "",
  street: "",
  zip: "",
  city: "",
};

export default function VoucherCheckout() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<Status>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customAmount = Number(form.voucherCustomAmount.replace(",", "."));
  const customAmountInCents = !Number.isNaN(customAmount)
    ? Math.round(customAmount * 100)
    : 0;
  const displayedAmount =
    customAmountInCents >= 5000 ? formatEuro(customAmountInCents) : "ab 50 €";

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setStatus(null);
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.voucherCustomAmount || customAmount < 50) {
      setStatus({
        type: "error",
        message: "Bitte gib einen Gutscheinbetrag ab 50 € ein.",
      });
      return;
    }

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.recipient.trim() ||
      !form.street.trim() ||
      !form.zip.trim() ||
      !form.city.trim()
    ) {
      setStatus({
        type: "error",
        message:
          "Bitte fülle alle Pflichtfelder aus: Name, E-Mail, Gutschein für wen und Versandadresse.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "info", message: "Checkout wird vorbereitet..." });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json().catch(() => null)) as {
        url?: string;
        error?: string;
      } | null;

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Checkout konnte nicht gestartet werden.");
      }

      window.location.href = data.url;
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Checkout konnte nicht gestartet werden.",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="checkout"
      className="relative z-10 scroll-mt-32 px-4 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-black/38">
              Direkt kaufen
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-light leading-[1] md:text-5xl">
              Wertgutschein auswählen und sicher bezahlen
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-black/64 md:text-lg">
              Du bestimmst den Betrag ab 50 €. Die Zahlung läuft sicher über
              Stripe Checkout; Zahlungsdaten werden nicht auf dieser Webseite
              gespeichert.
            </p>

            {searchParams.get("zahlung") === "abgebrochen" && (
              <p className="mt-5 rounded-lg border border-black/10 bg-white/24 px-4 py-3 text-sm leading-7 text-black/66">
                Die Zahlung wurde abgebrochen. Du kannst den Wertgutschein
                jederzeit erneut kaufen oder Regina direkt kontaktieren.
              </p>
            )}

            <div className="mt-10 border-y border-black/10 py-6">
              <p className="text-xs uppercase tracking-[0.28em] text-black/40">
                Wertgutschein
              </p>
              <p className="mt-3 text-3xl font-light text-black">
                {displayedAmount}
              </p>
              <p className="mt-4 text-sm leading-7 text-black/62">
                Der Gutschein wird persönlich vorbereitet und kann für
                Portrait, Familie, Babybauch, Newborn oder Hochzeit eingesetzt
                werden.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 rounded-md border border-black/10 bg-white/26 p-4 md:p-8"
          >
            <p className="text-sm uppercase tracking-[0.28em] text-black/40">
              Kaufdaten
            </p>
            <h3 className="mt-3 text-2xl font-light text-black">
              Wertgutschein R.ArtPhotographie
            </h3>

            <div className="mt-7 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm text-black/62">
                  Gewünschter Gutscheinbetrag *
                </span>
                <input
                  name="voucherCustomAmount"
                  type="number"
                  min="50"
                  step="1"
                  inputMode="decimal"
                  placeholder="z. B. 100 €"
                  value={form.voucherCustomAmount}
                  onChange={updateField}
                  className="min-h-[52px] w-full rounded-md border border-black/10 bg-white/76 px-4 text-base text-black outline-none placeholder:text-black/35 md:min-h-[56px]"
                  required
                />
              </label>

              <input
                name="name"
                placeholder="Name *"
                value={form.name}
                onChange={updateField}
                className="min-h-[52px] w-full rounded-md border border-black/10 bg-white/76 px-4 text-base text-black outline-none placeholder:text-black/35 md:min-h-[56px]"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="E-Mail *"
                value={form.email}
                onChange={updateField}
                className="min-h-[52px] w-full rounded-md border border-black/10 bg-white/76 px-4 text-base text-black outline-none placeholder:text-black/35 md:min-h-[56px]"
                required
              />
              <input
                name="phone"
                placeholder="Telefon (optional)"
                value={form.phone}
                onChange={updateField}
                className="min-h-[52px] w-full rounded-md border border-black/10 bg-white/76 px-4 text-base text-black outline-none placeholder:text-black/35 md:min-h-[56px]"
              />
              <input
                name="recipient"
                placeholder="Gutschein für wen? *"
                value={form.recipient}
                onChange={updateField}
                className="min-h-[52px] w-full rounded-md border border-black/10 bg-white/76 px-4 text-base text-black outline-none placeholder:text-black/35 md:min-h-[56px]"
                required
              />
              <textarea
                name="message"
                placeholder="Nachricht auf dem Gutschein (optional)"
                value={form.message}
                onChange={updateField}
                className="min-h-[120px] w-full rounded-md border border-black/10 bg-white/76 px-4 py-4 text-base text-black outline-none placeholder:text-black/35 md:min-h-[130px]"
              />
              <input
                name="street"
                placeholder="Straße und Hausnummer *"
                value={form.street}
                onChange={updateField}
                className="min-h-[52px] w-full rounded-md border border-black/10 bg-white/76 px-4 text-base text-black outline-none placeholder:text-black/35 md:min-h-[56px]"
                required
              />
              <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                <input
                  name="zip"
                  placeholder="PLZ *"
                  value={form.zip}
                  onChange={updateField}
                  className="min-h-[52px] w-full rounded-md border border-black/10 bg-white/76 px-4 text-base text-black outline-none placeholder:text-black/35 md:min-h-[56px]"
                  required
                />
                <input
                  name="city"
                  placeholder="Ort *"
                  value={form.city}
                  onChange={updateField}
                  className="min-h-[52px] w-full rounded-md border border-black/10 bg-white/76 px-4 text-base text-black outline-none placeholder:text-black/35 md:min-h-[56px]"
                  required
                />
              </div>

              {status && (
                <p
                  className={`rounded-xl border px-4 py-3 text-sm leading-7 ${
                    status.type === "error"
                      ? "border-black/12 bg-white/24 text-black/70"
                      : "border-black/10 bg-white/34 text-black/72"
                  }`}
                >
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ color: "#ffffff" }}
              >
                {isSubmitting ? "Weiter zu Stripe..." : "Wertgutschein kaufen"}
              </button>

              <p className="text-sm leading-7 text-black/52">
                Nach erfolgreicher Zahlung erhält Regina die Zahlungsdetails
                und bereitet den Wertgutschein persönlich vor.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
