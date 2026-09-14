import { createClient } from "@/lib/supabase/server";
import { RequestRow } from "@/components/admin/RequestRow";
import type { ServiceRequest } from "@/types";

export default async function AdminRequestsPage() {
  const supabase = createClient();
  const { data: requests } = await supabase.from("requests").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">الطلبات</h1>
      <div className="mt-6 flex flex-col gap-3">
        {(requests || []).map((r) => (
          <RequestRow key={r.id} request={r as ServiceRequest} />
        ))}
        {(!requests || requests.length === 0) && (
          <p className="py-8 text-center text-sm text-ink-muted">لا توجد طلبات بعد.</p>
        )}
      </div>
    </div>
  );
}
