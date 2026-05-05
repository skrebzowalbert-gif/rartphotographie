"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { instagramUrl, publicContactEmail } from "@/lib/site";

const INSTAGRAM_URL = instagramUrl;
const EMAIL_ADDRESS = publicContactEmail;

type FormState = {
  name: string;
  email: string;
  phone: string;
  type: string;
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
  message: "",
};

function KontaktForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormState>({
    ...INITIAL_FORM,
    type: searchParams.get("shooting") || searchParams.get("type") || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setSubmitStatus(null);
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Request failed");
      }

      setSubmitStatus({
        type: "success",
        message: "Vielen Dank. Deine Anfrage wurde erfolgreich gesendet.",
      });
      setForm(INITIAL_FORM);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error && error.message !== "Request failed"
            ? error.message
            : "Beim Senden ist ein Fehler aufgetreten. Bitte versuche es erneut oder schreibe direkt per Instagram.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="bg-[#e7dfd3] px-4 pb-24 text-black md:px-10">
      <div className="mx-auto max-w-6xl">
        <section className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-black/38">
              Kontakt
            </p>

            <h1 className="mt-4 text-4xl font-light leading-[0.98] md:text-6xl">
              Shooting anfragen
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-black/62 md:text-lg">
              Beschreibe dein Shooting oder deine allgemeine Anfrage so genau
              wie möglich. Du bekommst eine persönliche Rückmeldung mit allen
              wichtigen Details.
            </p>

            <p className="mt-4 max-w-xl text-base leading-8 text-black/68">
              Anfragen werden in der Regel kurzfristig beantwortet. Für eine
              schnelle und passende Rückmeldung helfen folgende Angaben:
              Wunschdatum, Ort, Uhrzeit sowie die Art des Shootings.
            </p>

            <p className="mt-4 max-w-xl text-base leading-8 text-black/68">
              Je mehr Details du angibst, desto konkreter kann ich dir direkt
              antworten.
            </p>

            <p className="mt-4 max-w-xl text-base leading-8 text-black/68">
              Shootings finden im Raum Kaufbeuren statt. Termine außerhalb
              (z. B. München) sind möglich – die Anfahrt wird individuell
              berechnet.
            </p>

            <p className="mt-4 max-w-xl text-base leading-8 text-black/68">
              Standort: Kaufbeuren (Allgäu)
              <br />
              Shootings auch in München & Umgebung möglich.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
                style={{ color: "#ffffff" }}
              >
                Über Instagram schreiben
              </a>

              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/24 bg-white/35 px-7 py-3 text-sm font-semibold text-black transition hover:border-black/40 hover:bg-white/55"
                style={{ color: "#111111" }}
              >
                Per E-Mail anfragen
              </a>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              <a
                href={`mailto:${EMAIL_ADDRESS}`}
                className="min-w-0 border-t border-black/12 pt-5 transition hover:border-black/24"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-black/40">
                  E-Mail
                </p>
                <p className="mt-3 min-w-0 overflow-hidden break-words text-[15px] font-medium leading-7 text-black [overflow-wrap:anywhere] sm:text-sm md:text-[15px]">
                  {EMAIL_ADDRESS}
                </p>
                <p className="mt-2 text-sm leading-6 text-black/58">
                  Für detaillierte Anfragen und klare Abstimmung.
                </p>
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 border-t border-black/12 pt-5 transition hover:border-black/24"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-black/40">
                  Instagram
                </p>
                <p className="mt-3 text-base font-medium text-black">
                  r.artphotographie
                </p>
                <p className="mt-2 text-sm leading-6 text-black/58">
                  Mehr aktuelle Arbeiten und direkter Einstieg.
                </p>
              </a>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-md border border-black/10 bg-white/24 p-4 backdrop-blur-sm md:p-8"
          >
            <div className="grid gap-4">
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="min-h-[52px] w-full rounded-md border border-black/10 bg-white/70 px-4 text-base text-black outline-none placeholder:text-black/35 md:min-h-[56px]"
                required
              />

              <input
                name="email"
                type="email"
                placeholder="E-Mail"
                value={form.email}
                onChange={handleChange}
                className="min-h-[52px] w-full rounded-md border border-black/10 bg-white/70 px-4 text-base text-black outline-none placeholder:text-black/35 md:min-h-[56px]"
                required
              />

              <input
                name="phone"
                placeholder="Telefon (optional)"
                value={form.phone}
                onChange={handleChange}
                className="min-h-[52px] w-full rounded-md border border-black/10 bg-white/70 px-4 text-base text-black outline-none placeholder:text-black/35 md:min-h-[56px]"
              />

              <input
                name="type"
                placeholder="Anfrageart, z. B. Portrait, Hochzeit oder Allgemein"
                value={form.type}
                onChange={handleChange}
                className="min-h-[52px] w-full rounded-md border border-black/10 bg-white/70 px-4 text-base text-black outline-none placeholder:text-black/35 md:min-h-[56px]"
                required
              />

              <label className="grid gap-2">
                <span className="text-sm text-black/62">
                  Nachricht (bitte Wunschdatum, Ort und Details angeben)
                </span>
                <textarea
                  name="message"
                  placeholder="z. B. Wunschdatum, Ort, Uhrzeit, Art des Shootings..."
                  value={form.message}
                  onChange={handleChange}
                  className="min-h-[150px] w-full rounded-md border border-black/10 bg-white/70 px-4 py-4 text-base text-black outline-none placeholder:text-black/35 md:min-h-[180px]"
                />
              </label>

              {submitStatus && (
                <p
                  className={`rounded-xl border px-4 py-3 text-sm leading-7 ${
                    submitStatus.type === "success"
                      ? "border-black/10 bg-white/34 text-black/72"
                      : "border-black/12 bg-white/24 text-black/70"
                  }`}
                >
                  {submitStatus.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 inline-flex min-h-[56px] items-center justify-center rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ color: "#ffffff" }}
              >
                {isSubmitting ? "Wird gesendet..." : "Anfrage senden"}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-black/48">
              <span>Unverbindliche Anfrage</span>
              <span>•</span>
              <span>Schnelle Rückmeldung</span>
              <span>•</span>
              <span>Persönliche Abstimmung</span>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default function KontaktPageContent() {
  return (
    <Suspense
      fallback={
        <main className="bg-[#e7dfd3] px-6 pb-24 text-black md:px-10" />
      }
    >
      <KontaktForm />
    </Suspense>
  );
}
