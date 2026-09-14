import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">إضافة عمل جديد</h1>
      <p className="mt-1 text-sm text-ink-muted">أنشئ العمل أولًا ثم ارفع الصور والفيديو من صفحة التعديل.</p>
      <div className="mt-6">
        <ProjectForm />
      </div>
    </div>
  );
}
