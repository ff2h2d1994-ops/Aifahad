"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthorizedUser } from "@/lib/utils";

// ---------------- Services ----------------

export async function updateServiceOrder(id: string, order_index: number) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const supabase = createClient();
  const { error } = await supabase.from("services").update({ order_index }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true as const };
}

export async function toggleServiceVisibility(id: string, visible: boolean) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const supabase = createClient();
  const { error } = await supabase.from("services").update({ visible }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true as const };
}

export async function updateServiceText(id: string, formData: FormData) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const patch = {
    title_ar: String(formData.get("title_ar") || ""),
    title_en: String(formData.get("title_en") || ""),
    description_ar: String(formData.get("description_ar") || ""),
    description_en: String(formData.get("description_en") || ""),
    icon: String(formData.get("icon") || "sparkles"),
    price_min: formData.get("price_min") ? Number(formData.get("price_min")) : null,
    price_max: formData.get("price_max") ? Number(formData.get("price_max")) : null,
    price_note: String(formData.get("price_note") || ""),
    show_price: formData.get("show_price") === "on",
  };

  const supabase = createClient();
  const { error } = await supabase.from("services").update(patch).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { ok: true as const };
}

// ---------------- Site settings (texts, contact info, logo, certificate) ----------------

export async function updateSiteSetting(key: string, value: unknown) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const supabase = createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true as const };
}

export async function updateContactSettings(formData: FormData) {
  const value = {
    whatsapp: String(formData.get("whatsapp") || ""),
    email: String(formData.get("email") || ""),
    instagram: String(formData.get("instagram") || ""),
    snapchat: String(formData.get("snapchat") || ""),
    x: String(formData.get("x") || ""),
  };
  return updateSiteSetting("contact", value);
}

export async function updateHeroSettings(formData: FormData) {
  const value = {
    title_ar: String(formData.get("title_ar") || ""),
    subtitle_ar: String(formData.get("subtitle_ar") || ""),
    tagline_ar: String(formData.get("tagline_ar") || ""),
  };
  return updateSiteSetting("hero_text", value);
}

export async function updatePaymentMethods(formData: FormData) {
  const value = {
    show: formData.get("show") === "on",
    stc_pay: String(formData.get("stc_pay") || ""),
    bank_name: String(formData.get("bank_name") || ""),
    iban: String(formData.get("iban") || ""),
    account_holder: String(formData.get("account_holder") || ""),
  };
  return updateSiteSetting("payment_methods", value);
}
