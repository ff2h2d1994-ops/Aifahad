"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthorizedUser } from "@/lib/utils";

// Public: fired once per page visit from <ViewTracker>. Deliberately
// minimal — no IP, no user agent, just a path and a timestamp for a
// simple visit counter. RLS only allows INSERT for the public, never
// SELECT, so a visitor can never read the counter data.
export async function logPageView(path: string) {
  const safePath = String(path || "/").slice(0, 200);
  const supabase = createClient();
  await supabase.from("page_views").insert({ path: safePath });
  // Intentionally no return value / error surfaced — a failed view log
  // should never disrupt the person browsing the site.
}

const reviewSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(3, "أضف تعليقًا قصيرًا عن تجربتك"),
  service: z.string().optional(),
});

// Public: anyone can submit a review. It stays hidden (approved = false)
// until the admin approves it — protects the public testimonials list
// from spam or abuse.
export async function submitReview(formData: FormData) {
  const parsed = reviewSchema.safeParse({
    name: String(formData.get("name") || ""),
    rating: formData.get("rating"),
    comment: String(formData.get("comment") || ""),
    service: String(formData.get("service") || ""),
  });

  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message || "بيانات غير صحيحة" };
  }

  const supabase = createClient();
  const { error } = await supabase.from("reviews").insert({
    name: parsed.data.name,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
    service: parsed.data.service || null,
  });

  if (error) return { ok: false as const, error: "تعذر إرسال التقييم، حاول مرة أخرى" };
  return { ok: true as const };
}

// Admin only ---------------------------------------------------------

export async function setReviewApproved(id: string, approved: boolean) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const supabase = createClient();
  const { error } = await supabase.from("reviews").update({ approved }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  return { ok: true as const };
}

export async function deleteReview(id: string) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const supabase = createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  return { ok: true as const };
}
