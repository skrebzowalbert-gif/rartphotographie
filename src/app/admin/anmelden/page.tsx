import Link from "next/link";
import { redirect } from "next/navigation";
import PasskeyButton from "@/components/portal/PasskeyButton";
import { hasAdmin } from "@/lib/portal/admin-auth";
import { getAdminUser } from "@/lib/portal/session";

export default async function AnmeldenPage() {
  if (await getAdminUser()) redirect("/admin");

  // Ohne eingerichteten Zugang wäre ein Anmeldeknopf eine Sackgasse.
  if (!(await hasAdmin())) {
    return (
      <div className="mx-auto max-w-xl">
        <p className="eyebrow text-ink/55">Verwaltung</p>
        <h1 className="display-lg mt-5 text-ink">Noch nicht eingerichtet</h1>
        <p className="mt-6 text-base leading-8 text-ink/75">
          Für dieses Portal wurde noch kein Zugang angelegt. Das geht einmalig
          über den Einrichtungslink mit dem Einrichtungs-Token.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <p className="eyebrow text-ink/55">Verwaltung</p>
      <h1 className="display-lg mt-5 text-ink">
        Willkommen <span className="accent-italic">zurück</span>
      </h1>
      <p className="mt-6 text-base leading-8 text-ink/75">
        Ein Klick, dann Face ID oder Fingerabdruck. Es gibt hier kein Passwort,
        das jemand erraten oder dir entlocken könnte.
      </p>

      <div className="mt-10">
        <PasskeyButton mode="login">Mit Passkey anmelden</PasskeyButton>
      </div>

      {/*
        Hier stand vorher "lege auf einem bekannten Gerät einen weiteren
        Passkey an". Das half niemandem, der genau dieses bekannte Gerät nicht
        hat – und das ist der Normalfall, wenn ein Handy neu dazukommt. Was
        wirklich zu tun ist: einen Einladungslink anfordern.
      */}
      <p className="mt-12 text-sm leading-7 text-ink/60">
        Neues Gerät? Es braucht einen Einladungslink von einem Gerät, das schon
        freigeschaltet ist. Der Link gilt dreißig Minuten und schaltet genau ein
        Gerät frei.{" "}
        <Link href="/" className="underline underline-offset-4">
          Zurück zur Website
        </Link>
      </p>
    </div>
  );
}
