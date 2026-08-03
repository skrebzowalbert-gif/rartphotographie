"use client";

import { useActionState } from "react";
import { loginToGallery, type LoginState } from "@/app/galerie/[slug]/actions";

/**
 * Die Passwortseite.
 *
 * Bewusst karg: ein Titelbild, die Namen, ein Feld. Wer hierher kommt, hat den
 * Link von Regina und will seine Bilder sehen – nicht navigieren.
 */
export default function GalleryLogin({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginToGallery,
    {}
  );

  return (
    <div className="mx-auto max-w-lg py-20">
      <p className="eyebrow text-ink/55">Eure Galerie</p>
      <h1 className="display-lg mt-5 text-ink">{title}</h1>
      <p className="mt-6 text-base leading-8 text-ink/75">
        Gib das Passwort ein, das du von Regina bekommen hast.
      </p>

      <form action={action} className="mt-10">
        <input type="hidden" name="slug" value={slug} />
        <label className="sr-only" htmlFor="password">
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          autoFocus
          placeholder="z. B. k7mq-x3rt-9wbd"
          className="w-full rounded-xl border border-ink/15 bg-paper/50 px-4 py-4 text-lg tracking-wide text-ink outline-none transition-colors duration-300 focus:border-ink/45"
        />

        <button
          type="submit"
          disabled={pending}
          className="mt-6 inline-flex min-h-[58px] w-full items-center justify-center rounded-full bg-ink px-8 text-base font-medium text-paper transition-colors duration-500 hover:bg-ink-soft disabled:opacity-60"
        >
          {pending ? "Einen Moment…" : "Galerie öffnen"}
        </button>

        {state.error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-ink/12 bg-paper/40 px-4 py-3 text-sm leading-7 text-ink/75"
          >
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}
