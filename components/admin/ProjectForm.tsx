"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject, addProjectMedia, removeProjectMedia } from "@/lib/actions/projects";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";
import { MEDIA_RULES, validateFile } from "@/lib/uploads";
import type { Project } from "@/types";

const CATEGORIES = ["ai", "photo", "design", "video", "audio", "web", "data", "shopping", "travel", "consulting", "content", "other"];

export function ProjectForm({ project }: { project?: Project }) {
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const toast = useToast();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!project) return; // uploads only make sense once the project exists
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selected = Array.from(files);
    for (const file of selected) {
      const validationError = validateFile(file, MEDIA_RULES);
      if (validationError) {
        toast(validationError, "error");
        e.target.value = "";
        return;
      }
    }

    setUploading(true);
    try {
      const supabase = createClient();
      let successCount = 0;
      for (const file of selected) {
        const isVideo = file.type.startsWith("video");
        const path = `${project.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
        const { error: upErr } = await supabase.storage.from("media").upload(path, file);
        if (!upErr) {
          const { data } = supabase.storage.from("media").getPublicUrl(path);
          await addProjectMedia(project.id, data.publicUrl, isVideo ? "video" : "image");
          successCount++;
        } else {
          toast(`تعذر رفع "${file.name}"`, "error");
        }
      }
      if (successCount > 0) toast(`تم رفع ${successCount} ملف بنجاح`, "success");
      router.refresh();
    } finally {
      setUploading(false);
    }
  }

  async function handleRemoveMedia(mediaUrl: string) {
    if (!project) return;
    if (!confirm("حذف هذا الملف من العمل؟")) return;
    startTransition(async () => {
      const res = await removeProjectMedia(project.id, mediaUrl);
      if (res.ok) {
        toast("تم حذف الملف", "success");
        router.refresh();
      } else {
        toast(res.error, "error");
      }
    });
  }

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const res = project ? await updateProject(project.id, formData) : await createProject(formData);
      if (!res.ok) {
        setError(res.error);
        toast(res.error, "error");
        return;
      }
      toast(project ? "تم حفظ التعديلات" : "تم إنشاء العمل", "success");
      if (!project && "id" in res) {
        router.push(`/admin/projects/${res.id}/edit`);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <form action={handleSubmit} className="glass flex flex-col gap-4 rounded-2xl p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="العنوان (عربي)" name="title_ar" defaultValue={project?.title_ar} required />
        <TextField label="العنوان (إنجليزي)" name="title_en" defaultValue={project?.title_en} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextArea label="الوصف (عربي)" name="description_ar" defaultValue={project?.description_ar} />
        <TextArea label="الوصف (إنجليزي)" name="description_en" defaultValue={project?.description_en} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-ink-muted">التصنيف</label>
          <select name="category" defaultValue={project?.category || "other"} className="rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm text-ink">
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <TextField label="تاريخ التنفيذ" name="execution_date" type="date" defaultValue={project?.execution_date || ""} />
        <div className="flex items-center gap-4 pt-6">
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input type="checkbox" name="featured" defaultChecked={project?.featured} /> مميز
          </label>
          {project && (
            <label className="flex items-center gap-2 text-sm text-ink-muted">
              <input type="checkbox" name="visible" defaultChecked={project?.visible} /> منشور
            </label>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm text-ink-muted">روابط مرتبطة (سطر لكل رابط، بصيغة: العنوان | الرابط)</label>
        <textarea
          name="links"
          rows={2}
          defaultValue={project?.links?.map((l) => `${l.label} | ${l.url}`).join("\n")}
          className="rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-ink"
        />
      </div>

      {project && (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-ink-muted">رفع صور / فيديو للمشروع</label>
          <input type="file" multiple accept="image/*,video/*" onChange={handleUpload} className="text-sm text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-black/10 file:px-4 file:py-2 file:text-ink" />
          {uploading && <p className="text-xs text-ink-muted">جاري الرفع…</p>}
          {project.media?.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {project.media.map((m, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-base-layer2">
                  {m.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <video src={m.url} className="h-full w-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(m.url)}
                    className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white"
                    aria-label="حذف الملف"
                    title="حذف"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button type="submit" disabled={pending} className="mt-2 self-start rounded-full bg-gradient-to-r from-electric to-violet px-6 py-2.5 text-sm font-medium text-white shadow-glow disabled:opacity-60">
        {pending ? "جاري الحفظ…" : project ? "حفظ التعديلات" : "إنشاء العمل"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}

function TextField({ label, name, defaultValue, required, type = "text" }: { label: string; name: string; defaultValue?: string | null; required?: boolean; type?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-ink-muted">{label}</label>
      <input name={name} type={type} defaultValue={defaultValue || ""} required={required} className="rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-ink" />
    </div>
  );
}

function TextArea({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string | null }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-ink-muted">{label}</label>
      <textarea name={name} rows={3} defaultValue={defaultValue || ""} className="rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-ink" />
    </div>
  );
}
