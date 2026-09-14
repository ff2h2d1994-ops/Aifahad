import type { Metadata } from "next";
import { Star } from "lucide-react";
import { ReviewForm } from "@/components/ReviewForm";
import { getServices, getApprovedReviews } from "@/lib/data/fetch";
import type { Review } from "@/types";

export const metadata: Metadata = {
  title: "تقييمات العملاء",
  description: "آراء وتقييمات العملاء عن خدمات فهد المشعان.",
};

export default async function ReviewsPage() {
  const [reviews, services] = await Promise.all([getApprovedReviews(), getServices()]);

  return (
    <div className="px-5 py-16">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <h1 className="font-display text-3xl text-ink">تقييمات العملاء</h1>
        <p className="mt-3 text-ink-muted">شاركنا رأيك في الخدمة التي تم تنفيذها لك.</p>
      </div>

      <ReviewForm services={services} />

      <div className="mx-auto mt-14 flex max-w-2xl flex-col gap-4">
        {(reviews as Review[]).map((r) => (
          <div key={r.id} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm text-ink">{r.name}</p>
              <div className="flex" dir="ltr">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-ember text-ember" : "text-ink-muted/30"}`} />
                ))}
              </div>
            </div>
            {r.service && <p className="mt-1 text-xs text-ink-muted">{r.service}</p>}
            <p className="mt-2 text-sm text-ink-muted">{r.comment}</p>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-sm text-ink-muted">كن أول من يقيّم تجربته.</p>
        )}
      </div>
    </div>
  );
}
