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

      <div className="mt-10">
        <PasskeyButton mode="register" inviteToken={token} label={invite.label}>
          Jetzt freischalten
        </PasskeyButton>
      </div>

      <p className="mt-12 text-sm leading-7 text-ink/60">
        Der Schlüssel bleibt auf diesem Gerät und verlässt es nie. Geht das
        Gerät verloren, lässt sich der Zugang von einem anderen Gerät aus
        entziehen.
      </p>
    </div>
  );
}
