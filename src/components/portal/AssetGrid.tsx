"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

/**
 * Bilderraster im Verwaltungsbereich.
 *
 * Zwei Dinge, die im ersten Wurf gefehlt haben:
 *
 * 1. Mehrfachauswahl. Bei einem misslungenen Stapel von 17 Bildern siebzehnmal
 *    einzeln zu klicken ist keine Bedienung, das ist Strafarbeit.
 *
 * 2. Ein Umschalter auf die Kundenansicht. Regina sieht ihre Bilder sonst
 *    immer ohne Wasserzeichen – sinnvoll zum Beurteilen, aber dann kann sie
 *    nie prüfen, wie das Wasserzeichen tatsächlich wirkt.
 */

export type GridAsset = {
  id: string;
  fileName: string;
  width: number | null;
  height: number | null;
};

export default function AssetGrid({
  assets,
  projectId,
  watermarkEnabled,
  onDelete,
}: {
  assets: GridAsset[];
  projectId: string;
  watermarkEnabled: boolean;
  onDelete: (formData: FormData) => Promise<void>;
  }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [asClient, setAsClient] = useState(false);
  const [pending, startTransition] = useTransition();

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function removeSelected() {
    // Bewusst mit Rückfrage: Löschen lässt sich nicht rückgängig machen, und
    // ein Fehlklick auf "alle auswählen" wäre sonst teuer.
    const count = selected.size;
    if (
      !confirm(
        count === 1
          ? "Dieses Bild dauerhaft entfernen?"
          : `${count} Bilder dauerhaft entfernen?`
      )
    ) {
      return;
    }

    startTransition(async () => {
      for (const id of selected) {
        const data = new FormData();
        data.set("assetId", id);
        data.set("projectId", projectId);
        await onDelete(data);
      }
      setSelected(new Set());
      router.refresh();
    });
  }

  const alleGewaehlt = selected.size === assets.length && assets.length > 0;

  return (
    <div>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={() =>
            setSelected(alleGewaehlt ? new Set() : new Set(assets.map((a) => a.id)))
          }
          className="text-sm text-ink/70 underline underline-offset-4 transition-colors duration-300 hover:text-ink"
        >
          {alleGewaehlt ? "Auswahl aufheben" : "Alle auswählen"}
        </button>

        {watermarkEnabled && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={asClient}
              onChange={(event) => setAsClient(event.target.checked)}
              className="h-4 w-4 accent-black"
            />
            So sieht es die Kundschaft
          </label>
        )}

        {selected.size > 0 && (
          <button
            type="button"
            onClick={removeSelected}
            disabled={pending}
            className="ml-auto inline-flex min-h-[42px] items-center justify-center rounded-full border border-ink/30 px-5 text-sm font-medium text-ink transition-colors duration-300 hover:border-ink/60 disabled:opacity-50"
          >
            {pending
              ? "Wird entfernt…"
              : `${selected.size} ${
                  selected.size === 1 ? "Bild" : "Bilder"
                } entfernen`}
          </button>
        )}
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {assets.map((asset) => {
          const isSelected = selected.has(asset.id);

          return (
            <li key={asset.id}>
              <button
                type="button"
                onClick={() => toggle(asset.id)}
                aria-pressed={isSelected}
                className="group relative block w-full overflow-hidden rounded-lg"
              >
                {/*
                  Bewusst ein einfaches img-Element statt next/image: Diese
                  Bilder liegen hinter einer Anmeldung. Vercels Bildoptimierung
                  würde sie holen und in einem gemeinsamen Zwischenspeicher
                  ablegen – genau das, was bei Kundenfotos nicht passieren darf.
                */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/portal/bild/${asset.id}?w=400${
                    asClient ? "&ansicht=kunde" : ""
                  }`}
                  alt={asset.fileName}
                  loading="lazy"
                  width={asset.width ?? undefined}
                  height={asset.height ?? undefined}
                  className={`aspect-[4/5] w-full object-cover transition-opacity duration-300 ${
                    isSelected ? "opacity-55" : "group-hover:opacity-85"
                  }`}
                />

                <span
                  aria-hidden
                  className={`absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border text-[13px] transition-colors duration-200 ${
                    isSelected
                      ? "border-ink bg-ink text-paper"
                      : "border-white/70 bg-black/25 text-transparent"
                  }`}
                >
                  ✓
                </span>
              </button>

              <p className="mt-2 truncate font-mono text-[11px] text-ink/50">
                {asset.fileName}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
