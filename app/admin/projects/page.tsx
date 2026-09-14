import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProjectRowActions } from "@/components/admin/ProjectRowActions";

export default async function AdminProjectsPage() {
  const supabase = createClient();
  const { data: projects } = await supabase.from("projects").select("*").order("order_index", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">إدارة الأعمال</h1>
        <Link href="/admin/projects/new" className="rounded-full bg-gradient-to-r from-electric to-violet px-5 py-2.5 text-sm font-medium text-white shadow-glow">
          + عمل جديد
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-start text-sm">
          <thead>
            <tr className="border-b border-black/10 text-ink-muted">
              <th className="py-2 text-start">العنوان</th>
              <th className="py-2 text-start">التصنيف</th>
              <th className="py-2 text-start">الحالة</th>
              <th className="py-2 text-start">مميز</th>
              <th className="py-2 text-start">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {(projects || []).map((p) => (
              <tr key={p.id} className="border-b border-black/5">
                <td className="py-3 text-ink">
                  <Link href={`/admin/projects/${p.id}/edit`} className="hover:text-electric-soft">{p.title_ar}</Link>
                </td>
                <td className="py-3 text-ink-muted">{p.category}</td>
                <td className="py-3 text-ink-muted">{p.visible ? "منشور" : "مخفي"}</td>
                <td className="py-3 text-ink-muted">{p.featured ? "نعم" : "—"}</td>
                <td className="py-3"><ProjectRowActions id={p.id} visible={p.visible} /></td>
              </tr>
            ))}
            {(!projects || projects.length === 0) && (
              <tr><td colSpan={5} className="py-8 text-center text-ink-muted">لا توجد أعمال بعد. ابدأ بإضافة أول عمل.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
