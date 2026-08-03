"use client";

import { useActionState, useState } from "react";
import {
  resetGalleryPassword,
  type ResetState,
} from "@/app/admin/projekt/[id]/actions";

/**
 * Neues Galerie-Passwort erzeugen und genau einmal anzeigen.
 *
 * Wie beim Anlegen wandert es nicht über die Adresszeile – dort stünde es im
 * Browserverlauf, in Server-Protokollen und im Referer jeder Folgeanfrage.
 */
export default function PasswordReset({
  projectId,
  galleryUrl,
}: {
  projectId: string;
  galleryUrl: string;
}) {
  const [state, action, pending] = useActionState<ResetState, FormData>(
    resetGalleryPassword,
    {}
  );
  const [copied, setCopied] = useState(false);

  if (state.password) {
    return (
      <div className="rounded-xl border border-ink/12 bg-paper/40 px-5 py-4">
        <p className="text-sm leading-7 text-ink/70">
          Neues Passwort – wird nur dieses eine Mal angezeigt:
        </p>
        <p className="mt-2 font-mono text-2xl tracking-wide text-ink">
          {state.password}
        </p>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(
              `${galleryUrl}\nPasswort: ${state.password}`
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          }}
          className="mt-4 inline-flex min-h-[46px] items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors duration-500 hover:bg-ink-soft"
        >
          {copied ? "Kopiert" : "Link und Passwort kopieren"}
        </button>
      </div>
    );
  }

  return (
    <form action={action}>
      <input type="hidden" name="projectId" value={projectId} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-ink/25 px-6 text-sm font-medium text-ink transition-colors duration-500 hover:border-ink/55 disabled:opacity-60"
      >
        {pending ? "Wird erzeugt…" : "Neues Passwort erzeugen"}
      </button>
      {state.error && (
        <p className="mt-3 text-sm text-ink/70">{state.error}</p>
      )}
    </form>
  );
}
