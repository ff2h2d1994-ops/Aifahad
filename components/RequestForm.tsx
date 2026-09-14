"use client";

import { useState, useTransition } from "react";
import Script from "next/script";
import { submitServiceRequest } from "@/lib/actions/requests";
import { buildWhatsAppUrl, serviceRequestMessage } from "@/lib/whatsapp";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";
import { UPLOAD_RULES, validateFile } from "@/lib/uploads";
import type { Service } from "@/types";

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "ff2h2d1994@gmail.com";
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function RequestForm({ services }: { services: Service[] }) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; url: string }[]>([]);
  const toast = useToast();

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selected = Array.from(files).slice(0, 5);

    for (const file of selected) {
      const validationError = validateFile(file, UPLOAD_RULES);
      if (validationError) {
        toast(validationError, "error");
        e.target.value = "";
        return;
      }
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const uploaded: { name: string; url: string }[] = [];
      for (const file of selected) {
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
        const { error } = await supabase.storage.from("uploads").upload(safeName, file);
        if (!error) {
          const { data } = supabase.storage.from("uploads").getPublicUrl(safeName);
          uploaded.push({ name: file.name, url: data.publicUrl });
        } else {
          toast(`تعذر رفع "${file.name}"`, "error");
        }
      }
      setUploadedFiles(uploaded);
      if (uploaded.length > 0) toast(`تم رفع ${uploaded.length} ملف بنجاح`, "success");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(formData: FormData) {
    formData.set("files_json", JSON.stringify(uploadedFiles));
    startTransition(async () => {
      const res = await submitServiceRequest(formData);
      if (res.ok) {
        setStatus("saved");
        toast("تم استلام طلبك بنجاح، سنتواصل معك قريبًا.", "success");
      } else {
        setStatus("error");
        setErrorMsg(res.error);
        toast(res.error, "error");
        if (typeof window !== "undefined" && (window as any).turnstile) {
          (window as any).turnstile.reset();
        }
      }
    });
  }

  function currentValues(form: HTMLFormElement) {
    const fd = new FormData(form);
    return {
      name: String(fd.get("name") || ""),
      service: String(fd.get("service") || ""),
      description: String(fd.get("description") || ""),
    };
  }

  return (
    <>
      {TURNSTILE_SITE_KEY && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      )}
      <form
        action={handleSubmit}
        className="glass mx-auto flex max-w-xl flex-col gap-4 rounded-2xl p-6 md:p-8"
      >
        <Field label="الاسم" name="name" required />
        <Field label="رقم الجوال" name="phone" required type="tel" />
        <Field label="البريد الإلكتروني" name="email" type="email" />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-ink-muted">نوع الخدمة</label>
          <select name="service" required className="rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-ink outline-none focus:border-electric-soft">
            <option value="">اختر الخدمة</option>
            {services.map((s) => (
              <option key={s.id} value={s.title_ar}>
                {s.title_ar}
              </option>
            ))}
            <option value="خدمة مخصصة">خدمة مخصصة / أخرى</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-ink-muted">وصف الطلب</label>
          <textarea name="description" required rows={4} className="rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-ink outline-none focus:border-electric-soft" />
        </div>

        <Field label="الميزانية (اختياري)" name="budget" />
        <Field label="موعد التسليم المتوقع" name="deadline" type="date" />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-ink-muted">ملفات مرجعية (اختياري، حتى 15 MB لكل ملف)</label>
          <input type="file" multiple onChange={handleFiles} className="text-sm text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-black/10 file:px-4 file:py-2 file:text-ink" />
          {uploading && <p className="text-xs text-ink-muted">جاري الرفع…</p>}
          {uploadedFiles.length > 0 && <p className="text-xs text-electric-soft">تم رفع {uploadedFiles.length} ملف</p>}
        </div>

        {TURNSTILE_SITE_KEY && <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="dark" />}

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-full bg-gradient-to-r from-electric to-violet px-6 py-3 text-sm font-medium text-white shadow-glow disabled:opacity-60"
          >
            {pending ? "جاري الإرسال…" : "إرسال الطلب"}
          </button>

          <button
            type="button"
            onClick={(e) => {
              const form = (e.currentTarget.closest("form") as HTMLFormElement);
              const { name, service, description } = currentValues(form);
              window.open(buildWhatsAppUrl(serviceRequestMessage({ serviceName: service, clientName: name, details: description })), "_blank");
            }}
            className="flex-1 rounded-full border border-black/15 bg-black/5 px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-black/10"
          >
            إرسال عبر واتساب
          </button>

          <button
            type="button"
            onClick={(e) => {
              const form = (e.currentTarget.closest("form") as HTMLFormElement);
              const { name, service, description } = currentValues(form);
              const subject = encodeURIComponent("طلب خدمة جديدة من موقع Fahad Almishan");
              const body = encodeURIComponent(`الاسم: ${name}\nالخدمة المطلوبة: ${service}\nوصف الطلب: ${description}`);
              window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
            }}
            className="flex-1 rounded-full border border-black/15 bg-black/5 px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-black/10"
          >
            إرسال عبر البريد
          </button>
        </div>

        {status === "saved" && <p className="text-sm text-emerald-600">تم استلام طلبك بنجاح، سنتواصل معك قريبًا.</p>}
        {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}
      </form>
    </>
  );
}

function Field({ label, name, required, type = "text" }: { label: string; name: string; required?: boolean; type?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-ink-muted">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-xl border border-black/10 bg-black/5 px-4 py-2.5 text-sm text-ink outline-none focus:border-electric-soft"
      />
    </div>
  );
}
