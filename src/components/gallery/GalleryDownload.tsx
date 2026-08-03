"use client";

import { useState } from "react";

/**
 * Der Moment, auf den das Paar wartet: die fertigen Bilder.
 *
 * Zwei Wege nebeneinander, und das ist Absicht. Das Paket ist der bequeme
 * Weg. Aber ein ZIP über mehrere hundert Megabyte über Mobilfunk ist eine
 * Zumutung – und wer nur ein Bild für eine Nachricht braucht, will nicht alles
 * laden. Deshalb steht die Einzelliste gleichberechtigt darunter.
 */
export type Enddatei = {
  id: string;
  fileName: string;
  byteSize: number;
};

export default function GalleryDownload({
  projectId,
  dateien,
  paketZuGross,
}: {
  projectId: string;
  dateien: Enddatei[];
  paketZuGross: boolean;
}) {
  const [offen, setOffen] = useState(false);

  const gesamt = dateien.reduce((summe, d) => summe + d.byteSize, 0);
  const mb = gesamt / 1024 / 1024;

  return (
    <section className="border-b border-paper/10 px-[var(--shell-x)] py-14 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow text-paper/50">Fertig bearbeitet</p>
        <h2 className="display-lg mt-5 text-paper">
          Eure Bilder sind <span className="accent-italic">da</span>
        </h2>
        <p className="mt-6 text-base leading-8 text-paper/65">
          {dateien.length} {dateien.length === 1 ? "Bild" : "Bilder"} in voller
          Auflösung, ohne Wasserzeichen. Ihr dürft sie drucken, verschenken und
          teilen.
        </p>

        {!paketZuGross ? (
          <a
            href={`/api/portal/paket/${projectId}`}
            className="mt-10 inline-flex min-h-[58px] items-center justify-center rounded-full bg-paper px-8 text-base font-medium text-ink transition-opacity duration-300 hover:opacity-85"
          >
            Alle herunterladen · {mb < 1024
              ? `${mb.toFixed(0)} MB`
              : `${(mb / 1024).toFixed(1)} GB`}
          </a>
        ) : (
          <p className="mt-10 text-base leading-8 text-paper/65">
            Für ein einzelnes Paket sind das zu viele Daten. Lade die Bilder
            bitte einzeln herunter – die Liste steht unten.
          </p>
        )}

        <div className="mt-8">
          <button
            type="button"
            onClick={() => setOffen((v) => !v)}
            aria-expanded={offen}
            className="text-sm text-paper/55 underline decoration-paper/25 underline-offset-4 transition-colors duration-300 hover:text-paper"
          >
            {offen ? "Liste schließen" : "Einzeln herunterladen"}
          </button>
        </div>

        {offen && (
          <ul className="mx-auto mt-8 max-w-xl divide-y divide-paper/10 border-t border-paper/15 text-left">
            {dateien.map((datei) => (
              <li
                key={datei.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <span className="font-mono text-sm text-paper/70">
                  {datei.fileName}
                </span>
                <a
                  href={`/api/portal/datei/${datei.id}`}
                  className="text-sm text-paper/60 underline decoration-paper/25 underline-offset-4 transition-colors duration-300 hover:text-paper"
                >
                  {(datei.byteSize / 1024 / 1024).toFixed(1)} MB laden
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
