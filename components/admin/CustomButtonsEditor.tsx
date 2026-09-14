"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import { updateSiteSetting } from "@/lib/actions/settings";
import { useToast } from "@/components/ToastProvider";
import type { CustomButton } from "@/types";

export function CustomButtonsEditor({ buttons: initialButtons }: { buttons: CustomButton[] }) {
  const [buttons, setButtons] = useState<CustomButton[]>(initialButtons);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  function update(id: string, patch: Partial<CustomButton>) {
    setButtons((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  function remove(id: string) {
    setButtons((prev) => prev.filter((b) => b.id !== id));
  }

  function addButton() {
    setButtons((prev) => [...prev, { id: `btn-${Date.now()}`, label_ar: "زر جديد", url: "https://", style: "secondary" }]);
  }

  function save() {
    startTransition(async () => {
      const res = await updateSiteSetting("custom_buttons", buttons);
      if (res.ok) toast("تم حفظ الأزرار", "success");
      else toast(res.error, "error");
      router.refresh();
    });
  }

  return (
    <div className="glass flex flex-col gap-3 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg text-ink">أزرار مخصصة</h2>
          <p className="text-xs text-ink-muted">تظهر أسفل الأزرار الرئيسية في الصفحة الرئيسية — لأي رابط إضافي تحتاجه (عرض، حجز، ملف PDF، إلخ).</p>
        </div>
        <button onClick={addButton} className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs text-ink-muted hover:text-ink">
          <Plus className="h-3.5 w-3.5" /> إضافة زر
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {buttons.map((b) => (
          <div key={b.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-black/10 bg-black/5 p-3">
            <input
              value={b.label_ar}
              onChange={(e) => update(b.id, { label_ar: e.target.value })}
              placeholder="نص الزر"
              className="min-w-[110px] flex-1 rounded-lg border border-black/10 bg-transparent px-2.5 py-1.5 text-sm text-ink"
            />
            <input
              value={b.url}
              onChange={(e) => update(b.id, { url: e.target.value })}
              placeholder="https://"
              dir="ltr"
              className="min-w-[140px] flex-[2] rounded-lg border border-black/10 bg-transparent px-2.5 py-1.5 text-sm text-ink"
            />
            <select
              value={b.style}
              onChange={(e) => update(b.id, { style: e.target.value as CustomButton["style"] })}
              className="rounded-lg border border-black/10 bg-transparent px-2 py-1.5 text-xs text-ink-muted"
            >
              <option value="primary">تصميم رئيسي</option>
              <option value="secondary">تصميم ثانوي</option>
            </select>
            <button onClick={() => remove(b.id)} className="text-red-600 hover:text-red-300" aria-label="حذف">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {buttons.length === 0 && <p className="py-4 text-center text-sm text-ink-muted">لا توجد أزرار مخصصة بعد.</p>}
      </div>

      <button onClick={save} disabled={pending} className="mt-1 self-start rounded-full bg-gradient-to-r from-electric to-violet px-5 py-2 text-sm font-medium text-white shadow-glow disabled:opacity-60">
        {pending ? "جاري الحفظ…" : "حفظ الأزرار"}
      </button>
    </div>
  );
}
