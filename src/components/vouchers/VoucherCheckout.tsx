"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { calculateVoucherDiscount } from "@/lib/promotions";
import { formatEuro } from "@/lib/vouchers";
import { trackEvent } from "@/lib/analytics";
import type { SanityPromotion } from "@/sanity/queries";

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
  delivery: "email" | "post";
};

type Status =
  | { type: "error"; message: string }
  | { type: "info"; message: string }
  | null;

type VoucherCheckoutProps = {
  promotion?: SanityPromotion | null;
};

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
  // Digital ist der Standard: sofort verfügbar, kein Portoweg, keine Adresse.
  delivery: "email",
};

/**
 * Voreingestellte Beträge.
 *
 * Vorher gab es nur ein leeres Zahlenfeld mit "ab 50 €". Ohne Anker orientiert
 * sich der Käufer am Minimum. Die Vorschläge entsprechen den echten
 * Shootingpreisen, damit der Gutschein direkt ein Paket abdeckt.
 */
const AMOUNT_PRESETS = [
  { value: "100", label: "100 €" },
  { value: "200", label: "200 €", hint: "Portrait" },
  { value: "250", label: "250 €", hint: "Familie" },
  { value: "350", label: "350 €", hint: "Hochzeit" },
];

export default function VoucherCheckout({ promotion }: VoucherCheckoutProps) {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<Status>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customAmount = Number(form.voucherCustomAmount.replace(",", "."));
  const customAmountInCents = !Number.isNaN(customAmount)
    ? Math.round(customAmount * 100)
    : 0;
  const hasValidVoucherAmount = customAmountInCents >= 5000;
  const discount = calculateVoucherDiscount(
    hasValidVoucherAmount ? customAmountInCents : 0,
    promotion
  );
  const hasDiscount = discount.discountAmount > 0;
  const promotionPercent =
    promotion?.discountType === "percent" &&
    typeof promotion.discountValue === "number"
      ? Math.min(100, Math.max(0, promotion.discountValue))
      : 0;
  const hasVoucherPromotion = promotionPercent > 0;
  const displayedAmount =
    hasValidVoucherAmount ? formatEuro(customAmountInCents) : "ab 50 €";
  const promoBadge = promotion?.badge?.trim() || promotion?.title?.trim();

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const wantsPost = form.delivery === "post";

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

    if (!form.name.trim() || !form.email.trim() || !form.recipient.trim()) {
      setStatus({
        type: "error",
        message:
          "Bitte fülle Name, E-Mail und den Namen der beschenkten Person aus.",
      });
      return;
    }

    if (wantsPost && (!form.street.trim() || !form.zip.trim() || !form.city.trim())) {
      setStatus({
        type: "error",
        message: "Für den Postversand brauchen wir Straße, PLZ und Ort.",
      });
      return;
    }

    if (!acceptedTerms) {
      setStatus({
        type: "error",
        message: "Bitte bestätige AGB und Widerrufsbelehrung.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "info", message: "Checkout wird vorbereitet..." });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          voucherAmount: customAmountInCents,
          paymentAmount: discount.paymentAmount,
          discountAmount: discount.discountAmount,
          discountPercent: discount.percent,
          promotionId: promotion?.id,
          acceptedTerms,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        url?: string;
        error?: string;
      } | null;

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Checkout konnte nicht gestartet werden.");
      }

      // Vor der Weiterleitung melden – danach läuft kein Code dieser Seite mehr.
      trackEvent("gutschein_checkout_gestartet", {
        betrag_euro: Math.round(customAmountInCents / 100),
        zustellung: form.delivery,
      });

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
            <p className="eyebrow text-ink/55">
              Direkt kaufen
            </p>
            <h2 className="display-lg mt-4 max-w-3xl text-ink">
              Wertgutschein auswählen und sicher bezahlen
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-ink/64 md:text-lg">
              Du bestimmst den Betrag ab 50 €. Die Zahlung läuft sicher über
              Stripe Checkout; Zahlungsdaten werden nicht auf dieser Webseite
              gespeichert.
            </p>

            {promotion && hasVoucherPromotion && (
              <div className="mt-7 border-y border-ink/10 py-5">
                {promoBadge && (
                  <p className="text-xs uppercase tracking-[0.28em] text-ink/65">
                    {promoBadge}
                  </p>
                )}
                <p className="mt-2 text-sm leading-7 text-ink/62">
                  {promotionPercent} % Rabatt auf Wertgutscheine werden beim
                  Checkout automatisch berücksichtigt.
                </p>
              </div>
            )}

            {searchParams.get("zahlung") === "abgebrochen" && (
              <p className="mt-5 rounded-lg border border-ink/10 bg-paper/24 px-4 py-3 text-sm leading-7 text-ink/66">
                Die Zahlung wurde abgebrochen. Du kannst den Wertgutschein
                jederzeit erneut kaufen oder Regina direkt kontaktieren.
              </p>
            )}

            <div className="mt-10 border-y border-ink/10 py-6">
              <p className="text-xs uppercase tracking-[0.28em] text-ink/65">
                Wertgutschein
              </p>
              <p className="mt-3 text-3xl font-light text-ink">
                {displayedAmount}
              </p>
              <p className="mt-4 text-sm leading-7 text-ink/62">
                Der Gutschein wird nach dem Kauf hochwertig vorbereitet und
                versendet. Er kann für Portrait, Familie, Babybauch, Newborn
                oder Hochzeit eingesetzt werden.
              </p>
              {hasValidVoucherAmount && (
                <div className="mt-5 grid gap-2 text-sm leading-6 text-ink/62">
                  <div className="flex items-center justify-between gap-4">
                    <span>Gutscheinwert</span>
                    <span className="text-ink">
                      {formatEuro(customAmountInCents)}
                    </span>
                  </div>
                  {hasDiscount && (
                    <div className="flex items-center justify-between gap-4">
                      <span>
                        {promoBadge || "Aktionsrabatt"} ({discount.percent} %)
                      </span>
                      <span className="text-ink">
                        -{formatEuro(discount.discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4 border-t border-ink/10 pt-2 text-base text-ink">
                    <span>Zu zahlen</span>
                    <span>{formatEuro(discount.paymentAmount)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative z-10 rounded-md border border-ink/10 bg-paper/26 p-4 md:p-8"
          >
            <p className="text-sm uppercase tracking-[0.28em] text-ink/65">
              Kaufdaten
            </p>
            <h3 className="mt-3 text-2xl font-light text-ink">
              Wertgutschein R.ArtPhotographie
            </h3>

            <div className="mt-7 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm text-ink/62">
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
                  className="min-h-[52px] w-full rounded-md border border-ink/20 bg-paper px-4 text-base text-ink outline-none transition placeholder:text-ink/60 focus:border-ink md:min-h-[56px]"
                  required
                />
              </label>

              {/* Preisanker: ohne Vorschläge orientiert sich der Käufer am
                  Minimum von 50 €. Die Beträge entsprechen echten Paketen. */}
              <div className="-mt-2 flex flex-wrap gap-2">
                {AMOUNT_PRESETS.map((preset) => {
                  const active = form.voucherCustomAmount === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => {
                        setStatus(null);
                        setForm((prev) => ({
                          ...prev,
                          voucherCustomAmount: preset.value,
                        }));
                      }}
                      aria-pressed={active}
                      className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-5 text-sm transition ${
                        active
                          ? "border-ink bg-ink text-paper"
                          : "border-ink/25 text-ink hover:border-ink/55"
                      }`}
                    >
                      <span className="font-medium">{preset.label}</span>
                      {preset.hint && (
                        <span className={active ? "text-paper/70" : "text-ink/55"}>
                          {preset.hint}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <input
                name="name"
                placeholder="Name *"
                value={form.name}
                onChange={updateField}
                className="min-h-[52px] w-full rounded-md border border-ink/20 bg-paper px-4 text-base text-ink outline-none transition placeholder:text-ink/60 focus:border-ink md:min-h-[56px]"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="E-Mail *"
                value={form.email}
                onChange={updateField}
                className="min-h-[52px] w-full rounded-md border border-ink/20 bg-paper px-4 text-base text-ink outline-none transition placeholder:text-ink/60 focus:border-ink md:min-h-[56px]"
                required
              />
              <input
                name="phone"
                placeholder="Telefon (optional)"
                value={form.phone}
                onChange={updateField}
                className="min-h-[52px] w-full rounded-md border border-ink/20 bg-paper px-4 text-base text-ink outline-none transition placeholder:text-ink/60 focus:border-ink md:min-h-[56px]"
              />
              <input
                name="recipient"
                placeholder="Gutschein für wen? *"
                value={form.recipient}
                onChange={updateField}
                className="min-h-[52px] w-full rounded-md border border-ink/20 bg-paper px-4 text-base text-ink outline-none transition placeholder:text-ink/60 focus:border-ink md:min-h-[56px]"
                required
              />
              <textarea
                name="message"
                placeholder="Nachricht auf dem Gutschein (optional)"
                value={form.message}
                onChange={updateField}
                className="min-h-[120px] w-full rounded-md border border-ink/20 bg-paper px-4 py-4 text-base text-ink outline-none transition placeholder:text-ink/60 focus:border-ink md:min-h-[130px]"
              />
              {/* Zustellweg – digital ist der Standard und ausdrücklich benannt.
                  Vorher war die Anschrift Pflicht, obwohl an drei Stellen der
                  Website etwas anderes versprochen wurde. */}
              <fieldset className="rounded-md border border-ink/15 p-5">
                <legend className="px-2 text-sm font-medium text-ink">
                  Wie soll der Gutschein ankommen?
                </legend>

                <div className="mt-2 grid gap-3">
                  {[
                    {
                      value: "email" as const,
                      title: "Sofort per E-Mail (PDF)",
                      text: "Direkt nach der Zahlung zum Herunterladen und Ausdrucken. Auch digital verschenkbar.",
                    },
                    {
                      value: "post" as const,
                      title: "Zusätzlich per Post",
                      text: "Auf hochwertigem Papier vorbereitet und verschickt. Das PDF bekommst du trotzdem sofort.",
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer gap-3 rounded-md border p-4 transition ${
                        form.delivery === option.value
                          ? "border-ink bg-paper/60"
                          : "border-ink/15 hover:border-ink/35"
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={option.value}
                        checked={form.delivery === option.value}
                        onChange={() => {
                          setStatus(null);
                          setForm((prev) => ({ ...prev, delivery: option.value }));
                        }}
                        className="mt-1 h-4 w-4 accent-black"
                      />
                      <span>
                        <span className="block text-[15px] font-medium text-ink">
                          {option.title}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-ink/70">
                          {option.text}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {wantsPost && (
                <div className="grid gap-4">
                  <input
                    name="street"
                    placeholder="Straße und Hausnummer *"
                    autoComplete="street-address"
                    value={form.street}
                    onChange={updateField}
                    className="min-h-[52px] w-full rounded-md border border-ink/20 bg-paper px-4 text-base text-ink outline-none transition placeholder:text-ink/60 focus:border-ink md:min-h-[56px]"
                    required
                  />
                  <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                    <input
                      name="zip"
                      placeholder="PLZ *"
                      autoComplete="postal-code"
                      inputMode="numeric"
                      value={form.zip}
                      onChange={updateField}
                      className="min-h-[52px] w-full rounded-md border border-ink/20 bg-paper px-4 text-base text-ink outline-none transition placeholder:text-ink/60 focus:border-ink md:min-h-[56px]"
                      required
                    />
                    <input
                      name="city"
                      placeholder="Ort *"
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={updateField}
                      className="min-h-[52px] w-full rounded-md border border-ink/20 bg-paper px-4 text-base text-ink outline-none transition placeholder:text-ink/60 focus:border-ink md:min-h-[56px]"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Pflichtangaben im Fernabsatz: AGB und Widerrufsbelehrung
                  müssen vor dem Kauf zugänglich und bestätigt sein. */}
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-ink/78">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => {
                    setStatus(null);
                    setAcceptedTerms(event.target.checked);
                  }}
                  className="mt-1 h-4 w-4 shrink-0 accent-black"
                  required
                />
                <span>
                  Ich habe die{" "}
                  <a href="/agb" className="underline underline-offset-4" target="_blank" rel="noreferrer">
                    AGB
                  </a>{" "}
                  und die{" "}
                  <a href="/widerruf" className="underline underline-offset-4" target="_blank" rel="noreferrer">
                    Widerrufsbelehrung
                  </a>{" "}
                  gelesen und stimme zu. Mit dem Kauf eines Wertgutscheins
                  bleibt das Widerrufsrecht bestehen.
                </span>
              </label>

              {status && (
                <p
                  className={`rounded-xl border px-4 py-3 text-sm leading-7 ${
                    status.type === "error"
                      ? "border-ink/12 bg-paper/24 text-ink/70"
                      : "border-ink/10 bg-paper/34 text-ink/72"
                  }`}
                >
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-ink px-8 py-4 text-sm font-medium text-paper transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Weiter zu Stripe..." : "Wertgutschein kaufen"}
              </button>

              <p className="text-sm leading-7 text-ink/65">
                Nach erfolgreicher Zahlung wird der Wertgutschein vorbereitet.
                Die Zahlungsdaten werden sicher über Stripe verarbeitet und
                nicht auf dieser Webseite gespeichert.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
