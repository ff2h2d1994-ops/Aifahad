"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addProjectMedia, createProject, removeProjectMedia, updateProject } from "@/lib/actions/projects";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";
import { MEDIA_RULES, validateFile } from "@/lib/uploads";
import type { MediaItem, Project } from "@/types";

const CATEGORIES = ["ai", "photo", "design", "video", "audio", "web", "data", "shopping", "travel", "consulting", "content", "other"];

type PreviewFile = File & { preview: string };

export function ProjectForm({ project }: { project?: Project }) {
  const [pending, startTransition] = useTransition();
  const [selectedFiles, setSelectedFiles] = useState<PreviewFile[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [error, setError] = useState("");
  const router = useRouter();
  const toast = useToast();

  useEffect(() => () => selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview)), [selectedFiles]);

  function chooseFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }) as PreviewFile);
    for (const file of files) {
      const validationError = validateFile(file, MEDIA_RULES);
      if (validationError) {
        toast(validationError, "error");
        files.forEach((item) => URL.revokeObjectURL(item.preview));
        e.target.value = "";
        return;
      }
    }
    selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    setSelectedFiles(files);
    setCoverIndex(0);
    setUploadedCount(0);
  }

  async function uploadFiles(projectId: string) {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setUploadedCount(0);
    const supabase = createClient();
    for (const [index, file] of selectedFiles.entries()) {
      const type = file.type.startsWith("video") ? "video" : "image";
      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "") || "media";
      const path = `${projectId}/${Date.now()}-${index}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
      if (uploadError) {
        toast(`تعذر رفع "${file.name}". تحقق من إعدادات bucket media.`, "error");
      } else {
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        const result = await addProjectMedia(projectId, data.publicUrl, type, type === "image" && index === coverIndex);
        if (!result.ok) toast(result.error, "error");
      }
      setUploadedCount(index + 1);
    }
    selectedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
    setSelectedFiles([]);
    setUploading(false);
  }

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = project ? await updateProject(project.id, formData) : await createProject(formData);
      if (!result.ok) {
        setError(result.error);
        toast(result.error, "error");
        return;
      }
      const projectId = project?.id || ("id" in result ? String(result.id) : null);
      if (projectId) await uploadFiles(projectId);
      toast(project ? "تم حفظ التعديلات" : "تم إنشاء العمل", "success");
      if (!project && projectId) router.push(`/admin/projects/${projectId}/edit`);
      else router.refresh();
    });
  }

  function handleRemoveMedia(media: MediaItem) {
    if (!project || !confirm("حذف هذا الملف من العمل؟")) return;
    startTransition(async () => {
      const result = await removeProjectMedia(project.id, media.url);
      if (result.ok) {
        toast("تم حذف الملف", "success");
        router.refresh();
      } else toast(result.error, "error");
    });
  }

  return (
    <form action={handleSubmit} className="glass flex flex-col gap-4 rounded-2xl p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="العنوان (عربي)" name="title_ar" defaultValue={project?.title_ar} required />
        <TextField label="العنوان (إنجليزي)" name="title_en" defaultValue={project?.title_en} />
      </div>
      <TextField label="الرابط المختصر (Slug)" name="slug" defaultValue={project?.slug} required dir="ltr" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextArea label="الوصف (عربي)" name="description_ar" defaultValue={project?.description_ar} />
        <TextArea label="الوصف (إنجليزي)" name="description_en" defaultValue={project?.description_en} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5"><label className="text-sm text-ink-muted">التصنيف</label><select name="category" defaultValue={project?.category || "other"} className="rounded-xl border border-black/10 bg-black/5 px-3 py-2.5 text-sm text-ink">{CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select></div>
        <TextField label="تاريخ التنفيذ" name="execution_date" type="date" defaultValue={project?.execution_date || ""} />
        <div className="flex items-center gap-4 pt-6"><label className="flex items-center gap-2 text-sm text-ink-muted"><input type="checkbox" name="featured" defaultChecked={project?.featured} /> مميز</label><label className="flex items-center gap-2 text-sm text-ink-muted"><input type="checkbox" name="visible" defaultChecked={project ? project.visible : true} /> منشور</label></div>
      </div>
      <div className="flex flex-col gap-1.5"><label className="text-sm text-ink-muted">روابط مرتبطة (سطر لكل رابط، بصيغة: العنوان | الرابط)</label><textarea name="links" rows={2} defaultValue={project?.links?.map((link) => `${link.label} | ${link.url}`).join("\n")} className="rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-ink" /></div>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-ink-muted">صور وفيديوهات المشروع (حتى 25MB للملف)</label>
        <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm" onChange={chooseFiles} className="text-sm text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-black/10 file:px-4 file:py-2 file:text-ink" />
        {selectedFiles.length > 0 && <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{selectedFiles.map((file, index) => <div key={`${file.name}-${index}`} className="relative overflow-hidden rounded-lg border border-black/10 bg-base-layer2">{file.type.startsWith("video") ? <video src={file.preview} controls className="aspect-square w-full object-cover" /> : <img src={file.preview} alt={file.name} className="aspect-square w-full object-cover" />} {!file.type.startsWith("video") && <label className="flex items-center gap-1 p-2 text-[11px] text-ink-muted"><input type="radio" name="cover-preview" checked={coverIndex === index} onChange={() => setCoverIndex(index)} /> غلاف</label>}</div>)}</div>}
        {project?.media?.length ? <MediaPreview media={project.media} onRemove={handleRemoveMedia} /> : null}
        {uploading && <><div className="h-2 overflow-hidden rounded-full bg-black/10"><div className="h-full bg-electric transition-all" style={{ width: `${(uploadedCount / selectedFiles.length) * 100}%` }} /></div><p className="text-xs text-ink-muted">جاري رفع {uploadedCount} من {selectedFiles.length} ملف...</p></>}
        {!project && selectedFiles.length > 0 && <p className="text-xs text-ink-muted">سيتم رفع الملفات تلقائيًا بعد إنشاء العمل.</p>}
      </div>
      <button type="submit" disabled={pending || uploading} className="mt-2 self-start rounded-full bg-gradient-to-r from-electric to-violet px-6 py-2.5 text-sm font-medium text-white shadow-glow disabled:opacity-60">{uploading ? "جاري رفع الملفات..." : pending ? "جاري الحفظ..." : project ? "حفظ التعديلات" : "إنشاء العمل"}</button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}

function MediaPreview({ media, onRemove }: { media: MediaItem[]; onRemove: (media: MediaItem) => void }) {
  return <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">{media.map((item, index) => <div key={`${item.url}-${index}`} className="group relative aspect-square overflow-hidden rounded-lg bg-base-layer2">{item.type === "image" ? <img src={item.url} alt="" className="h-full w-full object-cover" /> : <video src={item.url} controls className="h-full w-full object-cover" />}{item.cover && <span className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">غلاف</span>}<button type="button" onClick={() => onRemove(item)} className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-sm text-white" aria-label="حذف الملف" title="حذف">×</button></div>)}</div>;
}

function TextField({ label, name, defaultValue, required, type = "text", dir }: { label: string; name: string; defaultValue?: string | null; required?: boolean; type?: string; dir?: "ltr" | "rtl" }) {
  return <div className="flex flex-col gap-1.5"><label className="text-sm text-ink-muted">{label}</label><input name={name} type={type} dir={dir} defaultValue={defaultValue || ""} required={required} className="rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-ink" /></div>;
}

function TextArea({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string | null }) {
  return <div className="flex flex-col gap-1.5"><label className="text-sm text-ink-muted">{label}</label><textarea name={name} rows={3} defaultValue={defaultValue || ""} className="rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-ink" /></div>;
}
