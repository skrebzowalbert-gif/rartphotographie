"use client";

import { Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import PageHeader from "@/components/layout/PageHeader";
import {
  business,
  instagramUrl,
  phoneDisplay,
  phoneHref,
  publicContactEmail,
} from "@/lib/site";

/**
 * Muss ALLE Werte enthalten, die von anderen Seiten per ?shooting= gesendet
 * werden — sonst fällt die Vorauswahl still auf "" zurück und der Besucher
 * muss erneut wählen. Betroffen wären sonst ausgerechnet die vier
 * Hochzeitspakete, also die höchstpreisigen Produkte.
 *
 * Quellen der Werte: src/app/preise/page.tsx (requestValue),
 * src/app/portfolio/**, src/components/sections/ServicesAccordion.tsx.
 */
const SHOOTING_TYPES = [
  "Portraitshooting",
  "Familienshooting",
  "Babybauchshooting",
  "Newbornshooting",
  "Hochzeit",
  "Hochzeit – Mini-Paket",
  "Hochzeit – Kurzpaket",
  "Hochzeit – Standardpaket",
  "Hochzeit – Erweitertes Paket",
  "Eventfotografie",
  "Gutschein",
  "Etwas anderes",
];

/**
 * Fahrzeuge des Partners (Sportwagenvermietung Kaufbeuren). Wird nur
 * angezeigt, wenn der Besucher über einen der "Mit Premium-Fahrzeug
 * kombinieren"-Links von der Preisseite kommt (?vehicleInterest=true).
 */
const VEHICLE_OPTIONS = [
  "Noch offen",
  "Audi RSQ8 weiß",
  "BMW XM Plug-in-Hybrid weiß",
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  type: string;
  preferredDate: string;
  message: string;
};

type SubmitStatus =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  type: "",
  preferredDate: "",
  message: "",
};

const inputClass =
  "min-h-[52px] w-full rounded-md border border-ink/20 bg-paper px-4 text-base text-ink outline-none transition placeholder:text-ink/65 focus:border-ink focus:ring-2 focus:ring-ink/15 md:min-h-[56px]";

const labelClass = "text-sm font-medium text-ink/80";

