"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProject, moveProject, toggleProjectFeatured, toggleProjectVisibility } from "@/lib/actions/projects";
import { useToast } from "@/components/ToastProvider";

export function ProjectRowActions({ id, visible, featured, orderIndex }: { id: string; visible: boolean; featured: boolean; orderIndex: number }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={pending}
        onClick={() => startTransition(async () => {
          const res = await toggleProjectVisibility(id, !visible);
          if (res.ok) toast(visible ? "تم إخفاء العمل" : "تم إظهار العمل", "success");
          else toast(res.error, "error");
          router.refresh();
        })}
        className="rounded-full border border-black/10 px-3 py-1 text-xs text-ink-muted hover:text-ink"
      >
        {visible ? "إخفاء" : "إظهار"}
      </button>
      <button
        disabled={pending}
        onClick={() => startTransition(async () => {
          const res = await toggleProjectFeatured(id, !featured);
          if (res.ok) toast(featured ? "تم إلغاء التمييز" : "تم تمييز العمل", "success");
          else toast(res.error, "error");
          router.refresh();
        })}
        className="rounded-full border border-black/10 px-3 py-1 text-xs text-ink-muted hover:text-ink"
      >
        {featured ? "إلغاء التمييز" : "تمييز"}
      </button>
      <button
        disabled={pending || orderIndex <= 0}
        onClick={() => startTransition(async () => {
          const res = await moveProject(id, "up");
          if (!res.ok) toast(res.error, "error");
          router.refresh();
        })}
        className="rounded-full border border-black/10 px-2 py-1 text-xs text-ink-muted disabled:opacity-40"
        aria-label="تحريك للأعلى"
        title="تحريك للأعلى"
      >↑</button>
      <button
        disabled={pending}
        onClick={() => startTransition(async () => {
          const res = await moveProject(id, "down");
          if (!res.ok) toast(res.error, "error");
          router.refresh();
        })}
        className="rounded-full border border-black/10 px-2 py-1 text-xs text-ink-muted"
        aria-label="تحريك للأسفل"
        title="تحريك للأسفل"
      >↓</button>
      <button
        disabled={pending}
        onClick={() => {
          if (confirm("هل تريد حذف هذا العمل نهائيًا؟")) {
            startTransition(async () => {
              const res = await deleteProject(id);
              if (res.ok) toast("تم حذف العمل", "success");
              else toast(res.error, "error");
              router.refresh();
            });
          }
        }}
        className="rounded-full border border-red-500/20 px-3 py-1 text-xs text-red-600 hover:bg-red-500/10"
      >
        حذف
      </button>
    </div>
  );
}
