"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createProjectAction,
  type CreateProjectState,
} from "./actions";

const field =
  "mt-2 w-full rounded-xl border border-ink/15 bg-paper/50 px-4 py-3 text-base text-ink outline-none transition-colors duration-300 focus:border-ink/45";
const labelClass = "block text-sm font-medium text-ink";

export default function NewProjectForm({ origin }: { origin: string }) {
  const [state, action, pending] = useActionState<CreateProjectState, FormData>(
    createProjectAction,
    {}
  );

  if (state.created) {
    return <Created origin={origin} created={state.created} />;
  }

  return (
    <form action={action} className="mt-12 max-w-2xl space-y-8">
      <div>
        <label className={labelClass} htmlFor="title">
          Titel der Galerie
        </label>
        <input
          id="title"
          name="title"
          required
          maxLength={120}
          placeholder="Julia &amp; Max – Hochzeit"
          className={field}
        />
        <p className="mt-2 text-sm leading-6 text-ink/60">
          Sieht auch der Kunde. Der Link enthält zusätzlich eine Zufallsfolge,
          damit niemand fremde Galerien erraten kann.
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="clientName">
          Kundin oder Kunde
        </label>
        <input
          id="clientName"
          name="clientName"
          required
          maxLength={120}
          placeholder="Julia Berger"
          className={field}
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="selectionLimit">
            Inklusive Bilder
          </label>
          <input
            id="selectionLimit"
            name="selectionLimit"
            type="number"
            min={1}
            max={2000}
            placeholder="40"
            className={field}
          />
          <p className="mt-2 text-sm leading-6 text-ink/60">
            Leer lassen für unbegrenzt.
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="expiryDays">
            Gültig für (Tage)
          </label>
          <input
            id="expiryDays"
            name="expiryDays"
            type="number"
            min={1}
            max={1825}
            defaultValue={365}
            className={field}
          />
          <p className="mt-2 text-sm leading-6 text-ink/60">
            Danach werden die Dateien gelöscht.
          </p>
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-base leading-7 text-ink/80">
        <input
          type="checkbox"
          name="watermark"
          defaultChecked
          className="mt-1.5 h-4 w-4 shrink-0 accent-black"
        />
        <span>
          Vorschaubilder mit Wasserzeichen schützen
          <span className="mt-1 block text-sm leading-6 text-ink/60">
            Lässt sich jederzeit umschalten, ohne die Bilder neu zu berechnen.
          </span>
        </span>
      </label>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-ink/12 bg-paper/40 px-4 py-3 text-sm leading-7 text-ink/75"
        >
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[58px] items-center justify-center rounded-full bg-ink px-8 text-base font-medium text-paper transition-colors duration-500 hover:bg-ink-soft disabled:opacity-60"
        >
          {pending ? "Wird angelegt…" : "Galerie anlegen"}
        </button>
        <Link
          href="/admin"
          className="text-base text-ink/70 underline underline-offset-4"
        >
          Abbrechen
        </Link>
      </div>
    </form>
  );
}

/**
 * Die einzige Gelegenheit, das Passwort zu sehen.
 *
 * Gespeichert wird nur der scrypt-Hash. Wer das Passwort verliert, setzt ein
 * neues – das ist Absicht, keine fehlende Funktion.
 */
function Created({
  origin,
  created,
}: {
  origin: string;
  created: NonNullable<CreateProjectState["created"]>;
}) {
  const url = `${origin}/galerie/${created.slug}`;
  const [copied, setCopied] = useState<"link" | "beides" | null>(null);

  async function copy(text: string, what: "link" | "beides") {
    await navigator.clipboard.writeText(text);
    setCopied(what);
    setTimeout(() => setCopied(null), 2500);
  }

  return (
    <div className="mt-12 max-w-2xl">
      <h2 className="font-display text-3xl text-ink">
        {created.title} ist angelegt
      </h2>
      <p className="mt-4 text-base leading-8 text-ink/75">
        Notiere dir das Passwort jetzt. Es wird nur dieses eine Mal angezeigt –
        gespeichert ist ausschließlich eine nicht umkehrbare Prüfsumme.
      </p>

      <dl className="mt-10 space-y-6">
        <div>
          <dt className="eyebrow text-ink/55">Link</dt>
          <dd className="mt-2 break-all font-mono text-sm text-ink">{url}</dd>
        </div>
        <div>
          <dt className="eyebrow text-ink/55">Passwort</dt>
          <dd className="mt-2 font-mono text-2xl tracking-wide text-ink">
            {created.password}
          </dd>
        </div>
      </dl>

      <div className="mt-10 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() =>
            copy(
              `${url}\nPasswort: ${created.password}`,
              "beides"
            )
          }
          className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors duration-500 hover:bg-ink-soft"
        >
          {copied === "beides" ? "Kopiert" : "Link und Passwort kopieren"}
        </button>
        <button
          type="button"
          onClick={() => copy(url, "link")}
          className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-ink/25 px-7 text-sm font-medium text-ink transition-colors duration-500 hover:border-ink/55"
        >
          {copied === "link" ? "Kopiert" : "Nur den Link"}
        </button>
      </div>

      <p className="mt-10 text-sm leading-7 text-ink/60">
        <Link href="/admin" className="underline underline-offset-4">
          Zur Übersicht
        </Link>
      </p>
    </div>
  );
}
