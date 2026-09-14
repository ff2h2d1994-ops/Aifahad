import { createClient } from "@/lib/supabase/server";
import { ReviewRow } from "@/components/admin/ReviewRow";
import type { Review } from "@/types";

export default async function AdminReviewsPage() {
  const supabase = createClient();
  const { data: reviews } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">تقييمات العملاء</h1>
      <div className="mt-6 flex flex-col gap-3">
        {((reviews || []) as Review[]).map((r) => (
          <ReviewRow key={r.id} review={r} />
        ))}
        {(!reviews || reviews.length === 0) && (
          <p className="py-8 text-center text-sm text-ink-muted">لا توجد تقييمات بعد.</p>
        )}
      </div>
    </div>
  );
}
