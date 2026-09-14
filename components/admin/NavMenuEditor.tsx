"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { updateSiteSetting } from "@/lib/actions/settings";
import { useToast } from "@/components/ToastProvider";
import type { NavItem } from "@/types";

export function NavMenuEditor({ items: initialItems }: { items: NavItem[] }) {
  const [items, setItems] = useState<NavItem[]>(initialItems);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  function update(id: string, patch: Partial<NavItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function move(index: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((item, i) => ({ ...item, order_index: i + 1 }));
    });
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: `item-${Date.now()}`, label_ar: "رابط جديد", label_en: "New Link", href: "/", visible: true, order_index: prev.length + 1 },
    ]);
  }

  function save() {
    startTransition(async () => {
      const normalized = items.map((item, i) => ({ ...item, order_index: i + 1 }));
      const res = await updateSiteSetting("nav_menu", normalized);
      if (res.ok) toast("تم حفظ القائمة", "success");
      else toast(res.error, "error");
      router.refresh();
    });
  }

  return (
    <div className="glass flex flex-col gap-3 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-ink">القوائم (Navigation)</h2>
        <button onClick={addItem} className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs text-ink-muted hover:text-ink">
          <Plus className="h-3.5 w-3.5" /> إضافة رابط
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={item.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-black/10 bg-black/5 p-3">
            <div className="flex flex-col gap-1">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="text-ink-muted disabled:opacity-30">▲</button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-ink-muted disabled:opacity-30">▼</button>
            </div>
            <GripVertical className="h-4 w-4 text-ink-muted/50" />
            <input
              value={item.label_ar}
              onChange={(e) => update(item.id, { label_ar: e.target.value })}
              placeholder="النص بالعربي"
              className="min-w-[110px] flex-1 rounded-lg border border-black/10 bg-transparent px-2.5 py-1.5 text-sm text-ink"
            />
            <input
              value={item.label_en}
              onChange={(e) => update(item.id, { label_en: e.target.value })}
              placeholder="Label (EN)"
              dir="ltr"
              className="min-w-[110px] flex-1 rounded-lg border border-black/10 bg-transparent px-2.5 py-1.5 text-sm text-ink"
            />
            <input
              value={item.href}
              onChange={(e) => update(item.id, { href: e.target.value })}
              placeholder="/الرابط"
              dir="ltr"
              className="min-w-[110px] flex-1 rounded-lg border border-black/10 bg-transparent px-2.5 py-1.5 text-sm text-ink"
            />
            <label className="flex items-center gap-1.5 text-xs text-ink-muted">
              <input type="checkbox" checked={item.visible} onChange={(e) => update(item.id, { visible: e.target.checked })} /> ظاهر
            </label>
            <button onClick={() => remove(item.id)} className="text-red-600 hover:text-red-300" aria-label="حذف">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="py-4 text-center text-sm text-ink-muted">لا توجد روابط — أضف أول رابط.</p>}
      </div>

      <button onClick={save} disabled={pending} className="mt-2 self-start rounded-full bg-gradient-to-r from-electric to-violet px-5 py-2 text-sm font-medium text-white shadow-glow disabled:opacity-60">
        {pending ? "جاري الحفظ…" : "حفظ القائمة"}
      </button>
    </div>
  );
}
