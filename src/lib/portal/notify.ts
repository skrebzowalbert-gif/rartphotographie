import "server-only";

import { emailShell, getResendConfig, row } from "@/lib/email";
import { siteUrl } from "@/lib/site";

/**
 * Regina erfährt von einer eingegangenen Auswahl.
 *
 * Die Mail enthält die Dateinamen im Klartext – genau das braucht sie, um in
 * Lightroom zu filtern. Der Weg über das Portal ("Dateinamen kopieren") ist
 * bequemer, aber die Mail funktioniert auch am Handy in der Bahn.
 */
export async function notifySelection(params: {
  title: string;
  clientName: string;
  projectId: string;
  fileNames: string[];
}) {
  /*
    Aus der Entwicklung wird nicht gemailt.

    Sonst bekaeme Regina bei jedem Testlauf eine Nachricht ueber eine Auswahl,
    die es gar nicht gibt – und der Versand haengt im Testlauf spuerbar.
  */
  if ((process.env.PORTAL_ORIGIN ?? "").includes("localhost")) {
    console.info(
      `[Entwicklung] Benachrichtigung unterdrückt: ${params.title}, ${params.fileNames.length} Bilder`
    );
    return;
  }

  const config = getResendConfig();
  if (!config.ok) {
    console.warn("Keine Mail-Konfiguration – Auswahl bleibt nur im Portal.");
    return;
  }

  const list = params.fileNames.join("\n");

  const { error } = await config.resend.emails.send({
    from: config.fromEmail,
    to: config.toEmail,
    subject: `Auswahl eingegangen: ${params.title} (${params.fileNames.length} Bilder)`,
    // Nur-Text mitschicken: Wer die Liste am Telefon kopieren will, kommt so
    // ohne Formatierungsreste an die reinen Dateinamen.
    text: `${params.clientName} hat ${params.fileNames.length} Bilder ausgewählt.\n\n${list}\n\n${siteUrl}/admin/projekt/${params.projectId}`,
    html: emailShell(
      "Eine Auswahl ist eingegangen",
      [
        row("Galerie", params.title),
        row("Kundin oder Kunde", params.clientName),
        row("Ausgewählte Bilder", params.fileNames.length),
        `<p style="margin:24px 0 8px;"><strong>Dateinamen</strong></p>`,
        `<pre style="margin:0;padding:16px;background:#f4efe8;border-radius:12px;font-size:13px;line-height:1.7;white-space:pre-wrap;word-break:break-all;">${params.fileNames
          .map((n) => n.replace(/[<>&]/g, ""))
          .join("\n")}</pre>`,
        `<p style="margin:24px 0 0;"><a href="${siteUrl}/admin/projekt/${params.projectId}">Im Portal öffnen</a></p>`,
      ].join("")
    ),
  });

  if (error) throw new Error(String(error));
}

/**
 * Regina erfährt, dass eine Galerie bald abläuft.
 *
 * AN REGINA, NICHT AN DAS PAAR – und das ist keine Bequemlichkeit, sondern
 * eine Folge des Entwurfs: Kundschaft hat in diesem Portal kein Konto. Es gibt
 * kein Passwort-vergessen, keine E-Mail-Enumeration und keine halbe
 * Angriffsfläche, weil wir schlicht keine Adressen speichern. Der Preis dafür
 * steht hier: Wir können das Paar nicht erinnern.
 *
 * Regina kann es. Sie hat die Nummer im Telefon und weiß, wie sie die beiden
 * erreicht. Diese Mail gibt ihr den Anstoß und die Frist – den Rest macht ein
 * Mensch, und bei Hochzeitsbildern ist das ohnehin die bessere Fassung.
 */
export async function sendExpiryReminder(params: {
  title: string;
  clientName: string;
  slug: string;
  expiresAt: Date;
}) {
  if ((process.env.PORTAL_ORIGIN ?? "").includes("localhost")) {
    console.info(`[Entwicklung] Ablauf-Erinnerung unterdrückt: ${params.title}`);
    return;
  }

  const config = getResendConfig();
  if (!config.ok) {
    console.warn("Keine Mail-Konfiguration – Ablauf-Erinnerung entfällt.");
    return;
  }

  const datum = new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(params.expiresAt);

  const { error } = await config.resend.emails.send({
    from: config.fromEmail,
    to: config.toEmail,
    subject: `Läuft bald ab: ${params.title} (${datum})`,
    text: [
      `Die Galerie "${params.title}" für ${params.clientName} läuft am ${datum} ab.`,
      "",
      "Danach werden die Bilder gelöscht und lassen sich nicht wiederherstellen.",
      "",
      `${siteUrl}/galerie/${params.slug}`,
      "",
      "Falls die beiden noch nicht heruntergeladen haben, sag ihnen kurz Bescheid.",
      "Das Portal kann das nicht: Wir speichern bewusst keine Adressen der Kundschaft.",
    ].join("\n"),
    html: emailShell(
      "Eine Galerie läuft bald ab",
      [
        row("Galerie", params.title),
        row("Kundin oder Kunde", params.clientName),
        row("Läuft ab am", datum),
        `<p style="margin:20px 0 0;">
           <a href="${siteUrl}/galerie/${params.slug}">Galerie öffnen</a>
         </p>`,
        `<p style="margin:20px 0 0;color:#555;font-size:14px;">
           Danach werden die Bilder gelöscht. Falls die beiden noch nicht
           heruntergeladen haben, sag ihnen kurz Bescheid – das Portal kann das
           nicht, wir speichern bewusst keine Adressen der Kundschaft.
         </p>`,
      ].join("")
    ),
  });

  if (error) console.error("Ablauf-Erinnerung fehlgeschlagen:", error);
}
