"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthorizedUser } from "@/lib/utils";
import { slugify } from "@/lib/utils";

// Every mutation here re-checks the admin session server-side, in
// addition to the middleware guard on /admin and the RLS policy on
// the `projects` table. Three independent layers on purpose.

export async function createProject(formData: FormData) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const title_ar = String(formData.get("title_ar") || "");
  const title_en = String(formData.get("title_en") || "");
  const description_ar = String(formData.get("description_ar") || "");
  const description_en = String(formData.get("description_en") || "");
  const category = String(formData.get("category") || "other");
  const featured = formData.get("featured") === "on";
  const execution_date = String(formData.get("execution_date") || "") || null;

  if (!title_ar) return { ok: false as const, error: "العنوان بالعربي مطلوب" };

  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      slug: `${slugify(title_en || title_ar)}-${Date.now().toString(36)}`,
      title_ar,
      title_en: title_en || title_ar,
      description_ar,
      description_en,
      category,
      featured,
      execution_date,
      media: [],
      before_after: [],
      links: [],
    })
    .select("id")
    .single();

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
  return { ok: true as const, id: data.id };
}

export async function updateProject(id: string, formData: FormData) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const patch: Record<string, unknown> = {
    title_ar: String(formData.get("title_ar") || ""),
    title_en: String(formData.get("title_en") || ""),
    description_ar: String(formData.get("description_ar") || ""),
    description_en: String(formData.get("description_en") || ""),
    category: String(formData.get("category") || "other"),
    featured: formData.get("featured") === "on",
    visible: formData.get("visible") === "on",
    execution_date: String(formData.get("execution_date") || "") || null,
  };

  const linksRaw = String(formData.get("links") || "").trim();
  if (linksRaw) {
    patch.links = linksRaw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [label, url] = line.split("|").map((s) => s.trim());
        return { label: label || url, url };
      });
  }

  const supabase = createClient();
  const { error } = await supabase.from("projects").update(patch).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
  return { ok: true as const };
}

export async function addProjectMedia(id: string, mediaUrl: string, type: "image" | "video") {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const supabase = createClient();
  const { data: project } = await supabase.from("projects").select("media").eq("id", id).single();
  const media = Array.isArray(project?.media) ? project.media : [];
  media.push({ type, url: mediaUrl });

  const { error } = await supabase.from("projects").update({ media }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath(`/admin/projects/${id}/edit`);
  revalidatePath("/portfolio");
  return { ok: true as const };
}

export async function removeProjectMedia(id: string, mediaUrl: string) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const supabase = createClient();
  const { data: project } = await supabase.from("projects").select("media").eq("id", id).single();
  const media = Array.isArray(project?.media) ? project.media : [];
  const next = media.filter((m: { url: string }) => m.url !== mediaUrl);

  const { error } = await supabase.from("projects").update({ media: next }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath(`/admin/projects/${id}/edit`);
  revalidatePath("/portfolio");
  return { ok: true as const };
}

export async function toggleProjectVisibility(id: string, visible: boolean) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const supabase = createClient();
  const { error } = await supabase.from("projects").update({ visible }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
  return { ok: true as const };
}

export async function reorderProject(id: string, order_index: number) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const supabase = createClient();
  const { error } = await supabase.from("projects").update({ order_index }).eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/projects");
  return { ok: true as const };
}

export async function quickAddWorkToService(opts: {
  category: string;
  title_ar: string;
  media: { type: "image" | "video"; url: string }[];
}) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };
  if (opts.media.length === 0) return { ok: false as const, error: "لم يتم رفع أي ملف" };

  const supabase = createClient();
  const { error } = await supabase.from("projects").insert({
    slug: `${slugify(opts.title_ar)}-${Date.now().toString(36)}`,
    title_ar: opts.title_ar,
    title_en: opts.title_ar,
    description_ar: "",
    description_en: "",
    category: opts.category,
    media: opts.media,
    before_after: [],
    links: [],
    visible: true,
  });

  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/portfolio");
  revalidatePath("/admin/projects");
  revalidatePath("/services");
  return { ok: true as const };
}

export async function deleteProject(id: string) {
  const admin = await getAuthorizedUser();
  if (!admin) return { ok: false as const, error: "غير مصرح" };

  const supabase = createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
  return { ok: true as const };
}
