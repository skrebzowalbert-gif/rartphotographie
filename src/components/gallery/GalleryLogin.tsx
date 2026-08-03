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
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center py-20">
      <p className="eyebrow text-paper/50">Eure Galerie</p>
      <h1 className="display-lg mt-5 text-paper">{title}</h1>
      <p className="mt-6 text-base leading-8 text-paper/65">
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
          className="w-full rounded-xl border border-paper/20 bg-paper/8 px-4 py-4 text-lg tracking-wide text-paper outline-none transition-colors duration-300 placeholder:text-paper/35 focus:border-paper/55"
        />

        <button
          type="submit"
          disabled={pending}
          className="mt-6 inline-flex min-h-[58px] w-full items-center justify-center rounded-full bg-paper px-8 text-base font-medium text-ink transition-opacity duration-300 hover:opacity-85 disabled:opacity-50"
        >
          {pending ? "Einen Moment…" : "Galerie öffnen"}
        </button>

        {state.error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-paper/15 bg-paper/8 px-4 py-3 text-sm leading-7 text-paper/75"
          >
            {state.error}
          </p>
        )}
      </form>
    </div>
  );
}
