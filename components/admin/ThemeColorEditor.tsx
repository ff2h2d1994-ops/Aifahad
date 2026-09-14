"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSiteSetting } from "@/lib/actions/settings";
import { useToast } from "@/components/ToastProvider";
import type { ThemeColors } from "@/types";

const FIELDS: { key: keyof ThemeColors; label: string }[] = [
  { key: "electric", label: "اللون الأساسي (أزرق كهربائي)" },
  { key: "violet", label: "اللون الثانوي (بنفسجي)" },
  { key: "cyan", label: "لون التوهج (سماوي)" },
  { key: "ember", label: "لون التمييز (برتقالي محدود)" },
];

export function ThemeColorEditor({ colors }: { colors: ThemeColors }) {
  const [values, setValues] = useState(colors);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  function save() {
    startTransition(async () => {
      const res = await updateSiteSetting("theme_colors", values);
      if (res.ok) toast("تم تحديث الألوان — سيظهر التغيير على كل الصفحات فورًا", "success");
      else toast(res.error, "error");
      router.refresh();
    });
  }

  return (
    <div className="glass flex flex-col gap-4 rounded-2xl p-6">
      <h2 className="font-display text-lg text-ink">ألوان الهوية البصرية</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className="flex items-center gap-3">
            <input
              type="color"
              value={values[f.key]}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              className="h-10 w-14 cursor-pointer rounded-lg border border-black/10 bg-transparent"
            />
            <div className="flex-1">
              <p className="text-sm text-ink">{f.label}</p>
              <input
                value={values[f.key]}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                dir="ltr"
                className="mt-1 w-28 rounded-lg border border-black/10 bg-black/5 px-2 py-1 text-xs text-ink-muted"
              />
            </div>
          </div>
        ))}
      </div>
      <button onClick={save} disabled={pending} className="self-start rounded-full bg-gradient-to-r from-electric to-violet px-5 py-2 text-sm font-medium text-white shadow-glow disabled:opacity-60">
        {pending ? "جاري الحفظ…" : "حفظ الألوان"}
      </button>
    </div>
  );
}
