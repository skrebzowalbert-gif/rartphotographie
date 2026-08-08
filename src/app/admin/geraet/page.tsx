import Link from "next/link";
import PasskeyButton from "@/components/portal/PasskeyButton";
import { readInvite } from "@/lib/portal/invites";

export const metadata = { title: "Gerät hinzufügen" };
export const dynamic = "force-dynamic";

/**
 * Die Seite, die Regina auf ihrem Handy öffnet.
 *
 * Sie sieht hier nichts aus dem Portal – keine Galerien, keine Namen, keine
 * Kundendaten. Nur einen Satz und einen Knopf. Falls der Link doch einmal in
 * falschen Händen landet, ist auch dann nichts zu sehen, solange niemand den
 * Fingerabdruck des Geräts hat.
 */
export default async function GeraetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const invite = token ? await readInvite(token) : null;

  if (!invite) {
    return (
      <div className="mx-auto max-w-xl">
        <p className="eyebrow text-ink/55">Verwaltung</p>
        <h1 className="display-lg mt-5 text-ink">Dieser Link gilt nicht mehr</h1>
        <p className="mt-6 text-base leading-8 text-ink/75">
          Einladungen laufen nach dreißig Minuten ab und lassen sich nur einmal
          benutzen. Lass dir einfach einen neuen schicken – das dauert einen
          Moment.
        </p>
        <p className="mt-10 text-sm leading-7 text-ink/60">
          <Link href="/admin/anmelden" className="underline underline-offset-4">
            Zur Anmeldung
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="eyebrow text-ink/55">Verwaltung</p>
      <h1 className="display-lg mt-5 text-ink">
        Dieses Gerät <span className="accent-italic">freischalten</span>
      </h1>
      <p className="mt-6 text-base leading-8 text-ink/75">
        Ein Tippen, dann Face ID oder Fingerabdruck. Danach kommst du auf diesem
        Gerät jederzeit in deine Verwaltung – ohne Passwort, das jemand erraten
        oder dir entlocken könnte.
      </p>

      {/*
        Der Hinweis steht VOR dem Knopf, nicht darunter.

        Er ist keine Fußnote, sondern die häufigste Ursache dafür, dass hier
        nichts passiert: Ein Link aus WhatsApp öffnet sich im eingebauten
        Vorschaufenster, und das darf keine Passkeys anlegen. Wer erst nach dem
        Fehlschlag davon liest, hat schon einmal vergeblich getippt.
      */}
      <p className="mt-8 rounded-xl border border-ink/12 bg-paper/40 px-4 py-3 text-sm leading-7 text-ink/70">
        Wichtig: Diese Seite muss im richtigen Browser stehen – Safari auf dem
        iPhone, Chrome auf Android. Hast du den Link in WhatsApp angetippt,
        öffne ihn über das Teilen-Symbol noch einmal „in Safari“.
      </p>

      <div className="mt-10">
        <PasskeyButton mode="register" inviteToken={token} label={invite.label}>
          Jetzt freischalten
        </PasskeyButton>
      </div>

      {/*
        Ein Ausweg für den Fall, dass hier gar nichts freizuschalten ist.

        Passkeys wandern über den iCloud-Schlüsselbund von selbst aufs Telefon.
        Dann lehnt das Gerät einen zweiten für dieselbe Seite ab – richtigerweise,
        aber ohne diesen Satz sieht es nach einem kaputten Knopf aus.
      */}
      <p className="mt-8 text-sm leading-7 text-ink/60">
        Schon einmal freigeschaltet oder der Passkey vom Mac ist von selbst
        hier gelandet?{" "}
        <Link href="/admin/anmelden" className="underline underline-offset-4">
          Dann geht es direkt zur Anmeldung
        </Link>
        .
      </p>

      <p className="mt-8 text-sm leading-7 text-ink/60">
        Der Schlüssel bleibt auf diesem Gerät und verlässt es nie. Geht das
        Gerät verloren, lässt sich der Zugang von einem anderen Gerät aus
        entziehen.
      </p>
    </div>
  );
}
