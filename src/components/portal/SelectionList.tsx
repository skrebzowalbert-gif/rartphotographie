"use client";

import { useState } from "react";

/**
 * Die eingegangene Auswahl – und der Knopf, der im Alltag am meisten spart.
 *
 * Der Gedanke dahinter: Regina hat vierzig Dateinamen auf dem Bildschirm und
 * dieselben vierzig Bilder in Lightroom unter Hunderten liegen. Abtippen
 * dauert zehn Minuten und geht zuverlässig schief – ein vertippter Name führt
 * zum falschen Bild, und das merkt man erst beim Ausliefern.
 *
 * Zwei Formen, weil es zwei Verwendungen gibt:
 *
 * – Für den Filter: alle Namen in EINER Zeile, durch Leerzeichen getrennt und
 *   ohne Endung. Das Suchfeld der Filterleiste ist einzeilig; Zeilenumbrüche
 *   kommen dort gar nicht erst an. Die Endung fällt weg, damit der Name auch
 *   die RAW-Datei findet: In der Galerie liegt "IMG_5457.jpeg", auf Reginas
 *   Platte "IMG_5457.CR2" – mit Endung fände die Suche nichts.
 *
 * – Als Liste: zeilenweise, zum Ablegen oder Weiterschicken.
 */
export default function SelectionList({
  fileNames,
}: {
  fileNames: string[];
}) {
  const [kopiert, setKopiert] = useState<"filter" | "liste" | null>(null);

  const ohneEndung = fileNames.map((name) => name.replace(/\.[^.]+$/, ""));

  async function copy(was: "filter" | "liste") {
    await navigator.clipboard.writeText(
      was === "filter" ? ohneEndung.join(" ") : fileNames.join("\n")
    );
    setKopiert(was);
    setTimeout(() => setKopiert(null), 2500);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void copy("filter")}
          className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors duration-500 hover:bg-ink-soft"
        >
          {kopiert === "filter"
            ? "Kopiert"
            : `${fileNames.length} Namen für den Lightroom-Filter`}
        </button>

        <button
          type="button"
          onClick={() => void copy("liste")}
          className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-ink/20 px-6 text-sm font-medium text-ink transition-colors duration-300 hover:border-ink/50"
        >
          {kopiert === "liste" ? "Kopiert" : "Als Liste kopieren"}
        </button>
      </div>

      <p className="mt-5 max-w-2xl text-sm leading-7 text-ink/65">
        In Lightroom Classic:{" "}
        <strong className="font-medium text-ink">Bibliothek</strong> →
        Filterleiste einblenden (Taste{" "}
        <kbd className="rounded border border-ink/20 px-1.5 py-0.5 font-mono text-[11px]">
          \
        </kbd>
        ) → <strong className="font-medium text-ink">Text</strong> →{" "}
        <em>Dateiname</em> → <em>Enthält</em>, dann einfügen. Es erscheinen
        genau die ausgewählten Bilder; die markierst du alle und vergibst eine
        Farbmarkierung oder legst eine Sammlung an.
      </p>

      <pre className="mt-6 max-h-72 overflow-auto rounded-xl border border-ink/12 bg-paper/40 p-5 font-mono text-[12px] leading-6 text-ink/75">
        {fileNames.join("\n")}
      </pre>
    </div>
  );
}
