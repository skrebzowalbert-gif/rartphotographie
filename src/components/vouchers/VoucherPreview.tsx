/**
 * Vorschau des Gutscheins.
 *
 * WICHTIG: Diese Grafik bildet exakt das nach, was `src/lib/voucher-pdf.ts`
 * erzeugt. Die Koordinaten stammen aus derselben Quelle – das PDF ist 842×595
 * Punkt groß (A4 quer). PDF rechnet die Y-Achse von unten, SVG von oben,
 * deshalb gilt: y_svg = 595 − y_pdf.
 *
 * Wird das PDF-Layout geändert, muss diese Datei mitgeändert werden. Beide
 * Dateien verweisen aufeinander.
 *
 * Warum eine Nachbildung und kein echtes PDF im Browser: Eingebettete PDFs
 * lassen sich auf Mobilgeräten kaum zuverlässig darstellen, blockieren das
 * Scrollen und laden zusätzliche Megabyte. Eine SVG-Grafik ist wenige
 * Kilobyte groß, skaliert verlustfrei und ist für Screenreader lesbar.
 */
const SAND = "#e9e1d6";
const INK = "#16120f";
const INK_SOFT = "#59504a";

/*
  Die Vorschau muss zeigen, was wirklich gedruckt wird – nicht mehr und nicht
  weniger. Im PDF ist Playfair Display eingebettet, für die Kleinschrift bleibt
  Helvetica (siehe Begründung in voucher-pdf.ts). Genau so steht es hier.
*/
const SERIF = "var(--font-playfair), Georgia, serif";
const SANS = "Helvetica, Arial, sans-serif";

const LEFT = 74;
const col = (n: number) => LEFT + n * 174;

/** y_svg = 595 − y_pdf */
const y = (pdfY: number) => 595 - pdfY;

export default function VoucherPreview({
  amount = "250 €",
  code = "RA-XPND-3DVP",
  recipient = "Anna",
  buyer = "Sebastian",
  validUntil = "31. Dezember 2029",
  message = "Für dich – weil du dir mal Zeit für schöne Bilder nehmen sollst.",
  className = "",
}: {
  amount?: string;
  code?: string;
  recipient?: string;
  buyer?: string;
  validUntil?: string;
  message?: string;
  className?: string;
}) {
  const fields: [string, string][] = [
    ["GUTSCHEINCODE", code],
    ["FÜR", recipient],
    ["VON", buyer],
    ["GÜLTIG BIS", validUntil],
  ];

  return (
    <svg
      viewBox="0 0 842 595"
      className={className}
      role="img"
      aria-label={`Beispiel des Gutscheins: Wertgutschein über ${amount} für ein Fotoshooting bei R.ArtPhotographie, gültig bis ${validUntil}`}
    >
      <rect width="842" height="595" fill={SAND} />
      <rect
        x="34"
        y="34"
        width="774"
        height="527"
        fill="none"
        stroke={INK}
        strokeWidth="0.8"
      />

      <text
        x={LEFT}
        y={y(505)}
        fill={INK_SOFT}
        fontSize="11"
        fontFamily={SANS}
        fontWeight="700"
        letterSpacing="0.5"
      >
        R.ARTPHOTOGRAPHIE
      </text>
      <text
        x={LEFT}
        y={y(488)}
        fill={INK_SOFT}
        fontSize="10"
        fontFamily={SANS}
      >
        Fotografie in Kaufbeuren und im Allgäu
      </text>

      <text
        x={LEFT}
        y={y(420)}
        fill={INK}
        fontSize="42"
        fontFamily={SERIF}
      >
        Wertgutschein
      </text>
      <text
        x={LEFT}
        y={y(388)}
        fill={INK_SOFT}
        fontSize="20"
        fontStyle="italic"
        fontFamily={SERIF}
      >
        für ein Fotoshooting
      </text>

      <text
        x={LEFT}
        y={y(316)}
        fill={INK}
        fontSize="54"
        fontFamily={SERIF}
      >
        {amount}
      </text>

      <line
        x1={LEFT}
        y1={y(292)}
        x2={842 - LEFT}
        y2={y(292)}
        stroke={INK}
        strokeWidth="0.8"
      />

      {fields.map(([label, value], index) => (
        <g key={label}>
          <text
            x={col(index)}
            y={y(264)}
            fill={INK_SOFT}
            fontSize="8"
            fontWeight="700"
            letterSpacing="0.6"
            fontFamily={SANS}
          >
            {label}
          </text>
          <text
            x={col(index)}
            y={y(242)}
            fill={INK}
            fontSize="13"
            fontFamily={SANS}
          >
            {value}
          </text>
        </g>
      ))}

      {message && (
        <>
          <text
            x={LEFT}
            y={y(202)}
            fill={INK_SOFT}
            fontSize="8"
            fontWeight="700"
            letterSpacing="0.6"
            fontFamily={SANS}
          >
            PERSÖNLICHE NACHRICHT
          </text>
          <text
            x={LEFT}
            y={y(180)}
            fill={INK}
            fontSize="13"
            fontStyle="italic"
            fontFamily={SERIF}
          >
            {message}
          </text>
        </>
      )}

      <line
        x1={LEFT}
        y1={y(112)}
        x2={842 - LEFT}
        y2={y(112)}
        stroke={INK_SOFT}
        strokeWidth="0.5"
      />

      <text
        x={LEFT}
        y={y(92)}
        fill={INK_SOFT}
        fontSize="10"
        fontFamily={SANS}
      >
        Einlösbar für Portrait, Familie, Babybauch, Newborn und Hochzeit.
      </text>
      <text
        x={LEFT}
        y={y(76)}
        fill={INK_SOFT}
        fontSize="10"
        fontFamily={SANS}
      >
        Zum Einlösen einfach diesen Code bei der Anfrage angeben.
      </text>
      <text
        x={LEFT}
        y={y(54)}
        fill={INK_SOFT}
        fontSize="9"
        fontFamily={SANS}
      >
        Regina Gerdt · Hirtenstraße 16 · 87600 Kaufbeuren · rartphotographie.de
      </text>
      <text
        x={842 - LEFT}
        y={y(54)}
        fill={INK_SOFT}
        fontSize="9"
        textAnchor="end"
        fontFamily={SANS}
      >
        Bestellnummer RART-20260728-4070
      </text>
    </svg>
  );
}
