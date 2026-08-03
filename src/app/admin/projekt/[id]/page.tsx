import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import AssetGrid from "@/components/portal/AssetGrid";
import PasswordReset from "@/components/portal/PasswordReset";
import SelectionList from "@/components/portal/SelectionList";
import Uploader from "@/components/portal/Uploader";
import { db, schema } from "@/lib/db";
import { getAdminUser } from "@/lib/portal/session";
import { getProjectById, STATUS_LABEL } from "@/lib/portal/projects";
import { siteUrl } from "@/lib/site";
import { deleteAsset, setStatus, setWatermark } from "./actions";

export const metadata = { title: "Galerie" };

const dateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default async function ProjektPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await getAdminUser())) redirect("/admin/anmelden");

  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const assets = await db()
    .select({
      id: schema.assets.id,
      kind: schema.assets.kind,
      fileName: schema.assets.fileName,
      byteSize: schema.assets.byteSize,
      width: schema.assets.width,
      height: schema.assets.height,
    })
    .from(schema.assets)
    .where(eq(schema.assets.projectId, project.id))
    .orderBy(asc(schema.assets.sortIndex));

  const chosen = await db()
    .select({ fileName: schema.assets.fileName })
    .from(schema.favorites)
    .innerJoin(schema.assets, eq(schema.assets.id, schema.favorites.assetId))
    .where(eq(schema.favorites.projectId, project.id))
    .orderBy(asc(schema.assets.sortIndex));

  const previews = assets.filter((a) => a.kind === "preview");
  const finals = assets.filter((a) => a.kind === "final");
  const bytes = assets.reduce((sum, a) => sum + a.byteSize, 0);

  return (
    <div>
      <p className="eyebrow text-ink/55">
        <Link href="/admin" className="underline underline-offset-4">
          Galerien
        </Link>
      </p>
      <h1 className="display-lg mt-5 text-ink">{project.title}</h1>
      <p className="mt-4 text-base leading-8 text-ink/70">
        {project.clientName} · {STATUS_LABEL[project.status]} · gültig bis{" "}
        {dateFormat.format(project.expiresAt)} ·{" "}
        {project.watermarkEnabled ? "Wasserzeichen an" : "ohne Wasserzeichen"}
      </p>

      <p className="mt-2 break-all font-mono text-sm text-ink/55">
        {siteUrl}/galerie/{project.slug}
      </p>

      <div className="mt-8">
        <PasswordReset
          projectId={project.id}
          galleryUrl={`${siteUrl}/galerie/${project.slug}`}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <form action={setWatermark}>
          <input type="hidden" name="projectId" value={project.id} />
          <input
            type="hidden"
            name="enabled"
            value={project.watermarkEnabled ? "aus" : "an"}
          />
          <button
            type="submit"
            className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-ink/25 px-6 text-sm font-medium text-ink transition-colors duration-500 hover:border-ink/55"
          >
            {project.watermarkEnabled
              ? "Wasserzeichen ausschalten"
              : "Wasserzeichen einschalten"}
          </button>
        </form>

        {project.status === "draft" && previews.length > 0 && (
          <form action={setStatus}>
            <input type="hidden" name="projectId" value={project.id} />
            <input type="hidden" name="status" value="selecting" />
            <button
              type="submit"
              className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-colors duration-500 hover:bg-ink-soft"
            >
              Für die Kundschaft freigeben
            </button>
          </form>
        )}

        {project.status === "selecting" && (
          <form action={setStatus}>
            <input type="hidden" name="projectId" value={project.id} />
            <input type="hidden" name="status" value="draft" />
            <button
              type="submit"
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-ink/25 px-6 text-sm font-medium text-ink transition-colors duration-500 hover:border-ink/55"
            >
              Freigabe zurücknehmen
            </button>
          </form>
        )}
      </div>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-ink">
          Auswahlbilder{previews.length > 0 && ` (${previews.length})`}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-8 text-ink/70">
          Was die Kundschaft zur Auswahl sieht. Lade hier die vollen JPEGs hoch
          – ausgeliefert wird verkleinert und, wenn eingeschaltet, mit
          Wasserzeichen. Das Original verlässt den Speicher nicht.
        </p>

        <div className="mt-8">
          <Uploader projectId={project.id} kind="preview" />
        </div>

        {previews.length > 0 && (
          <AssetGrid
            assets={previews}
            projectId={project.id}
            watermarkEnabled={project.watermarkEnabled}
            onDelete={deleteAsset}
          />
        )}
      </section>

      {chosen.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl text-ink">
            Ausgewählt ({chosen.length})
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-8 text-ink/70">
            {project.status === "selecting"
              ? "Die Auswahl läuft noch – das Paar kann sie bis zum Abschicken ändern."
              : "Diese Bilder hat sich das Paar gewünscht. In Lightroom nach den Dateinamen filtern."}
          </p>
          <div className="mt-8">
            <SelectionList fileNames={chosen.map((c) => c.fileName)} />
          </div>
        </section>
      )}

      <section className="mt-20">
        <h2 className="font-display text-2xl text-ink">
          Enddateien{finals.length > 0 && ` (${finals.length})`}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-8 text-ink/70">
          Die bearbeiteten Bilder in voller Auflösung. Erst wenn die hier
          liegen, kann die Kundschaft herunterladen.
        </p>

        <div className="mt-8">
          <Uploader projectId={project.id} kind="final" />
        </div>
      </section>

      {assets.length > 0 && (
        <p className="mt-16 text-sm text-ink/55">
          {assets.length} Dateien · {(bytes / 1024 / 1024).toFixed(1)} MB
          belegt
        </p>
      )}
    </div>
  );
}
