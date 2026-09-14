"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";
import { updateServiceText, toggleServiceVisibility } from "@/lib/actions/settings";
import { useToast } from "@/components/ToastProvider";
import { ICON_CHOICES } from "@/lib/icons";
import type { Service } from "@/types";

function iconPreview(name: string) {
  const pascal = name.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  return (Icons as unknown as Record<string, Icons.LucideIcon>)[pascal] || Icons.Sparkles;
}

export function ServiceEditor({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  const [icon, setIcon] = useState(service.icon);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();
  const IconPreview = iconPreview(icon);

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/5">
            <IconPreview className="h-4 w-4 text-electric-soft" />
          </div>
          <div>
            <p className="font-display text-sm text-ink">{service.title_ar}</p>
            <p className="text-xs text-ink-muted">{service.category} · {service.visible ? "منشور" : "مخفي"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => startTransition(async () => {
              const res = await toggleServiceVisibility(service.id, !service.visible);
              if (res.ok) toast(service.visible ? "تم إخفاء الخدمة" : "تم إظهار الخدمة", "success");
              else toast(res.error, "error");
              router.refresh();
            })}
            disabled={pending}
            className="rounded-full border border-black/10 px-3 py-1 text-xs text-ink-muted hover:text-ink"
          >
            {service.visible ? "إخفاء" : "إظهار"}
          </button>
          <button onClick={() => setOpen((v) => !v)} className="rounded-full border border-black/10 px-3 py-1 text-xs text-ink-muted hover:text-ink">
            {open ? "إغلاق" : "تعديل"}
          </button>
        </div>
      </div>

      {open && (
        <form
          action={(formData) => startTransition(async () => {
            formData.set("icon", icon);
            const res = await updateServiceText(service.id, formData);
            if (res.ok) toast("تم حفظ التعديلات", "success");
            else toast(res.error, "error");
            router.refresh();
          })}
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <input name="title_ar" defaultValue={service.title_ar} placeholder="العنوان بالعربي" className="rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm text-ink" />
          <input name="title_en" defaultValue={service.title_en} placeholder="العنوان بالإنجليزي" className="rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm text-ink" />
          <textarea name="description_ar" defaultValue={service.description_ar} placeholder="الوصف بالعربي" rows={2} className="rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm text-ink sm:col-span-2" />
          <textarea name="description_en" defaultValue={service.description_en} placeholder="الوصف بالإنجليزي" rows={2} className="rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm text-ink sm:col-span-2" />

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm text-ink-muted">الأيقونة</label>
            <div className="flex flex-wrap gap-2">
              {ICON_CHOICES.map((name) => {
                const Ico = iconPreview(name);
                return (
                  <button
                    type="button"
                    key={name}
                    onClick={() => setIcon(name)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
                      icon === name ? "border-electric-soft bg-electric/15" : "border-black/10 bg-black/5 hover:border-black/20"
                    }`}
                    aria-label={name}
                  >
                    <Ico className="h-4 w-4 text-ink" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-sm text-ink-muted">السعر (يظهر للعميل — أنت وحدك من يعدّله)</label>
            <div className="flex flex-wrap items-center gap-2">
              <input name="price_min" type="number" min="0" defaultValue={service.price_min ?? ""} placeholder="من (ريال)" className="w-28 rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm text-ink" />
              <span className="text-ink-muted">—</span>
              <input name="price_max" type="number" min="0" defaultValue={service.price_max ?? ""} placeholder="إلى (ريال)" className="w-28 rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm text-ink" />
              <input name="price_note" defaultValue={service.price_note} placeholder="ملاحظة (مثال: لكل صورة، شهريًا)" className="min-w-[160px] flex-1 rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-sm text-ink" />
              <label className="flex items-center gap-1.5 text-xs text-ink-muted">
                <input type="checkbox" name="show_price" defaultChecked={service.show_price} /> إظهار السعر للعميل
              </label>
            </div>
          </div>

          <button type="submit" disabled={pending} className="self-start rounded-full bg-gradient-to-r from-electric to-violet px-5 py-2 text-sm font-medium text-white shadow-glow sm:col-span-2">
            حفظ
          </button>
        </form>
      )}
    </div>
  );
}
