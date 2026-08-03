import Link from "next/link";
import { redirect } from "next/navigation";
import DeviceInvite from "@/components/portal/DeviceInvite";
import { getAdminUser } from "@/lib/portal/session";
import { listProjects, STATUS_LABEL } from "@/lib/portal/projects";

export const metadata = { title: "Übersicht" };

const dateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default async function AdminPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/anmelden");

  const projects = await listProjects();

  return (
    <div>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-ink/55">Verwaltung</p>
          <h1 className="display-lg mt-5 text-ink">
            Deine <span className="accent-italic">Galerien</span>
          </h1>
        </div>
        <Link
          href="/admin/neu"
          className="inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-full bg-ink px-7 text-sm font-medium text-paper transition-colors duration-500 hover:bg-ink-soft"
        >
          Neue Galerie
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="mt-16 max-w-xl text-base leading-8 text-ink/70">
          Noch keine Galerie angelegt. Mit &bdquo;Neue Galerie&ldquo; erstellst du
          die erste – Link und Passwort bekommst du sofort danach.
        </p>
      ) : (
        <ul className="mt-14 divide-y divide-ink/12 border-t border-ink/15">
          {projects.map((project) => (
            <li key={project.id} className="py-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h2 className="font-display text-2xl leading-tight text-ink">
                      <Link
                        href={`/admin/projekt/${project.id}`}
                        className="underline decoration-ink/20 underline-offset-8 transition-colors duration-300 hover:decoration-ink/60"
                      >
                        {project.title}
                      </Link>
                    </h2>
                    <p className="mt-1 text-sm text-ink/60">
                      {project.clientName}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm text-ink/70">
                    {project.expired
                      ? "Abgelaufen"
                      : STATUS_LABEL[project.status]}
                  </p>
                </div>

                <p className="mt-4 text-sm leading-7 text-ink/65">
                  {project.previewCount} Vorschaubilder
                  {project.favoriteCount > 0 &&
                    ` · ${project.favoriteCount} ausgewählt`}
                  {project.finalCount > 0 &&
                    ` · ${project.finalCount} Enddateien`}
                  {project.watermarkEnabled
                    ? " · Wasserzeichen an"
                    : " · ohne Wasserzeichen"}
                  {" · gültig bis "}
                  {dateFormat.format(project.expiresAt)}
                </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-20 border-t border-ink/12 pt-8">
        <DeviceInvite />
        <p className="mt-8 text-sm text-ink/55">
          Angemeldet als {admin.displayName}
        </p>
      </div>
    </div>
  );
}
