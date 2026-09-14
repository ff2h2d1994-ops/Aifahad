"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { setReviewApproved, deleteReview } from "@/lib/actions/analytics";
import { useToast } from "@/components/ToastProvider";
import type { Review } from "@/types";

export function ReviewRow({ review }: { review: Review }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-display text-sm text-ink">{review.name}</p>
            <div className="flex" dir="ltr">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-ember text-ember" : "text-ink-muted/30"}`} />
              ))}
            </div>
          </div>
          {review.service && <p className="mt-0.5 text-xs text-ink-muted">{review.service}</p>}
          <p className="mt-2 max-w-lg text-sm text-ink-muted">{review.comment}</p>
          <p className="mt-1 text-xs text-ink-muted/70">
            {new Date(review.created_at).toLocaleString("ar-SA")} · {review.approved ? "منشور" : "بانتظار الموافقة"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <button
            disabled={pending}
            onClick={() => startTransition(async () => {
              const res = await setReviewApproved(review.id, !review.approved);
              if (res.ok) toast(review.approved ? "تم إخفاء التقييم" : "تم نشر التقييم", "success");
              else toast(res.error, "error");
              router.refresh();
            })}
            className="rounded-full border border-black/10 px-3 py-1 text-xs text-ink-muted hover:text-ink"
          >
            {review.approved ? "إخفاء" : "نشر"}
          </button>
          <button
            onClick={() => {
              if (confirm("حذف هذا التقييم نهائيًا؟")) {
                startTransition(async () => {
                  const res = await deleteReview(review.id);
                  if (res.ok) toast("تم حذف التقييم", "success");
                  else toast(res.error, "error");
                  router.refresh();
                });
              }
            }}
            className="text-xs text-red-600 hover:underline"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}