function KontaktForm() {
  const searchParams = useSearchParams();
  const prefillType = searchParams.get("shooting") || searchParams.get("type") || "";

  const hasVehicleInterest = searchParams.get("vehicleInterest") === "true";
  const [vehicleChoice, setVehicleChoice] = useState(VEHICLE_OPTIONS[0]);

  /*
    Ausfallsicher: Ein unbekannter, plausibler Wert aus der URL wird als
    zusätzliche Option aufgenommen, statt still verworfen zu werden. Sonst
    genügt eine neue Paketbezeichnung auf der Preisseite, um die Vorauswahl
    wieder unbemerkt zu zerstören. Länge begrenzt, damit die URL nicht zum
    Einfallstor für beliebigen Text wird.
  */
  const safePrefill =
    prefillType && prefillType.length <= 60 ? prefillType : "";
  const typeOptions = SHOOTING_TYPES.includes(safePrefill)
    ? SHOOTING_TYPES
    : safePrefill
    ? [safePrefill, ...SHOOTING_TYPES]
    : SHOOTING_TYPES;

  const [form, setForm] = useState<FormState>({
    ...INITIAL_FORM,
    type: safePrefill,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    // Fehlermeldung beim Weitertippen ausblenden, Erfolgsmeldung stehen lassen.
    setSubmitStatus((prev) => (prev?.type === "error" ? null : prev));
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Honeypot: von Menschen nie ausgefüllt, von einfachen Bots fast immer.
    const honeypot = new FormData(e.currentTarget).get("website");
    if (typeof honeypot === "string" && honeypot.length > 0) {
      setSubmitStatus({
        type: "success",
        message: "Vielen Dank. Deine Anfrage wurde gesendet.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const payload = {
      ...form,
      message: [
        form.preferredDate ? `Wunschdatum: ${form.preferredDate}` : "",
        form.message.trim(),
        hasVehicleInterest
          ? `Interesse an Premium-Fahrzeug: ja\nWunschfahrzeug: ${vehicleChoice}\nHinweis: Fahrzeugbuchung separat über den Partner, nicht im Shootingpreis enthalten.`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Request failed");
      }

      // Erst nach bestätigtem Erfolg melden, nicht beim Absenden.
      trackEvent("anfrage_gesendet", { art: form.type || "unbekannt" });

      setSubmitStatus({
        type: "success",
        message:
          "Deine Anfrage ist angekommen. Du bekommst gleich eine Bestätigung per E-Mail, Regina meldet sich in der Regel innerhalb von 24 Stunden.",
      });
      setForm(INITIAL_FORM);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error && error.message !== "Request failed"
            ? error.message
            : `Beim Senden ist ein Fehler aufgetreten. Bitte schreib direkt an ${publicContactEmail}${
                phoneDisplay ? ` oder ruf an: ${phoneDisplay}` : ""
              }.`,
      });
    } finally {
      setIsSubmitting(false);
      // Meldung zuverlässig in den Blick rücken.
      requestAnimationFrame(() =>
        statusRef.current?.scrollIntoView({ block: "center", behavior: "smooth" })
      );
    }
  }

  return (
    <div className="mx-auto max-w-[110rem] px-[var(--shell-x)] pb-24">
      <section className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-20">
          {/*
            Das Formular steht im Markup VOR dem Fließtext. Vorher lagen auf
            dem Handy rund 1160 px Text über dem ersten Eingabefeld.
          */}
          <form
            onSubmit={handleSubmit}
            noValidate={false}
            className="rounded-xl border border-ink/12 bg-paper/55 p-5 md:p-8"
          >
            <h2 className="text-2xl font-medium">Anfrageformular</h2>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              Felder mit <span aria-hidden="true">*</span> sind Pflicht.
            </p>

            <div className="mt-6 grid gap-5">
              <div className="grid gap-2">
                <label htmlFor="name" className={labelClass}>
                  Name *
                </label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Vor- und Nachname"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="email" className={labelClass}>
                  E-Mail *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="name@beispiel.de"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="phone" className={labelClass}>
                  Telefon <span className="text-ink/65">(optional)</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Für schnelle Rückfragen"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/*
                Vorher ein Pflicht-Freitextfeld: der Nutzer musste "Portrait"
                abtippen. Jede Tippanforderung kostet Abschlüsse.
              */}
              <div className="grid gap-2">
                <label htmlFor="type" className={labelClass}>
                  Was für ein Shooting? *
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Bitte auswählen</option>
                  {typeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="preferredDate" className={labelClass}>
                  Wunschdatum <span className="text-ink/65">(optional)</span>
                </label>
                <input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/*
                Nur sichtbar, wenn der Besucher von einem
                "Mit Premium-Fahrzeug kombinieren"-Link der Preisseite kommt.
              */}
              {hasVehicleInterest && (
                <div className="grid gap-2 rounded-md border border-ink/15 bg-paper/60 p-4">
                  <p className="text-sm font-medium text-ink">
                    Premium-Fahrzeug zum Shooting
                  </p>
                  <p className="text-sm leading-6 text-ink/70">
                    Die Fahrzeugbuchung läuft separat über unseren Partner und
                    ist nicht im Shootingpreis enthalten. Dein Interesse wird
                    mit der Anfrage übermittelt.
                  </p>
                  <label htmlFor="vehicle" className={`mt-2 ${labelClass}`}>
                    Wunschfahrzeug
                  </label>
                  <select
                    id="vehicle"
                    name="vehicle"
                    value={vehicleChoice}
                    onChange={(event) => setVehicleChoice(event.target.value)}
                    className={inputClass}
                  >
                    {VEHICLE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid gap-2">
                <label htmlFor="message" className={labelClass}>
                  Nachricht *
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Wunschort, Uhrzeit, Anlass, Anzahl der Personen – alles hilft."
                  value={form.message}
                  onChange={handleChange}
                  className="min-h-[150px] w-full rounded-md border border-ink/20 bg-paper px-4 py-4 text-base text-ink outline-none transition placeholder:text-ink/65 focus:border-ink focus:ring-2 focus:ring-ink/15 md:min-h-[170px]"
                  required
                />
              </div>

              {/* Honeypot – für Menschen unsichtbar, nicht per display:none. */}
              <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor="website">Website (bitte leer lassen)</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div ref={statusRef} aria-live="polite">
                {submitStatus && (
                  <p
                    className={`rounded-md border-l-4 px-4 py-3 text-sm leading-6 ${
                      submitStatus.type === "success"
                        ? "border-l-green-700 bg-green-50 text-green-900"
                        : "border-l-red-700 bg-red-50 text-red-900"
                    }`}
                  >
                    {submitStatus.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 inline-flex min-h-[56px] items-center justify-center rounded-full bg-ink px-8 text-base font-medium text-paper transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Wird gesendet…" : "Anfrage kostenlos senden"}
              </button>

              <p className="text-sm leading-6 text-ink/70">
                Mit dem Absenden werden deine Angaben zur Bearbeitung der
                Anfrage verarbeitet. Details in der{" "}
                <Link
                  href="/datenschutz"
                  className="underline underline-offset-4 hover:opacity-70"
                >
                  Datenschutzerklärung
                </Link>
                . Keine Weitergabe an Dritte, kein Newsletter.
              </p>
            </div>
          </form>

          <div className="text-base leading-8 text-ink/75">
            <h2 className="text-2xl font-medium text-ink">
              So läuft die Anfrage ab
            </h2>
            <ol className="mt-5 space-y-4">
              {[
                "Du schickst die Anfrage ab und bekommst sofort eine Bestätigung per E-Mail.",
                "Regina meldet sich persönlich, meist innerhalb von 24 Stunden.",
                "Ihr klärt Termin, Ort und Ablauf – unverbindlich und ohne Druck.",
                "Erst danach wird der Termin verbindlich gebucht.",
              ].map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-medium text-paper">
                    {index + 1}
                  </span>
                  <span className="text-base leading-7">{step}</span>
                </li>
              ))}
            </ol>

            <h2 className="mt-10 text-2xl font-medium text-ink">
              Wo finden die Shootings statt?
            </h2>
            <p className="mt-4 leading-8">
              Shootings finden in Kaufbeuren und im gesamten Ostallgäu statt –
              unter anderem in Neugablonz, Marktoberdorf, Buchloe, Biessenhofen,
              Kempten und Füssen. Weitere Orte, zum Beispiel München, sind nach
              Absprache möglich.
            </p>

            <div className="mt-8 rounded-xl border border-ink/12 bg-paper/45 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/70">
                Standort
              </p>
              <address className="mt-3 not-italic leading-7 text-ink/80">
                {business.name}
                <br />
                {business.street}
                <br />
                {business.postalCode} {business.city}
              </address>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${business.name} ${business.street} ${business.postalCode} ${business.city}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm underline underline-offset-4 hover:opacity-70"
              >
                In Google Maps öffnen
              </a>
            </div>
          </div>
      </section>
    </div>
  );
}

export default function KontaktPageContent() {
  return (
    <main className="bg-sand text-ink">
      {/*
        Kopf und Kontaktwege stehen bewusst AUSSERHALB der Suspense-Grenze.
        Vorher lag die gesamte Seite darin – weil das Formular useSearchParams
        nutzt, lieferte der Server nur den leeren Platzhalter aus, und die h1
        existierte im HTML überhaupt nicht. Sie erschien erst nach der
        Hydration im Browser.
      */}
      <PageHeader
        eyebrow="Kontakt"
        heading="Erzähl mir von"
        accent="eurem Vorhaben"
        intro="Unverbindlich, kostenlos und in der Regel innerhalb von 24 Stunden beantwortet."
      >
        <div className="rise mt-9 flex flex-wrap gap-4">
          {phoneHref && (
            <a
              href={phoneHref}
              className="group inline-flex min-h-[58px] items-center gap-3 rounded-full bg-ink px-8 text-base font-medium text-paper transition-colors duration-500 hover:bg-ink-soft"
            >
              {phoneDisplay} anrufen
            </a>
          )}
          <a
            href={`mailto:${publicContactEmail}`}
            className="inline-flex min-h-[58px] items-center rounded-full border border-ink/25 px-8 text-base font-medium text-ink transition-colors duration-500 hover:border-ink/55"
          >
            E-Mail schreiben
          </a>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[58px] items-center rounded-full border border-ink/25 px-8 text-base font-medium text-ink transition-colors duration-500 hover:border-ink/55"
          >
            Instagram
          </a>
        </div>
      </PageHeader>

      <Suspense fallback={<div className="min-h-[70svh]" />}>
        <KontaktForm />
      </Suspense>
    </main>
  );
}
