"use client";

import { useState } from "react";

/**
 * Die eingegangene Auswahl – und der Knopf, der im Alltag am meisten spart.
 *
 * Regina filtert in Lightroom nach Dateinamen. Vierzig Namen von einem
 * Bildschirm abzutippen dauert zehn Minuten und geht zuverlässig schief. Hier
 * ist es ein Klick, danach einmal einfügen.
 */
export default function SelectionList({
  fileNames,
}: {
  fileNames: string[];
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(fileNames.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void copy()}
        className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors duration-500 hover:bg-ink-soft"
      >
        {copied ? "Kopiert" : `${fileNames.length} Dateinamen kopieren`}
      </button>

      <pre className="mt-6 max-h-72 overflow-auto rounded-xl border border-ink/12 bg-paper/40 p-5 font-mono text-[12px] leading-6 text-ink/75">
        {fileNames.join("\n")}
      </pre>
    </div>
  );
}
