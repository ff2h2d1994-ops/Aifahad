"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateContactSettings, updateHeroSettings, updateSiteSetting, updatePaymentMethods } from "@/lib/actions/settings";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ToastProvider";
import { MEDIA_RULES, validateFile } from "@/lib/uploads";
import type { SiteContact, PaymentMethods } from "@/types";

export function ContactSettingsForm({ contact }: { contact: SiteContact }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  return (
    <form
      action={(fd) => startTransition(async () => {
        const res = await updateContactSettings(fd);
        if (res.ok) toast("تم حفظ بيانات التواصل", "success");
        else toast(res.error, "error");
        router.refresh();
      })}
      className="glass grid grid-cols-1 gap-3 rounded-2xl p-6 sm:grid-cols-2"
    >
      <h2 className="font-display text-lg text-ink sm:col-span-2">بيانات التواصل</h2>
      <Input label="واتساب (بدون +)" name="whatsapp" defaultValue={contact.whatsapp} />
      <Input label="البريد الإلكتروني" name="email" defaultValue={contact.email} />
      <Input label="Instagram" name="instagram" defaultValue={contact.instagram} />
      <Input label="Snapchat" name="snapchat" defaultValue={contact.snapchat} />
      <Input label="X" name="x" defaultValue={contact.x} />
      <button disabled={pending} className="mt-1 self-start rounded-full bg-gradient-to-r from-electric to-violet px-5 py-2 text-sm font-medium text-white shadow-glow sm:col-span-2">
        حفظ بيانات التواصل
      </button>
    </form>
  );
}

export function HeroSettingsForm({ hero }: { hero: { title_ar: string; subtitle_ar: string; tagline_ar: string } }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  return (
    <form
      action={(fd) => startTransition(async () => {
        const res = await updateHeroSettings(fd);
        if (res.ok) toast("تم الحفظ", "success");
        else toast(res.error, "error");
        router.refresh();
      })}
      className="glass grid grid-cols-1 gap-3 rounded-2xl p-6"
    >
      <h2 className="font-display text-lg text-ink">نصوص الصفحة الرئيسية</h2>
      <Input label="العنوان الرئيسي" name="title_ar" defaultValue={hero.title_ar} />
      <Input label="النص المساند" name="subtitle_ar" defaultValue={hero.subtitle_ar} />
      <Input label="عبارة الهوية" name="tagline_ar" defaultValue={hero.tagline_ar} />
      <button disabled={pending} className="mt-1 self-start rounded-full bg-gradient-to-r from-electric to-violet px-5 py-2 text-sm font-medium text-white shadow-glow">
        حفظ
      </button>
    </form>
  );
}

export function LogoSettingsForm({ logoUrl }: { logoUrl: string }) {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file, MEDIA_RULES);
    if (validationError) {
      toast(validationError, "error");
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const path = `logo-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
      const { error } = await supabase.storage.from("media").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        const res = await updateSiteSetting("logo_url", data.publicUrl);
        if (res.ok) toast("تم تحديث الشعار", "success");
        else toast(res.error, "error");
        router.refresh();
      } else {
        toast("تعذر رفع الشعار", "error");
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="glass flex flex-col gap-3 rounded-2xl p-6">
      <h2 className="font-display text-lg text-ink">الشعار</h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoUrl} alt="logo" className="h-16 w-16 rounded-xl bg-black/5 object-contain p-2" />
      <input type="file" accept="image/*" onChange={handleUpload} className="text-sm text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-black/10 file:px-4 file:py-2 file:text-ink" />
      {uploading && <p className="text-xs text-ink-muted">جاري الرفع…</p>}
    </div>
  );
}

export function CertificateSettingsForm({ certificate }: { certificate: { visible: boolean; verify_url: string } }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          const res = await updateSiteSetting("certificate", {
            visible: fd.get("visible") === "on",
            verify_url: String(fd.get("verify_url") || ""),
          });
          if (res.ok) toast("تم الحفظ", "success");
          else toast(res.error, "error");
          router.refresh();
        })
      }
      className="glass flex flex-col gap-3 rounded-2xl p-6"
    >
      <h2 className="font-display text-lg text-ink">شهادة Google AI</h2>
      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <input type="checkbox" name="visible" defaultChecked={certificate.visible} /> إظهار القسم في الموقع
      </label>
      <Input label="رابط التحقق من الشهادة" name="verify_url" defaultValue={certificate.verify_url} />
      <button disabled={pending} className="self-start rounded-full bg-gradient-to-r from-electric to-violet px-5 py-2 text-sm font-medium text-white shadow-glow">
        حفظ
      </button>
    </form>
  );
}

function Input({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-ink-muted">{label}</label>
      <input name={name} defaultValue={defaultValue} dir="ltr" className="rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm text-ink" />
    </div>
  );
}

export function PaymentSettingsForm({ payment }: { payment: PaymentMethods }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  return (
    <form
      action={(fd) => startTransition(async () => {
        const res = await updatePaymentMethods(fd);
        if (res.ok) toast("تم حفظ طرق الدفع", "success");
        else toast(res.error, "error");
        router.refresh();
      })}
      className="glass grid grid-cols-1 gap-3 rounded-2xl p-6 sm:grid-cols-2"
    >
      <div className="sm:col-span-2">
        <h2 className="font-display text-lg text-ink">طرق الدفع</h2>
        <p className="mt-1 text-xs text-ink-muted">
          تظهر هذه البيانات في صفحة "تواصل معي" ليتمكن العميل من التحويل مباشرة.
          STC Pay وتحويل الآيبان هما أسهل طريقتين لاستلام المبلغ فورًا بدون سجل تجاري أو بوابة دفع.
        </p>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-muted sm:col-span-2">
        <input type="checkbox" name="show" defaultChecked={payment.show} /> إظهار طرق الدفع للعملاء
      </label>
      <Input label="رقم STC Pay" name="stc_pay" defaultValue={payment.stc_pay} />
      <Input label="اسم البنك" name="bank_name" defaultValue={payment.bank_name} />
      <Input label="رقم الآيبان (IBAN)" name="iban" defaultValue={payment.iban} />
      <Input label="اسم صاحب الحساب" name="account_holder" defaultValue={payment.account_holder} />
      <button disabled={pending} className="self-start rounded-full bg-gradient-to-r from-electric to-violet px-5 py-2 text-sm font-medium text-white shadow-glow sm:col-span-2">
        {pending ? "جاري الحفظ…" : "حفظ طرق الدفع"}
      </button>
    </form>
  );
}
