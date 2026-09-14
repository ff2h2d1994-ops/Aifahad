"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { quickAddWorkToService } from "@/lib/actions/projects";
import { useToast } from "@/components/ToastProvider";
import { MEDIA_RULES, validateFile } from "@/lib/uploads";

// Visible to the admin only (the parent passes isAdmin after checking the
// session server-side). Uses a plain <input type="file">, which is the
// only way a website can open the OS picker — on iPhone/Android that
// sheet already includes Photos, Files, and any installed provider like
// Google Drive or Google Photos automatically; a site can't customize
// which providers appear beyond that.
export function AdminServiceUploadButton({ serviceCategory, serviceTitle }: { serviceCategory: string; serviceTitle: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
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
      const media: { type: "image" | "video"; url: string }[] = [];

      for (const file of selected) {
        const isVideo = file.type.startsWith("video");
        const path = `${serviceCategory}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
        const { error } = await supabase.storage.from("media").upload(path, file);
        if (!error) {
          const { data } = supabase.storage.from("media").getPublicUrl(path);
          media.push({ type: isVideo ? "video" : "image", url: data.publicUrl });
        } else {
          toast(`تعذر رفع "${file.name}"`, "error");
        }
      }

      if (media.length > 0) {
        const title = `${serviceTitle} — ${new Date().toLocaleDateString("ar-SA")}`;
        const res = await quickAddWorkToService({ category: serviceCategory, title_ar: title, media });
        if (res.ok) {
          toast("تمت إضافة العمل إلى معرض الأعمال", "success");
          router.refresh();
        } else {
          toast(res.error, "error");
        }
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFiles}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        title="إضافة صور أو فيديو لهذه الخدمة (يظهر لك أنت فقط)"
        className="flex items-center gap-1.5 rounded-full border border-ember/30 bg-ember/10 px-3 py-1.5 text-xs text-ember transition-colors hover:bg-ember/20 disabled:opacity-60"
      >
        {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
        {uploading ? "جاري الرفع…" : "إضافة عمل (أنت فقط)"}
      </button>
    </>
  );
}
