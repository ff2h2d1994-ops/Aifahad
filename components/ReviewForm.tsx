"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/lib/actions/analytics";
import { useToast } from "@/components/ToastProvider";
import type { Service } from "@/types";

export function ReviewForm({ services }: { services: Service[] }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  function handleSubmit(formData: FormData) {
    formData.set("rating", String(rating));
    startTransition(async () => {
      const res = await submitReview(formData);
      if (res.ok) {
        setSubmitted(true);
        toast("شكرًا لك! سيظهر تقييمك بعد المراجعة.", "success");
      } else {
        toast(res.error, "error");
      }
    });
  }

  if (submitted) {
    return (
      <div className="glass mx-auto max-w-lg rounded-2xl p-8 text-center">
        <p className="text-ink">شكرًا لتقييمك! سيظهر بعد مراجعته من قِبل فهد.</p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="glass mx-auto flex max-w-lg flex-col gap-4 rounded-2xl p-6 md:p-8">
      <h2 className="font-display text-lg text-ink">قيّم تجربتك</h2>

      <div className="flex items-center gap-1.5" dir="ltr">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(n)}
            aria-label={`${n} نجوم`}
          >
            <Star className={`h-7 w-7 ${n <= (hoverRating || rating) ? "fill-ember text-ember" : "text-ink-muted/40"}`} />
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-ink-muted">الاسم</label>
        <input name="name" required className="rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-ink" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-ink-muted">الخدمة (اختياري)</label>
        <select name="service" className="rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-ink">
          <option value="">بدون تحديد</option>
          {services.map((s) => (
            <option key={s.id} value={s.title_ar}>{s.title_ar}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-ink-muted">تعليقك</label>
        <textarea name="comment" required rows={3} className="rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-ink" />
      </div>

      <button type="submit" disabled={pending} className="self-start rounded-full bg-gradient-to-r from-electric to-violet px-6 py-2.5 text-sm font-medium text-white shadow-glow disabled:opacity-60">
        {pending ? "جاري الإرسال…" : "إرسال التقييم"}
      </button>
    </form>
  );
}
