"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getAuthorizedUser } from "@/lib/utils";
import type { RequestStatus } from "@/types";

const requestSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  phone: z.string().min(6, "رقم الجوال غير صحيح"),
  email: z.string().email().optional().or(z.literal("")),
  service: z.string().min(1, "اختر نوع الخدمة"),
  description: z.string().min(5, "أضف وصفًا للطلب"),
  budget: z.string().optional(),
  deadline: z.string().optional(),
});

const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_REQUESTS = 3;

function getClientIp() {
  const h = headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

// Verifies the Cloudflare Turnstile token server-side. If no secret key
// is configured yet (TURNSTILE_SECRET_KEY empty), the check is skipped
// so the site keeps working before Turnstile is set up — set the key
// in production to actually enforce it.
async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

// Public: anyone can submit a service request. RLS on `requests` only
// allows INSERT for anonymous/public callers — no read/update/delete.
// Three layers of abuse protection run before anything is saved:
// Turnstile (bot check) -> IP rate limit -> zod validation.
export async function submitServiceRequest(formData: FormData) {
  const ip = getClientIp();

  const turnstileToken = String(formData.get("cf-turnstile-response") || "");
  const humanVerified = await verifyTurnstile(turnstileToken, ip);
  if (!humanVerified) {
    return { ok: false as const, error: "تعذر التحقق الأمني، أعد المحاولة" };
  }

  // Rate limit: uses the service-role client ONLY for this internal count —
  // public visitors never get read access to the requests table via RLS.
  const admin = createAdminClient();
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
  const { count } = await admin
    .from("requests")
    .select("id", { count: "exact", head: true })
    .eq("ip_address", ip)
    .gte("created_at", since);

  if ((count ?? 0) >= RATE_LIMIT_MAX_REQUESTS) {
    return { ok: false as const, error: "لقد أرسلت عدة طلبات مؤخرًا، حاول مرة أخرى بعد قليل" };
  }

  const raw = {
    name: String(formData.get("name") || ""),
    phone: String(formData.get("phone") || ""),
    email: String(formData.get("email") || ""),
    service: String(formData.get("service") || ""),
    description: String(formData.get("description") || ""),
    budget: String(formData.get("budget") || ""),
    deadline: String(formData.get("deadline") || ""),
  };

  const parsed = requestSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message || "بيانات غير صحيحة" };
  }

  let files: { name: string; url: string }[] = [];
  const filesRaw = String(formData.get("files_json") || "");
  if (filesRaw) {
    try {
      files = JSON.parse(filesRaw);
    } catch {
      files = [];
    }
  }

  const supabase = createClient();
  const { error } = await supabase.from("requests").insert({
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    service: parsed.data.service,
    description: parsed.data.description,
    budget: parsed.data.budget || null,
    deadline: parsed.data.deadline || null,
    files,
    ip_address: ip,
  });

  if (error) return { ok: false as const, error: "تعذر حفظ الطلب، حاول مرة أخرى" };
  return { ok: true as const };
}

// Admin only below ------------------------------------------------

export async function updateRequestStatus(id: string, status: RequestStatus) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const supabase = createClient();
  const { error } = await supabase.from("requests").update({ status }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/requests");
  return { ok: true as const };
}

export async function updateRequestNotes(id: string, internal_notes: string) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const supabase = createClient();
  const { error } = await supabase.from("requests").update({ internal_notes }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/requests");
  return { ok: true as const };
}

export async function deleteRequest(id: string) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const supabase = createClient();
  const { error } = await supabase.from("requests").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/requests");
  return { ok: true as const };
}
