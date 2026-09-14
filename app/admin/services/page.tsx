import { createClient } from "@/lib/supabase/server";
import { ServiceEditor } from "@/components/admin/ServiceEditor";
import type { Service } from "@/types";

export default async function AdminServicesPage() {
  const supabase = createClient();
  const { data: services } = await supabase.from("services").select("*").order("order_index", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">إدارة الخدمات</h1>
      <p className="mt-1 text-sm text-ink-muted">
        الخدمات مرتبطة بجدول <code>services</code> في Supabase. شغّل <code>supabase/seed.sql</code> أول مرة لتعبئتها تلقائيًا.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {(services || []).map((s) => (
          <ServiceEditor key={s.id} service={s as Service} />
        ))}
        {(!services || services.length === 0) && (
          <p className="py-8 text-center text-sm text-ink-muted">
            لا توجد خدمات في قاعدة البيانات بعد — الموقع يعرض حاليًا القائمة الافتراضية. شغّل seed.sql لتتمكن من التعديل من هنا.
          </p>
        )}
      </div>
    </div>
  );
}
