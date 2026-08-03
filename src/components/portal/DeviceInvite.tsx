"use client";

import { useActionState, useState } from "react";
import { createDeviceInvite, type InviteState } from "@/app/admin/actions";

/**
 * Ein Gerät einladen.
 *
 * Bewusst eingeklappt: Das ist ein Vorgang für den ersten Tag und danach für
 * ein neues Telefon – er darf die Galerienübersicht nicht dominieren.
 */
export default function DeviceInvite() {
  const [offen, setOffen] = useState(false);
  const [kopiert, setKopiert] = useState(false);
  const [state, action, pending] = useActionState<InviteState, FormData>(
    createDeviceInvite,
    {}
  );

  if (!offen) {
    return (
      <button
        type="button"
        onClick={() => setOffen(true)}
        className="text-sm text-ink/60 underline decoration-ink/25 underline-offset-4 transition-colors duration-300 hover:text-ink"
      >
        Weiteres Gerät freischalten
      </button>
    );
  }

  return (
    <div className="max-w-2xl rounded-2xl border border-ink/12 bg-paper/50 p-6">
      <h2 className="font-display text-xl leading-tight text-ink">
        Weiteres Gerät freischalten
      </h2>
      <p className="mt-3 text-sm leading-7 text-ink/70">
        Du bekommst einen Link, den du an das Gerät schickst. Wer ihn öffnet,
        legt dort einen eigenen Passkey an. Der Link gilt dreißig Minuten und
        nur ein einziges Mal.
      </p>

      <form action={action} className="mt-6 flex flex-wrap items-end gap-4">
        <div className="min-w-[16rem] flex-1">
          <label
            htmlFor="label"
            className="block text-sm font-medium text-ink/80"
          >
            Um welches Gerät geht es?
          </label>
          <input
            id="label"
            name="label"
            required
            maxLength={60}
            defaultValue="Reginas Handy"
            className="mt-2 w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-base text-ink outline-none transition-colors duration-300 focus:border-ink/45"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors duration-500 hover:bg-ink-soft disabled:opacity-60"
        >
          {pending ? "Einen Moment…" : "Link erzeugen"}
        </button>
      </form>

      {state.error && (
        <p role="alert" className="mt-5 text-sm leading-7 text-ink/75">
          {state.error}
        </p>
      )}

      {state.url && (
        <div className="mt-7 border-t border-ink/12 pt-6">
          <p className="text-sm text-ink/70">
            Diesen Link verschicken – er wird kein zweites Mal angezeigt:
          </p>
          <p className="mt-3 break-all rounded-xl bg-ink/6 px-4 py-3 font-mono text-sm text-ink">
            {state.url}
          </p>

          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(state.url!);
              setKopiert(true);
            }}
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full border border-ink/20 px-5 text-sm font-medium text-ink transition-colors duration-300 hover:border-ink/50"
          >
            {kopiert ? "Kopiert" : "Link kopieren"}
          </button>

          <p className="mt-5 text-sm leading-7 text-ink/60">
            Schick ihn über einen Weg, den nur ihr beide lest. Nach dem
            Freischalten ist er wertlos, davor ist er ein Zugang.
          </p>
        </div>
      )}
    </div>
  );
}
