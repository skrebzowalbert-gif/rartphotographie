import PasskeyButton from "@/components/portal/PasskeyButton";
import { hasAdmin } from "@/lib/portal/admin-auth";

/**
 * Einmalige Ersteinrichtung.
 *
 * Aufruf mit /admin/einrichten?token=… – das Token steht in den
 * Umgebungsvariablen. Sobald ein Zugang existiert, ist diese Seite wirkungslos,
 * unabhängig davon, ob das Token noch gültig ist.
 */
export default async function EinrichtenPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (await hasAdmin()) {
    return (
      <div className="mx-auto max-w-xl">
        <p className="eyebrow text-ink/55">Verwaltung</p>
        <h1 className="display-lg mt-5 text-ink">Bereits eingerichtet</h1>
        <p className="mt-6 text-base leading-8 text-ink/75">
          Es gibt schon einen Zugang. Dieser Weg ist damit geschlossen – auch
          mit gültigem Token. Weitere Geräte legst du nach der Anmeldung an.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="eyebrow text-ink/55">Verwaltung</p>
      <h1 className="display-lg mt-5 text-ink">
        Zugang <span className="accent-italic">einrichten</span>
      </h1>
      <p className="mt-6 text-base leading-8 text-ink/75">
        Einmalig: Lege einen Passkey auf diesem Gerät an. Danach meldest du dich
        immer mit Face ID, Fingerabdruck oder Geräte-PIN an – ohne Passwort.
      </p>

      <div className="mt-10">
        <PasskeyButton mode="register" setupToken={token} label="Erstes Gerät">
          Passkey anlegen
        </PasskeyButton>
      </div>

      {!token && (
        <p className="mt-8 max-w-md rounded-xl border border-ink/12 bg-paper/40 px-4 py-3 text-sm leading-7 text-ink/70">
          Es fehlt der Token in der Adresse. Der Link muss auf{" "}
          <code>?token=…</code> enden.
        </p>
      )}
    </div>
  );
}
