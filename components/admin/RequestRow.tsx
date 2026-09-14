"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateRequestStatus, updateRequestNotes, deleteRequest } from "@/lib/actions/requests";
import { useToast } from "@/components/ToastProvider";
import type { RequestStatus, ServiceRequest } from "@/types";

const STATUSES: RequestStatus[] = ["جديد", "تم التواصل", "قيد التنفيذ", "مكتمل", "ملغي"];

export function RequestRow({ request }: { request: ServiceRequest }) {
  const [notes, setNotes] = useState(request.internal_notes || "");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm text-ink">{request.name} · {request.service}</p>
          <p className="mt-0.5 text-xs text-ink-muted" dir="ltr">{request.phone} {request.email ? `· ${request.email}` : ""}</p>
          <p className="mt-2 max-w-lg text-sm text-ink-muted">{request.description}</p>
          <p className="mt-1 text-xs text-ink-muted/70">
            {new Date(request.created_at).toLocaleString("ar-SA")}
            {request.budget ? ` · الميزانية: ${request.budget}` : ""}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <select
            defaultValue={request.status}
            disabled={pending}
            onChange={(e) => startTransition(async () => {
              const res = await updateRequestStatus(request.id, e.target.value as RequestStatus);
              if (res.ok) toast("تم تحديث الحالة", "success");
              else toast(res.error, "error");
              router.refresh();
            })}
            className="rounded-full border border-black/10 bg-black/5 px-3 py-1.5 text-xs text-ink"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button
            onClick={() => {
              if (confirm("حذف هذا الطلب نهائيًا؟")) {
                startTransition(async () => {
                  const res = await deleteRequest(request.id);
                  if (res.ok) toast("تم حذف الطلب", "success");
                  else toast(res.error, "error");
                  router.refresh();
                });
              }
            }}
            className="text-xs text-red-600 hover:underline"
          >
            حذف الطلب
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="ملاحظات داخلية"
          className="flex-1 rounded-xl border border-black/10 bg-black/5 px-3 py-2 text-xs text-ink"
        />
        <button
          onClick={() => startTransition(async () => {
            const res = await updateRequestNotes(request.id, notes);
            if (res.ok) toast("تم حفظ الملاحظة", "success");
            else toast(res.error, "error");
            router.refresh();
          })}
          disabled={pending}
          className="rounded-xl border border-black/10 px-4 py-2 text-xs text-ink-muted hover:text-ink"
        >
          حفظ الملاحظة
        </button>
      </div>
    </div>
  );
}
