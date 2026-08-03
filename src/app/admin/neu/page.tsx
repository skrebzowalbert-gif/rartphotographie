import { redirect } from "next/navigation";
import NewProjectForm from "./NewProjectForm";
import { getAdminUser } from "@/lib/portal/session";
import { siteUrl } from "@/lib/site";

export const metadata = { title: "Neue Galerie" };

export default async function NeuPage() {
  // Zugriffsschutz in der Seite selbst, nicht in einer vorgelagerten Schicht.
  if (!(await getAdminUser())) redirect("/admin/anmelden");

  return (
    <div>
      <p className="eyebrow text-ink/55">Verwaltung</p>
      <h1 className="display-lg mt-5 text-ink">
        Neue <span className="accent-italic">Galerie</span>
      </h1>
      <NewProjectForm origin={siteUrl} />
    </div>
  );
}
