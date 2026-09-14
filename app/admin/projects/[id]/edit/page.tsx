import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/ProjectForm";
import type { Project } from "@/types";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: project } = await supabase.from("projects").select("*").eq("id", params.id).single();
  if (!project) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">تعديل العمل</h1>
      <div className="mt-6">
        <ProjectForm project={project as Project} />
      </div>
    </div>
  );
}
