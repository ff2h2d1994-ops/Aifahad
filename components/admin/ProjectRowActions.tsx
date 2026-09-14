"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleProjectVisibility, deleteProject } from "@/lib/actions/projects";
import { useToast } from "@/components/ToastProvider";

export function ProjectRowActions({ id, visible }: { id: string; visible: boolean }) {
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
